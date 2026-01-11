---
layout: post
title: "Kotlin Advanced Features: Generics, Extensions, Delegation, and More"
date: 2026-01-11
categories: [backend, kotlin]
tags: [kotlin, jvm, generics, extensions, delegation]
image: /assets/images/posts/kotlin-advanced-features.png
---

Kotlin provides powerful advanced features that enable expressive and type-safe code. This guide covers generics, extension functions, delegation, reflection, and annotations.

## Generics

### Basic Generic Class

```kotlin
class Box<T>(val value: T)

val intBox = Box(1)
val stringBox = Box("Hello")

// Generic function
fun <T> asList(vararg items: T): List<T> {
    val result = ArrayList<T>()
    for (item in items) result.add(item)
    return result
}
```

### Variance with `in` and `out`

Kotlin uses declaration-site variance unlike Java's use-site variance.

#### `out` (Covariance) - Producer

`out` means the type parameter is only used as return type (produced):

```kotlin
abstract class Source<out T> {
    abstract fun nextT(): T  // T is only returned
}

fun demo(strs: Source<String>) {
    val objects: Source<Any> = strs  // OK - Source<String> is subtype of Source<Any>
}
```

This is like Java's `? extends T`.

#### `in` (Contravariance) - Consumer

`in` means the type parameter is only used as parameter type (consumed):

```kotlin
abstract class Comparable<in T> {
    abstract fun compareTo(other: T): Int  // T is only consumed
}

fun demo(x: Comparable<Number>) {
    val y: Comparable<Double> = x  // OK - Comparable<Number> is subtype of Comparable<Double>
}
```

This is like Java's `? super T`.

### Use-site Variance

Apply variance at the use site when declaration-site isn't suitable:

```kotlin
// Array is invariant
fun copy(from: Array<out Any>, to: Array<Any>) {
    for (i in from.indices)
        to[i] = from[i]
}

val ints: Array<Int> = arrayOf(1, 2, 3)
val any: Array<Any> = arrayOfNulls(3)
copy(ints, any)  // Works because of 'out'

// 'in' projection
fun fill(dest: Array<in Int>, value: Int) {
    dest[0] = value
}

val objects: Array<Any?> = arrayOfNulls(1)
fill(objects, 1)  // Works because of 'in'
```

### Star Projection

Use `*` when you don't care about the type parameter:

```kotlin
fun printArray(array: Array<*>) {
    array.forEach { println(it) }
}
```

### Generic Constraints

#### Upper Bound

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) {
    // T must implement Comparable
}

// Multiple bounds with 'where'
fun <T> process(list: List<T>)
    where T : Comparable<T>,
          T : Cloneable {
    // T must implement both Comparable and Cloneable
}
```

### Platform Types

`T!` means "T or T?" - used for Java interop when nullability is unknown.

## Extension Functions

### Basic Extensions

Add functions to existing classes without inheritance:

```kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1]
    this[index1] = this[index2]
    this[index2] = tmp
}

val list = mutableListOf(1, 2, 3)
list.swap(0, 2)  // [3, 2, 1]

// Generic extension
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1]
    this[index1] = this[index2]
    this[index2] = tmp
}
```

### Extension Resolution

Extensions are resolved statically (at compile time), not dynamically:

```kotlin
open class Shape
class Rectangle : Shape()

fun Shape.getName() = "Shape"
fun Rectangle.getName() = "Rectangle"

fun printClassName(s: Shape) {
    println(s.getName())  // Always prints "Shape"!
}

printClassName(Rectangle())  // Prints "Shape"
```

### Member Takes Precedence

When an extension has the same signature as a member, the member wins:

```kotlin
class Example {
    fun printMessage() { println("Member") }
}

fun Example.printMessage() { println("Extension") }

Example().printMessage()  // Prints "Member"
```

### Nullable Receiver

Extensions can be defined on nullable types:

```kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    return toString()  // Smart cast to non-null
}
```

### Companion Object Extensions

```kotlin
class MyClass {
    companion object
}

fun MyClass.Companion.create(): MyClass = MyClass()

val instance = MyClass.create()
```

### Extension Properties

```kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1

// Note: No backing field, so no initializers allowed
```

### Extensions in Classes

Scoped extensions visible only within a class:

```kotlin
class Host(val hostname: String) {
    fun printHostname() { println(hostname) }
}

