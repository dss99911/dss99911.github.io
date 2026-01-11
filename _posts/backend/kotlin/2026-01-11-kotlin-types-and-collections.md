---
layout: post
title: "Kotlin Types and Collections: Numbers, Strings, Arrays, and Maps"
date: 2026-01-11
categories: [backend, kotlin]
tags: [kotlin, jvm, data-types, collections]
image: /assets/images/posts/kotlin-types-collections.png
---

Understanding Kotlin's type system and collection classes is essential for writing effective Kotlin code. This guide covers all the fundamental data types, string manipulation, and collection operations.

## Number Types

### Number Literals

```kotlin
// Integer types
val decimal = 123       // Int
val long = 123L         // Long
val hex = 0x0F          // Hexadecimal
val binary = 0b00001011 // Binary

// Floating point types
val double = 123.5      // Double
val float = 123.5f      // Float

// Note: Octal literals are not supported in Kotlin
```

### Type Conversion

Unlike Java, Kotlin doesn't have implicit type widening. Explicit conversion is required:

```kotlin
val intValue: Int = 100
val longValue: Long = intValue.toLong()
val doubleValue: Double = intValue.toDouble()

// String to number
val str = "123"
val num = str.toInt()
val numOrNull = str.toIntOrNull()  // Safe conversion
```

### Primitive Arrays

For performance, Kotlin provides specialized array classes without boxing overhead:

```kotlin
val intArray: IntArray = intArrayOf(1, 2, 3)
val byteArray: ByteArray = byteArrayOf(1, 2, 3)
val shortArray: ShortArray = shortArrayOf(1, 2, 3)

// Access and modify
intArray[0] = intArray[1] + intArray[2]
```

### Random Numbers

```kotlin
import kotlin.random.Random

val randomInt = Random.nextInt(10)        // 0 to 9
val randomInRange = Random.nextInt(1, 100) // 1 to 99
```

### Math Operations

```kotlin
import kotlin.math.*

val squareRoot = sqrt(16.0)  // 4.0
val power = 2.0.pow(3)       // 8.0
val absolute = abs(-5)       // 5
val maxValue = max(10, 20)   // 20
```

## Character Type

### Escape Characters

```kotlin
val tab = '\t'
val backspace = '\b'
val newline = '\n'
val carriageReturn = '\r'
val singleQuote = '\''
val doubleQuote = '\"'
val backslash = '\\'
val dollar = '\$'
```

### Unicode

```kotlin
val unicode = '\uFF00'  // Unicode character
```

## String Type

### String Templates

String interpolation is one of Kotlin's most useful features:

```kotlin
val name = "Kotlin"
println("Hello, $name!")           // Variable
println("Length: ${name.length}")  // Expression
println("${s1.replace("is", "was")}, but now is $a")

// Escape dollar sign
val price = """${'$'}9.99"""
```

### Raw Strings

Multi-line strings with preserved formatting:

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
""".trimMargin()

// Custom margin prefix
val customMargin = """
    >First line
    >Second line
