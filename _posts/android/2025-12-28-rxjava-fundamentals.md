---
layout: post
title: "RxJava Fundamentals - Reactive Programming on Android"
date: 2025-12-28
categories: android
tags: [rxjava, android, reactive-programming, kotlin, java]
---

RxJava의 기본 개념과 안드로이드에서의 활용법을 알아봅니다.

## RxJava란?

RxJava는 Reactive + Functional Programming을 결합한 라이브러리입니다.

### 핵심 개념

- 데이터와 처리를 분리하고, 데이터는 처리에 푸시만 합니다
- Threading을 라이브러리가 담당하므로 비즈니스 로직에 집중할 수 있습니다

### 기본 흐름

```kotlin
// 1. Observable 생성
val observable = Observable.create<String> { emitter ->
    emitter.onNext("Item 1")
    emitter.onNext("Item 2")
    emitter.onComplete()
}

// 2. Observable 구독
val disposable = observable.subscribe(observer)

// 3. 구독 해제
disposable.dispose()
```

### 실행 순서

1. Observable을 만든다 (subscribe될 때 어떤 것을 emit할지 정의)
2. Observable을 subscribe한다 (onSubscribe 호출)
3. Observer에게 emit한 것을 전달
4. Observer가 emit한 것을 처리
5. subscribe와 observe할 스레드를 결정할 수 있음

## RxJava의 장점

### 구체적 장점

- **Threading 자동화**: 라이브러리가 스레딩을 지원하므로 비즈니스 로직에 집중 가능
- **메모리 릭 방지**: observer와 emitter를 분리해서 unsubscribe시 GC 가능
- **Debouncing**: 지연 로직을 손쉽게 처리
- **Standard Error Handling**: 일관된 에러 처리 메커니즘
- **Callback Hell 제거**: interface, implementation 등의 복잡한 코드 제거
- **One for Everything**: 네트워크, DB, UI 등 모든 작업에 동일한 API 사용
- **Functional Way**: 읽기 쉬운 선언적 코드 작성
- **Maintainable & Testable**: 유지보수와 테스트가 용이한 코드

### 전반적 장점

기존 문제점:
- 비즈니스 로직과 관련 없는 코드가 복잡하게 만듦 (verbose)
- 하나의 기능이 여러 곳에 분리

RxJava 해결책:
- 비즈니스 외 코드 감소 -> 개발 속도 향상, 버그 감소, 가독성 증가
- 기능 관련 코드를 한 곳에 집중

## Dependencies 설정

```gradle
// Kotlin
compile 'io.reactivex.rxjava2:rxkotlin:2.2.0'

// Android
compile 'io.reactivex.rxjava2:rxandroid:2.0.1'
```

## Hot vs Cold Observable

### Cold Observable

```kotlin
val coldObservable = Observable.just(1, 2, 3)

// 각 구독자가 처음부터 모든 아이템을 받음
coldObservable.subscribe { println("Observer 1: $it") }
coldObservable.subscribe { println("Observer 2: $it") }
```

- subscribe()가 호출되었을 때 onSubscribe() 호출
- 모든 subscriber가 처음부터 끝까지 같은 아이템을 구독

### Hot Observable

```kotlin
val connectableObservable = Observable.interval(100, TimeUnit.MILLISECONDS)
    .publish()

connectableObservable.subscribe { println("Subscription 1: $it") }
connectableObservable.subscribe { println("Subscription 2: $it") }

// connect() 호출 시 emit 시작
connectableObservable.connect()
```

- subscribe()가 호출되지 않아도 emit 시작 가능
- 다중 observer가 있을 때 observable을 한 번만 준비

## Observable 생성

### create

```kotlin
val observable = Observable.create<String> {
    it.onNext("Emit 1")
    it.onNext("Emit 2")
    it.onComplete()
    // 또는 it.onError(Exception("Error"))
}
```

### List to Observable

```kotlin
val observable = listOf("One", 2, "Three").toObservable()

// 또는
val observable = Observable.fromIterable(list)
```

### Range

```kotlin
Observable.range(1, 10)
```

### Empty

```kotlin
Observable.empty<String>()
```

### Just

```kotlin
// 여러 리스트를 하나씩 push
val observableOnList = Observable.just(
    listOf("One", 2, "Three"),
    listOf("List with Single Item"),
    listOf(1, 2, 3, 4, 5, 6)
)
```

### Interval

```kotlin
// 300ms 간격으로 emit, count 반환
Observable.interval(300, TimeUnit.MILLISECONDS)
    .subscribe { println("Count: $it") }
```

### Timer

```kotlin
// 400ms 후에 emit
Observable.timer(400, TimeUnit.MILLISECONDS)
    .subscribe { println("Timer fired") }
```

## Maybe

값이 있을 수도 없을 수도 있는 경우:

```kotlin
val maybeValue = Maybe.just(14)
maybeValue.subscribeBy(
    onComplete = { println("Completed Empty") },
    onError = { println("Error $it") },
    onSuccess = { println("Completed with value $it") }
)

val maybeEmpty = Maybe.empty<Int>()
maybeEmpty.subscribeBy(
    onComplete = { println("Completed Empty") },  // 호출됨
    onError = { println("Error $it") },
    onSuccess = { println("Completed with value $it") }
)
```

## 관련 문서

RxJava를 배우기 전에 Java Stream을 먼저 공부하면 이해하기 쉽습니다:

- [Java 8 Stream Tutorial](http://winterbe.com/posts/2014/07/31/java8-stream-tutorial-examples/)
- [RxJava for Android App Development (O'Reilly)](http://www.oreilly.com/programming/free/files/rxjava-for-android-app-development.pdf)

## 용어 정리

- **Producer**: 데이터를 생성하는 Observable/Flowable
- **Downstream**: Producer로부터 데이터를 받는 쪽
- **Emit**: 데이터를 내보내는 행위
- **Subscribe**: Observer가 Observable을 구독하는 행위
