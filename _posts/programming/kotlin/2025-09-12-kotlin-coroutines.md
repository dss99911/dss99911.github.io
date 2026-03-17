---
layout: post
title: "Kotlin 코루틴: 비동기 프로그래밍"
date: 2025-09-12 17:49:00 +0900
categories: [programming, kotlin]
tags: [kotlin, coroutine, async, suspend, concurrency]
description: "Kotlin 코루틴의 기본 개념과 사용법을 알아봅니다. suspend 함수, async, runBlocking에 대해 다룹니다."
image: /assets/images/posts/thumbnails/2025-12-28-kotlin-coroutines.png
redirect_from:
  - "/programming/kotlin/2025/12/28/kotlin-coroutines.html"
---

코루틴은 Kotlin에서 비동기 프로그래밍을 위한 강력한 도구입니다. 가벼운 스레드라고 생각할 수 있습니다.

## 설정

### Gradle 설정

```kotlin
apply plugin: 'kotlin'
// 또는
apply plugin: 'kotlin-android'

kotlin {
    experimental {
        coroutines 'enable'
    }
}

repositories {
    jcenter()
}

dependencies {
    compile "org.jetbrains.kotlinx:kotlinx-coroutines-core:0.16"
}
```

## 기본 개념

### suspend 함수

`suspend` 키워드는 함수가 일시 중단될 수 있음을 나타냅니다.

```kotlin
suspend fun longRunningTask(): Long {
    val time = measureTimeMillis {
        println("Please wait")
        delay(2, TimeUnit.SECONDS)  // 2초 대기
        println("Delay Over")
    }
    return time
}
```

### runBlocking

다른 스레드에서 작업하지만 현재 스레드를 블록합니다.

```kotlin
fun main(args: Array<String>) {
    runBlocking {
        val exeTime = longRunningTask()
        println("Execution Time is $exeTime")
    }
}
```

### delay

스레드를 블록하지 않고 일시 중단합니다. `suspend` 함수 내에서만 사용 가능합니다.

```kotlin
runBlocking {
    delay(5, TimeUnit.SECONDS)
}
```

## async

비동기 작업을 시작하고 결과를 나중에 받을 수 있습니다.

### Context

- `Unconfined`: 메인 스레드
- `CommonPool`: 공용 스레드 풀

### 사용법

```kotlin
fun main(args: Array<String>) {
    val time = async(CommonPool) { longRunningTask() }  // 비동기 시작
    println("Print after async")
    runBlocking {
        println("printing time ${time.await()}")  // 결과 대기
    }
}
```

### await와 예외 처리

`await()` 호출 전까지 예외는 무시됩니다. 예외를 확인하려면 `await()`를 호출해야 합니다.

```kotlin
val deferred = async(CommonPool) {
    throw RuntimeException("Error!")
}

// 여기서는 예외가 발생하지 않음
println("After async")

// await() 호출 시 예외 발생
try {
    deferred.await()
} catch (e: Exception) {
    println("Exception caught: ${e.message}")
}
```

## 시간 측정

`measureTimeMillis`로 람다 실행 시간을 측정할 수 있습니다.

```kotlin
val time = measureTimeMillis {
    // 측정할 코드
    performOperation()
}
println("Took $time ms")
```

## 유용한 리소스