class Connection {
    fun Host.printConnectionString() {
        printHostname()  // Calls Host's method
        println("Connected to database")
    }

    fun connect(host: Host) {
        host.printConnectionString()
    }
}
```

### Universal Extension

Add to all types:

```kotlin
fun <T> T.basicToString(): String {
    return this.toString()
}
```

## Delegation

### Interface Delegation

Delegate interface implementation to another object:

```kotlin
interface Base {
    fun print()
}

class BaseImpl(val x: Int) : Base {
    override fun print() { println(x) }
}

class Derived(b: Base) : Base by b

val impl = BaseImpl(10)
Derived(impl).print()  // prints 10
```

### Property Delegation

#### Lazy Properties

```kotlin
val lazyValue: String by lazy {
    println("Computing...")
    "Hello"
}

println(lazyValue)  // Computing... Hello
println(lazyValue)  // Hello (cached)
```

#### Observable Properties

```kotlin
class User {
    var name: String by Delegates.observable("<no name>") { prop, old, new ->
        println("$old -> $new")
    }
}

val user = User()
user.name = "first"   // <no name> -> first
user.name = "second"  // first -> second
```

#### Map Delegation

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int by map
}

val user = User(mapOf(
    "name" to "John",
    "age" to 25
))

println(user.name)  // John
println(user.age)   // 25
```

### Custom Delegates

```kotlin
class Delegate {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        return "$thisRef, delegating '${property.name}'"
    }

    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
        println("$value assigned to '${property.name}'")
    }
}

class Example {
    var p: String by Delegate()
}
```

### Local Delegated Properties

```kotlin
fun example(computeFoo: () -> Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()  // Computed only if needed
    }
}
```

## Annotations

### Use-site Targets

Specify where the annotation should apply:

```kotlin
class Example(
    @field:Ann val foo: String,     // Annotate Java field
    @get:Ann val bar: String,       // Annotate getter
    @param:Ann val quux: String     // Annotate constructor param
)
```

### Multiple Annotations

```kotlin
class Example {
    @set:[Inject VisibleForTesting]
    var collaborator: Collaborator = TODO()
}
```

### Common Annotations for Java Interop

```kotlin
// Throw exception declaration for Java callers
@Throws(IOException::class)
fun readFile(path: String): String { /* ... */ }

// JVM static
class Foo {
    companion object {
        @JvmStatic
        fun bar() { }  // Callable as Foo.bar() from Java
    }
}
```

## Reflection

Basic reflection with `::`:

```kotlin
val kClass = MyClass::class
val kProperty = MyClass::property
val kFunction = ::topLevelFunction

// Check if lateinit is initialized
class Example {
    lateinit var value: String

    fun isInitialized() = ::value.isInitialized
}
```

## Code Conventions

### Naming Style

- Use camelCase for names
- Types start with uppercase
- Methods and properties start with lowercase
- Use 4 space indentation

### Colon Spacing

```kotlin
// Space before colon for type/supertype
interface Foo<out T : Any> : Bar {
    fun foo(a: Int): T
}

// No space for instance/type
val x: Int = 1
```

### Lambda Style

```kotlin
// Spaces around braces and arrow
list.filter { it > 10 }.map { element -> element * 2 }
```

### Functions vs Properties

Prefer a property when the algorithm:
- Does not throw exceptions
- Has O(1) complexity
- Is cheap to calculate
- Returns the same result over invocations

## Documentation (KDoc)

```kotlin
/**
 * Calculates the sum of two numbers.
 *
 * @param a First number
 * @param b Second number
 * @return The sum of a and b
 * @throws IllegalArgumentException if numbers are negative
 */
fun sum(a: Int, b: Int): Int {
    require(a >= 0 && b >= 0) { "Numbers must be non-negative" }
    return a + b
}
```

## Best Practices

1. **Use extensions for utility functions**: Keep classes focused
2. **Prefer delegation over inheritance**: More flexible
3. **Use `lazy` for expensive computations**: Defer until needed
4. **Leverage variance**: Make APIs more flexible
5. **Document public APIs**: Use KDoc format
6. **Follow conventions**: Code is read more than written

## Conclusion

Kotlin's advanced features like generics with variance, extension functions, and delegation patterns provide powerful tools for writing expressive and maintainable code. Understanding these concepts enables you to leverage Kotlin's full potential and create APIs that are both type-safe and flexible.
