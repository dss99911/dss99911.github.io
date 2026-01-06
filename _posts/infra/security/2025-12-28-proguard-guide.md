---
layout: post
title: "ProGuard 완벽 가이드 - Android 코드 난독화와 최적화"
date: 2025-12-28 12:04:00 +0900
categories: [infra, security]
tags: [security, proguard, android, obfuscation, r8, code-shrinking]
description: "Android 앱의 코드 난독화와 최적화를 위한 ProGuard 설정 방법, keep 규칙, 그리고 일반적인 에러 해결 방법을 상세히 설명합니다."
image: /assets/images/posts/thumbnails/2025-12-28-proguard-guide.png
---

# ProGuard 완벽 가이드

ProGuard는 Android 앱의 코드를 난독화하고 최적화하는 도구입니다. 이 글에서는 ProGuard의 개념, 설정 방법, 그리고 자주 발생하는 문제들의 해결 방법을 다룹니다.

## ProGuard 기본 용어

ProGuard는 다음 네 가지 주요 기능을 제공합니다:

| 기능 | 설명 |
|------|------|
| **Shrinking** | 사용하지 않는 클래스, 메서드, 필드 제거 |
| **Optimizing** | 바이트코드 최적화, 메서드 인라이닝 |
| **Obfuscating** | 클래스/메서드/필드 이름을 의미 없는 짧은 문자열로 변경 |
| **Preverifying** | 클래스에 preverification 정보 추가 |

---

## @Keep 어노테이션

`@Keep` 어노테이션은 해당 클래스나 메서드가 난독화 또는 제거되지 않도록 보호합니다. 주로 리플렉션을 통해 접근하는 코드에 사용합니다.

```kotlin
@Keep
class MyClass {
    @Keep
    fun myMethod() {
        // 이 메서드는 난독화되지 않음
    }
}
```

---

## Keep 규칙 상세 가이드

### keep vs keepclassmembers vs keepclasseswithmembers

세 가지 keep 규칙의 차이점을 이해하는 것이 중요합니다.

#### 1. -keep

클래스와 지정된 멤버를 모두 유지합니다.

```proguard
# 클래스만 keep (멤버는 난독화 가능)
-keep class com.example.MyClass

# 클래스와 모든 멤버 keep
-keep class com.example.MyClass { *; }

# 클래스와 특정 메서드만 keep
-keep class com.example.MyClass {
    public ** component1();
}

# 내부 클래스 중 이름이 serializer인 경우 유지
-keep,includedescriptorclasses class **$$serializer { *; }
```

#### 2. -keepclassmembers

멤버만 유지하고, 클래스 자체가 사용되지 않으면 클래스는 제거될 수 있습니다.

```proguard
# Parcelable의 CREATOR 필드만 유지
-keepclassmembers class * implements android.os.Parcelable {
    static ** CREATOR;
}
```

#### 3. -keepclassmembernames

멤버의 이름만 유지합니다. 해당 멤버가 사용되지 않으면 제거됩니다.

```proguard
# 네트워크 Value Object의 필드 이름 유지
-keepclassmembernames public class * extends com.example.BaseValueObject {
    private <fields>;
}
```

#### 4. -keepclasseswithmembers

조건을 충족하는 멤버가 있는 클래스와 해당 멤버를 유지합니다.

```proguard
# component1 메서드가 있는 클래스 전체 유지
-keepclasseswithmembers class com.example.** {
    public ** component1();
    <fields>;
}

# Retrofit 어노테이션이 있는 메서드를 가진 클래스 유지
-keepclasseswithmembers class * {
    @retrofit.http.* <methods>;
}
```

### 어노테이션 기반 Keep

```proguard
# @Keep 어노테이션이 있는 클래스 유지
-keep @android.support.annotation.Keep class *

# 특정 어노테이션이 있는 메서드를 가진 클래스 유지
-keepclasseswithmembers class * {
    @retrofit.http.* <methods>;
}
```

### 필드 및 와일드카드

```proguard
# 모든 private 필드 유지
-keepclassmembernames public class * extends com.example.BaseModel {
    private <fields>;
}

# 모든 필드 유지
-keepclassmembernames class * implements com.example.Log {
    <fields>;
}

# *** 는 any type을 의미
public static *** parse(***);
```

