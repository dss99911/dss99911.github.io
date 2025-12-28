---
layout: post
title: "Android 의존성 주입 (DI) 가이드"
date: 2025-12-28 12:09:00 +0900
categories: [mobile, android]
tags: [android, dagger, koin, hilt, dependency-injection]
description: "Android에서 의존성 주입을 구현하는 방법을 알아봅니다. Dagger2, Hilt, Koin 등을 비교하고 사용법을 다룹니다."
---

# Android 의존성 주입 (DI) 가이드

의존성 주입(Dependency Injection)은 코드의 테스트 용이성과 유지보수성을 높이는 디자인 패턴입니다.

## 왜 의존성 주입이 필요한가?

### DI의 장점

1. **테스트 용이성**: Mock 객체로 쉽게 대체 가능
2. **코드 재사용성**: 모듈 단위로 교체 가능
3. **유지보수성**: 의존성이 명확하게 드러남
4. **결합도 감소**: 컴포넌트 간 느슨한 결합

### DI 없이

```kotlin
class UserRepository {
    private val api = ApiService.create()  // 직접 생성
    private val database = AppDatabase.getInstance()  // 직접 참조
}
```

### DI 사용

```kotlin
class UserRepository(
    private val api: ApiService,  // 주입받음
    private val database: AppDatabase  // 주입받음
)
```

## Dagger2

### 기본 개념

- **Compile-time DI**: 런타임이 아닌 컴파일 시점에 의존성 그래프 생성
- **@Inject**: 주입받을 필드나 생성자에 표시
- **@Module**: 의존성을 제공하는 클래스
- **@Provides**: 의존성을 제공하는 메서드
- **@Component**: 의존성 그래프의 진입점

### 의존성 추가

```kotlin
dependencies {
    implementation("com.google.dagger:dagger:2.48")
    kapt("com.google.dagger:dagger-compiler:2.48")
}
```

### @Inject 사용

```kotlin
class CoffeeMaker @Inject constructor(
    private val heater: Heater,
    private val pump: Pump
) {
    fun brew() { }
}
```

### @Module과 @Provides

```kotlin
@Module
class AppModule {
    @Provides
    @Singleton
    fun provideApiService(): ApiService {
        return Retrofit.Builder()
            .baseUrl("https://api.example.com/")
            .build()
            .create(ApiService::class.java)
    }

    @Provides
    fun provideUserRepository(
        api: ApiService,
        db: AppDatabase
    ): UserRepository {
        return UserRepository(api, db)
    }
}
```

### @Component

```kotlin
@Singleton
@Component(modules = [AppModule::class, NetworkModule::class])
interface AppComponent {
    fun inject(activity: MainActivity)
    fun userRepository(): UserRepository
}
```

### Component 생성 및 사용

```kotlin
// Application에서 초기화
class MyApp : Application() {
    lateinit var appComponent: AppComponent

    override fun onCreate() {
        super.onCreate()
        appComponent = DaggerAppComponent.builder()
            .appModule(AppModule())
            .build()
    }
}

// Activity에서 사용
class MainActivity : AppCompatActivity() {
    @Inject
    lateinit var userRepository: UserRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        (application as MyApp).appComponent.inject(this)
    }
}
```

### Scope

```kotlin
@Singleton  // 항상 같은 인스턴스
@Provides
fun provideDatabase(): AppDatabase { }

@Reusable  // 재사용하지만 싱글톤은 아님
@Provides
fun provideHelper(): Helper { }

// 커스텀 스코프
@Scope
@Retention(AnnotationRetention.RUNTIME)
annotation class ActivityScope
```

### Qualifier

같은 타입의 다른 인스턴스 구분:

```kotlin
@Qualifier
@Retention(AnnotationRetention.RUNTIME)
annotation class AuthInterceptor

@Qualifier
@Retention(AnnotationRetention.RUNTIME)
annotation class LoggingInterceptor

@Module
class NetworkModule {
    @Provides
    @AuthInterceptor
    fun provideAuthInterceptor(): Interceptor = AuthInterceptor()

    @Provides
    @LoggingInterceptor
    fun provideLoggingInterceptor(): Interceptor = HttpLoggingInterceptor()
}
```

