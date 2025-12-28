---
layout: post
title: "Kotlin 함수와 람다: 함수 선언부터 고차 함수까지"
date: 2025-12-28 12:02:00 +0900
categories: [programming, kotlin]
tags: [kotlin, function, lambda, higher-order-function, inline]
description: "Kotlin의 함수 선언, 람다 표현식, 고차 함수, 인라인 함수에 대해 알아봅니다."
---

Kotlin은 함수형 프로그래밍을 강력하게 지원합니다. 이 포스트에서는 함수와 람다의 다양한 사용법을 알아보겠습니다.

## 함수 선언

### 기본 함수

```kotlin
fun sum(a: Int, b: Int): Int {
    return a + b
}

// 사용
val result = sum(1, 2)
```

### 기본 인자 (Default Arguments)

```kotlin
fun read(b: Array<Byte>, off: Int = 0, len: Int = b.size) { ... }
```

### 가변 인자 (Vararg)

```kotlin
fun foo(vararg strings: String) { /* ... */ }

// 배열 전개
fun(*array)
```

### Unit 반환 타입

반환 값이 없는 함수는 `Unit`을 반환합니다. 생략 가능합니다.

```kotlin
fun printSum(a: Int, b: Int): Unit {
    println("sum of $a and $b is ${a + b}")
}

// Unit 생략 가능
fun printSum(a: Int, b: Int) {
    println("sum of $a and $b is ${a + b}")
}
```

### Single-Expression 함수

함수 본문이 단일 표현식인 경우 중괄호를 생략할 수 있습니다.

```kotlin
fun double(x: Int): Int = x * 2

// 반환 타입 추론
fun double(x: Int) = x * 2

fun max(a: Int, b: Int) = if (a > b) a else b
```

### Named Arguments

파라미터 이름을 명시하여 호출할 수 있습니다.

```kotlin
reformat(str, wordSeparator = '_')

// Spread operator
foo(strings = *arrayOf("a", "b", "c"))
```

### Infix 함수 (중간 연산자)

```kotlin
// 선언
infix fun Int.shl(x: Int): Int { ... }

// 사용
1 shl 2      // infix notation
1.shl(2)     // 일반 호출
```

### Global 함수

클래스 외부에 선언된 함수는 다른 파일에서 import 없이 사용 가능합니다 (import static과 유사).

### Tail Recursive 함수

재귀 함수 최적화를 위해 `tailrec` 키워드를 사용합니다. JVM에서만 지원됩니다.

```kotlin
tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (x == Math.cos(x)) x else findFixPoint(Math.cos(x))
```

### 함수 내 함수

함수 내부에 다른 함수를 정의할 수 있습니다.

```kotlin
fun outer() {
    fun inner() { ... }
    inner()
}
```

### 백틱 함수명

테스트에서 읽기 쉬운 이름을 사용할 수 있습니다.

```kotlin
fun `should return true when valid input`() {
    // test code
}
```

## Inline 함수

람다를 인라인으로 처리하여 오버헤드를 줄입니다.

```kotlin
inline fun <T> lock(lock: Lock, body: () -> T): T { ... }

// noinline: 특정 람다는 인라인하지 않음
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) { ... }
```

### crossinline

람다가 다른 컨텍스트에서 호출될 때 사용합니다.

```kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object : Runnable {
        override fun run() = body()
    }
}
```

### Inline 프로퍼티

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }

inline var bar: Bar
    get() = ...
    set(v) { ... }
```

### Reified 타입

inline 함수에서 제네릭 타입 정보를 런타임에 사용할 수 있습니다.

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}

// 사용
treeNode.findParentOfType<MyTreeNode>()
```

```kotlin
object YamlReader {
    inline fun <reified T> read(path: String): T =
        ObjectMapper(YAMLFactory()).readValue(File(path), T::class.java)
}
```

## 람다 표현식

### 람다 타입 선언

인터페이스 선언 없이 함수 타입을 정의할 수 있습니다.

