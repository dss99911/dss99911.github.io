---
layout: post
title: "RxJava Observers and Subjects - Understanding Data Flow"
date: 2025-12-28
categories: [mobile, android]
tags: [rxjava, android, observer, subject, reactive-programming]
image: /assets/images/posts/thumbnails/2025-12-28-rxjava-observers-subjects.png
---

RxJava의 Observer, Subject, Disposable, Subscriber에 대해 알아봅니다.

## Observer

### Lambda로 Subscribe

```kotlin
observable.subscribeBy(
    onNext = { i -> println("Next: $i") },
    onComplete = { println("Complete") },
    onError = { throwable -> println("Error: $throwable") }
)
```

### Observer 객체

```kotlin
val observer = object : Observer<Any> {
    override fun onComplete() {
        println("All Completed")
    }

    override fun onNext(item: Any) {
        println("Next $item")
    }

    override fun onError(e: Throwable) {
        println("Error Occurred $e")
    }

    override fun onSubscribe(d: Disposable) {
        println("Subscribed to $d")
    }
}

observable.subscribe(observer)
```

### Maybe Observer

세 가지 중 하나만 호출됩니다:
- **onComplete**: 에러 없이 값도 없음
- **onError**: 에러 발생
- **onSuccess**: 값이 있음

```kotlin
val maybeEmpty = Maybe.empty<Int>()
maybeEmpty.subscribeBy(
    onComplete = { println("Completed Empty") },
    onError = { println("Error $it") },
    onSuccess = { println("Completed with value $it") }
)
```

## Disposable

구독을 관리하고 해제하는 객체입니다.

```kotlin
interface Disposable {
    fun dispose()
    val isDisposed: Boolean
}
```

### 사용 예시

```kotlin
val disposable = observable.subscribe { println(it) }

// 구독 해제
disposable.dispose()
```

### CompositeDisposable

여러 구독을 한 번에 관리:

```kotlin
val compositeDisposable = CompositeDisposable()

compositeDisposable.add(observable1.subscribe { ... })
compositeDisposable.add(observable2.subscribe { ... })

// 모든 구독 해제
compositeDisposable.dispose()
```

## Subscription

Observable과 Subscriber를 연결합니다.

```kotlin
// subscribe 호출 시 subscription/disposable 반환
val subscription = observable.subscribe()

// 중단 시
subscription.unsubscribe()  // RxJava 1.x
// 또는
disposable.dispose()  // RxJava 2.x

// 여러 구독 관리
compositeSubscription.unsubscribe()
```

## Subscriber (Flowable용)

Flowable과 함께 사용하며 backpressure를 제어합니다.

```kotlin
Flowable.range(1, 15)
    .map { MyItem(it) }
    .observeOn(Schedulers.io())
    .subscribe(object : Subscriber<MyItem> {
        lateinit var subscription: Subscription

        override fun onSubscribe(subscription: Subscription) {
            this.subscription = subscription
            subscription.request(5)  // 5개만 요청
        }

        override fun onNext(s: MyItem?) {
            runBlocking { delay(50) }
            println("Subscriber received $s")
            if (s?.id == 5) {
                println("Requesting two more")
                subscription.request(2)  // 추가 2개 요청
            }
        }

        override fun onError(e: Throwable) {
            e.printStackTrace()
        }

        override fun onComplete() {
            println("Done!")
        }
    })
```

모든 데이터를 받으려면:
```kotlin
subscription.request(Long.MAX_VALUE)
```

## Subject

Subject는 Observable과 Observer 역할을 동시에 수행합니다.

- Cold Observable을 subscribe하고 Hot Observable로 emit
- 여러 Observer에게 동시에 데이터 전달

### AsyncSubject

마지막 값만 emit하고 complete합니다.

```kotlin
val subject = AsyncSubject.create<Int>()
subject.onNext(1)
subject.onNext(2)
subject.onNext(3)
subject.onNext(4)

subject.subscribe({
    println("Received $it")  // 4만 출력
}, {
    it.printStackTrace()
}, {
    println("Complete")
})

subject.onComplete()  // 반드시 호출해야 값 전달
```

**Use Case**: AsyncTask와 유사하게 백그라운드 작업 후 완료 값 전달

### BehaviorSubject

가장 최근 값을 새 구독자에게 전달합니다.

```kotlin
val subject = BehaviorSubject.create<Int>()
subject.onNext(1)
subject.onNext(2)

subject.subscribe { println("Observer 1: $it") }  // 2 출력

subject.onNext(3)  // 둘 다 3 출력

subject.subscribe { println("Observer 2: $it") }  // 3 출력
```

**Use Case**: 위치 정보 - 새 구독자가 즉시 현재 위치를 받아야 할 때

### PublishSubject

구독 시점부터의 값만 전달합니다.

```kotlin
val observable = Observable.interval(100, TimeUnit.MILLISECONDS)
val subject = PublishSubject.create<Long>()

observable.subscribe(subject)

subject.subscribe { println("Subscription 1: $it") }

runBlocking { delay(1100) }

// 이 구독자는 11부터 시작 (1100ms 후)
subject.subscribe { println("Subscription 2: $it") }

runBlocking { delay(1100) }
```

**Use Case**: Listener - 이전 이벤트는 필요 없고 현재부터의 이벤트만 필요할 때

### ReplaySubject

모든 값을 버퍼링하여 새 구독자에게 전체 히스토리를 전달합니다.

```kotlin
val subject = ReplaySubject.create<Int>()
subject.onNext(1)
subject.onNext(2)
subject.onNext(3)

subject.subscribe { println("Observer 1: $it") }  // 1, 2, 3 모두 출력

subject.onNext(4)

subject.subscribe { println("Observer 2: $it") }  // 1, 2, 3, 4 모두 출력
```

## Processor

Flowable용 Subject입니다.

### PublishProcessor

```kotlin
val flowable = listOf("String 1", "String 2", "String 3").toFlowable()
val processor = PublishProcessor.create<String>()

processor.subscribe({
    println("Subscription 1: $it")
    runBlocking { delay(1000) }
    println("Subscription 1 delay")
})

processor.subscribe { println("Subscription 2: $it") }

flowable.subscribe(processor)
```
