---
layout: post
title: "Android 앱 최적화 가이드"
date: 2025-12-28 12:04:00 +0900
categories: android
tags: [android, optimization, performance, memory, apk-size]
description: "Android 앱의 성능, 메모리, APK 크기 최적화 방법을 알아봅니다. 메모리 누수 방지, ProGuard 설정, 빌드 최적화 등을 다룹니다."
---

# Android 앱 최적화 가이드

Android 앱의 성능을 최적화하는 다양한 방법을 알아봅니다.

## 성능 최적화

### StrictMode 사용

개발 중 성능 문제를 감지하는 데 유용합니다.

```kotlin
class MyApplication : Application() {
    override fun onCreate() {
        if (BuildConfig.DEBUG) {
            StrictMode.setThreadPolicy(
                StrictMode.ThreadPolicy.Builder()
                    .detectAll()
                    .penaltyLog()
                    .build()
            )

            StrictMode.setVmPolicy(
                StrictMode.VmPolicy.Builder()
                    .detectLeakedSqlLiteObjects()
                    .detectLeakedClosableObjects()
                    .penaltyLog()
                    .penaltyDeath()
                    .build()
            )
        }
        super.onCreate()
    }
}
```

### 반응성 체크

- StrictMode로 메인 스레드 딜레이 감지
- ANR(Application Not Responding) 방지

### 배터리 최적화

- 연결/해제 작업은 리소스를 많이 소모함 (파일, 네트워크 등)
- 가능하면 작업을 묶어서 처리

## 메모리 누수 방지

### 일반적인 메모리 누수 원인

1. **애니메이션 미해제**
   - `onDestroy()`에서 애니메이션 cancel 필수

   ```kotlin
   override fun onDestroy() {
       super.onDestroy()
       animation?.cancel()
   }
   ```

2. **Observer 미해제**
   - `ViewTreeObserver`, `ScrollListener` 등 반드시 remove

   ```kotlin
   override fun onDestroyView() {
       super.onDestroyView()
       view.viewTreeObserver.removeOnScrollChangedListener(listener)
   }
   ```

3. **Handler와 postDelayed**
   - delay 동안 메모리가 반환되지 않음

   ```kotlin
   override fun onDestroy() {
       super.onDestroy()
       handler.removeCallbacksAndMessages(null)
   }
   ```

### static 내부 클래스 사용

외부 클래스를 참조하지 않는 내부 클래스는 static으로 선언합니다.

```kotlin
// Bad - 외부 Activity를 암묵적으로 참조
inner class MyRunnable : Runnable {
    override fun run() { }
}

// Good - Activity 참조 없음
class MyRunnable : Runnable {
    override fun run() { }
}
```

### Context 누수 방지

```kotlin
// Bad - Activity context를 장기 보관
class MySingleton(val context: Context)

// Good - Application context 사용
class MySingleton(context: Context) {
    val appContext = context.applicationContext
}
```

### Drawable 참조 누수

Drawable은 뷰에 추가될 때 해당 뷰를 콜백으로 등록합니다.

```kotlin
override fun onDestroy() {
    super.onDestroy()
    imageView.setImageDrawable(null)
}
```

### 메모리 분석 도구

- **LeakCanary**: 메모리 누수 자동 감지
- **Memory Profiler**: Android Studio 내장 도구
- **MAT (Memory Analyzer Tool)**: 상세 분석용

```bash
adb shell dumpsys meminfo <package_name>
```

### Object Size

- **Shallow Size**: 객체 자체의 크기
- **Retained Size**: 객체가 참조하는 모든 객체 크기 포함

## APK 크기 최적화

### 라이브러리 분석

```
http://www.methodscount.com/
```

Android Studio에서 APK 파일을 드래그하면 상세 분석을 볼 수 있습니다.

### ProGuard/R8 설정

```kotlin
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### 리소스 최적화

```kotlin
android {
    defaultConfig {
        // 특정 언어만 포함
        resConfigs "en", "ko"
    }
}
```

### 미사용 리소스 제거

```kotlin
buildTypes {
    release {
        shrinkResources true
    }
}
```

동적으로 사용하는 리소스는 keep 설정 필요:

```xml
<!-- res/raw/keep.xml -->
<resources xmlns:tools="http://schemas.android.com/tools"
    tools:shrinkMode="strict"
    tools:keep="@layout/used_*,@drawable/icon_*" />
```

### 이미지 최적화

- **WebP 형식 사용**: PNG보다 작은 용량
- **Tiny PNG**: 손실 압축으로 품질 유지하며 용량 감소
- **Vector Drawable**: 해상도 독립적인 아이콘

### Multidex

64K 메서드 제한 초과 시:

```kotlin
android {
    defaultConfig {
        multiDexEnabled true
    }
}
```

ProGuard로 미사용 코드 제거가 더 효과적입니다.

## 네트워크 최적화

### 네트워크 사용량 측정

```kotlin
TrafficStats.getUidTxBytes(uid)
TrafficStats.getUidRxBytes(uid)
```

### 캐싱 전략

- HTTP 캐시 헤더 활용
- 로컬 데이터베이스에 응답 캐싱
- OkHttp 캐시 설정

```kotlin
val cache = Cache(cacheDirectory, 10 * 1024 * 1024) // 10MB
val client = OkHttpClient.Builder()
    .cache(cache)
    .build()
```

## 빌드 시간 최적화

### gradle.properties 설정

```properties
org.gradle.jvmargs=-Xmx4096m
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.daemon=true

# Kotlin 증분 컴파일
kotlin.incremental=true
kapt.incremental.apt=true
```

### Android Studio 설정

1. Only sync the active variant 활성화
2. 오프라인 모드 사용 (의존성 변경 없을 때)

```bash
./gradlew assembleDebug --offline
```

## GPU 렌더링 프로파일

개발자 옵션에서 "GPU 렌더링 프로파일"을 활성화하여 프레임 렌더링 시간을 모니터링합니다.

## ANR 방지

### ANR 발생 조건

- Input 이벤트 5초 이상 응답 없음
- BroadcastReceiver 10초 이상 처리

### 해결 방법

- 무거운 작업은 백그라운드 스레드에서 처리
- 네트워크, DB 작업은 코루틴 또는 RxJava 사용

```kotlin
lifecycleScope.launch(Dispatchers.IO) {
    val result = heavyOperation()
    withContext(Dispatchers.Main) {
        updateUI(result)
    }
}
```

## 결론

앱 최적화는 지속적인 과정입니다. 개발 단계에서 StrictMode를 활용하고, 메모리 누수를 방지하며, ProGuard로 APK 크기를 줄이세요. 정기적으로 프로파일링 도구를 사용하여 성능 저하 요인을 찾아 개선하는 것이 중요합니다.