```kotlin
val lambda: (String) -> String

val sum: (Int, Int) -> Int = { x, y -> x + y }

// 익명 함수
ints.filter(fun(item) = item > 0)
```

### 함수를 파라미터로 받기

```kotlin
fun <T> lock(lock: Lock, body: () -> T): T {
    lock.lock()
    try {
        return body()
    } finally {
        lock.unlock()
    }
}

// 함수 참조로 전달
fun toBeSynchronized() = sharedResource.operation()
val result = lock(lock, ::toBeSynchronized)
```

### 람다 사용법

```kotlin
// 명시적 파라미터
{ arg -> arg + 1 }

// 암시적 파라미터 (it)
fruits
    .filter { it.startsWith("a") }
    .sortedBy { it }
    .map { it.toUpperCase() }
    .forEach { println(it) }

// 다중 파라미터
max(strings, { a, b -> a.length < b.length })

// 사용하지 않는 변수
map.forEach { _, value -> println("$value!") }
```

### 람다와 return

람다 내부의 `return`은 해당 람다를 포함한 함수를 종료시킵니다 (inline 함수의 경우).

```kotlin
// 암시적 반환 (마지막 표현식이 반환값)
ints.filter {
    val shouldFilter = it > 0
    shouldFilter
}

// 명시적 반환
ints.filter {
    val shouldFilter = it > 0
    return@filter shouldFilter
}

// 라벨 사용
ints.forEach lit@ {
    if (it == 0) return@lit
    print(it)
}

// 암시적 라벨
ints.forEach {
    if (it == 0) return@forEach
    print(it)
}
```

### Destructuring 람다

```kotlin
{ a -> ... }           // 단일 파라미터
{ a, b -> ... }        // 두 파라미터
{ (a, b) -> ... }      // 구조 분해 (Pair 등)
{ (a, b), c -> ... }   // 구조 분해 + 추가 파라미터
```

### Receiver가 있는 람다

```kotlin
fun <T> T.apply(block: T.() -> Unit): T { /* ... */ }

class HTML {
    fun body() { ... }
}

fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()
    html.init()
    return html
}

// 사용
html {
    body()  // receiver 객체의 메서드 직접 호출
}
```

## 표준 라이브러리 함수

### let

`it`을 통해 값을 참조하고 결과를 반환합니다.

```kotlin
val mapped = value?.let { transformValue(it) } ?: defaultValueIfValueIsNull
```

### apply

객체의 메서드를 호출하고 객체 자체를 반환합니다.

```kotlin
IntArray(size).apply { fill(-1) }
```

### with

한 객체의 여러 메서드를 호출할 때 유용합니다.

```kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) {
    penDown()
    for (i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```

### also

객체로 각기 다른 작업을 수행할 때 사용합니다.

```kotlin
val numbers = mutableListOf(1, 2, 3)
numbers.also { println("The list elements: $it") }
    .add(4)
```

### run

`with`와 유사하지만 확장 함수 형태입니다.

```kotlin
val result = listOf.run { add(1); get(0) }
```

### takeIf

조건에 맞는 경우에만 처리합니다.

```kotlin
val number = Random.nextInt(100)
val evenOrNull = number.takeIf { it % 2 == 0 }
```

## Sequence 빌더

무한 시퀀스를 생성할 수 있습니다.

```kotlin
fun main(args: Array<String>) {
    val fibonacciSeries = sequence {
        var a = 0
        var b = 1
        yield(a)
        yield(b)

        while (true) {
            val c = a + b
            yield(c)
            a = b
            b = c
        }
    }

    println(fibonacciSeries.take(10).joinToString(","))
}
```

## 컬렉션 함수

### 리스트 생성

```kotlin
listOf("apple", "banana", "kiwi")     // 불변 리스트
mutableListOf(1, 2, 3)                 // 가변 리스트
```

## 다음 단계

함수와 람다에 대해 알아보았습니다. 다음으로 [제어문](/kotlin/kotlin-control-flow)에 대해 알아보세요.
