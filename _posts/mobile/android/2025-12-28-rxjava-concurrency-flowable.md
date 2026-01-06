---
layout: post
title: "RxJava Concurrency and Flowable - Threading and Backpressure"
date: 2025-12-28
categories: [mobile, android]
tags: [rxjava, android, concurrency, flowable, backpressure]
image: /assets/images/posts/thumbnails/2025-12-28-rxjava-concurrency-flowable.png
---

RxJava의 스레딩과 Flowable을 사용한 Backpressure 처리를 알아봅니다.

## Schedulers

### 기본 Schedulers

```kotlin
// Unbounded worker thread pool, 재사용
Schedulers.io()

// CPU 코어 수만큼 제한된 스레드
Schedulers.computation()

// 항상 새 스레드 생성
Schedulers.newThread()

// 단일 스레드
Schedulers.single()

// 호출 스레드 (기본값)
Schedulers.trampoline()

// Custom Executor
val executor = Executors.newFixedThreadPool(2)
val scheduler = Schedulers.from(executor)
```

### subscribeOn vs observeOn

```kotlin
Observable.range(1, 10)
    .subscribeOn(Schedulers.computation())  // emit 스레드
    .observeOn(Schedulers.io())             // 이후 연산 스레드
    .subscribe { println(it) }
```

- **subscribeOn**: 전체 subscription(emit 포함)에 사용할 스레드
- **observeOn**: observeOn 이후의 연산에 사용할 스레드

### Android Main Thread

```kotlin
observable
    .subscribeOn(Schedulers.io())
    .observeOn(AndroidSchedulers.mainThread())
    .subscribe { updateUI(it) }
```

### Custom Scheduler 예시

```kotlin
val executor = Executors.newFixedThreadPool(2)
val scheduler = Schedulers.from(executor)

Observable.range(1, 10)
    .subscribeOn(scheduler)
    .subscribe {
        runBlocking { delay(200) }
        println("Observable1 Item Received $it - ${Thread.currentThread().name}")
    }

Observable.range(21, 10)
    .subscribeOn(scheduler)
    .subscribe {
        runBlocking { delay(100) }
        println("Observable2 Item Received $it - ${Thread.currentThread().name}")
    }
```

## Flowable

Observable의 대안으로, OutOfMemory를 방지합니다.

### 특징

- 128개의 요소를 emit하고 consumer가 처리할 때까지 대기
- Observable보다 느리지만 메모리 안전
- **사용 시점**: 10,000개 이상의 아이템 & 비동기 처리

### Backpressure Strategy

버퍼가 가득 찼을 때의 처리 전략:

```kotlin
// BUFFER (기본): 버퍼에 쌓고 기다림
BackpressureStrategy.BUFFER

// ERROR: MissingBackpressureException 발생
BackpressureStrategy.ERROR

// DROP: 버퍼 초과분 버림
BackpressureStrategy.DROP

// LATEST: DROP과 같지만 마지막 값은 보존
BackpressureStrategy.LATEST

// MISSING: 커스터마이징
BackpressureStrategy.MISSING
```

### Flowable 생성

#### range

```kotlin
Flowable.range(1, 1000)
    .map { MyItem(it) }
    .observeOn(Schedulers.io())
    .subscribe({
        println("Received $it")
        runBlocking { delay(50) }
    }, { it.printStackTrace() })
```

#### create

```kotlin
val flowable = Flowable.create<Int>({
    for (i in 1..10) {
        it.onNext(i)
    }
    it.onComplete()
}, BackpressureStrategy.BUFFER)

flowable.observeOn(Schedulers.io())
    .subscribe(subscriber)
```

### Observable to Flowable

```kotlin
val source = Observable.range(1, 1000)
source.toFlowable(BackpressureStrategy.BUFFER)
    .subscribe { println(it) }
```

### Backpressure 커스터마이징

#### onBackpressureBuffer

```kotlin
source.toFlowable(BackpressureStrategy.MISSING)
    .onBackpressureBuffer()  // BUFFER와 동일
    .subscribe { println(it) }

// 용량 제한
source.toFlowable(BackpressureStrategy.MISSING)
    .onBackpressureBuffer(20)  // 20개 초과시 ERROR
    .subscribe { println(it) }
```

#### onBackpressureDrop

```kotlin
source.toFlowable(BackpressureStrategy.MISSING)
    .onBackpressureDrop { println("Dropped $it") }
    .subscribe { println("Received $it") }
```

#### onBackpressureLatest

```kotlin
source.toFlowable(BackpressureStrategy.MISSING)
    .onBackpressureLatest()
    .subscribe { println("Received $it") }
```

### generate

람다를 반복 실행하며 버퍼 backpressure 적용:

```kotlin
object GenerateFlowableItem {
    var item: Int = 0
        get() {
            field += 1
            return field
        }
}

val flowable = Flowable.generate<Int> {
    it.onNext(GenerateFlowableItem.item)
}

flowable.map { MyItem(it) }
    .observeOn(Schedulers.io())
    .subscribe {
        runBlocking { delay(100) }
        println("Next $it")
    }
```

### ConnectableFlowable (Hot Flowable)

```kotlin
val connectableFlowable = listOf("String 1", "String 2", "String 3")
    .toFlowable()
    .publish()

connectableFlowable.subscribe({
    println("Subscription 1: $it")
    runBlocking { delay(1000) }
    println("Subscription 1 delay")
})

connectableFlowable.subscribe { println("Subscription 2: $it") }

connectableFlowable.connect()
```

## Error Handling

### 기본 에러 처리

```kotlin
Observable.just(1, 2, 3, 5, 6, 7, "Error", 8, 9, 10)
    .map { it.toIntOrError() }
    .subscribeBy(
        onNext = { println("Next $it") },
        onError = { println("Error $it") }
    )
```

### onErrorReturn

에러 발생 시 대체 값 반환 후 complete:

```kotlin
Observable.just(1, 2, 3, 4, 5)
    .map { it / (3 - it) }
    .onErrorReturn { -1 }  // 에러 시 -1 반환
    .subscribe { println("Received $it") }
```

### onErrorResumeNext

에러 발생 시 다른 Observable로 전환:

```kotlin
Observable.just(1, 2, 3, 4, 5)
    .map { it / (3 - it) }
    .onErrorResumeNext(Observable.range(10, 5))
    .subscribe { println("Received $it") }
```

### retry

에러 발생 시 처음부터 재시도:

```kotlin
Observable.just(1, 2, 3, 4, 5)
    .map { it / (3 - it) }
    .retry(3)  // 3번 재시도
    .subscribeBy(
        onNext = { println("Received $it") },
        onError = { println("Error") }
    )

// Predicate 사용
var retryCount = 0
Observable.just(1, 2, 3, 4, 5)
    .map { it / (3 - it) }
    .retry { _, _ -> (++retryCount) < 3 }
    .subscribeBy(
        onNext = { println("Received $it") },
        onError = { println("Error") }
    )
```

## Resource Management

리소스 생성, 사용, 해제를 관리합니다:

```kotlin
Observable.using({
    // 리소스 생성 (예: Cursor)
    Resource()
}, { resource: Resource ->
    // 데이터 가져오기
    Observable.just(resource)
}, { resource: Resource ->
    // 리소스 해제
    resource.close()
}).subscribe {
    println("Resource Data ${it.data}")
}
```

## Warning

Main Activity에서 create할 경우, Observable이 반환되기 전까지 Main Activity가 반환되지 않아 메모리 릭이 발생할 수 있습니다. subscribe() 호출 시 다른 스레드에서 emit 작업 중에는 반환되지 않는 문제가 있습니다.