## Koin

Koin은 Kotlin을 위한 경량 DI 프레임워크입니다.

### 장점

- 간단한 DSL
- 빠른 학습 곡선
- 코드 생성 없음 (리플렉션 사용)

### 의존성 추가

```kotlin
dependencies {
    implementation("io.insert-koin:koin-android:3.5.0")
}
```

### 모듈 정의

```kotlin
val appModule = module {
    single { ApiService.create() }
    single { AppDatabase.getInstance(get()) }
    single { UserRepository(get(), get()) }
    viewModel { UserViewModel(get()) }
}
```

### 초기화

```kotlin
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            androidContext(this@MyApp)
            modules(appModule)
        }
    }
}
```

### 사용

```kotlin
class MainActivity : AppCompatActivity() {
    // ViewModel 주입
    private val viewModel: UserViewModel by viewModel()

    // 일반 의존성 주입
    private val repository: UserRepository by inject()
}
```

## Hilt

Hilt는 Dagger 위에 구축된 Android 전용 DI 라이브러리입니다.

### 의존성 추가

```kotlin
// project build.gradle
plugins {
    id("com.google.dagger.hilt.android") version "2.48" apply false
}

// app build.gradle
plugins {
    id("kotlin-kapt")
    id("com.google.dagger.hilt.android")
}

dependencies {
    implementation("com.google.dagger:hilt-android:2.48")
    kapt("com.google.dagger:hilt-compiler:2.48")
}
```

### Application 설정

```kotlin
@HiltAndroidApp
class MyApp : Application()
```

### Activity/Fragment 주입

```kotlin
@AndroidEntryPoint
class MainActivity : AppCompatActivity() {
    @Inject
    lateinit var analytics: Analytics

    private val viewModel: UserViewModel by viewModels()
}

@AndroidEntryPoint
class UserFragment : Fragment() {
    @Inject
    lateinit var repository: UserRepository
}
```

### 모듈 정의

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides
    @Singleton
    fun provideApiService(): ApiService {
        return Retrofit.Builder()
            .baseUrl("https://api.example.com/")
            .build()
            .create(ApiService::class.java)
    }
}

@Module
@InstallIn(ViewModelComponent::class)
object ViewModelModule {
    @Provides
    fun provideUserRepository(api: ApiService): UserRepository {
        return UserRepository(api)
    }
}
```

### ViewModel 주입

```kotlin
@HiltViewModel
class UserViewModel @Inject constructor(
    private val repository: UserRepository
) : ViewModel() {
    // ...
}
```

### Hilt 컴포넌트

| 컴포넌트 | 스코프 | 생성 시점 |
|---------|-------|----------|
| SingletonComponent | @Singleton | Application#onCreate() |
| ActivityComponent | @ActivityScoped | Activity#onCreate() |
| ViewModelComponent | @ViewModelScoped | ViewModel 생성 |
| FragmentComponent | @FragmentScoped | Fragment#onAttach() |

## 비교

| 특징 | Dagger2 | Koin | Hilt |
|-----|---------|------|------|
| 학습 곡선 | 높음 | 낮음 | 중간 |
| 성능 | 빠름 (컴파일 타임) | 느림 (런타임 리플렉션) | 빠름 |
| Android 통합 | 수동 | 쉬움 | 자동 |
| 에러 발견 | 컴파일 타임 | 런타임 | 컴파일 타임 |
| 코드량 | 많음 | 적음 | 중간 |

## 결론

- **소규모 프로젝트**: Koin (간단하고 빠른 설정)
- **대규모 프로젝트**: Hilt (컴파일 타임 검증, Android 최적화)
- **기존 Dagger 사용 프로젝트**: Hilt로 마이그레이션 고려

의존성 주입을 통해 테스트 가능하고 유지보수하기 쉬운 코드를 작성하세요.
