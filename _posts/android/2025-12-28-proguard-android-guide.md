---
layout: post
title: "ProGuard Android Guide - Code Shrinking and Obfuscation"
date: 2025-12-28
categories: android
tags: [proguard, android, obfuscation, optimization, security]
---

Android ProGuard 설정과 문제 해결 방법을 알아봅니다.

## ProGuard 용어

- **Shrinking**: 안 쓰는 메서드, 클래스, 필드 등 제거
- **Optimizing**: 메서드 바이트코드 최적화, inline
- **Obfuscating**: 이름을 의미없는 짧은 문자열로 변경 (난독화)
- **Preverifying**: 클래스에 pre verification info 추가

## Keep 규칙

### @Keep 어노테이션

빌드 시 minify에서 제외되어야 하는 클래스나 메서드에 사용합니다. 리플렉션으로 접근하는 경우에 필요합니다.

### Keep 규칙 종류

#### -keep

클래스와 멤버를 유지합니다.

```proguard
# 클래스만 keep (멤버는 keep 안 됨)
-keep class com.example.app.data.Task

# 클래스와 모든 멤버 keep
-keep class com.google.ads.mediation.AdUrlAdapter {
    *;
}

# 클래스와 특정 메서드만 keep
-keep class com.example.app.data.Tasks {
    public ** component1();
}

# 내부 serializer 클래스 유지
-keep,includedescriptorclasses class **$$serializer { *; }
```

#### -keepclassmembers

멤버만 유지합니다 (클래스를 안 쓰면 삭제됨).

```proguard
-keepclassmembers class * implements android.os.Parcelable {
    static ** CREATOR;
}
```

#### -keepclassmembernames

클래스 내의 멤버들의 이름만 유지합니다. 해당 멤버를 사용하지 않으면 삭제됩니다.

```proguard
# Network Value Object 공통 처리
-keepclassmembernames public class * extends com.example.base.net.BaseValueObject {
    private <fields>;
}
```

#### -keepclasseswithmembers

조건을 충족하는 멤버가 있는 경우에 클래스와 멤버를 유지합니다.

```proguard
-keepclasseswithmembers class <com.your.package>.** {
    public ** component1();
    <fields>;
}
```

### 어노테이션으로 Keep

```proguard
-keep @android.support.annotation.Keep class *

-keepclasseswithmembers class * {
    @retrofit.http.* <methods>;
}
```

### 필드 Keep

```proguard
-keepclassmembernames public class * extends com.example.base.net.BaseValueObject {
    private <fields>;
}

-keepclassmembernames class * implements com.example.log.Log {
    <fields>;
}
```

### Any Type

`***`는 any type인 경우 사용합니다.

```proguard
public static *** parse(***);
```

## 3rd Party 라이브러리

3rd 파티 라이브러리를 사용할 때, 해당 라이브러리에서 API 호출하는 경우 Request/Response 클래스를 반드시 keep 해야 합니다.

```proguard
-keepclassmembernames class com.example.sdk.** { *; }
```

`-keep`을 쓰면 dex 에러가 발생할 수 있습니다. 이 경우 개별 클래스를 수동으로 keep해야 합니다.

```proguard
-keep class com.example.sdk.Models.AllowedCredentials
-keepclassmembers class com.example.sdk.Models.AllowedCredentials { *; }
```

## 에러 해결

### can't find referenced class

APK 빌드 시 referenced class가 없다는 오류입니다.

**원인**:
- 라이브러리가 참조하는 클래스가 라이브러리에 포함되지 않음
- implement로 의존성을 추가했지만 해당 클래스가 없음 (api로 하면 포함됨)

**해결**:
- ProGuard 적용 안 했을 때 문제없다면 런타임에 해당 클래스가 사용되지 않는 것
- `-dontwarn` 사용

```proguard
-dontwarn com.example.unused.class.**
```

### ClassNotFoundException (Enum)

Enum 클래스의 경우 클래스 이름도 keep 해야 합니다.

```
java.lang.ClassNotFoundException: Didn't find class "com.example.base.e.HasType"
```

### 상속 클래스 Keep

난독화되는 클래스를 상속하는 클래스를 난독화 방지할 경우, 부모 클래스도 keep해야 합니다.

```proguard
-keep class com.example.base.mvp.BaseModel
-keepclassmembers class * extends com.example.base.mvp.BaseModel { *; }
```

### Retrofit Jackson + KotlinModule 크래시

```
Caused by: java.lang.IllegalStateException: No BuiltInsLoader implementation was found.
```

해결:
```proguard
-keep class kotlin.reflect.jvm.internal.** { *; }
```

### Unable to create converter

```
java.lang.IllegalArgumentException: Unable to create converter for class
```

부모 클래스의 keep이 누락된 경우 발생합니다.

## implement vs api

- **implement**: 해당 라이브러리를 내부에 보관하지 않음
- **api**: 해당 라이브러리를 보관함

라이브러리가 참조하는 클래스가 필요한 경우 `api`를 사용해야 합니다.

## 참고 자료

- [ProGuard Manual](https://www.guardsquare.com/en/products/proguard/manual/usage#keep)
- [Retrofit ProGuard Rules](https://github.com/square/retrofit)
- [Stack Overflow: keep vs keepclassmembers](https://stackoverflow.com/questions/46855454/proguard-rules-keep-vs-keepclassmembers-vs-keepclasseswithmembers)
