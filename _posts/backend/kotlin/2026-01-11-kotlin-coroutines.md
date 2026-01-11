---
layout: post
title: "Kotlin Coroutines: Asynchronous Programming Made Simple"
date: 2026-01-11
categories: [backend, kotlin]
tags: [kotlin, jvm, coroutines, async, concurrency]
image: /assets/images/posts/kotlin-coroutines.png
---

Kotlin coroutines provide a powerful way to write asynchronous, non-blocking code. They're lightweight threads that make concurrent programming intuitive and less error-prone.

## What are Coroutines?

Coroutines are light-weight threads that allow you to write asynchronous code in a sequential style. Unlike traditional threads, thousands of coroutines can run on a single thread without significant overhead.

## Setup

Add the coroutines dependency to your project:

```kotlin
// Gradle (Kotlin DSL)
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    // For Android
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
}
```

## Basic Concepts

### Suspend Functions

Functions that can pause execution without blocking the thread:

```kotlin
suspend fun fetchUser(): User {
    delay(1000)  // Non-blocking delay
    return User("John")
}

suspend fun longRunningTask(): Long {
    val time = measureTimeMillis {
        println("Starting...")
        delay(2000)  // Suspends for 2 seconds
        println("Done!")
    }
    return time
}
```

### runBlocking

Bridges blocking and non-blocking worlds (mainly for main functions and tests):

```kotlin
fun main() = runBlocking {
    val time = longRunningTask()
    println("Execution time: $time ms")
}
```

### launch

Starts a new coroutine that doesn't return a result:

```kotlin
fun main() = runBlocking {
    launch {
        delay(1000)
        println("World!")
    }
    println("Hello,")  // Prints immediately
}
// Output: Hello, World!
```

### async

Starts a coroutine that returns a result via `Deferred`:

```kotlin
fun main() = runBlocking {
    val deferred = async {
        delay(1000)
        "Hello, Async!"
    }

    println("Waiting...")
    val result = deferred.await()  // Suspends until result is ready
    println(result)
}
```

## Coroutine Context and Dispatchers

### Dispatchers

Control which thread(s) the coroutine runs on:

```kotlin
launch(Dispatchers.Default) {
    // CPU-intensive work (background thread pool)
}

launch(Dispatchers.IO) {
    // I/O operations (larger thread pool)
}

launch(Dispatchers.Main) {
    // UI updates (Android main thread)
}

launch(Dispatchers.Unconfined) {
    // Runs in caller thread until first suspension
}
```

### Common Pool Pattern

```kotlin
fun main() = runBlocking {
    val time = async(Dispatchers.Default) { longRunningTask() }

    println("Printed after async launch")

    val result = time.await()
    println("Time taken: $result ms")
}
```

## Structured Concurrency

### Coroutine Scope

Coroutines are scoped, ensuring proper cancellation and resource cleanup:

```kotlin
class MyViewModel : ViewModel() {
    private val scope = CoroutineScope(Dispatchers.Main + Job())

    fun loadData() {
        scope.launch {
            val data = fetchData()
            updateUI(data)
        }
    }

    override fun onCleared() {
        scope.cancel()  // Cancel all coroutines
    }
}
```

### coroutineScope

Creates a scope that waits for all children to complete:

```kotlin
suspend fun fetchTwoPosts(): Pair<Post, Post> = coroutineScope {
    val post1 = async { fetchPost(1) }
    val post2 = async { fetchPost(2) }
    Pair(post1.await(), post2.await())
}
```

## Exception Handling

### try-catch

```kotlin
launch {
    try {
        riskyOperation()
    } catch (e: Exception) {
        handleError(e)
    }
}
```

### CoroutineExceptionHandler

```kotlin
val handler = CoroutineExceptionHandler { _, exception ->
    println("Caught $exception")
}

val scope = CoroutineScope(Dispatchers.Default + handler)

scope.launch {
    throw RuntimeException("Boom!")
}
```

### async Exception Handling

Note: Exceptions in `async` are only thrown when `await()` is called:

```kotlin
val deferred = async {
    throw RuntimeException("Error!")
}

try {
    deferred.await()  // Exception thrown here
} catch (e: Exception) {
    println("Caught: ${e.message}")
}
```

