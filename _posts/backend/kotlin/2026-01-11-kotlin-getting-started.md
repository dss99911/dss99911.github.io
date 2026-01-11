---
layout: post
title: "Getting Started with Kotlin: Setup, Build, and Project Structure"
date: 2026-01-11
categories: [backend, kotlin]
tags: [kotlin, jvm, gradle, setup]
image: /assets/images/posts/kotlin-getting-started.png
---

This guide covers how to set up a Kotlin project, create executable JARs, and understand the basic project structure. Whether you're coming from Java or starting fresh, this will get you up and running quickly.

## The Main Function

Every Kotlin application starts with a `main` function:

```kotlin
fun main(args: Array<String>) {
    println("Hello, World!")
}

// Since Kotlin 1.3, args parameter is optional
fun main() {
    println("Hello, Kotlin!")
}
```

## Setting Up a Kotlin Project with Gradle

### build.gradle.kts (Kotlin DSL)

```kotlin
plugins {
    kotlin("jvm") version "1.9.20"
    application
}

group = "com.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))

    testImplementation(kotlin("test"))
}

application {
    mainClass.set("com.example.MainKt")
}

tasks.test {
    useJUnitPlatform()
}
```

### Creating an Executable JAR

To create a fat JAR with all dependencies:

```kotlin
// build.gradle.kts
tasks.jar {
    manifest {
        attributes["Main-Class"] = "com.example.MainKt"
    }
    from(configurations.runtimeClasspath.get().map {
        if (it.isDirectory) it else zipTree(it)
    })
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
}
```

Or using the `build.gradle` (Groovy):

```groovy
jar {
    manifest {
        attributes 'Main-Class': 'com.example.MainKt'
    }
    from {
        configurations.runtimeClasspath.collect {
            it.isDirectory() ? it : zipTree(it)
        }
    }
}
```

### Running the Application

```bash
# Using Gradle
./gradlew run

# Build the JAR
./gradlew build

# Run the JAR
java -jar build/libs/your-app-1.0-SNAPSHOT.jar
```

## Project Structure

A typical Kotlin project structure:

```
my-kotlin-project/
├── build.gradle.kts
├── settings.gradle.kts
├── src/
│   ├── main/
│   │   ├── kotlin/
│   │   │   └── com/example/
│   │   │       └── Main.kt
│   │   └── resources/
│   └── test/
│       ├── kotlin/
│       │   └── com/example/
│       │       └── MainTest.kt
│       └── resources/
└── gradle/
    └── wrapper/
```

## Packages and Imports

### Package Declaration

```kotlin
package com.example.myapp

class MyClass { /* ... */ }

fun myFunction() { /* ... */ }
```

### Import Statements

```kotlin
import com.example.utils.Helper
import com.example.utils.*  // Import all from package

// Import with alias
import bar.Bar as bBar  // bBar refers to bar.Bar

// Usage
val helper = Helper()
val myBar = bBar()
```

### Default Imports

These packages are imported by default in every Kotlin file:
- `kotlin.*`
- `kotlin.annotation.*`
- `kotlin.collections.*`
- `kotlin.comparisons.*`
- `kotlin.io.*`
- `kotlin.ranges.*`
- `kotlin.sequences.*`
- `kotlin.text.*`

For JVM: `java.lang.*`, `kotlin.jvm.*`

## Exception Handling

Kotlin doesn't have checked exceptions. You don't need to declare or catch exceptions:

```kotlin
// Try-catch as expression
val number: Int? = try {
    parseInt(input)
} catch (e: NumberFormatException) {
    null
}

// Try-catch-finally
fun readFile(path: String): String {
    val result = try {
        File(path).readText()
    } catch (e: IOException) {
        "Error reading file: ${e.message}"
    } finally {
        println("Attempted to read: $path")
    }
    return result
}
```

### Throwing Exceptions

```kotlin
fun divide(a: Int, b: Int): Int {
    if (b == 0) {
        throw IllegalArgumentException("Cannot divide by zero")
    }
    return a / b
}
```

