---
layout: post
title: "Android 화면 크기와 리소스 관리"
date: 2025-12-28 12:11:00 +0900
categories: [mobile, android]
tags: [android, screen, resources, dpi, responsive]
description: "Android 다양한 화면 크기 지원 방법을 알아봅니다. 밀도별 리소스, dimens, 반응형 레이아웃 등을 다룹니다."
---

# Android 화면 크기와 리소스 관리

다양한 Android 기기에서 일관된 UI를 제공하는 방법을 알아봅니다.

## 화면 크기 분류

### Screen Size

대각선 크기 기준:

- **small**: 최소 426dp x 320dp
- **normal**: 최소 470dp x 320dp
- **large**: 최소 640dp x 480dp
- **xlarge**: 최소 960dp x 720dp

### Screen Density (DPI)

| Density | DPI | 배율 |
|---------|-----|------|
| ldpi | ~120 | 0.75x |
| mdpi | ~160 | 1.0x (기준) |
| hdpi | ~240 | 1.5x |
| xhdpi | ~320 | 2.0x |
| xxhdpi | ~480 | 3.0x |
| xxxhdpi | ~640 | 4.0x |

### DP 계산

```
px = dp * (dpi / 160)
```

예: 160dpi에서 1dp = 1px

## 밀도별 이미지 크기

아이콘 예시 (기준 48dp):

| Density | 크기 |
|---------|------|
| ldpi | 36x36px |
| mdpi | 48x48px (기준) |
| hdpi | 72x72px |
| xhdpi | 96x96px |
| xxhdpi | 144x144px |
| xxxhdpi | 192x192px |

## 리소스 한정자

### Smallest Width (sw)

화면의 가장 작은 쪽 기준:

```
res/values-sw320dp/     # 작은 화면
res/values-sw600dp/     # 7인치 태블릿
res/values-sw720dp/     # 10인치 태블릿
```

### Available Width/Height

```
res/values-w720dp/      # 최소 너비 720dp
res/values-h1024dp/     # 최소 높이 1024dp
```

### 방향

```
res/layout-land/        # 가로 모드
res/layout-port/        # 세로 모드
```

### Density

```
res/drawable-ldpi/
res/drawable-mdpi/
res/drawable-hdpi/
res/drawable-xhdpi/
res/drawable-xxhdpi/
res/drawable-xxxhdpi/
res/drawable-nodpi/     # 스케일링 안 함
res/drawable-anydpi/    # 모든 밀도
```

## 반응형 레이아웃 전략

### 권장 접근법

1. **기기 분류**: 태블릿 vs 폰
2. **화면 그룹**: 320dp, 480dp, 600dp, 720dp
3. **그룹별 UI**: 각 그룹에 필요한 레이아웃 정의
4. **상대적 크기**: 고정 dp보다 비율 사용

### ConstraintLayout 퍼센트 사용

```xml
<View
    android:layout_width="0dp"
    android:layout_height="0dp"
    app:layout_constraintWidth_percent="0.5"
    app:layout_constraintHeight_percent="0.3" />
```

### 퍼센트의 장단점

**장점:**
- 모든 화면에 같은 비율 적용

**단점:**
- Drawable이 깨질 수 있음
- 큰 이미지만 사용 시 메모리 증가

## Dimension 리소스

### sw별 dimens 정의

```xml
<!-- res/values/dimens.xml -->
<dimen name="text_large">18sp</dimen>
<dimen name="margin_default">16dp</dimen>

<!-- res/values-sw600dp/dimens.xml -->
<dimen name="text_large">22sp</dimen>
<dimen name="margin_default">24dp</dimen>
```

### 코드에서 dp 값 가져오기

```kotlin
val marginPx = resources.getDimension(R.dimen.margin_default)
val marginDp = resources.getDimensionPixelSize(R.dimen.margin_default)
```

## Array 리소스

### Color/Drawable Array

```xml
<integer-array name="theme_colors">
    <item>@color/red</item>
    <item>@color/blue</item>
    <item>@color/green</item>
</integer-array>
```

```kotlin
val colors = resources.getIntArray(R.array.theme_colors)
val typedArray = resources.obtainTypedArray(R.array.theme_colors)
val drawable = typedArray.getDrawable(0)
typedArray.recycle()  // 반드시 recycle
```

## String 리소스

### 복수형 (Plural)

```xml
<plurals name="items_count">
    <item quantity="one">%d item</item>
    <item quantity="other">%d items</item>
</plurals>
```

```kotlin
val text = resources.getQuantityString(R.plurals.items_count, count, count)
```

### 엔티티 정의

```xml
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE resources [
    <!ENTITY appname "My App">
]>
<resources>
    <string name="app_name">&appname;</string>
    <string name="welcome">Welcome to &appname;</string>
</resources>
```

## mipmap vs drawable

### mipmap

- 런처 아이콘 전용
- 리소스 최적화 시에도 유지됨
- 홈 화면에서 더 높은 밀도 아이콘 사용 가능

```
res/mipmap-mdpi/ic_launcher.png
res/mipmap-hdpi/ic_launcher.png
res/mipmap-xhdpi/ic_launcher.png
...
```

### drawable

- 앱 내 이미지
- 빌드 최적화 시 불필요한 밀도 제거됨

## 체크포인트

1. **작은 화면 지원**: 최소 화면에서 사용 가능한지
2. **큰 화면 최적화**: 태블릿에서 공간 활용
3. **가로/세로 모드**: 두 방향 모두 지원

## 화면 정보 얻기

```kotlin
val displayMetrics = resources.displayMetrics
val widthPx = displayMetrics.widthPixels
val heightPx = displayMetrics.heightPixels
val density = displayMetrics.density
val densityDpi = displayMetrics.densityDpi

val widthDp = widthPx / density
val heightDp = heightPx / density
```

## Configuration 확인

```kotlin
val config = resources.configuration
val screenLayout = config.screenLayout and Configuration.SCREENLAYOUT_SIZE_MASK

when (screenLayout) {
    Configuration.SCREENLAYOUT_SIZE_SMALL -> "Small"
    Configuration.SCREENLAYOUT_SIZE_NORMAL -> "Normal"
    Configuration.SCREENLAYOUT_SIZE_LARGE -> "Large"
    Configuration.SCREENLAYOUT_SIZE_XLARGE -> "XLarge"
    else -> "Unknown"
}
```

## 결론

다양한 화면 크기를 지원하려면 밀도별 이미지 제공, sw 한정자를 통한 레이아웃/dimension 분기, 비율 기반 레이아웃을 적절히 조합하세요. ConstraintLayout과 dp 단위를 활용하면 대부분의 화면에서 일관된 UI를 제공할 수 있습니다.
