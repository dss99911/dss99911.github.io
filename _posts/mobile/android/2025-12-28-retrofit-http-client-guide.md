---
layout: post
title: "Retrofit HTTP Client Guide for Android"
date: 2025-12-28
categories: [mobile, android]
tags: [retrofit, android, http, networking, kotlin]
image: /assets/images/posts/thumbnails/2025-12-28-retrofit-http-client-guide.png
---

Android에서 Retrofit을 사용한 HTTP 통신 방법을 알아봅니다.

## Dependencies

```gradle
implementation "com.squareup.retrofit2:retrofit:2.4.0"
implementation "com.squareup.retrofit2:converter-gson:2.4.0"
```

## Retrofit Builder

### 기본 설정

```kotlin
object Api {
    val service by lazy {
        val gson = GsonBuilder()
            .setLenient()
            .create()

        Retrofit.Builder()
            .baseUrl("https://api.example.com")
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
            .create(ApiService::class.java)
    }
}
```

### 상세 설정

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
                .client(client)
                .build()
        }

        return retrofit!!
    }

    fun getAPIService(logLevel: LogLevel = LogLevel.LOG_REQ_RES_BODY_HEADERS) =
        getClient(logLevel).create(APIService::class.java)
}
```

## Service Interface

### 기본 형태

```kotlin
interface ApiService {
    @POST("endpoint/path")
    fun postData(@Body body: RequestBody): Call<ResponseType>

    @GET("endpoint/path")
    fun getData(@Query("param") param: String): Call<ResponseType>
}
```

### RxJava와 함께 사용

```kotlin
interface ApiService {
    @POST("todos/list")
    fun getToDoList(): Observable<GetToDoListResponse>

    @POST("todos/edit")
    fun editTodo(@Body todo: String): Observable<BaseResponse>

    @POST("todos/add")
    fun addTodo(@Body todo: String): Observable<BaseResponse>
}
```

RxJava Adapter 추가:
```kotlin
Retrofit.Builder()
    .baseUrl(Constants.BASE_URL)
    .addConverterFactory(GsonConverterFactory.create())
    .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
    .build()
```

## API 호출

### Callback 방식

```kotlin
Api.service.getData(param).enqueue(object : Callback<ResponseType> {
    override fun onFailure(call: Call<ResponseType>?, t: Throwable?) {
        println("Error: $t")
    }

    override fun onResponse(call: Call<ResponseType>?, response: Response<ResponseType>?) {
        println("Response: ${response?.body()}")
    }
})
```

### RxJava 방식

```kotlin
APIClient()
    .getAPIService()
    .getToDoList()
    .subscribeOn(Schedulers.io())
    .observeOn(AndroidSchedulers.mainThread())
    .subscribeBy(
        onNext = { response ->
            adapter.setDataset(response.data)
        },
        onError = { e ->
            e.printStackTrace()
        }
    )
```

## Thread 설정

특정 스레드에서 응답을 받으려면:

```kotlin
Retrofit.Builder()
    .baseUrl(Constants.BASE_URL)
    .callbackExecutor(Executors.newSingleThreadExecutor())
    .build()
```

## ProGuard 설정

Retrofit 사용 시 ProGuard 설정이 필요합니다:

- [Retrofit GitHub](https://github.com/square/retrofit)
- [Retrofit Documentation](https://square.github.io/retrofit/)

공식 문서에서 최신 ProGuard 규칙을 확인하세요.

## 구조 가이드

### ApiClient

모든 서비스를 포함합니다.

### Service

모든 API 엔드포인트를 포함합니다.

```kotlin
// 구조 예시
ApiClient
 ├── UserService
 │    ├── login()
 │    ├── logout()
 │    └── getProfile()
 └── TodoService
      ├── getList()
      ├── add()
      └── edit()
```