### For Java Interop

When you need to tell Java callers about exceptions:

```kotlin
@Throws(IOException::class)
fun readConfig(path: String): Config {
    // This annotation generates throws clause in Java bytecode
    return parseConfig(File(path).readText())
}
```

## Testing in Kotlin

### Setup

```kotlin
// build.gradle.kts
dependencies {
    testImplementation(kotlin("test"))
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.mockito:mockito-core:4.0.0")
}
```

### Writing Tests

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.expect

class CalculatorTest {

    @Test
    fun `addition should return sum of two numbers`() {
        val result = add(2, 3)
        assertEquals(5, result)
    }

    @Test
    fun `expect block evaluates correctly`() {
        expect(10) {
            val x = 5
            val y = 2
            x * y
        }
    }
}
```

### Test Naming with Backticks

Kotlin allows spaces in function names when using backticks, making test names more readable:

```kotlin
@Test
fun `should return empty list when no items match`() {
    // Test code
}

@Test
fun `user should be authenticated after login`() {
    // Test code
}
```

## Java Interoperability

Kotlin is designed to work seamlessly with Java:

### Calling Java from Kotlin

```kotlin
// Java class is used directly
val list = ArrayList<String>()
list.add("Hello")

// Java getters/setters become properties
val length = file.length  // calls getLength()
file.readable = true      // calls setReadable(true)
```

### Calling Kotlin from Java

```kotlin
// Kotlin file: Utils.kt
package com.example

fun formatName(name: String): String = name.uppercase()

// In Java, call as:
// String result = UtilsKt.formatName("hello");
```

### Static Members

```kotlin
class MyClass {
    companion object {
        @JvmStatic
        fun create(): MyClass = MyClass()

        @JvmField
        val DEFAULT = MyClass()

        const val MAX_COUNT = 100
    }
}

// In Java:
// MyClass instance = MyClass.create();  // @JvmStatic
// MyClass def = MyClass.DEFAULT;        // @JvmField
// int max = MyClass.MAX_COUNT;          // const
```

## Kotlin for Different Platforms

Kotlin supports multiple platforms:

### JVM (Server-side, Android)
```kotlin
plugins {
    kotlin("jvm") version "1.9.20"
}
```

### JavaScript
```kotlin
plugins {
    kotlin("js") version "1.9.20"
}
```

### Native (iOS, macOS, Linux, Windows)
```kotlin
plugins {
    kotlin("multiplatform") version "1.9.20"
}
```

### Multiplatform

Kotlin Multiplatform allows sharing code across platforms:

```kotlin
// Common code (shared)
expect fun platformName(): String

// JVM implementation
actual fun platformName(): String = "JVM"

// iOS implementation
actual fun platformName(): String = "iOS"
```

## Debugging Tips

1. **Break down functions**: Keep functions small and focused for easier debugging
2. **Use meaningful names**: Even with type inference, clear names help
3. **Leverage IDE**: IntelliJ IDEA has excellent Kotlin support
4. **Use logging**: Add strategic log statements

```kotlin
// Use inline logging for debug
inline fun log(tag: String, message: () -> String) {
    if (BuildConfig.DEBUG) {
        println("[$tag] ${message()}")
    }
}

// Usage - lambda only evaluated in debug
log("MyClass") { "Complex message: ${computeValue()}" }
```

## Best Practices

1. **Use `main` without args** when not needed (Kotlin 1.3+)
2. **Prefer Gradle Kotlin DSL** for type-safe build scripts
3. **Follow naming conventions**: Package names in lowercase, classes in PascalCase
4. **Leverage backtick names** for readable test names
5. **Don't overuse exceptions**: Use sealed classes for expected failures

## Conclusion

Getting started with Kotlin is straightforward, especially with IDE support from IntelliJ IDEA. The language integrates smoothly with existing Java projects and provides modern features that make development more productive. Whether you're building server applications, Android apps, or multiplatform projects, Kotlin's clean syntax and powerful features will serve you well.