## Cancellation

### Checking for Cancellation

```kotlin
suspend fun longTask() = coroutineScope {
    repeat(1000) { i ->
        if (!isActive) return@coroutineScope  // Check cancellation
        // or use ensureActive()
        delay(100)
        println("Processing $i")
    }
}
```

### Timeout

```kotlin
val result = withTimeout(1000) {
    fetchData()  // Throws TimeoutCancellationException if takes > 1s
}

// Or with null on timeout
val result = withTimeoutOrNull(1000) {
    fetchData()
}
```

## Flow (Cold Streams)

For asynchronous data streams:

```kotlin
fun numbers(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100)
        emit(i)
    }
}

fun main() = runBlocking {
    numbers()
        .filter { it % 2 == 1 }
        .map { it * it }
        .collect { println(it) }  // 1, 9
}
```

## Channels (Hot Streams)

For communication between coroutines:

```kotlin
val channel = Channel<Int>()

launch {
    for (x in 1..5) channel.send(x * x)
    channel.close()
}

launch {
    for (y in channel) println(y)  // 1, 4, 9, 16, 25
}
```

## Time Measurement

```kotlin
import kotlin.system.measureTimeMillis

val elapsed = measureTimeMillis {
    runBlocking {
        delay(1000)
    }
}
println("Took $elapsed ms")
```

## Kotlin Native Concurrency

For Kotlin Multiplatform, there are special considerations:

### Frozen Objects

In Kotlin/Native, objects passed between threads are frozen (immutable):

```kotlin
// Objects are frozen by default
object DataManager {
    // Use @ThreadLocal for mutable state
    @ThreadLocal
    var mutableData: String? = null
}

// Global properties are accessible only from main thread
// unless marked @SharedImmutable or @ThreadLocal
```

### Worker API

```kotlin
// Background work in Kotlin/Native
val worker = Worker.start()
val future = worker.execute(TransferMode.SAFE, { data }) {
    // This runs in worker thread
    processData(it)
}
val result = future.result  // Get result (freezes if needed)
```

### Best Practices for Native

1. Use `ensureNeverFrozen()` to catch unexpected freezing
2. Understand that `freeze()` applies to object graph
3. Be careful with closures capturing outer scope
4. Use `@ThreadLocal` for thread-specific mutable state

## Unit Testing Coroutines

```kotlin
dependencies {
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.mockito:mockito-core:4.0.0")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3")
}
```

```kotlin
@Test
fun `test coroutine`() = runTest {
    val result = async { fetchData() }.await()
    assertEquals("expected", result)
}

// With TestDispatcher for time control
@Test
fun `test with delay`() = runTest {
    var result = ""
    launch {
        delay(1000)
        result = "done"
    }
    advanceTimeBy(1000)
    assertEquals("done", result)
}
```

## Best Practices

1. **Use structured concurrency**: Always scope coroutines properly
2. **Prefer suspend functions**: Make asynchronous operations explicit
3. **Choose the right dispatcher**: IO for network/disk, Default for CPU
4. **Handle exceptions properly**: Use try-catch or exception handlers
5. **Cancel when appropriate**: Clean up resources and stop unnecessary work
6. **Avoid GlobalScope**: Use proper scoping for lifecycle management

## Common Patterns

### Sequential by Default

```kotlin
suspend fun loadContent() {
    val user = fetchUser()       // Waits
    val posts = fetchPosts(user) // Then executes
    display(user, posts)
}
```

### Concurrent with async

```kotlin
suspend fun loadContent() = coroutineScope {
    val user = async { fetchUser() }
    val posts = async { fetchPosts() }
    display(user.await(), posts.await())  // Parallel execution
}
```

### Fire and Forget with launch

```kotlin
fun logAnalytics(event: String) {
    scope.launch(Dispatchers.IO) {
        analyticsService.log(event)  // Don't wait for result
    }
}
```

## Conclusion

Kotlin coroutines transform asynchronous programming from callback hell to clean, sequential code. With suspend functions, structured concurrency, and powerful operators like Flow, you can write concurrent code that's both safe and readable. The key is understanding scopes, dispatchers, and proper exception handling to build robust applications.
