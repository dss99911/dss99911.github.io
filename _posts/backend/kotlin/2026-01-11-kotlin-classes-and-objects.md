---
layout: post
title: "Kotlin Classes and Objects: Complete OOP Guide"
date: 2026-01-11
categories: [backend, kotlin]
tags: [kotlin, jvm, oop, classes, objects]
image: /assets/images/posts/kotlin-classes-objects.png
---

Kotlin provides a powerful and concise object-oriented programming model. This guide covers classes, objects, inheritance, interfaces, and all the OOP features you need to build robust applications.

## Class Declaration

### Basic Class

```kotlin
class Greeter {
    fun greet() {
        println("Hello!")
    }
}

// With constructor parameters
class Person(val name: String, var age: Int) {
    fun introduce() {
        println("I'm $name, $age years old")
    }
}

// Empty body can be omitted
class Empty
```

### Visibility and Annotations on Constructor

```kotlin
class Customer public @Inject constructor(name: String) {
    // ...
}
```

### Initializer Blocks

```kotlin
class Customer(name: String) {
    val customerKey: String

    init {
        customerKey = name.uppercase()
        println("Customer initialized: $customerKey")
    }
}
```

## Constructors

### Primary Constructor

```kotlin
class Person(val name: String, var age: Int)

// Private property in constructor
class ParameterizedClass<A>(private val value: A) {
    fun getValue(): A = value
}
```

### Secondary Constructors

```kotlin
class Person(val name: String) {
    var children: MutableList<Person> = mutableListOf()

    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}

// Multiple secondary constructors
class MyView : View {
    constructor(ctx: Context) : super(ctx)
    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

### Private Constructor

```kotlin
class Singleton private constructor() {
    companion object {
        val instance = Singleton()
    }
}
```

## Inheritance

### Open Classes

Classes are final by default. Use `open` to allow inheritance:

```kotlin
open class Animal(val name: String) {
    open fun makeSound() {
        println("Some sound")
    }
}

class Dog(name: String) : Animal(name) {
    override fun makeSound() {
        println("Woof!")
    }
}
```

### Abstract Classes

```kotlin
abstract class Shape(val sides: List<Double>) {
    val perimeter: Double get() = sides.sum()
    abstract fun calculateArea(): Double
}

class Rectangle(
    val height: Double,
    val width: Double
) : Shape(listOf(height, width, height, width)) {
    override fun calculateArea() = height * width
}
```

### Preventing Further Override

```kotlin
open class Base {
    open fun v() {}
}

class Derived : Base() {
    final override fun v() {}  // Cannot be overridden
}
```

## Properties

### Property Override

Properties can be overridden. `val` can be overridden with `var` (adding setter):

```kotlin
open class Foo {
    open val x: Int get() = 1
}

class Bar : Foo() {
    override var x: Int = 0  // val -> var is allowed
}
```

### Custom Getters and Setters

```kotlin
class Rectangle(val width: Int, val height: Int) {
    val area: Int
        get() = width * height

    var counter: Int = 0
        set(value) {
            if (value >= 0) field = value
        }

    var setterVisibility: String = "visible"
        private set  // Private setter
}
```

### Late Initialization

For non-null properties initialized after construction:

```kotlin
class MyTest {
    lateinit var subject: TestSubject

    @Before
    fun setup() {
        subject = TestSubject()
    }

    @Test
    fun test() {
        subject.method()  // Direct access, no null check
    }

    fun checkInitialized(): Boolean = ::subject.isInitialized
}
```

## Nested and Inner Classes

### Nested Class (Static)

```kotlin
class Outer {
    private val bar: Int = 1

    class Nested {
        fun foo() = 2  // Cannot access bar
    }
}

val demo = Outer.Nested().foo()  // 2
```

### Inner Class

```kotlin
class Outer {
    private val bar: Int = 1

    inner class Inner {
        fun foo() = bar  // Can access outer class members
    }
}

val demo = Outer().Inner().foo()  // 1
```

### Qualified `this` and `super`

```kotlin
class A {
    inner class B {
        fun Int.foo() {
            val a = this@A       // A's this
            val b = this@B       // B's this
            val c = this         // Int's this (receiver)
        }
    }
}

class Bar : Foo() {
    inner class Baz {
        fun g() {
            super@Bar.f()  // Calls Foo's f()
        }
    }
}
```

## Interfaces

### Basic Interface

```kotlin
interface Clickable {
    fun click()
    fun showOff() = println("I'm clickable!")  // Default implementation
}

