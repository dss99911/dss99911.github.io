---
layout: post
title: "Android 네트워킹과 Retrofit 가이드"
date: 2025-12-28 12:08:00 +0900
categories: android
tags: [android, retrofit, okhttp, networking, api]
description: "Android에서 네트워크 통신을 처리하는 방법을 알아봅니다. Retrofit, OkHttp 설정, 인터셉터 등을 다룹니다."
---

# Android 네트워킹과 Retrofit 가이드

Android에서 REST API 통신을 위한 Retrofit 사용법을 알아봅니다.

## 기본 설정

### 의존성 추가

```kotlin
dependencies {
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
}
```

### 기본 구조

**OkHttpClient**: 실제 네트워크 통신 담당
- 타임아웃 설정
- 인터셉터 (헤더 추가, 로깅 등)

**Retrofit**: OkHttpClient와 앱을 연결
- Base URL 설정
- Converter (Gson 등) 설정
- Service 인터페이스 생성

**Service**: API 정의

## Retrofit 초기화

```kotlin
object ApiClient {
    private const val BASE_URL = "https://api.example.com/"

    private val okHttpClient: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .addInterceptor(loggingInterceptor)
            .addInterceptor(authInterceptor)
            .build()
    }

    private val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    val apiService: ApiService by lazy {
        retrofit.create(ApiService::class.java)
    }
}
```

## API Service 인터페이스

```kotlin
interface ApiService {
    @GET("users")
    suspend fun getUsers(): Response<List<User>>

    @GET("users/{id}")
    suspend fun getUser(@Path("id") userId: String): Response<User>

    @GET("search")
    suspend fun searchUsers(
        @Query("query") query: String,
        @Query("page") page: Int,
        @Query("limit") limit: Int = 20
    ): Response<SearchResult>

    @POST("users")
    suspend fun createUser(@Body user: User): Response<User>

    @PUT("users/{id}")
    suspend fun updateUser(
        @Path("id") userId: String,
        @Body user: User
    ): Response<User>

    @DELETE("users/{id}")
    suspend fun deleteUser(@Path("id") userId: String): Response<Unit>

    @FormUrlEncoded
    @POST("login")
    suspend fun login(
        @Field("email") email: String,
        @Field("password") password: String
    ): Response<AuthResponse>

    @Multipart
    @POST("upload")
    suspend fun uploadFile(
        @Part file: MultipartBody.Part,
        @Part("description") description: RequestBody
    ): Response<UploadResponse>

    @Headers("Cache-Control: max-age=3600")
    @GET("static-data")
    suspend fun getStaticData(): Response<Data>
}
```

## 인터셉터

### 로깅 인터셉터

```kotlin
private val loggingInterceptor = HttpLoggingInterceptor().apply {
    level = if (BuildConfig.DEBUG) {
        HttpLoggingInterceptor.Level.BODY
    } else {
        HttpLoggingInterceptor.Level.NONE
    }
}
```

### 인증 인터셉터

```kotlin
private val authInterceptor = Interceptor { chain ->
    val originalRequest = chain.request()
    val token = TokenManager.getToken()

    val newRequest = originalRequest.newBuilder()
        .addHeader("Authorization", "Bearer $token")
        .addHeader("Content-Type", "application/json")
        .build()

    chain.proceed(newRequest)
}
```

### 토큰 갱신 인터셉터

```kotlin
class TokenRefreshInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val response = chain.proceed(chain.request())

        if (response.code == 401) {
            synchronized(this) {
                // 토큰 갱신
                val newToken = refreshToken()
                if (newToken != null) {
                    TokenManager.saveToken(newToken)

                    // 원래 요청 재시도
                    val newRequest = chain.request().newBuilder()
                        .header("Authorization", "Bearer $newToken")
                        .build()
                    return chain.proceed(newRequest)
                }
            }
        }

        return response
    }
}
```

## Repository 패턴

```kotlin
class UserRepository(
    private val apiService: ApiService
) {
    suspend fun getUsers(): Result<List<User>> {
        return try {
            val response = apiService.getUsers()
            if (response.isSuccessful) {
                Result.success(response.body() ?: emptyList())
            } else {
                Result.failure(ApiException(response.code(), response.message()))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getUser(id: String): Result<User> {
        return try {
            val response = apiService.getUser(id)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(ApiException(response.code(), response.message()))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```

## ViewModel에서 사용

```kotlin
class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {

    private val _users = MutableLiveData<List<User>>()
    val users: LiveData<List<User>> = _users

    private val _error = MutableLiveData<String>()
    val error: LiveData<String> = _error

    fun loadUsers() {
        viewModelScope.launch {
            repository.getUsers()
                .onSuccess { userList ->
                    _users.value = userList
                }
                .onFailure { exception ->
                    _error.value = exception.message
                }
        }
    }
}
```

## 파일 업로드

```kotlin
fun uploadImage(uri: Uri) {
    viewModelScope.launch {
        val file = File(uri.path!!)
        val requestFile = file.asRequestBody("image/*".toMediaType())
        val body = MultipartBody.Part.createFormData("file", file.name, requestFile)

        val description = "Image description".toRequestBody("text/plain".toMediaType())

        val response = apiService.uploadFile(body, description)
        // 처리
    }
}
```

## 캐싱

### OkHttp 캐시 설정

```kotlin
val cacheSize = 10 * 1024 * 1024L // 10 MB
val cache = Cache(context.cacheDir, cacheSize)

val okHttpClient = OkHttpClient.Builder()
    .cache(cache)
    .build()
```

### 캐시 제어 인터셉터

```kotlin
val cacheInterceptor = Interceptor { chain ->
    val response = chain.proceed(chain.request())

    val cacheControl = CacheControl.Builder()
        .maxAge(1, TimeUnit.HOURS)
        .build()

    response.newBuilder()
        .header("Cache-Control", cacheControl.toString())
        .build()
}
```

## 에러 처리

```kotlin
sealed class NetworkResult<T> {
    data class Success<T>(val data: T) : NetworkResult<T>()
    data class Error<T>(val code: Int, val message: String?) : NetworkResult<T>()
    data class Exception<T>(val e: Throwable) : NetworkResult<T>()
}

suspend fun <T> safeApiCall(apiCall: suspend () -> Response<T>): NetworkResult<T> {
    return try {
        val response = apiCall()
        if (response.isSuccessful) {
            NetworkResult.Success(response.body()!!)
        } else {
            NetworkResult.Error(response.code(), response.message())
        }
    } catch (e: IOException) {
        NetworkResult.Exception(e)
    } catch (e: Exception) {
        NetworkResult.Exception(e)
    }
}
```

## 간단한 HTTP 요청

Retrofit 없이 간단한 요청:

```kotlin
val url = URL("https://www.example.com/data")
val connection = url.openConnection() as HttpsURLConnection
connection.connect()
val inputStream = connection.inputStream
// 데이터 읽기
```

## 결론

Retrofit은 Android에서 REST API 통신을 간편하게 처리할 수 있게 해줍니다. 인터셉터를 활용하여 인증, 로깅, 캐싱 등을 효율적으로 구현하고, Repository 패턴으로 데이터 레이어를 깔끔하게 분리하세요.
