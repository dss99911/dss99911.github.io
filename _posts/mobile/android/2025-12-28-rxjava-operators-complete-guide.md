---
layout: post
title: "RxJava Operators Complete Guide"
date: 2025-12-28
categories: [mobile, android]
tags: [rxjava, android, operators, reactive-programming]
image: /assets/images/posts/thumbnails/2025-12-28-rxjava-operators-complete-guide.png
---

RxJava의 다양한 연산자들을 상세히 알아봅니다.

## Transforming Operators

### map

데이터를 변환합니다.

```kotlin
Observable.range(1, 5)
    .map { it * 2 }
    .subscribe { println(it) }  // 2, 4, 6, 8, 10
```

### cast

타입을 캐스팅합니다.

```kotlin
list.toObservable()
    .cast(MyItem::class.java)
    .subscribe { println(it) }
```

### flatMap

Observable을 반환하며, 순서를 보장하지 않습니다 (merge 사용).

```kotlin
val observable = listOf(10, 9, 8, 7, 6).toObservable()
observable.flatMap { number ->
    Observable.just("Transforming Int to String $number")
}.subscribe { item ->
    println("Received $item")
}
```

### concatMap

flatMap과 같지만 순서를 보장합니다.

```kotlin
Observable.range(1, 10)
    .concatMap {
        val randDelay = Random().nextInt(10)
        Observable.just(it)
            .delay(randDelay.toLong(), TimeUnit.MILLISECONDS)
    }
    .blockingSubscribe { println("Received $it") }
```

### switchMap

새로운 emit이 발생하면 이전 작업을 취소합니다.

```kotlin
Observable.range(1, 10)
    .switchMap {
        val randDelay = Random().nextInt(10)
        if (it % 3 == 0)
            Observable.just(it)
        else
            Observable.just(it).delay(randDelay.toLong(), TimeUnit.MILLISECONDS)
    }
    .blockingSubscribe { println("Received $it") }
```

### defaultIfEmpty

비어있으면 기본값을 반환합니다.

```kotlin
Observable.range(0, 10)
    .filter { it > 15 }
    .defaultIfEmpty(15)
    .subscribe { println("Received $it") }  // 15
```

### switchIfEmpty

비어있으면 다른 Observable로 전환합니다.

```kotlin
Observable.range(0, 10)
    .filter { it > 15 }
    .switchIfEmpty(Observable.range(11, 10))
    .subscribe { println("Received $it") }
```

### sorted

정렬합니다 (x - y는 오름차순).

```kotlin
listOf(2, 6, 7, 1, 3, 4, 5)
    .toObservable()
    .sorted()
    .subscribe { println("Received $it") }

// Custom 정렬
listOf(2, 6, 7, 1, 3, 4, 5)
    .toObservable()
    .sorted { item1, item2 -> if (item1 > item2) -1 else 1 }  // 내림차순
    .subscribe { println("Received $it") }
```

### scan

이전 값과 현재 값을 사용해 누적 계산합니다.

```kotlin
Observable.range(1, 10)
    .scan { previousAccumulation, newEmission ->
        previousAccumulation + newEmission
    }
    .subscribe { println("Received $it") }
// 1, 3, 6, 10, 15, 21, 28, 36, 45, 55
```

## Filter Operators

### debounce

딜레이 동안 새로운 emit이 없을 때만 처리합니다.

```kotlin
createObservable()
    .debounce(200, TimeUnit.MILLISECONDS)
    .subscribe { println(it) }
```

### distinct

중복을 필터링합니다.

```kotlin
listOf(1, 2, 2, 3, 4, 5, 5, 5, 6, 7, 8, 9, 3, 10)
    .toObservable()
    .distinct()
    .subscribe { println("Received $it") }
```

### distinctUntilChanged

연속된 중복만 필터링합니다.

```kotlin
listOf(1, 2, 2, 3, 4, 5, 5, 5, 6, 7, 8, 9, 3, 10)
    .toObservable()
    .distinctUntilChanged()
    .subscribe { println("Received $it") }
// 1, 2, 3, 4, 5, 6, 7, 8, 9, 3, 10 (마지막 3은 출력됨)
```

### elementAt

n번째 요소를 가져옵니다.

```kotlin
val observable = listOf(10, 1, 2, 5, 8, 6, 9).toObservable()
observable.elementAt(5).subscribe { println("Received $it") }  // 6
```

### filter

조건에 맞는 것만 통과시킵니다.

```kotlin
Observable.range(1, 20)
    .filter { it % 2 == 0 }
    .subscribe { println("Received $it") }
```

### first / last

첫 번째/마지막 요소를 가져옵니다.

```kotlin
val observable = Observable.range(1, 10)
observable.first(2).subscribeBy { println("Received $it") }  // 1
observable.last(2).subscribeBy { println("Received $it") }   // 10

// 비어있을 때 기본값 사용
Observable.empty<Int>().first(2).subscribeBy { println("Received $it") }  // 2
```

### ignoreElements

모든 요소를 무시하고 Completable을 반환합니다.

```kotlin
val observable = Observable.range(1, 10)
observable.ignoreElements()
    .subscribe { println("Completed") }
```

### take / takeLast

처음/마지막 n개를 가져옵니다.

```kotlin
Observable.range(1, 10)
    .take(3)
    .subscribe { println(it) }  // 1, 2, 3
```

