---
layout: post
title: "Kotlin 클래스와 객체: Class, Data Class, Sealed Class, Object"
date: 2025-12-28 12:01:00 +0900
categories: kotlin
tags: [kotlin, class, data-class, sealed-class, object, singleton]
description: "Kotlin의 클래스, 데이터 클래스, Sealed 클래스, Object 선언과 Companion Object에 대해 알아봅니다."
---

Kotlin은 객체 지향 프로그래밍을 위한 풍부한 기능을 제공합니다. 이 포스트에서는 다양한 클래스 유형과 객체에 대해 알아보겠습니다.

## 클래스 선언

### 기본 클래스

```kotlin
// 파라미터 없는 경우
class Greeter() {
    fun greet() {
    }
}

// read only, mutable 파라미터
class Greeter(val name: String, var age: Int) {
    fun greet() {
        println("Hello, ${name}")
    }
}

// body가 없는 경우 중괄호 생략 가능
class A(a: Int)

// visibility modifier와 annotation이 있는 생성자
class Customer public @Inject constructor(name: String) { ... }
```

### 상속

기본적으로 Kotlin의 모든 클래스는 `final`입니다. 상속을 허용하려면 `open` 키워드를 사용해야 합니다.

```kotlin
open class A  // 상속 가능

class B : A() {
    override fun foo(i: Int) { ... }
}

// 파라미터가 있는 클래스 상속
class Rectangle(
    var height: Double,
    var length: Double
) : Shape(listOf(height, length, height, length)) { ... }
```

### 추상 클래스

추상 클래스는 `open` 키워드가 필요 없습니다.

```kotlin
abstract class Shape(val sides: List<Double>) {
    val perimeter: Double get() = sides.sum()
    abstract fun calculateArea(): Double
}

// 비추상 멤버를 추상으로 오버라이드
open class Base {
    open fun f() {}
}

abstract class Derived : Base() {
    override abstract fun f()
}
```

### 생성자

```kotlin
// Secondary constructor
class Person {
    constructor(parent: Person) {
        parent.children.add(this)
    }
}

// Primary constructor가 있는 경우 delegation 필수
class Person(val name: String) {
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}

// super 생성자 호출
class MyView : View {
    constructor(ctx: Context) : super(ctx)
    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}

// private constructor
class C private constructor(a: Int) { ... }

// private property in constructor
class ParameterizedClass<A>(private val value: A) {
    fun getValue(): A = value
}
```

### 초기화 블록

```kotlin
class Customer(name: String) {
    init {
        logger.info("Customer initialized with value ${name}")
    }

    val customerKey = name.toUpperCase()
}
```

### 중첩 클래스

```kotlin
// Static nested class (기본)
class Outer {
    private val bar: Int = 1
    class Nested {
        fun foo() = 2
    }
}
val demo = Outer.Nested().foo()  // == 2

// Inner class (외부 클래스 참조 가능)
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}
val demo = Outer().Inner().foo()  // == 1
```

### 메서드 오버라이딩

```kotlin
open class Base {
    open fun v() {}
    fun nv() {}  // final by default
}

class Derived() : Base() {
    override fun v() {}

    // 추가 오버라이드 방지
    final override fun v() {}
}
```

### 다중 상속에서의 충돌 해결

인터페이스와 클래스에서 같은 시그니처의 메서드가 있을 경우:

```kotlin
open class A {
    open fun f() { print("A") }
    fun a() { print("a") }
}

interface B {
    fun f() { print("B") }  // interface members are 'open' by default
    fun b() { print("b") }
}

class C() : A(), B {
    // 컴파일러가 f() 오버라이드를 요구함
    override fun f() {
        super<A>.f()  // A.f() 호출
        super<B>.f()  // B.f() 호출
    }
}
```

### 프로퍼티 오버라이딩

Kotlin에서는 프로퍼티도 오버라이드할 수 있습니다. `val`을 `var`로 오버라이드할 수 있지만, 그 반대는 불가능합니다.

```kotlin
open class Foo {
    open val x: Int get() { ... }
}

class Bar1 : Foo() {
    override var x: Int = ...  // val -> var 가능
}

// Primary constructor에서 오버라이드
interface Foo {
    val count: Int
}

class Bar1(override val count: Int) : Foo
```

### this와 super 레이블

