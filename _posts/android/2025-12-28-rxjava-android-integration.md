---
layout: post
title: "RxJava Android Integration - Retrofit, RxBinding, and Testing"
date: 2025-12-28
categories: android
tags: [rxjava, android, retrofit, rxbinding, testing]
---

RxJava를 Android에서 실제로 활용하는 방법을 알아봅니다.

## Retrofit with RxJava

### Dependencies

```gradle
implementation 'com.squareup.retrofit2:adapter-rxjava2:2.3.0'
implementation 'io.reactivex.rxjava2:rxandroid:2.0.1'
implementation 'io.reactivex.rxjava2:rxkotlin:2.1.0'
```

### API Client 설정

```kotlin
class APIClient {
    private var retrofit: Retrofit? = null

    enum class LogLevel {
        LOG_NOT_NEEDED,
        LOG_REQ_RES,
        LOG_REQ_RES_BODY_HEADERS,
        LOG_REQ_RES_HEADERS_ONLY
    }

    fun getClient(logLevel: LogLevel): Retrofit {
        val interceptor = HttpLoggingInterceptor()
        when (logLevel) {
            LogLevel.LOG_NOT_NEEDED ->
                interceptor.level = HttpLoggingInterceptor.Level.NONE
            LogLevel.LOG_REQ_RES ->
                interceptor.level = HttpLoggingInterceptor.Level.BASIC
            LogLevel.LOG_REQ_RES_BODY_HEADERS ->
                interceptor.level = HttpLoggingInterceptor.Level.BODY
            LogLevel.LOG_REQ_RES_HEADERS_ONLY ->
                interceptor.level = HttpLoggingInterceptor.Level.HEADERS
        }

        val client = OkHttpClient.Builder()
            .connectTimeout(3, TimeUnit.MINUTES)
            .writeTimeout(3, TimeUnit.MINUTES)
            .readTimeout(3, TimeUnit.MINUTES)
            .addInterceptor(interceptor)
            .build()

        if (retrofit == null) {
            retrofit = Retrofit.Builder()
                .baseUrl(Constants.BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .addCallAdapterFactory(RxJava2CallAdapterFactory.create())  // RxJava Adapter
                .client(client)
                .build()
        }

        return retrofit!!
    }

    fun getAPIService(logLevel: LogLevel = LogLevel.LOG_REQ_RES_BODY_HEADERS) =
        getClient(logLevel).create(APIService::class.java)
}
```

### API Service (Observable 반환)

```kotlin
interface APIService {
    @POST(Constants.GET_TODO_LIST)
    fun getToDoList(): Observable<GetToDoListAPIResponse>

    @POST(Constants.EDIT_TODO)
    fun editTodo(@Body todo: String): Observable<BaseAPIResponse>

    @POST(Constants.ADD_TODO)
    fun addTodo(@Body todo: String): Observable<BaseAPIResponse>
}
```

### 사용 예시

```kotlin
private fun fetchTodoList() {
    APIClient()
        .getAPIService()
        .getToDoList()
        .subscribeOn(Schedulers.computation())
        .observeOn(AndroidSchedulers.mainThread())
        .subscribeBy(
            onNext = { response ->
                adapter.setDataset(response.data)
            },
            onError = { e ->
                e.printStackTrace()
            }
        )
}
```

## RxBinding

UI 이벤트를 Observable로 변환합니다.

### Dependencies

```gradle
implementation 'com.jakewharton.rxbinding2:rxbinding-kotlin:2.0.0'
```

### 사용 예시

```kotlin
// Click 이벤트
itemView.clicks()
    .subscribeBy {
        onClickTodoSubject.onNext(Pair(itemView, todoItem))
    }

// Text 변경 이벤트
textview.textChanges().subscribeBy { changedText ->
    Log.d("Text Changed", changedText.toString())
}

// FAB 클릭을 Subject에 연결
fab.clicks()
    .map { Pair(fab, "a") }
    .subscribe(onClickTodoSubject)
```

## HTTP with RxJava

Apache HTTP Client 사용:

```gradle
compile "com.netflix.rxjava:rxjava-apache-http:0.20.7"
```

```kotlin
val httpClient = HttpAsyncClients.createDefault()
httpClient.start()

ObservableHttp.createGet("http://example.com/api", httpClient)
    .toObservable()
    .flatMap { response ->
        response.content.map { bytes -> String(bytes) }
    }
    .onErrorReturn { "Error Parsing data" }
    .subscribe {
        println(it)
        httpClient.close()
    }
```

## Custom Operators

### Define Custom Operator

```kotlin
class AddSerialNumber<T> : ObservableOperator<Pair<Int, T>, T> {
    val counter = AtomicInteger()

    override fun apply(observer: Observer<in Pair<Int, T>>): Observer<in T> {
        return object : Observer<T> {
            override fun onComplete() = observer.onComplete()
            override fun onSubscribe(d: Disposable) = observer.onSubscribe(d)
            override fun onError(e: Throwable) = observer.onError(e)
            override fun onNext(t: T) {
                observer.onNext(Pair(counter.incrementAndGet(), t))
            }
        }
    }
}
```

### Use Custom Operator

