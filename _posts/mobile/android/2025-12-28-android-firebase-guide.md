---
layout: post
title: "Android Firebase 통합 가이드"
date: 2025-12-28 12:07:00 +0900
categories: [mobile, android]
tags: [android, firebase, fcm, analytics, deeplink]
description: "Android 앱에서 Firebase를 활용하는 방법을 알아봅니다. FCM 푸시, Analytics, Dynamic Links 등을 다룹니다."
---

# Android Firebase 통합 가이드

Firebase는 Android 앱 개발에 필수적인 다양한 서비스를 제공합니다.

## Firebase 초기 설정

### 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com)에서 프로젝트 생성
2. Android 앱 추가 (패키지명 등록)
3. `google-services.json` 다운로드하여 app 모듈에 추가

### Gradle 설정

```kotlin
// project build.gradle
plugins {
    id("com.google.gms.google-services") version "4.4.0" apply false
}

// app build.gradle
plugins {
    id("com.google.gms.google-services")
}

dependencies {
    implementation(platform("com.google.firebase:firebase-bom:32.7.0"))
    implementation("com.google.firebase:firebase-analytics-ktx")
}
```

## FCM (Firebase Cloud Messaging)

### 의존성 추가

```kotlin
implementation("com.google.firebase:firebase-messaging-ktx")
```

### FirebaseMessagingService 구현

```kotlin
class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        // 서버에 토큰 등록
        sendTokenToServer(token)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        // 알림 데이터 처리
        remoteMessage.notification?.let { notification ->
            showNotification(notification.title, notification.body)
        }

        // 데이터 페이로드 처리
        remoteMessage.data.let { data ->
            handleData(data)
        }
    }

    private fun showNotification(title: String?, body: String?) {
        val channelId = "default_channel"
        val notificationBuilder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)

        val notificationManager = getSystemService(NotificationManager::class.java)

        // Android 8.0+ 채널 생성
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Default Channel",
                NotificationManager.IMPORTANCE_HIGH
            )
            notificationManager.createNotificationChannel(channel)
        }

        notificationManager.notify(0, notificationBuilder.build())
    }
}
```

### Manifest 등록

```xml
<service
    android:name=".MyFirebaseMessagingService"
    android:exported="false">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
</service>
```

### 토큰 가져오기

```kotlin
FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
    if (task.isSuccessful) {
        val token = task.result
        // 서버에 토큰 전송
    }
}
```

### 토픽 구독

```kotlin
FirebaseMessaging.getInstance().subscribeToTopic("news")
    .addOnCompleteListener { task ->
        if (task.isSuccessful) {
            Log.d(TAG, "Subscribed to news topic")
        }
    }
```

## Firebase Analytics

### 이벤트 로깅

```kotlin
val firebaseAnalytics = Firebase.analytics

// 표준 이벤트
firebaseAnalytics.logEvent(FirebaseAnalytics.Event.SELECT_ITEM) {
    param(FirebaseAnalytics.Param.ITEM_ID, "item_123")
    param(FirebaseAnalytics.Param.ITEM_NAME, "Product Name")
}

// 커스텀 이벤트
firebaseAnalytics.logEvent("share_image") {
    param("image_name", "sunset.jpg")
    param("full_text", "Beautiful sunset")
}
```

### 사용자 속성 설정

```kotlin
firebaseAnalytics.setUserProperty("favorite_category", "electronics")
```

### 화면 추적

```kotlin
firebaseAnalytics.logEvent(FirebaseAnalytics.Event.SCREEN_VIEW) {
    param(FirebaseAnalytics.Param.SCREEN_NAME, "HomeScreen")
    param(FirebaseAnalytics.Param.SCREEN_CLASS, "MainActivity")
}
```

## Firebase Dynamic Links

### 딥링크 설정

```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data
        android:host="example.page.link"
        android:scheme="https" />
</intent-filter>
```

### 딥링크 처리

```kotlin
Firebase.dynamicLinks
    .getDynamicLink(intent)
    .addOnSuccessListener { pendingDynamicLinkData ->
        val deepLink = pendingDynamicLinkData?.link

        deepLink?.let { uri ->
            // 딥링크 처리
            handleDeepLink(uri)
        }
    }
    .addOnFailureListener { e ->
        Log.e(TAG, "getDynamicLink:onFailure", e)
    }
```

### 동적 링크 생성

```kotlin
val dynamicLink = Firebase.dynamicLinks.dynamicLink {
    link = Uri.parse("https://www.example.com/post/123")
    domainUriPrefix = "https://example.page.link"
    androidParameters("com.example.app") {
        minimumVersion = 125
    }
    socialMetaTagParameters {
        title = "Check this out!"
        description = "Interesting content"
        imageUrl = Uri.parse("https://example.com/image.jpg")
    }
}

val dynamicLinkUri = dynamicLink.uri
```

### 단축 링크 생성

```kotlin
Firebase.dynamicLinks.shortLinkAsync {
    link = Uri.parse("https://www.example.com/post/123")
    domainUriPrefix = "https://example.page.link"
    androidParameters("com.example.app") { }
}.addOnSuccessListener { result ->
    val shortLink = result.shortLink
    val flowchartLink = result.previewLink
}
```

## Firebase Crashlytics

### 초기화

```kotlin
// 자동으로 비정상 종료 리포트
// 수동으로 비치명적 오류 기록:
Firebase.crashlytics.recordException(exception)

// 커스텀 키 추가
Firebase.crashlytics.setCustomKey("user_id", "123")

// 커스텀 로그
Firebase.crashlytics.log("User clicked checkout button")
```

### 사용자 식별

```kotlin
Firebase.crashlytics.setUserId("user_123")
```

## Firebase Remote Config

### 기본값 설정

```kotlin
val remoteConfig = Firebase.remoteConfig
val configSettings = remoteConfigSettings {
    minimumFetchIntervalInSeconds = 3600
}
remoteConfig.setConfigSettingsAsync(configSettings)
remoteConfig.setDefaultsAsync(R.xml.remote_config_defaults)
```

### 값 가져오기

```kotlin
remoteConfig.fetchAndActivate()
    .addOnCompleteListener { task ->
        if (task.isSuccessful) {
            val welcomeMessage = remoteConfig.getString("welcome_message")
            val buttonColor = remoteConfig.getLong("button_color")
        }
    }
```

## 배터리 및 네트워크 고려사항

Firebase SDK는 배터리와 네트워크를 효율적으로 사용하도록 설계되어 있지만, 다음 사항을 고려하세요:

1. **Analytics 배치 처리**: 이벤트는 자동으로 배치 처리됨
2. **FCM 토큰**: 자주 변경되지 않으므로 캐싱 권장
3. **Remote Config**: fetch interval을 적절히 설정

## 결론

Firebase는 Android 앱 개발에 필수적인 인프라를 제공합니다. FCM으로 사용자 참여를 높이고, Analytics로 사용자 행동을 분석하며, Crashlytics로 앱 안정성을 모니터링하세요.
