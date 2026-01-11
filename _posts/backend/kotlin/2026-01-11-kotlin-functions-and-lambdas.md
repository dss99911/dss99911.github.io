---
layout: post
title: "Kotlin Functions and Lambdas: Complete Guide"
date: 2026-01-11
categories: [backend, kotlin]
tags: [kotlin, jvm, functions, lambda, functional-programming]
image: /assets/images/posts/kotlin-functions-lambdas.png
---

Kotlin treats functions as first-class citizens, providing powerful features like lambdas, higher-order functions, and scope functions. This comprehensive guide covers everything you need to know about functions in Kotlin.

## Function Declaration

### Basic Syntax

```kotlin
fun sum(a: Int, b: Int): Int {
    return a + b
}

// Single-expression function
fun double(x: Int): Int = x * 2

// Type inference for return
fun double(x: Int) = x * 2

// Maximum with expression
fun max(a: Int, b: Int) = if (a > b) a else b
```

### Default Arguments

```kotlin
fun read(
    buffer: ByteArray,
    offset: Int = 0,
    length: Int = buffer.size
) {
    // Implementation
}

// Call with different combinations
read(data)
read(data, 10)
read(data, 10, 100)
```

### Named Arguments

Named arguments make function calls more readable and allow skipping default parameters:

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    wordSeparator: Char = ' '
) { /* ... */ }

// Use named arguments
reformat(str, wordSeparator = '_')
reformat(
    str,
    normalizeCase = false,
    wordSeparator = '-'
)
```

### Variable Number of Arguments (Vararg)

```kotlin
fun printAll(vararg messages: String) {
    for (m in messages) println(m)
}

printAll("Hello", "World", "!")

// Spread operator to pass array
val array = arrayOf("a", "b", "c")
printAll(*array)
```

### Unit Return Type

Functions that don't return anything return `Unit` (can be omitted):

```kotlin
fun printSum(a: Int, b: Int): Unit {
    println("Sum: ${a + b}")
}

// Equivalent - Unit is implicit
fun printSum(a: Int, b: Int) {
    println("Sum: ${a + b}")
}
```

## Advanced Function Features

### Infix Notation

Create operators that can be called without dots and parentheses:

```kotlin
infix fun Int.shl(x: Int): Int = this shl x

// Usage
val result = 1 shl 2     // Same as 1.shl(2)
```

### Tail Recursive Functions

Optimize recursive functions to prevent stack overflow:

```kotlin
tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (x == Math.cos(x)) x else findFixPoint(Math.cos(x))
```

### Inline Functions

Inline functions reduce overhead for higher-order functions:

```kotlin
inline fun <T> lock(lock: Lock, body: () -> T): T {
    lock.lock()
    try {
        return body()
    } finally {
        lock.unlock()
    }
}

// noinline for lambdas that shouldn't be inlined
inline fun foo(
    inlined: () -> Unit,
    noinline notInlined: () -> Unit
) { /* ... */ }

// crossinline for lambdas used in different context
inline fun createRunnable(crossinline body: () -> Unit): Runnable {
    return object : Runnable {
        override fun run() = body()
    }
}
```

### Inline Properties

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = field
    inline set(v) { field = v }
```

### Reified Type Parameters

Access generic type information at runtime with inline functions:

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}

// Usage - no need to pass class
val myNode = treeNode.findParentOfType<MyTreeNode>()

// Practical example with JSON
inline fun <reified T> read(path: String): T =
    ObjectMapper().readValue(File(path), T::class.java)
```

### Backtick Function Names

Useful for test methods with descriptive names:

```kotlin
@Test
fun `should return true when user is authenticated`() {
    // Test code
}
```

### Local Functions

Functions can be nested inside other functions:

```kotlin
fun processUser(user: User) {
    fun validate(value: String, fieldName: String) {
        if (value.isEmpty()) {
            throw IllegalArgumentException("$fieldName is empty")
        }
    }

    validate(user.name, "Name")
    validate(user.email, "Email")
    // Process user
}
```

### Global Functions

Functions declared outside classes act like static imports:

```kotlin
// utils.kt
fun formatCurrency(amount: Double): String = "$${amount}"

// Other file - no import needed
val price = formatCurrency(19.99)
```

## Lambda Expressions

### Lambda Syntax

```kotlin
// Full syntax
val sum: (Int, Int) -> Int = { x: Int, y: Int -> x + y }

// Type inference
val sum = { x: Int, y: Int -> x + y }