class Button : Clickable {
    override fun click() = println("Button clicked")
}
```

### Interface with Properties

```kotlin
interface Named {
    val name: String
}

class Person(override val name: String) : Named
```

### Multiple Interface Inheritance

```kotlin
interface A {
    fun foo() { println("A") }
}

interface B {
    fun foo() { println("B") }
}

class C : A, B {
    override fun foo() {
        super<A>.foo()
        super<B>.foo()
    }
}
```

## Data Classes

Automatically generate `equals()`, `hashCode()`, `toString()`, `copy()`, and `componentN()`:

```kotlin
data class User(val name: String, val age: Int)

val john = User("John", 30)
val olderJohn = john.copy(age = 31)

// Destructuring
val (name, age) = john

// In loops
for ((key, value) in map) {
    println("$key -> $value")
}
```

### Returning Multiple Values

```kotlin
data class Result(val value: Int, val status: Status)

fun compute(): Result {
    return Result(42, Status.SUCCESS)
}

val (value, status) = compute()
```

## Sealed Classes

Restricted class hierarchies for exhaustive `when`:

```kotlin
sealed class Expr
data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()

fun eval(expr: Expr): Double = when(expr) {
    is Const -> expr.number
    is Sum -> eval(expr.e1) + eval(expr.e2)
    NotANumber -> Double.NaN
    // No else needed - all cases covered
}
```

## Enum Classes

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}

// With properties
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

// With methods
enum class ProtocolState {
    WAITING {
        override fun signal() = TALKING
    },
    TALKING {
        override fun signal() = WAITING
    };

    abstract fun signal(): ProtocolState
}

// Generic enum access
inline fun <reified T : Enum<T>> printAllValues() {
    print(enumValues<T>().joinToString { it.name })
}

printAllValues<Color>()  // RED, GREEN, BLUE
```

## Object Declarations and Expressions

### Object Declaration (Singleton)

```kotlin
object DataManager {
    val data = mutableListOf<String>()

    fun addItem(item: String) {
        data.add(item)
    }
}

// Usage
DataManager.addItem("item")
```

### Companion Objects

Static-like members in classes:

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}

val instance = MyClass.create()

// Companion can implement interfaces
interface Factory<T> {
    fun create(): T
}

class MyClass {
    companion object : Factory<MyClass> {
        override fun create(): MyClass = MyClass()
    }
}
```

### Object Expressions (Anonymous Objects)

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /* ... */ }
    override fun mouseEntered(e: MouseEvent) { /* ... */ }
})

// Simple object for local use
fun getPoint() = object {
    var x: Int = 0
    var y: Int = 0
}
```

## Visibility Modifiers

| Modifier | Class Member | Top-level |
|----------|--------------|-----------|
| `public` (default) | Visible everywhere | Visible everywhere |
| `private` | Visible in class | Visible in file |
| `protected` | Visible in class and subclasses | N/A |
| `internal` | Visible in same module | Visible in same module |

```kotlin
open class Base {
    private val a = 1
    protected open val b = 2
    internal val c = 3
    val d = 4  // public by default

    protected open fun e() {}
}
```

## Traits Pattern with Extension Functions

```kotlin
interface Logger

fun Logger.log(text: String) {
    Log.d(this.javaClass.simpleName, text)
}

class MyService : Logger {
    fun doSomething() {
        log("Doing something")  // Uses extension
    }
}
```

## Inline Classes (Value Classes)

Wrap a value without runtime overhead:

```kotlin
@JvmInline
value class Password(private val s: String)

fun login(password: Password) { /* ... */ }

// At runtime, Password is just a String
login(Password("secret"))
```

## Best Practices

1. **Prefer composition over inheritance**: Use delegation
2. **Make classes final by default**: Only open when needed
3. **Use data classes for DTOs**: Automatic equals/hashCode
4. **Leverage sealed classes**: For restricted hierarchies
5. **Use companion objects wisely**: For factory methods and constants
6. **Prefer properties over getters**: More Kotlin idiomatic

## Conclusion

Kotlin's OOP features combine the power of traditional object-oriented programming with modern conveniences like data classes, sealed classes, and object declarations. Understanding these concepts allows you to write clean, safe, and expressive code that's easy to maintain and extend.