- [Kotlin 코루틴 기본](https://kotlinlang.org/docs/reference/coroutines/basics.html)
- [Kotlin 코루틴 참조](https://kotlinlang.org/docs/reference/coroutines.html)
- [Quasar - 어노테이션 기반 병렬 라이브러리](http://www.paralleluniverse.co/quasar/)

## 다음 단계

코루틴의 기본에 대해 알아보았습니다. 다음으로 [Kotlin Native 동시성](/kotlin/kotlin-native-concurrency)에 대해 알아보세요.

---

## 구조화된 동시성 (Structured Concurrency)

Kotlin 코루틴의 핵심 개념 중 하나는 구조화된 동시성입니다. 모든 코루틴은 특정 `CoroutineScope` 안에서 실행되며, 부모 코루틴이 취소되면 모든 자식 코루틴도 함께 취소됩니다.

```kotlin
coroutineScope {
    val deferred1 = async { fetchUserProfile() }
    val deferred2 = async { fetchUserOrders() }

    val profile = deferred1.await()
    val orders = deferred2.await()

    // 둘 중 하나가 실패하면 다른 하나도 자동 취소
    updateUI(profile, orders)
}
```

이 패턴은 코루틴 누수를 방지하고, 예외 처리를 예측 가능하게 만듭니다.

## Dispatchers

코루틴이 어떤 스레드에서 실행될지를 결정하는 것이 Dispatcher입니다.

| Dispatcher | 용도 | 설명 |
|-----------|------|------|
| `Dispatchers.Main` | UI 업데이트 | Android 메인 스레드 |
| `Dispatchers.IO` | 네트워크/파일 I/O | 최대 64개 스레드 풀 |
| `Dispatchers.Default` | CPU 집약 작업 | CPU 코어 수만큼 스레드 |
| `Dispatchers.Unconfined` | 테스트용 | 호출한 스레드에서 실행 |

```kotlin
withContext(Dispatchers.IO) {
    val data = api.fetchData()  // IO 스레드에서 실행
}

withContext(Dispatchers.Main) {
    textView.text = data  // 메인 스레드에서 UI 업데이트
}
```

## Flow

Flow는 코루틴 기반의 비동기 스트림입니다. RxJava의 Observable과 유사하지만 코루틴과 자연스럽게 통합됩니다.

```kotlin
fun fetchNumbers(): Flow<Int> = flow {
    for (i in 1..5) {
        delay(1000)
        emit(i)
    }
}

// 수집
lifecycleScope.launch {
    fetchNumbers()
        .filter { it % 2 == 0 }
        .map { it * it }
        .collect { value ->
            println(value)  // 4, 16
        }
}
```

Flow의 주요 특징:
- **Cold stream**: collect가 호출될 때만 실행됩니다
- **취소 가능**: 코루틴 취소 시 Flow도 함께 취소됩니다
- **연산자 지원**: `map`, `filter`, `combine`, `flatMapMerge` 등 다양한 연산자를 제공합니다

## 코루틴 사용 시 주의사항

1. **GlobalScope 사용을 피하세요**: `GlobalScope`는 앱 전체 수명주기를 따르므로 코루틴 누수가 발생할 수 있습니다. 대신 `viewModelScope`나 `lifecycleScope`를 사용하세요.
2. **suspend 함수 내에서 스레드를 블록하지 마세요**: `Thread.sleep()` 대신 `delay()`를 사용하세요.
3. **예외 처리를 잊지 마세요**: `CoroutineExceptionHandler`를 사용하거나 `try-catch`로 예외를 처리하세요.
4. **테스트에서는 `runTest`를 사용하세요**: `kotlinx-coroutines-test` 라이브러리가 테스트용 디스패처와 시간 제어를 제공합니다.

---

## CoroutineExceptionHandler

코루틴에서 발생하는 예외를 전역적으로 처리할 수 있습니다.

```kotlin
val handler = CoroutineExceptionHandler { _, exception ->
    println("Caught $exception")
}

val scope = CoroutineScope(Dispatchers.Default + handler)

scope.launch {
    throw RuntimeException("Something went wrong!")
}
// Output: Caught java.lang.RuntimeException: Something went wrong!
```

### supervisorScope

일반적인 coroutineScope에서는 자식 코루틴 하나가 실패하면 다른 자식도 모두 취소됩니다. `supervisorScope`를 사용하면 각 자식이 독립적으로 실패를 처리합니다.

```kotlin
supervisorScope {
    val job1 = launch {
        delay(100)
        throw RuntimeException("Job 1 failed")
    }

    val job2 = launch {
        delay(500)
        println("Job 2 completed")  // Job 1이 실패해도 실행됨
    }
}
```

이 패턴은 여러 독립적인 작업을 병렬로 실행할 때 유용합니다. 예를 들어, 대시보드에서 여러 API를 동시에 호출할 때 하나의 API 실패가 다른 API 결과까지 취소하면 안 되는 경우에 사용합니다.

---

## Channel

Channel은 코루틴 간에 데이터를 스트리밍하는 데 사용되며, 생산자-소비자 패턴을 구현할 수 있습니다.

```kotlin
val channel = Channel<Int>(capacity = 5)

// 생산자
launch {
    for (i in 1..10) {
        channel.send(i)
        println("Sent $i")
    }
    channel.close()
}

// 소비자
launch {
    for (value in channel) {
        println("Received $value")
        delay(100)
    }
}
```

### Channel vs Flow

| 특성 | Channel | Flow |
|------|---------|------|
| **Hot/Cold** | Hot (즉시 실행) | Cold (collect 시 실행) |
| **1:1 / 1:N** | 1:1 통신 | 1:N 브로드캐스트 가능 |
| **버퍼** | 설정 가능 | 연산자로 제어 |
| **취소** | 수동 close 필요 | 자동 취소 |
| **사용 사례** | 코루틴 간 직접 통신 | 데이터 스트림 처리 |

---

## StateFlow와 SharedFlow

### StateFlow

상태를 관리하기 위한 특수한 Flow입니다. Android에서 LiveData의 대안으로 많이 사용됩니다.

```kotlin
class UserViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    fun loadUser() {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            try {
                val user = repository.fetchUser()
                _uiState.value = UiState.Success(user)
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.message)
            }
        }
    }
}

// Activity/Fragment에서 수집
lifecycleScope.launch {
    viewModel.uiState.collect { state ->
        when (state) {
            is UiState.Loading -> showLoading()
            is UiState.Success -> showUser(state.user)
            is UiState.Error -> showError(state.message)
        }
    }
}
```

### SharedFlow

이벤트 스트리밍에 적합합니다. StateFlow와 달리 동일한 값을 여러 번 emit할 수 있습니다.

```kotlin
class EventBus {
    private val _events = MutableSharedFlow<Event>()
    val events: SharedFlow<Event> = _events.asSharedFlow()

    suspend fun emit(event: Event) {
        _events.emit(event)
    }
}
```

---

## 코루틴 테스트

`kotlinx-coroutines-test` 라이브러리를 사용하면 코루틴을 효과적으로 테스트할 수 있습니다.

```kotlin
@Test
fun testFetchUser() = runTest {
    val viewModel = UserViewModel(FakeRepository())

    viewModel.loadUser()
    advanceUntilIdle()

    assertEquals(UiState.Success(expectedUser), viewModel.uiState.value)
}
```

### TestDispatcher

테스트에서는 `StandardTestDispatcher`나 `UnconfinedTestDispatcher`를 사용합니다.

```kotlin
@Test
fun testWithTestDispatcher() = runTest {
    val testDispatcher = StandardTestDispatcher(testScheduler)

    val viewModel = UserViewModel(
        repository = FakeRepository(),
        dispatcher = testDispatcher
    )

    viewModel.loadData()
    advanceUntilIdle()  // 모든 대기 중인 코루틴 실행

    assertNotNull(viewModel.data.value)
}
```

### 핵심 테스트 유틸리티

| 함수 | 설명 |
|------|------|
| `runTest` | 테스트용 코루틴 스코프 생성 |
| `advanceUntilIdle()` | 모든 대기 중인 코루틴을 실행 |
| `advanceTimeBy(ms)` | 지정된 시간만큼 가상 시간 진행 |
| `runCurrent()` | 현재 시점에서 실행 가능한 코루틴만 실행 |

---

## 실무 패턴: 병렬 API 호출

여러 API를 병렬로 호출하고 결과를 합치는 패턴은 실무에서 매우 자주 사용됩니다.

```kotlin
suspend fun loadDashboard(): DashboardData = coroutineScope {
    val userDeferred = async { api.fetchUser() }
    val ordersDeferred = async { api.fetchOrders() }
    val notificationsDeferred = async { api.fetchNotifications() }

    DashboardData(
        user = userDeferred.await(),
        orders = ordersDeferred.await(),
        notifications = notificationsDeferred.await()
    )
}
```

세 API가 순차적으로 실행되면 총 시간이 합산되지만, `async`로 병렬 실행하면 가장 오래 걸리는 API의 시간만큼만 소요됩니다. 예를 들어, 각 API가 1초씩 걸리면 순차 실행은 3초, 병렬 실행은 약 1초입니다.