```kotlin
Observable.range(10, 20)
    .lift(AddSerialNumber<Int>())
    .subscribeBy(
        onNext = { println("Next $it") },
        onError = { it.printStackTrace() },
        onComplete = { println("Completed") }
    )
```

### Extension Function (Kotlin)

```kotlin
fun <T> Observable<T>.addSerialNumber(): Observable<Pair<Int, T>> =
    lift(AddSerialNumber<T>())

// 사용
Observable.range(10, 20)
    .addSerialNumber()
    .subscribe { println("Next $it") }
```

### Compose Operators

```kotlin
class SchedulerManager<T>(
    val subscribeScheduler: Scheduler,
    val observeScheduler: Scheduler
) : ObservableTransformer<T, T> {
    override fun apply(upstream: Observable<T>): ObservableSource<T> {
        return upstream
            .subscribeOn(subscribeScheduler)
            .observeOn(observeScheduler)
    }
}

// 사용
Observable.range(1, 10)
    .map { println("map - ${Thread.currentThread().name} $it"); it }
    .compose(SchedulerManager(Schedulers.computation(), Schedulers.io()))
    .subscribe { println("onNext - ${Thread.currentThread().name} $it") }
```

### Extension Function for Compose

```kotlin
fun <T> Observable<T>.scheduler(
    subscribeScheduler: Scheduler,
    observeScheduler: Scheduler
): Observable<T> = compose(SchedulerManager(subscribeScheduler, observeScheduler))

// 사용
Observable.range(1, 10)
    .scheduler(
        subscribeScheduler = Schedulers.computation(),
        observeScheduler = Schedulers.io()
    )
    .subscribe { println(it) }
```

## Unit Testing

### Blocking Operators

```kotlin
// blockingSubscribe
val emissionsCount = AtomicInteger()
Observable.range(1, 10)
    .subscribeOn(Schedulers.computation())
    .blockingSubscribe { _ ->
        emissionsCount.incrementAndGet()
    }
assertEquals(10, emissionsCount.get())

// blockingFirst & blockingLast
val observable = listOf(2, 10, 5, 6, 9, 8, 7, 1, 4, 3).toObservable().sorted()
val firstItem = observable.blockingFirst()
assertEquals(1, firstItem)

val lastItem = observable.blockingLast()
assertEquals(10, lastItem)

// blockingGet (Monad)
val firstElement: Single<Int> = observable.first(0)
val firstItem = firstElement.blockingGet()

val maybeElement: Maybe<Int> = observable.firstElement()
val item = maybeElement.blockingGet()

// blockingIterable
val list = listOf(2, 10, 5, 6, 9, 8, 7, 1, 4, 3)
val observable = list.toObservable().sorted()
val iterable = observable.blockingIterable()
assertEquals(list.sorted(), iterable.toList())

// blockingForEach (OOM 방지)
val list = listOf(2, 10, 5, 6, 9, 8, 7, 1, 4, 3, 12, 20, 15, 16, 19, 18, 17, 11, 14, 13)
val observable = list.toObservable().filter { it % 2 == 0 }
observable.blockingForEach { item ->
    assertTrue { item % 2 == 0 }
}
```

### TestObserver & TestSubscriber

```kotlin
val list = listOf(2, 10, 5, 6, 9, 8, 7, 1, 4, 3, 12, 20, 15, 16, 19, 18, 17, 11, 14, 13)
val observable = list.toObservable().sorted()
val testObserver = TestObserver<Int>()

observable.subscribe(testObserver)

testObserver.assertSubscribed()
testObserver.awaitTerminalEvent()  // 완료까지 blocking
testObserver.assertNoErrors()
testObserver.assertComplete()
testObserver.assertValueCount(20)
testObserver.assertValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20)
```

### TestScheduler

시간 기반 테스트:

```kotlin
val testScheduler = TestScheduler()
val observable = Observable.interval(5, TimeUnit.MINUTES, testScheduler)
val testObserver = TestObserver<Long>()

observable.subscribe(testObserver)
testObserver.assertSubscribed()
testObserver.assertValueCount(0)

testScheduler.advanceTimeBy(100, TimeUnit.MINUTES)
testObserver.assertValueCount(20)

testScheduler.advanceTimeBy(400, TimeUnit.MINUTES)
testObserver.assertValueCount(100)
```

## Reactor (Alternative)

Java 8 이상, Android SDK 26 이상에서 사용 가능합니다.

```gradle
compile 'io.projectreactor:reactor-core:3.1.1.RELEASE'
```

### Flux

```kotlin
val flux = Flux.just("Item 1", "Item 2", "Item 3")
flux.subscribe(object : Consumer<String> {
    override fun accept(item: String) {
        println("Got Next $item")
    }
})
```

### Mono

```kotlin
val consumer = object : Consumer<String> {
    override fun accept(item: String) {
        println("Got $item")
    }
}

val emptyMono = Mono.empty<String>()
emptyMono.log().subscribe(consumer)

val monoWithData = Mono.justOrEmpty<String>("A String")
monoWithData.log().subscribe(consumer)

val monoByExtension = "Another String".toMono()
monoByExtension.log().subscribe(consumer)
```
