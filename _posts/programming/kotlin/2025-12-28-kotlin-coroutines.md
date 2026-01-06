---
layout: post
title: "Kotlin 코루틴: 비동기 프로그래밍"
date: 2025-12-28 12:09:00 +0900
categories: [programming, kotlin]
tags: [kotlin, coroutine, async, suspend, concurrency]
description: "Kotlin 코루틴의 기본 개념과 사용법을 알아봅니다. suspend 함수, async, runBlocking에 대해 다룹니다."
image: /assets/images/posts/thumbnails/2025-12-28-kotlin-coroutines.png
---

코루틴은 Kotlin에서 비동기 프로그래밍을 위한 강력한 도구입니다. 가벼운 스레드라고 생각할 수 있습니다.

## 설정

### Gradle 설정

```kotlin
apply plugin: 'kotlin'
// 또는
apply plugin: 'kotlin-android'

kotlin {
    experimental {
        coroutines 'enable'
    }
}

repositories {
    jcenter()
}

dependencies {
    compile "org.jetbrains.kotlinx:kotlinx-coroutines-core:0.16"
}
```

## 기본 개념

### suspend 함수

`suspend` 키워드는 함수가 일시 중단될 수 있음을 나타냅니다.

```kotlin
suspend fun longRunningTask(): Long {
    val time = measureTimeMillis {
        println("Please wait")
        delay(2, TimeUnit.SECONDS)  // 2초 대기
        println("Delay Over")
    }
    return time
}
```

### runBlocking

다른 스레드에서 작업하지만 현재 스레드를 블록합니다.

```kotlin
fun main(args: Array<String>) {
    runBlocking {
        val exeTime = longRunningTask()
        println("Execution Time is $exeTime")
    }
}
```

### delay

스레드를 블록하지 않고 일시 중단합니다. `suspend` 함수 내에서만 사용 가능합니다.

```kotlin
runBlocking {
    delay(5, TimeUnit.SECONDS)
}
```

## async

비동기 작업을 시작하고 결과를 나중에 받을 수 있습니다.

### Context

- `Unconfined`: 메인 스레드
- `CommonPool`: 공용 스레드 풀

### 사용법

```kotlin
fun main(args: Array<String>) {
    val time = async(CommonPool) { longRunningTask() }  // 비동기 시작
    println("Print after async")
    runBlocking {
        println("printing time ${time.await()}")  // 결과 대기
    }
}
```

### await와 예외 처리

`await()` 호출 전까지 예외는 무시됩니다. 예외를 확인하려면 `await()`를 호출해야 합니다.

```kotlin
val deferred = async(CommonPool) {
    throw RuntimeException("Error!")
}

// 여기서는 예외가 발생하지 않음
println("After async")

// await() 호출 시 예외 발생
try {
    deferred.await()
} catch (e: Exception) {
    println("Exception caught: ${e.message}")
}
```

## 시간 측정

`measureTimeMillis`로 람다 실행 시간을 측정할 수 있습니다.

```kotlin
val time = measureTimeMillis {
    // 측정할 코드
    performOperation()
}
println("Took $time ms")
```

## 유용한 리소스

- [Kotlin 코루틴 기본](https://kotlinlang.org/docs/reference/coroutines/basics.html)
- [Kotlin 코루틴 참조](https://kotlinlang.org/docs/reference/coroutines.html)
- [Quasar - 어노테이션 기반 병렬 라이브러리](http://www.paralleluniverse.co/quasar/)

## 다음 단계

코루틴의 기본에 대해 알아보았습니다. 다음으로 [Kotlin Native 동시성](/kotlin/kotlin-native-concurrency)에 대해 알아보세요.