```kotlin
class A {
    inner class B {
        fun Int.foo() {
            val a = this@A  // A's this
            val b = this@B  // B's this
            val c = this    // foo()'s receiver, an Int
        }
    }
}

class Bar : Foo() {
    override fun f() { /* ... */ }

    inner class Baz {
        fun g() {
            super@Bar.f()  // Foo의 f() 호출
        }
    }
}
```

## 인터페이스

### 선언과 구현

```kotlin
interface RectangleProperties {
    val isSquare: Boolean
}

// 메서드 기본 구현 가능
interface B {
    fun f() { print("B") }
    fun b() { print("b") }
}

// 구현
class Rectangle : Shape(), RectangleProperties {
    override val isSquare: Boolean get() = length == height
}
```

## Data Class

Data class는 데이터를 보관하기 위한 클래스로, 다음 함수들을 자동 생성합니다:
- `equals()` / `hashCode()`
- `toString()` - "User(name=John, age=42)" 형식
- `componentN()` 함수들
- `copy()` 함수

```kotlin
data class User(val name: String, val age: Int)

// copy 사용
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

### Destructuring Declarations

`componentN()` 함수가 있는 클래스에서 사용 가능합니다.

```kotlin
val (name, age) = person
// 아래와 동일
val name = person.component1()
val age = person.component2()

// for 문에서
for ((a, b) in collection) { ... }
for ((key, value) in map) { ... }

// 사용하지 않는 변수
val (_, status) = getResult()
```

### 여러 값 반환하기

```kotlin
data class Result(val result: Int, val status: Status)

fun function(...): Result {
    // computations
    return Result(result, status)
}

val (result, status) = function(...)
```

## Sealed Class

Sealed class는 같은 파일 내에서만 상속이 가능합니다. 이를 통해 제한된 클래스 계층을 정의할 수 있습니다.

```kotlin
sealed class Expr
data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()
```

### when과 함께 사용

Sealed class의 모든 하위 클래스가 처리되면 `else` 절이 필요 없습니다.

```kotlin
fun eval(expr: Expr): Double = when(expr) {
    is Const -> expr.number
    is Sum -> eval(expr.e1) + eval(expr.e2)
    NotANumber -> Double.NaN
    // else 절이 필요 없음!
}
```

## Object

### Object Expression (익명 클래스)

Java의 anonymous inner class와 유사합니다.

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }
    override fun mouseEntered(e: MouseEvent) { ... }
})

// 여러 인터페이스/클래스 상속
open class A(x: Int) {
    public open val y: Int = x
}

interface B { ... }

val ab: A = object : A(1), B {
    override val y = 15
}
```

### 간단한 Object

타입 없이 간단한 객체를 생성할 수 있습니다.

```kotlin
fun foo() {
    val adHoc = object {
        var x: Int = 0
        var y: Int = 0
    }
    print(adHoc.x + adHoc.y)
}
```

### Object Declaration (Singleton)

Kotlin에서 싱글톤을 선언하는 가장 쉬운 방법입니다.

```kotlin
object Resource {
    val name = "Name"
}

// 사용
val resourceName = Resource.name
```

```kotlin
object DataProviderManager {
    fun registerDataProvider(provider: DataProvider) { ... }

    val allDataProviders: Collection<DataProvider>
        get() = ...
}

DataProviderManager.registerDataProvider(...)
```

### Companion Object

클래스 내부에 static 멤버를 정의하는 방법입니다.

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}

val instance = MyClass.create()

// 이름 생략 가능
class MyClass {
    companion object { }
}

val x = MyClass.Companion
```

### Companion Object와 인터페이스

Companion object도 인터페이스를 구현할 수 있습니다.

```kotlin
interface Factory<T> {
    fun create(): T
}

class MyClass {
    companion object : Factory<MyClass> {
        override fun create(): MyClass = MyClass()
    }
}
```

## 표준 라이브러리의 데이터 클래스

Kotlin 표준 라이브러리에서 제공하는 데이터 클래스들:

```kotlin
Pair  // 두 값을 담는 클래스
Triple  // 세 값을 담는 클래스

val pair = Pair("key", "value")
val (key, value) = pair
```

## 다음 단계

클래스와 객체에 대해 알아보았습니다. 다음으로 [함수와 람다](/kotlin/kotlin-functions-lambda)에 대해 알아보세요.