// Single parameter uses 'it'
val double: (Int) -> Int = { it * 2 }
```

### Lambda as Last Parameter

When a lambda is the last parameter, it can be placed outside parentheses:

```kotlin
val items = listOf(1, 2, 3)

// Lambda inside parentheses
items.filter({ it > 0 })

// Lambda outside - preferred style
items.filter { it > 0 }

// Only lambda parameter - parentheses can be omitted
items.forEach { println(it) }
```

### Function References

Reference existing functions with `::`:

```kotlin
fun isOdd(x: Int) = x % 2 != 0

val numbers = listOf(1, 2, 3, 4, 5)
println(numbers.filter(::isOdd))  // [1, 3, 5]
```

### Lambda with Receiver

Create DSL-like syntax:

```kotlin
fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()
    html.init()
    return html
}

html {
    body()  // 'this' is HTML instance
}
```

### Multiple Parameters and Destructuring

```kotlin
// Multiple parameters
val compare: (String, String) -> Boolean = { a, b -> a.length < b.length }

// Destructuring in lambdas
map.forEach { (key, value) -> println("$key: $value") }

// Unused parameters with underscore
map.forEach { _, value -> println(value) }
```

### Lambda Returns

```kotlin
// Implicit return - last expression
val result = items.filter {
    val shouldFilter = it > 0
    shouldFilter  // Returned
}

// Explicit return with label
val result = items.filter {
    return@filter it > 0
}

// Return from enclosing function (only with inline functions)
inline fun process(items: List<Int>) {
    items.forEach {
        if (it == 0) return  // Returns from process()
        println(it)
    }
}

// Local return in lambda
items.forEach {
    if (it == 0) return@forEach  // Continues to next item
    println(it)
}
```

## Scope Functions

Kotlin provides several scope functions for working with objects concisely.

### let

Execute a block with the object as `it`, return the block result:

```kotlin
val result = nullableValue?.let { transformValue(it) } ?: defaultValue

// Useful for null checks
user?.let {
    sendEmail(it.email)
    logAccess(it.id)
}
```

### apply

Execute a block with the object as `this`, return the object:

```kotlin
val array = IntArray(10).apply { fill(-1) }

val user = User().apply {
    name = "John"
    age = 30
    email = "john@example.com"
}
```

### with

Call multiple methods on an object without repeating the variable:

```kotlin
val turtle = Turtle()
with(turtle) {
    penDown()
    for (i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```

### run

Combines `with` and `let` - object as `this`, returns block result:

```kotlin
val result = service.run {
    port = 8080
    query()
}
```

### also

Execute a block with the object as `it`, return the object:

```kotlin
val numbers = mutableListOf(1, 2, 3)
numbers
    .also { println("Before: $it") }
    .add(4)
    .also { println("After adding: $numbers") }
```

### takeIf and takeUnless

Conditional processing:

```kotlin
val user = getUser().takeIf { it.isActive }
val inactiveUser = getUser().takeUnless { it.isActive }
```

## Scope Functions Summary

| Function | Object Reference | Return Value | Use Case |
|----------|-----------------|--------------|----------|
| `let` | `it` | Lambda result | Null checks, scoping |
| `apply` | `this` | Context object | Object configuration |
| `run` | `this` | Lambda result | Object config + compute |
| `also` | `it` | Context object | Additional effects |
| `with` | `this` | Lambda result | Grouping function calls |

## Higher-Order Functions

Functions that take or return functions:

```kotlin
// Function taking a lambda
fun <T> List<T>.customFilter(predicate: (T) -> Boolean): List<T> {
    val result = mutableListOf<T>()
    for (item in this) {
        if (predicate(item)) result.add(item)
    }
    return result
}

// Function returning a lambda
fun multiplier(factor: Int): (Int) -> Int {
    return { number -> number * factor }
}

val triple = multiplier(3)
println(triple(5))  // 15
```

## Best Practices

1. **Use default arguments** instead of overloading
2. **Prefer expression functions** for simple operations
3. **Use named arguments** for clarity with many parameters
4. **Leverage scope functions** for concise object manipulation
5. **Use inline functions** for performance-critical higher-order functions
6. **Prefer lambdas outside parentheses** for readability

## Conclusion

Kotlin's function system is one of its most powerful features. From simple function declarations to advanced concepts like inline functions with reified types, Kotlin provides tools that make functional programming natural and expressive. Understanding scope functions (`let`, `apply`, `run`, `also`, `with`) is particularly valuable for writing idiomatic Kotlin code.
