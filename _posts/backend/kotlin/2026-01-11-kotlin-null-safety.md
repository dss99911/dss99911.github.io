---
layout: post
title: "Kotlin Null Safety: Eliminating NullPointerException"
date: 2026-01-11
categories: [backend, kotlin]
tags: [kotlin, jvm, null-safety, best-practices]
image: /assets/images/posts/kotlin-null-safety.png
---

Kotlin's null safety is one of its most powerful features, designed to eliminate the infamous NullPointerException from your code. This guide covers all the tools Kotlin provides for safe null handling.

## The Problem with Null

In Java and many other languages, any object reference can be null, leading to runtime NullPointerExceptions. Kotlin addresses this at the type system level.

## Nullable and Non-null Types

In Kotlin, the type system distinguishes between nullable and non-null references:

```kotlin
// Non-null type - cannot hold null
var name: String = "Kotlin"
// name = null  // Compilation error!

// Nullable type - can hold null
var nickname: String? = "K"
nickname = null  // OK

// The difference in usage
println(name.length)     // OK - name cannot be null
// println(nickname.length)  // Compilation error! nickname might be null
```

## Safe Calls with `?.`

The safe call operator returns null if the receiver is null, otherwise calls the method:

```kotlin
val length = nickname?.length  // Returns Int? (nullable Int)

// Chaining safe calls
val cityName = user?.address?.city?.name

// With method calls
user?.save()  // Only calls save() if user is not null
```

## The Elvis Operator `?:`

Provide a default value when an expression is null:

```kotlin
// Instead of
val l: Int = if (b != null) b.length else -1

// Use Elvis operator
val l = b?.length ?: -1

// With return or throw
fun process(node: Node): String {
    val parent = node.getParent() ?: return "No parent"
    val name = node.getName() ?: throw IllegalArgumentException("Name required")
    return "$parent - $name"
}
```

## The `!!` Operator (Not-null Assertion)

Converts a nullable type to non-null, throwing NPE if it's null:

```kotlin
val length = nickname!!.length  // Throws NPE if nickname is null
```

**Use sparingly!** This operator should be used only when you're certain the value is not null and want to get a clear NPE if you're wrong.

## Safe Casts with `as?`

Cast safely, returning null if the cast fails:

```kotlin
val maybeInt: Int? = someValue as? Int

// Compare to unsafe cast
val definitelyInt: Int = someValue as Int  // Throws ClassCastException if not Int
```

## The `let` Function for Null Checks

Execute code only when a value is not null:

```kotlin
// Process only if not null
nickname?.let {
    println("Nickname is: $it")
    sendNotification(it)
}

// Transform nullable value
val mapped = value?.let { transformValue(it) } ?: defaultValue

// Filtering nulls in collections
val list: List<String?> = listOf("A", null, "B")
for (item in list) {
    item?.let { println(it) }  // Prints A and B
}
```

## Smart Casts

After a null check, Kotlin automatically casts to non-null:

```kotlin
fun processString(str: String?) {
    if (str != null) {
        // str is automatically cast to String (non-null)
        println(str.length)
    }

    // Same with early return
    if (str == null) return
    println(str.length)  // str is non-null here
}
```

## Null Safety with Collections

### Filtering Nulls

```kotlin
val nullableList: List<String?> = listOf("A", null, "B")
val nonNullList: List<String> = nullableList.filterNotNull()  // ["A", "B"]
```

### Null in Collections vs Nullable Collections

```kotlin
// List that can contain null elements
val listWithNulls: List<String?> = listOf("A", null, "B")

// List that can itself be null
val nullableList: List<String>? = null

// Both - list that can be null and contain nulls
val bothNullable: List<String?>? = null
```

## Null Safety Patterns

### Early Return Pattern

```kotlin
fun processUser(user: User?) {
    val name = user?.name ?: return
    val email = user.email ?: return

    // Now name and email are non-null
    sendEmail(name, email)
}
```

### Require and Check

```kotlin
fun processUser(user: User?) {
    requireNotNull(user) { "User cannot be null" }
    // user is now non-null

    checkNotNull(user.email) { "Email must be set" }
    // user.email is now non-null
}
```

### Default Values

```kotlin
data class Settings(
    val theme: String = "light",
    val fontSize: Int = 14,
    val notifications: Boolean = true
)

// Use with nullable input
fun applySettings(settings: Settings?) {
    val actual = settings ?: Settings()  // Use defaults if null
}
```

## Platform Types

When calling Java code, Kotlin doesn't know about nullability. These are "platform types" denoted as `Type!`:

```kotlin
// Java method: String getName() - might return null
val name = javaObject.name  // Type is String! (platform type)

// You decide how to treat it:
val safeName: String? = javaObject.name  // Treat as nullable
val unsafeName: String = javaObject.name  // Treat as non-null (might throw)
```

### Best Practice for Java Interop

```kotlin
// Always treat Java returns as nullable unless documented otherwise
val name: String? = javaObject.name
val displayName = name ?: "Unknown"
```

## Exception Handling with Null

```kotlin
// Try-catch as expression with null
val number: Int? = try {
    parseInt(input)
} catch (e: NumberFormatException) {
    null
}
```

## Common Patterns

### Nullable in Lambda

```kotlin
// Return from lambda on null
activity?.let { activity ->
    doSomething(activity)
} ?: return@postDelayed  // Return from enclosing lambda
```

### Null-safe Method Chaining

```kotlin
data class Address(val city: String?)
data class Company(val address: Address?)
data class Person(val company: Company?)

fun getCityName(person: Person?): String {
    return person?.company?.address?.city ?: "Unknown"
}
```

### With in When Expressions

```kotlin
when (val user = getUser()) {
    null -> handleNoUser()
    else -> handleUser(user)  // user is non-null here
}
```

## Null Safety Best Practices

1. **Prefer non-null types**: Only use nullable when truly needed
2. **Use safe calls and Elvis**: Avoid `!!` except when necessary
3. **Handle nulls early**: Check at boundaries (API responses, user input)
4. **Use `let` for scoping**: Execute blocks only when value exists
5. **Leverage smart casts**: After null checks, types are automatically non-null
6. **Document nullability**: Especially for public APIs

## Anti-Patterns to Avoid

```kotlin
// Don't do this - loses null safety benefits
val name = user?.name!!

// Don't chain !! operators
val city = user!!.address!!.city!!

// Instead, handle properly
val city = user?.address?.city ?: "Unknown"
```

## Comparison with Java Optional

| Kotlin | Java |
|--------|------|
| `String?` | `Optional<String>` |
| `?.` | `.map()` |
| `?:` | `.orElse()` |
| `?.let {}` | `.ifPresent()` |
| `!!` | `.get()` |

## Conclusion

Kotlin's null safety system catches null-related errors at compile time rather than runtime. By using nullable types (`?`), safe calls (`?.`), the Elvis operator (`?:`), and smart casts, you can write code that's inherently safer without the boilerplate of null checks. Embrace these features and say goodbye to NullPointerException!
