---
layout: post
title: "Kotlin Native 동시성과 Freezing"
date: 2025-12-28 12:10:00 +0900
categories: kotlin
tags: [kotlin, kotlin-native, concurrency, freezing, multiplatform]
description: "Kotlin Native의 동시성 모델과 객체 freezing에 대해 알아봅니다."
---

Kotlin Native는 JVM과 다른 메모리 모델을 사용합니다. 멀티스레드 환경에서 안전하게 객체를 공유하기 위해 freezing 개념을 도입했습니다.

## 기본 개념

### Object와 freeze

Object 선언은 기본적으로 freeze 상태입니다.

```kotlin
object MySingleton {
    // 기본적으로 freeze됨
    // mutable로 바꾸려면 @ThreadLocal 사용
}
```

### Global Properties

전역 프로퍼티는 메인 스레드에서만 접근 가능하며 mutable입니다.

```kotlin
// 백그라운드 스레드에서 접근 시 에러:
// kotlin.native.IncorrectDereferenceException:
// Trying to access top level value not marked as
// @ThreadLocal or @SharedImmutable from non-main thread
```

### String

String은 기본적으로 frozen 상태입니다.

### freeze 발생 위치 추적

`ensureNeverFrozen()`을 사용하면 freeze가 발생하는 위치를 찾을 수 있습니다.

## Object vs Property Freeze

freeze는 object에 걸리지, property에 걸리는 것이 아닙니다.

```kotlin
class A {
    var b = B()
}

fun run() {
    val a = A()
    a.b.freeze()
    a.b = B()  // freeze 후에도 에러 없음! (a는 freeze되지 않음)
}
```

a.b가 바뀔 때 에러가 나게 하려면 a를 freeze해야 합니다.

### ensureNeverFrozen과 sub-graph

`ensureNeverFrozen`은 해당 object에만 적용되고, 참조되는 하위 객체에는 반영되지 않습니다.

```kotlin
class A {
    init {
        ensureNeverFrozen()
    }
    var a = B("a")
}

fun run() {
    A().a.freeze()  // 에러가 안남 (B만 freeze됨)
}
```

## 람다와 Freeze

### 클래스 참조가 없는 경우

클래스 안에서 백그라운드 람다가 생성되더라도, 클래스 객체를 참조하지 않으면 클래스는 freeze되지 않습니다.

```kotlin
class CountingModelSafer {
    var count = 0

    fun increment() {
        count++
        saveToDb(count)
    }

    private fun saveToDb(arg: Int) = background {
        // 클래스를 참조하지 않음
        println("Doing db stuff with $arg, in main $isMainThread")
    }
}

fun captureArgs() {
    val model = CountingModelSafer()
    model.increment()  // count 변경 가능
    println("I have ${model.count}")

    model.increment()
    println("I have ${model.count}")
}
```

### 클래스 참조가 있는 경우

람다에서 클래스 멤버를 참조하면 클래스가 freeze됩니다.

```kotlin
class CountingModel {
    var count = 0

    fun increment() {
        count++
        background {
            saveToDb(count)  // count는 CountingModel의 필드라 CountingModel을 freeze함
        }
    }

    private fun saveToDb(arg: Int) {
        println("Saving $arg to db")
    }
}
```

## Coroutine과 Freeze

coroutine을 launch한다고 자동으로 freeze되지는 않습니다.

Dispatcher가 다른 스레드를 사용하는 경우, Native에서는 `kotlin.native.concurrent.Worker`를 호출하고, 여기서 freeze가 발생합니다.

## 유용한 리소스

- [Kotlin Native Concurrency](https://kotlinlang.org/docs/reference/native/concurrency.html)
- [Kotlin Native Immutability](https://kotlinlang.org/docs/reference/native/immutability.html)
- [Touchlab - Kotlin Native Concurrency](https://touchlab.co/kotlin-native-concurrency/)
- [Kotlin Native Concurrency Hands-on](https://play.kotlinlang.org/hands-on/Kotlin%20Native%20Concurrency/02_Frozen)

## Kotlin Multiplatform

Kotlin Multiplatform에 대한 더 자세한 내용은 다음 리소스를 참고하세요:

- [Kotlin Multiplatform Under the Hood (YouTube)](https://www.youtube.com/watch?v=5QPPZV04-50&list=PLQ176FUIyIUankIQrXKNfXaOxOPx04D8V&index=16)

## 다음 단계

Kotlin Native의 동시성에 대해 알아보았습니다. 이제 Kotlin의 주요 기능들을 모두 살펴보았습니다!
