---
layout: post
title: "Kotlin Basic Syntax: Variables, Operators, Control Flow, and Ranges"
date: 2026-01-11
categories: [backend, kotlin]
tags: [kotlin, jvm, programming-basics, control-flow]
image: /assets/images/posts/kotlin-basic-syntax.png
---

Kotlin is a modern, concise, and safe programming language that runs on the JVM. This comprehensive guide covers the fundamental syntax elements you need to master before diving into more advanced Kotlin features.

## Variables and Constants

### Variable Declaration

Kotlin distinguishes between mutable and immutable variables using `var` and `val` keywords.

```kotlin
// Mutable variable - can be reassigned
var count = 0
count = 1  // OK

// Read-only variable - cannot be reassigned
val name: String = "Kotlin"
// name = "Java"  // Compilation error!

// Type inference - Kotlin can infer the type
val message = "Hello"  // String type is inferred
val number = 42        // Int type is inferred

// Delayed initialization
val result: Int
result = computeValue()  // Must be assigned before use
```

### Custom Getters and Setters

```kotlin
var temperature: Int = 0
    get() = field * 9 / 5 + 32  // Convert to Fahrenheit
    set(value) {
        field = (value - 32) * 5 / 9  // Store as Celsius
    }
```

### Compile-time Constants

Use `const` for compile-time constants that are known at compile time:

```kotlin
const val API_VERSION: String = "1.0.0"
const val MAX_RETRY_COUNT = 3
```

Constants must be:
- Top-level or member of an object
- Initialized with a String or primitive type
- Have no custom getter

## Nullable and Non-null Types

Kotlin's type system distinguishes between nullable and non-null types:

```kotlin
var name: String = "Kotlin"
// name = null  // Compilation error!

var nickname: String? = "K"
nickname = null  // OK - the ? makes it nullable
```

## Operators

### Comparison Operators

```kotlin
val a: Int = 10000

// === checks referential equality (same object)
println(a === a)  // true

// == checks structural equality (same value, calls .equals())
val boxedA: Int? = a
val anotherBoxedA: Int? = a
println(boxedA == anotherBoxedA)   // true (same value)
println(boxedA === anotherBoxedA)  // false (different objects)
```

### Bit Operators

Kotlin uses named functions for bitwise operations instead of symbols:

```kotlin
val x = (1 shl 2) and 0x000FF000

// Available bit operators:
// shl(bits) - signed shift left (Java's <<)
// shr(bits) - signed shift right (Java's >>)
// ushr(bits) - unsigned shift right (Java's >>>)
// and(bits) - bitwise and
// or(bits) - bitwise or
// xor(bits) - bitwise xor
// inv() - bitwise inversion
```

## Type Checking and Casting

### Type Check with `is`

```kotlin
if (obj is String) {
    println(obj.length)  // Smart cast to String
}

if (obj !is String) {
    return
}
// obj is automatically cast to String here
```

### Smart Casts

Kotlin automatically casts types after type checks:

```kotlin
fun processValue(x: Any) {
    when (x) {
        is Int -> println(x + 1)
        is String -> println(x.length)
        is IntArray -> println(x.sum())
    }
}
```

### Safe Cast with `as?`

Returns null if the cast fails instead of throwing an exception:

```kotlin
val maybeInt: Int? = someValue as? Int
```

### Unsafe Cast with `as`

Throws ClassCastException if the cast fails:

```kotlin
val str: String = obj as String  // May throw exception
```

## Control Flow

### If Expression

In Kotlin, `if` is an expression that returns a value:

```kotlin
val max = if (a > b) a else b

// With blocks - the last expression is the value
val result = if (a > b) {
    println("a is greater")
    a
} else {
    println("b is greater")
    b
}
```

### When Expression

`when` is Kotlin's powerful replacement for switch statements:

```kotlin
// Basic usage
when (language) {
    "EN" -> println("Hello!")
    "FR" -> println("Salut!")
    "IT" -> println("Ciao!")
    else -> println("Unknown language")
}

// Multiple values in one branch
when (obj) {
    1, 2, 3 -> println("One, two, or three")
    "Hello" -> println("Greeting")
    is Long -> println("Long type")
    !is String -> println("Not a string")
    else -> println("Unknown")
}

// Range check
when (x) {
    in 1..10 -> println("x is in range")
    !in 10..20 -> println("x is outside range")
    else -> println("None of the above")
}

// Without argument - replacement for if-else chain
when {
    x.isOdd() -> println("x is odd")
    x.isEven() -> println("x is even")
    else -> println("x is unknown")
}
```

## Loops

### For Loop

```kotlin
// Iterate over collection
for (name in names) {
    println("Hello, $name!")
}

// Iterate with index
for (i in names.indices) {
    println(names[i])
}

// Destructuring with index and value
for ((index, value) in array.withIndex()) {
    println("Element at $index is $value")
}

// Iterate over map
for ((key, value) in map) {
    println("$key -> $value")
}
```

### Loop with Labels

```kotlin
outer@ for (i in 1..10) {
    for (j in 1..10) {
        if (condition) break@outer  // Break outer loop
        if (other) continue@outer   // Continue outer loop
    }
}
```

### forEach with Labels

```kotlin
items.forEach {
    if (it == 0) return@forEach  // Continue to next iteration
    println(it)
}

// Named label
items.forEach lit@ {
    if (it == 0) return@lit
    println(it)
}
```

### While and Do-While

```kotlin
while (x > 0) {
    x--
}

do {
    val input = readLine()
} while (input != "quit")
```

## Ranges

Ranges are a powerful feature in Kotlin for representing intervals:

```kotlin
// Inclusive range (1 to 10)
for (i in 1..10) print(i)  // 12345678910

// Until - excludes the end
for (i in 1 until 10) print(i)  // 123456789

// Descending range
for (i in 10 downTo 1) print(i)  // 10987654321

// With step
for (i in 1..10 step 2) print(i)  // 13579
for (i in 10 downTo 1 step 2) print(i)  // 108642

// Range check
if (x in 1..100) {
    println("x is in range")
}

if (x !in 0..array.lastIndex) {
    println("x is out of bounds")
}
```

## Custom Iterators

You can make any class iterable by implementing the iterator protocol:

```kotlin
class DateRange(val start: LocalDate, val end: LocalDate) {
    operator fun iterator(): Iterator<LocalDate> = object : Iterator<LocalDate> {
        var current = start
        override fun hasNext() = current <= end
        override fun next(): LocalDate {
            val result = current
            current = current.plusDays(1)
            return result
        }
    }
}

// Usage
for (date in DateRange(startDate, endDate)) {
    println(date)
}
```

## Import and Aliases

```kotlin
import bar.Bar as bBar  // bBar stands for 'bar.Bar'

// Now you can use bBar instead of bar.Bar
val instance = bBar()
```

## Best Practices

1. **Prefer `val` over `var`**: Immutable variables lead to safer code
2. **Use meaningful variable names**: Even with type inference
3. **Leverage smart casts**: Let the compiler do the work
4. **Use `when` for multiple conditions**: Cleaner than if-else chains
5. **Use ranges**: More expressive than traditional for loops

## Conclusion

Kotlin's basic syntax is designed to be concise yet expressive. Understanding these fundamentals - variables, operators, control flow, and ranges - provides a solid foundation for writing clean and safe Kotlin code. The type system's null safety and smart casts help prevent common programming errors at compile time.