---

## 3rd Party 라이브러리 처리

외부 라이브러리를 사용할 때는 해당 라이브러리의 API 호출에 사용되는 Request/Response 클래스들을 keep해야 합니다.

### 기본 방법

```proguard
-keepclassmembernames class com.thirdparty.sdk.** { *; }
```

### DEX 에러가 나는 경우

`-keep`을 사용하면 DEX 에러가 발생할 수 있습니다. 이 경우 필요한 클래스만 개별적으로 keep합니다:

```proguard
-keep class com.thirdparty.sdk.Models.AllowedCredentials
-keepclassmembers class com.thirdparty.sdk.Models.AllowedCredentials { *; }
```

---

## 일반적인 에러와 해결 방법

### 1. can't find referenced class

**원인:**
- APK 빌드 시 참조하는 클래스를 찾을 수 없음
- 라이브러리가 참조하는 클래스가 프로젝트에 포함되지 않음

**분석:**
```
Warning: com.example.library.SomeClass: can't find referenced class com.missing.Class
```

**해결 방법:**
1. ProGuard를 적용하지 않았을 때 문제가 없다면, 런타임에 해당 클래스가 사용되지 않는 것
2. 이 경우 `dontwarn` 처리:

```proguard
-dontwarn com.missing.Class
```

**주의:** 특정 케이스에서만 해당 클래스가 사용될 수 있으므로, 충분한 테스트 필요

### 2. Enum 클래스 관련 에러

enum 클래스의 경우 클래스 이름도 keep해야 합니다.

```
java.lang.ClassNotFoundException: Didn't find class "com.example.e.HasType"
```

**해결:**
```proguard
-keep enum com.example.HasType { *; }
```

### 3. 상속 관련 에러

부모 클래스가 난독화된 경우, 자식 클래스에서 문제가 발생할 수 있습니다.

```
java.lang.IllegalArgumentException: Unable to create converter for class UserPropertiesResponse
```

**원인:** 난독화되는 클래스를 상속하는 클래스를 keep하려 할 때, 부모 클래스가 이미 난독화되어 찾을 수 없음

**해결:**
```proguard
# 부모 클래스와 자식 클래스 모두 keep
-keep class com.example.base.BaseModel
-keepclassmembers class * extends com.example.base.BaseModel { *; }
```

### 4. Kotlin Reflection 에러

Retrofit에서 Jackson + KotlinModule을 사용할 때 발생:

```
Caused by: java.lang.IllegalStateException: No BuiltInsLoader implementation was found.
Please ensure that the META-INF/services/ is not stripped from your application
```

**해결:**
```proguard
-keep class kotlin.reflect.jvm.internal.** { *; }
```

---

## 권장 ProGuard 설정 템플릿

```proguard
# 기본 설정
-optimizationpasses 5
-dontusemixedcaseclassnames
-verbose

# Kotlin 관련
-keep class kotlin.** { *; }
-keep class kotlin.Metadata { *; }
-keepclassmembers class kotlin.Metadata {
    public <methods>;
}

# Kotlin Reflection
-keep class kotlin.reflect.jvm.internal.** { *; }

# Serialization
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# Parcelable
-keepclassmembers class * implements android.os.Parcelable {
    static ** CREATOR;
}

# Enum
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Retrofit
-keepattributes RuntimeVisibleAnnotations, RuntimeVisibleParameterAnnotations
-keepclassmembers,allowshrinking,allowobfuscation interface * {
    @retrofit2.http.* <methods>;
}

# Gson/Jackson
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}
```

---

## 디버깅 팁

### 1. Mapping 파일 생성

```proguard
-printmapping mapping.txt
```

### 2. 난독화된 스택트레이스 복원

```bash
retrace.sh -verbose mapping.txt stacktrace.txt
```

### 3. 제거된 코드 확인

```proguard
-printusage unused.txt
```

---

## 참고 자료

- [ProGuard Manual](https://www.guardsquare.com/en/products/proguard/manual/usage#keep)
- [R8 Documentation](https://developer.android.com/studio/build/shrink-code)
- [ProGuard keep vs keepclassmembers](https://stackoverflow.com/questions/46855454/proguard-rules-keep-vs-keepclassmembers-vs-keepclasseswithmembers)
