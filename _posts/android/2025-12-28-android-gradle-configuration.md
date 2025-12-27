---
layout: post
title: "Android Gradle 설정 완벽 가이드"
date: 2025-12-28 12:01:00 +0900
categories: android
tags: [android, gradle, build, flavor, buildTypes]
description: "Android Gradle 빌드 시스템의 핵심 설정들을 알아봅니다. Flavor, BuildTypes, 커스텀 플러그인, 빌드 최적화 등을 다룹니다."
---

# Android Gradle 설정 완벽 가이드

Android 빌드 시스템의 핵심인 Gradle 설정에 대해 상세히 알아봅니다.

## 기본 Android 블록 설정

### defaultConfig

```kotlin
android {
    compileSdkVersion 34

    defaultConfig {
        applicationId "com.example.myapp"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"

        // BuildConfig 필드 추가
        buildConfigField "String", "API_URL", "\"https://api.example.com\""

        // 리소스 값 추가
        resValue "string", "app_name", "MyApp"
    }
}
```

### Build Types

```kotlin
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'

        buildConfigField "boolean", "IS_DEBUG", "false"
    }

    debug {
        applicationIdSuffix ".debug"
        versionNameSuffix "-DEBUG"
        debuggable true

        buildConfigField "boolean", "IS_DEBUG", "true"
    }

    // 스테이징 환경
    staging {
        initWith debug
        applicationIdSuffix ".staging"
        buildConfigField "String", "API_URL", "\"https://staging-api.example.com\""
    }
}
```

## Product Flavors

여러 버전의 앱을 빌드해야 할 때 사용합니다.

```kotlin
flavorDimensions "version", "api"

productFlavors {
    // version dimension
    free {
        dimension "version"
        applicationIdSuffix ".free"
        buildConfigField "boolean", "IS_PREMIUM", "false"
    }

    paid {
        dimension "version"
        buildConfigField "boolean", "IS_PREMIUM", "true"
    }

    // api dimension
    minApi21 {
        dimension "api"
        minSdkVersion 21
        versionNameSuffix "-minApi21"
    }

    minApi24 {
        dimension "api"
        minSdkVersion 24
        versionNameSuffix "-minApi24"
    }
}
```

### Flavor별 소스 디렉토리

```
app/
  src/
    main/         # 공통 코드
    free/         # free flavor 전용
    paid/         # paid flavor 전용
    debug/        # debug build type 전용
    release/      # release build type 전용
```

## Manifest에 빌드 변수 주입

```kotlin
defaultConfig {
    manifestPlaceholders = [
        appLabel: "MyApp",
        appIcon: "@mipmap/ic_launcher"
    ]
}
```

```xml
<application
    android:label="${appLabel}"
    android:icon="${appIcon}">
</application>
```

## 빌드 시간 최적화

### Android Studio 설정

1. **Only sync the active variant**
   - File > Settings > Experimental > Gradle에서 활성화

2. **오프라인 모드**
   - File > Settings > Build, Execution, Deployment > Gradle에서 "Offline work" 체크

3. **명령줄에서 오프라인 빌드**
   ```bash
   ./gradlew assembleDebug --offline
   ```

### Gradle 설정 최적화

```properties
# gradle.properties
org.gradle.jvmargs=-Xmx4096m
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.configureondemand=true

# Kotlin 증분 컴파일
kotlin.incremental=true
```

### 빌드 캐시 활용

```kotlin
// settings.gradle
buildCache {
    local {
        directory = new File(rootDir, 'build-cache')
        removeUnusedEntriesAfterDays = 30
    }
}
```

## 커스텀 Gradle 플러그인

### buildSrc 방식

```kotlin
// buildSrc/src/main/kotlin/MyPlugin.kt
class MyPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.task("myTask") {
            doLast {
                println("Custom task executed!")
            }
        }
    }
}
```

```kotlin
// app/build.gradle.kts
plugins {
    id("my-plugin")
}
```

## 자주 발생하는 에러 해결

### Duplicate class 에러

```kotlin
configurations.all {
    resolutionStrategy {
        force 'com.google.code.gson:gson:2.8.9'
    }
}
```

### APK 서명 설정

```kotlin
android {
    signingConfigs {
        release {
            storeFile file("keystore.jks")
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

## 64bit 지원

Google Play에서는 64bit 지원이 필수입니다.

```kotlin
android {
    defaultConfig {
        ndk {
            abiFilters 'armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64'
        }
    }
}
```

### 64bit 지원 확인

```bash
# APK 분석
./gradlew app:dependencies --configuration releaseRuntimeClasspath
```

## App Bundle

Google Play에서 권장하는 배포 형식입니다.

```bash
# AAB 빌드
./gradlew bundleRelease
```

```kotlin
android {
    bundle {
        language {
            enableSplit = true
        }
        density {
            enableSplit = true
        }
        abi {
            enableSplit = true
        }
    }
}
```

## 결론

Gradle 설정을 잘 이해하고 최적화하면 빌드 시간을 단축하고 다양한 버전의 앱을 효율적으로 관리할 수 있습니다. Product Flavors와 Build Types를 적절히 활용하여 개발, 스테이징, 프로덕션 환경을 분리하세요.