### skip / skipLast

처음/마지막 n개를 건너뜁니다.

```kotlin
Observable.range(1, 20)
    .skip(5)
    .subscribe { println(it) }  // 6~20

// 시간 기반
Observable.interval(100, TimeUnit.MILLISECONDS)
    .skip(400, TimeUnit.MILLISECONDS)
    .subscribe { println(it) }
```

### skipWhile

조건이 true인 동안 건너뜁니다 (첫 false 이후는 모두 통과).

```kotlin
Observable.range(1, 20)
    .skipWhile { it < 10 }
    .subscribe { println(it) }  // 10~20
```

### skipUntil

다른 Observable이 emit할 때까지 건너뜁니다.

```kotlin
val observable1 = Observable.interval(100, TimeUnit.MILLISECONDS)
val observable2 = Observable.timer(500, TimeUnit.MILLISECONDS)

observable1.skipUntil(observable2)
    .subscribe { println(it) }  // 500ms 이후부터 출력
```

## Combining Operators

### startWith

맨 앞에 요소를 추가합니다.

```kotlin
Observable.range(0, 10)
    .startWith(-1)
    .subscribe { println("Received $it") }

// 리스트나 Observable도 가능
Observable.range(5, 10)
    .startWith(listOf(1, 2, 3, 4))
    .subscribe { println("Received $it") }
```

### merge

순서 없이 합칩니다 (emit되는 대로).

```kotlin
val observable1 = listOf("Kotlin", "Scala", "Groovy").toObservable()
val observable2 = listOf("Python", "Java", "C++").toObservable()

Observable.merge(observable1, observable2)
    .subscribe { println("Received $it") }

// mergeArray, mergeWith도 사용 가능
```

### concat

순서를 유지하며 합칩니다.

```kotlin
val observable1 = Observable.interval(500, TimeUnit.MILLISECONDS)
    .take(2)
    .map { "Observable 1 $it" }
val observable2 = Observable.interval(100, TimeUnit.MILLISECONDS)
    .map { "Observable 2 $it" }

Observable.concat(observable1, observable2)
    .subscribe { println("Received $it") }
```

### amb (Ambiguous)

먼저 emit하는 Observable만 사용합니다.

```kotlin
val observable1 = Observable.interval(500, TimeUnit.MILLISECONDS)
    .map { "Observable 1 $it" }
val observable2 = Observable.interval(100, TimeUnit.MILLISECONDS)
    .map { "Observable 2 $it" }

Observable.amb(listOf(observable1, observable2))
    .subscribe { println("Received $it") }  // Observable 2만 출력
```

### zip

같은 인덱스의 요소들을 결합합니다 (최대 9개).

```kotlin
val observable1 = Observable.range(1, 10)
val observable2 = Observable.range(11, 10)

Observable.zip(observable1, observable2,
    BiFunction<Int, Int, Int> { e1, e2 -> e1 + e2 }
).subscribe { println("Received $it") }
```

### zipWith

```kotlin
val observable1 = Observable.range(1, 10)
val observable2 = listOf("String 1", "String 2", ...).toObservable()

observable1.zipWith(observable2) { e1: Int, e2: String -> "$e2 $e1" }
    .subscribe { println("Received $it") }
```

### combineLatest

한쪽이 emit하면 다른 쪽의 최신 값과 결합합니다.

```kotlin
val observable1 = Observable.interval(100, TimeUnit.MILLISECONDS)
val observable2 = Observable.interval(250, TimeUnit.MILLISECONDS)

Observable.combineLatest(observable1, observable2,
    BiFunction { t1: Long, t2: Long -> "t1: $t1, t2: $t2" }
).subscribe { println("Received $it") }
```

## Reducing Operators

### count

개수를 반환합니다.

```kotlin
listOf(1, 5, 9, 7, 6, 4, 3, 2).toObservable()
    .count()
    .subscribeBy { println("count $it") }
```

### reduce

누적 계산 후 최종 값만 반환합니다.

```kotlin
Observable.range(1, 10)
    .reduce { prev, curr -> prev + curr }
    .subscribeBy { println("accumulation $it") }  // 55
```

## Buffer and Window Operators

### buffer

요소들을 그룹으로 묶습니다.

```kotlin
val flowable = Flowable.range(1, 111)
flowable.buffer(10)
    .subscribe { println(it) }
// [1..10], [11..20], ...
```

시간 기반:
```kotlin
Flowable.interval(100, TimeUnit.MILLISECONDS)
    .buffer(1, TimeUnit.SECONDS)
    .subscribe { println(it) }
```

### window

buffer와 같지만 Observable을 반환합니다.

```kotlin
Flowable.range(1, 111)
    .window(10)
    .subscribe { flo ->
        flo.subscribe { print("$it, ") }
        println()
    }
```

## Grouping Operators

### groupBy

키를 기준으로 그룹화합니다.

```kotlin
Observable.range(1, 30)
    .groupBy { it % 5 }
    .blockingSubscribe {
        println("Key ${it.key}")
        it.subscribe { println("Received $it") }
    }
```

## Throttle Operators

### throttleFirst / throttleLast

일정 시간 동안 첫/마지막 emit만 통과시킵니다.

```kotlin
Flowable.interval(100, TimeUnit.MILLISECONDS)
    .throttleFirst(200, TimeUnit.MILLISECONDS)
    .subscribe { println(it) }
```
