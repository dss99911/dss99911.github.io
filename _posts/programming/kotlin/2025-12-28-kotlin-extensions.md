---
layout: post
title: "Kotlin 확장 함수와 확장 프로퍼티"
date: 2025-12-28 12:07:00 +0900
categories: [programming, kotlin]
tags: [kotlin, extension, extension-function, extension-property]
description: "Kotlin의 확장 함수와 확장 프로퍼티를 알아봅니다. 기존 클래스에 새로운 기능을 추가하는 방법을 다룹니다."
image: /assets/images/posts/thumbnails/2025-12-28-kotlin-extensions.png
---

Kotlin의 확장 함수는 기존 클래스를 수정하지 않고 새로운 기능을 추가할 수 있는 강력한 기능입니다.

## 확장 함수 (Extension Functions)

### 기본 사용법

```kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1]  // 'this'는 리스트를 참조
    this[index1] = this[index2]
    this[index2] = tmp
}

// 사용
val l = mutableListOf(1, 2, 3)
l.swap(0, 2)
```

### 제네릭 확장

```kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1]
    this[index1] = this[index2]
    this[index2] = tmp
}
```

## 확장 함수의 특성

### 정적 해석

확장 함수는 멤버 함수가 아닌 정적 함수로 해석됩니다. 따라서 인스턴스의 런타임 타입이 아닌 선언된 타입을 따릅니다.

```kotlin
open class C
class D: C()

fun C.foo() = "c"
fun D.foo() = "d"

fun printFoo(c: C) {
    println(c.foo())
}

printFoo(D())  // "c" 출력 (D가 아닌 C의 확장 함수 호출)
```

### 멤버 함수 우선

동일한 시그니처의 멤버 함수가 있으면 멤버 함수가 호출됩니다.

```kotlin
class C {
    fun foo() { println("member") }
}

fun C.foo() { println("extension") }

C().foo()  // "member" 출력
```

### Nullable Receiver

nullable 타입에 대해서도 확장 함수를 정의할 수 있습니다.

```kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    return toString()  // null 체크 후 non-null로 자동 캐스트
}
```

## Companion Object 확장

```kotlin
class MyClass {
    companion object { }
}

fun MyClass.Companion.foo() {
    // ...
}

MyClass.foo()
```

## 클래스 내부의 확장 함수

해당 클래스에서만 사용할 수 있는 확장 함수를 정의할 수 있습니다.

```kotlin
class D {
    fun bar() { ... }
}

class C {
    fun baz() { ... }

    fun D.foo() {
        bar()   // D.bar 호출
        baz()   // C.baz 호출
    }

    fun caller(d: D) {
        d.foo()  // 확장 함수 호출
    }
}
```

### 함수명 충돌 시

```kotlin
class C {
    fun D.foo() {
        toString()         // D.toString() 호출
        this@C.toString()  // C.toString() 호출
    }
}
```

### 지역 확장 함수

함수 내에서 확장 함수를 정의할 수 있습니다.

```kotlin
fun a() {
    fun Int.sum(other: Int): Int = this + other
    val i: Int = 1
    i.sum(1)
}
```

## 확장 함수 오버라이드

dispatch receiver(확장이 정의된 클래스)에 대해서는 가상으로 해석되지만, extension receiver에 대해서는 정적으로 해석됩니다.

```kotlin
open class D { }
class D1 : D() { }

open class C {
    open fun D.foo() {
        println("D.foo in C")
    }

    open fun D1.foo() {
        println("D1.foo in C")
    }

    fun caller(d: D) {
        d.foo()
    }
}

class C1 : C() {
    override fun D.foo() {
        println("D.foo in C1")
    }

    override fun D1.foo() {
        println("D1.foo in C1")
    }
}

C().caller(D())   // "D.foo in C"
C1().caller(D())  // "D.foo in C1" - dispatch receiver는 가상으로 해석
C().caller(D1())  // "D.foo in C" - extension receiver는 정적으로 해석
```

## 확장 프로퍼티 (Extension Properties)

backing field가 없으므로 초기화할 수 없고, getter/setter만 정의합니다.

```kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```

## 모든 클래스에 대한 확장

```kotlin
fun <T> T.basicToString(): String {
    return ""
}
```

## 유용한 확장 함수 리소스

다양한 확장 함수를 모아놓은 사이트: [http://kotlinextensions.com/](http://kotlinextensions.com/)

## 실용적인 예시

### 컬렉션 확장

```kotlin
fun <T> MutableList<T>.moveItem(fromIndex: Int, toIndex: Int) {
    val item = removeAt(fromIndex)
    add(toIndex, item)
}
```

### 뷰 확장 (Android)

```kotlin
fun View.show() {
    visibility = View.VISIBLE
}

fun View.hide() {
    visibility = View.GONE
}
```

### 문자열 확장

```kotlin
fun String.isValidEmail(): Boolean =
    this.matches(Regex("[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"))
```

## 다음 단계

확장 함수에 대해 알아보았습니다. 다음으로 [기타 Kotlin 기능](/kotlin/kotlin-misc-features)에 대해 알아보세요.