""".trimMargin(">")
```

### String Operations

```kotlin
// Contains with regex
fun String.isTrueBalance(): Boolean =
    this.contains("(?i)OTP.*TRUEBALANCE".toRegex())

// Common operations
val upper = "hello".uppercase()
val lower = "HELLO".lowercase()
val trimmed = "  hello  ".trim()
val split = "a,b,c".split(",")
```

## Arrays and Lists

### Declaration

```kotlin
// Array
val arr = arrayOf(1, 2, 3)
val nulls = arrayOfNulls<String>(5)  // Array of nulls

// Array with lambda initialization
val squares = Array(5) { i -> i * i }  // [0, 1, 4, 9, 16]

// List (immutable)
val list = listOf(1, 2, 3)

// MutableList
val mutableList = mutableListOf(1, 2, 3)
mutableList.add(4)
```

### Array Properties

```kotlin
val items = arrayOf("apple", "banana", "cherry")

println(items.size)       // 3
println(items.indices)    // 0..2
println(items.lastIndex)  // 2

// Fill with value
items.fill("fruit", 0, 2)  // First two elements
```

### Checking Elements

```kotlin
if ("apple" in items) {
    println("Found apple!")
}
```

### Lambda Operations

```kotlin
val fruits = listOf("apple", "apricot", "banana", "cherry")

val result = fruits
    .filter { it.startsWith("a") }   // [apple, apricot]
    .sortedBy { it }                  // Sort alphabetically
    .map { it.uppercase() }           // [APPLE, APRICOT]

result.forEach { println(it) }
```

### Filtering

```kotlin
// Basic filter
val filtered = items.filter { it.startsWith("a") }

// Filter not null
val nullableList: List<String?> = listOf("A", null, "B")
val nonNullList: List<String> = nullableList.filterNotNull()
```

### Sorting

```kotlin
val sorted = items.sortedBy { it }
val sortedDesc = items.sortedByDescending { it }
val customSort = items.sortedWith(compareBy { it.length })
```

### Building Sequences

Sequences are lazily evaluated and efficient for large datasets:

```kotlin
val fibonacci = sequence {
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

println(fibonacci.take(10).toList())  // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

## Maps

### Declaration

```kotlin
// Read-only map
val map = mapOf("a" to 1, "b" to 2, "c" to 3)

// Mutable map
val mutableMap = mutableMapOf("a" to 1)
mutableMap["b"] = 2
```

### Accessing Values

```kotlin
println(map["key"])      // Returns null if not found
println(map.getValue("a"))  // Throws if not found
println(map.getOrDefault("z", 0))  // Returns default
```

### Iterating

```kotlin
// Destructuring in for loop
for ((key, value) in map) {
    println("$key -> $value")
}

// Using forEach
map.forEach { (key, value) ->
    println("$key: $value")
}
```

### Transforming Maps

```kotlin
// Map values
val doubled = map.mapValues { (_, value) -> value * 2 }

// Map keys
val uppercased = map.mapKeys { (key, _) -> key.uppercase() }

// Filter map
val filtered = map.filterValues { it > 1 }
```

## Standard Types Summary

| Type | Description |
|------|-------------|
| `String` | Immutable string |
| `Int` | 32-bit integer |
| `Long` | 64-bit integer |
| `Double` | 64-bit floating point |
| `Float` | 32-bit floating point |
| `Boolean` | true/false |
| `Char` | Single character |
| `Array<T>` | Generic array |
| `List<T>` | Immutable list |
| `MutableList<T>` | Mutable list |
| `Map<K,V>` | Immutable map |
| `MutableMap<K,V>` | Mutable map |
| `Set<T>` | Immutable set |
| `IntArray` | Primitive int array (no boxing) |
| `Any` | Root of class hierarchy (like Object in Java) |

## Pair and Triple

Built-in data classes for holding multiple values:

```kotlin
val pair = Pair("key", 1)
val (key, value) = pair  // Destructuring

val triple = Triple("a", 1, true)
val (first, second, third) = triple

// Infix 'to' creates Pair
val anotherPair = "name" to "John"
```

## Time Measurement

```kotlin
import kotlin.system.measureTimeMillis

val elapsed = measureTimeMillis {
    // Code to measure
    Thread.sleep(1000)
}
println("Elapsed: $elapsed ms")
```

## Best Practices

1. **Use immutable collections by default**: `listOf`, `mapOf`, `setOf`
2. **Prefer specialized arrays for primitives**: `IntArray` over `Array<Int>`
3. **Use sequences for large datasets**: Lazy evaluation improves performance
4. **Leverage destructuring**: Makes code more readable
5. **Use safe conversions**: `toIntOrNull()` instead of `toInt()` when parsing user input

## Conclusion

Kotlin's type system and collection library provide a rich set of tools for handling data. The distinction between mutable and immutable collections, along with features like string templates, sequences, and destructuring, make Kotlin code both safe and expressive.
