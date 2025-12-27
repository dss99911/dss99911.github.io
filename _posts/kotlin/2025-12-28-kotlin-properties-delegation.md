---
layout: post
title: "Kotlin 프로퍼티와 위임: Property, Delegation, lateinit"
date: 2025-12-28 12:05:00 +0900
categories: kotlin
tags: [kotlin, property, delegation, lateinit, lazy, observable]
description: "Kotlin의 프로퍼티 선언, 커스텀 getter/setter, 위임 패턴(lazy, observable, map)에 대해 알아봅니다."
---

Kotlin의 프로퍼티는 Java의 필드보다 강력한 기능을 제공합니다. 특히 위임(Delegation) 패턴을 통해 프로퍼티의 동작을 쉽게 커스터마이징할 수 있습니다.

## 프로퍼티 기본 문법

```kotlin
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
```

## 커스텀 Getter

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### backing field 사용

```kotlin
var item: Int = 0
    get() {
        field += 1
        return field
    }
```

## 커스텀 Setter

```kotlin
var stringRepresentation: String
    get() = this.toString()
    set(value) {
        setDataFromString(value)  // 다른 프로퍼티에 값 설정
    }

// field 키워드로 backing field 접근
var counter = 0
    set(value) {
        if (value >= 0) field = value
    }
```

## 접근자의 가시성 수정

```kotlin
var setterVisibility: String = "abc"
    private set  // setter는 private, getter는 public

var setterWithAnnotation: Any? = null
    @Inject set  // setter에 어노테이션

var stringRepresentation: String
    get() = this.toString()
    private set(value) {
        // ...
    }
```

## 프로퍼티 오버라이딩

Kotlin에서는 프로퍼티도 오버라이드할 수 있습니다 (getter/setter를 오버라이드).

```kotlin
open class Foo {
    open val x: Int get() { ... }
}

class Bar1 : Foo() {
    override var x: Int = ...  // val을 var로 오버라이드 가능
}

// primary constructor에서 오버라이드
interface Foo {
    val count: Int
}

class Bar1(override val count: Int) : Foo

class Bar2 : Foo {
    override var count: Int = 0
}
```

**주의**: `val`을 `var`로 오버라이드할 수 있지만, 반대는 불가능합니다.

## 상수 (const)

컴파일 타임 상수는 다음 조건을 만족해야 합니다:
- Top-level 또는 object의 멤버
- String 또는 primitive 타입으로 초기화
- 커스텀 getter 없음

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED)
fun foo() { ... }
```

## lateinit

초기화를 나중에 할 수 있는 non-null 프로퍼티입니다.

```kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp
    fun setup() {
        subject = TestSubject()
    }

    @Test
    fun test() {
        subject.method()  // null 체크 없이 직접 사용
    }
}
```

### 초기화 여부 확인

```kotlin
companion object {
    private lateinit var sInstance: StockLiveData

    @MainThread
    fun get(symbol: String): StockLiveData {
        sInstance = if (::sInstance.isInitialized) sInstance else StockLiveData(symbol)
        return sInstance
    }
}
```

## 인터페이스 위임 (Interface Delegation)

이미 구현이 있는 경우 중복 구현 없이 위임할 수 있습니다.

```kotlin
interface Base {
    fun print()
}

class BaseImpl(val x: Int) : Base {
    override fun print() { print(x) }
}

class Derived(b: Base) : Base by b

fun main(args: Array<String>) {
    val b = BaseImpl(10)
    Derived(b).print()  // 10 출력
}
```

## 프로퍼티 위임 (Delegated Properties)

프로퍼티의 getter/setter 로직을 위임할 수 있습니다.

```kotlin
class Example {
    var p: String by Delegate()
}

class Delegate {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        return "$thisRef, thank you for delegating '${property.name}' to me!"
    }

    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
        println("$value has been assigned to '${property.name} in $thisRef.'")
    }
}

val e = Example()
println(e.p)  // "Example@33a17727, thank you for delegating 'p' to me!"
```

## 표준 위임

### lazy

값을 처음 접근할 때 초기화합니다.

```kotlin
val lazyValue: String by lazy {
    println("computed!")
    "Hello"
}

fun main(args: Array<String>) {
    println(lazyValue)  // "computed!" 출력 후 "Hello" 출력
    println(lazyValue)  // "Hello"만 출력 (이미 계산됨)
}
```

**`get()`과의 차이**: `lazy`는 한 번만 호출되고, `get()`은 매번 호출됩니다.

```kotlin
val app: BaseApplication
    get() = BaseApplication.instance  // 매번 호출됨

val app: BaseApplication by lazy {
    BaseApplication.instance  // 한 번만 호출됨
}
```

### 지역 위임 프로퍼티

조건이 만족되지 않으면 계산하지 않습니다.

```kotlin
fun example(computeFoo: () -> Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()
    }
}
```

### observable

값이 변경될 때마다 콜백을 호출합니다.

```kotlin
class User {
    var name: String by Delegates.observable("<no name>") { prop, old, new ->
        println("$old -> $new")
    }
}

fun main(args: Array<String>) {
    val user = User()
    user.name = "first"   // "<no name> -> first" 출력
    user.name = "second"  // "first -> second" 출력
}
```

### Map에 위임

Map의 키를 프로퍼티처럼 사용합니다.

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int by map
}

val user = User(mapOf(
    "name" to "John Doe",
    "age" to 25
))

println(user.name)  // "John Doe"
println(user.age)   // 25

// Mutable 버전
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int by map
}
```

## provideDelegate

프로퍼티에 따라 다른 위임을 제공합니다.

```kotlin
class ResourceDelegate<T> : ReadOnlyProperty<MyUI, T> {
    override fun getValue(thisRef: MyUI, property: KProperty<*>): T { ... }
}

class ResourceLoader<T>(id: ResourceID<T>) {
    operator fun provideDelegate(
        thisRef: MyUI,
        prop: KProperty<*>
    ): ReadOnlyProperty<MyUI, T> {
        checkProperty(thisRef, prop.name)
        return ResourceDelegate()
    }

    private fun checkProperty(thisRef: MyUI, name: String) { ... }
}

class MyUI {
    fun <T> bindResource(id: ResourceID<T>): ResourceLoader<T> { ... }

    val image by bindResource(ResourceID.image_id)
    val text by bindResource(ResourceID.text_id)
}
```

## 다음 단계

프로퍼티와 위임에 대해 알아보았습니다. 다음으로 [제네릭](/kotlin/kotlin-generics)에 대해 알아보세요.
