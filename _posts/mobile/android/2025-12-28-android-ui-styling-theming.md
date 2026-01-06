---
layout: post
title: "Android UI 스타일링과 테마 가이드"
date: 2025-12-28 12:10:00 +0900
categories: [mobile, android]
tags: [android, theme, style, material-design, ui]
description: "Android 앱의 스타일과 테마 적용 방법을 알아봅니다. Material Design, 커스텀 스타일, Shape, Ripple 효과 등을 다룹니다."
image: /assets/images/posts/thumbnails/2025-12-28-android-ui-styling-theming.png
---

# Android UI 스타일링과 테마 가이드

Android 앱의 일관된 디자인을 위한 스타일과 테마 적용 방법을 알아봅니다.

## Theme

### 테마 적용 전략

1. `Theme.AppCompat` 기반 테마 선택
2. 팝업, 액션바 등에는 `ThemeOverlay.AppCompat` 사용
3. 앱 디자인에 맞춰 주요 색상 속성 설정

### 주요 색상 속성

```xml
<style name="AppTheme" parent="Theme.MaterialComponents.DayNight.NoActionBar">
    <item name="colorPrimary">@color/primary</item>
    <item name="colorPrimaryDark">@color/primary_dark</item>
    <item name="colorPrimaryVariant">@color/primary_variant</item>
    <item name="colorSecondary">@color/secondary</item>
    <item name="colorAccent">@color/accent</item>
    <item name="android:colorBackground">@color/background</item>
</style>
```

### Window 속성

```xml
<style name="AppTheme" parent="Theme.MaterialComponents.DayNight.NoActionBar">
    <!-- 타이틀바 없음 -->
    <item name="android:windowNoTitle">true</item>

    <!-- 상태바 색상 -->
    <item name="android:statusBarColor">@color/primary_dark</item>

    <!-- 시스템 바 영역까지 확장 -->
    <item name="android:windowDrawsSystemBarBackgrounds">true</item>
</style>
```

### 테마 오버레이

뷰 레벨에서 테마 적용:

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:theme="@style/ThemeOverlay.MaterialComponents.Dark">

    <!-- 하위 뷰들은 다크 테마 적용 -->
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Dark Theme Text" />

</LinearLayout>
```

### 코드에서 테마 적용

```kotlin
// ContextThemeWrapper 사용
val wrapper = ContextThemeWrapper(context, R.style.MyPopupTheme)
val popupMenu = PopupMenu(wrapper, anchorView)

// Dialog에 테마 적용
AlertDialog.Builder(context, R.style.Theme_MaterialComponents_Dialog)
    .setTitle("Title")
    .show()

// Inflater에 테마 적용
val themedContext = ContextThemeWrapper(context, R.style.MyTheme)
val inflater = LayoutInflater.from(themedContext)
val view = inflater.inflate(R.layout.my_layout, container, false)
```

## Style

### 스타일 정의

```xml
<style name="MyTextStyle" parent="TextAppearance.MaterialComponents.Body1">
    <item name="android:textColor">@color/text_primary</item>
    <item name="android:textSize">16sp</item>
    <item name="android:fontFamily">@font/roboto</item>
</style>
```

### 스타일 상속

```xml
<!-- 시스템 스타일 상속 (parent 명시) -->
<style name="GreenText" parent="@android:style/TextAppearance">
    <item name="android:textColor">#00FF00</item>
</style>

<!-- 자신의 스타일 상속 (점 표기법) -->
<style name="CodeFont.Red">
    <item name="android:textColor">#FF0000</item>
</style>
```

### 스타일 적용

```xml
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:textAppearance="@style/MyTextStyle" />
```

### 위젯별 스타일

```xml
<!-- ProgressBar -->
<ProgressBar
    style="@android:style/Widget.ProgressBar.Small" />

<!-- Button -->
<Button
    style="@style/Widget.MaterialComponents.Button.OutlinedButton" />
```

## Material Design 텍스트 스타일

```xml
<!-- Headline -->
<TextView
    android:textAppearance="@style/TextAppearance.MaterialComponents.Headline5" />

<!-- Subtitle -->
<TextView
    android:textAppearance="@style/TextAppearance.MaterialComponents.Subtitle1" />

<!-- Body -->
<TextView
    android:textAppearance="@style/TextAppearance.MaterialComponents.Body1" />

<!-- Caption -->
<TextView
    android:textAppearance="@style/TextAppearance.MaterialComponents.Caption" />
```

## Button 스타일

```xml
<!-- Filled Button -->
<Button
    style="@style/Widget.MaterialComponents.Button" />

<!-- Outlined Button -->
<Button
    style="@style/Widget.MaterialComponents.Button.OutlinedButton" />

<!-- Text Button -->
<Button
    style="@style/Widget.MaterialComponents.Button.TextButton" />
```

## Shape Drawable

### 기본 Shape

```xml
<!-- res/drawable/rounded_background.xml -->
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="@color/background" />
    <corners android:radius="8dp" />
    <stroke
        android:width="1dp"
        android:color="@color/border" />
</shape>
```

### 원형 Shape

```xml
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="oval">
    <solid android:color="@color/accent" />
</shape>
```

### Inset (마진 적용)

```xml
<inset xmlns:android="http://schemas.android.com/apk/res/android"
    android:insetLeft="72dp">
    <shape android:shape="rectangle">
        <solid android:color="#1e000000" />
    </shape>
</inset>
```

## Ripple 효과

### 기본 Ripple

```xml
<!-- 기본 ripple -->
android:background="?android:attr/selectableItemBackground"

<!-- 원형 ripple (경계 없음) -->
android:background="?attr/selectableItemBackgroundBorderless"
```

### 커스텀 Ripple

```xml
<!-- res/drawable/ripple_rounded.xml -->
<ripple xmlns:android="http://schemas.android.com/apk/res/android"
    android:color="?android:attr/colorControlHighlight">
    <item android:id="@android:id/mask">
        <shape android:shape="rectangle">
            <solid android:color="#000000" />
            <corners android:radius="8dp" />
        </shape>
    </item>
    <item>
        <shape android:shape="rectangle">
            <solid android:color="@color/button_background" />
            <corners android:radius="8dp" />
        </shape>
    </item>
</ripple>
```

### Foreground Ripple

FrameLayout에서 foreground로 ripple 적용:

```xml
<FrameLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:clickable="true"
    android:focusable="true"
    android:foreground="?android:attr/selectableItemBackground">
    <!-- 내용 -->
</FrameLayout>
```

## Shadow (Elevation)

```xml
<CardView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:elevation="4dp"
    android:translationZ="2dp" />
```

그림자가 안 보이면:
- 뷰에 배경색 설정
- 부모의 `clipChildren="false"` 설정
- `clipToPadding="false"` 설정

## Vector Drawable

```xml
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="@color/icon"
        android:pathData="M12,2L2,12h3v8h14v-8h3L12,2z" />
</vector>
```

### Path 명령어

- `M` / `m`: 이동 (Move)
- `L` / `l`: 직선 (Line to)
- `H` / `h`: 수평선 (Horizontal line)
- `V` / `v`: 수직선 (Vertical line)
- `Z` / `z`: 경로 닫기

대문자는 절대 좌표, 소문자는 상대 좌표입니다.

## Color Selector

```xml
<!-- res/color/button_text_color.xml -->
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_pressed="true"
        android:color="@color/text_pressed" />
    <item android:state_enabled="false"
        android:color="@color/text_disabled" />
    <item android:color="@color/text_normal" />
</selector>
```

## Font

### 커스텀 폰트 적용

```xml
<!-- res/font/roboto.xml -->
<font-family xmlns:android="http://schemas.android.com/apk/res/android">
    <font
        android:fontStyle="normal"
        android:fontWeight="400"
        android:font="@font/roboto_regular" />
    <font
        android:fontStyle="normal"
        android:fontWeight="700"
        android:font="@font/roboto_bold" />
</font-family>
```

```xml
<TextView
    android:fontFamily="@font/roboto" />
```

## 결론

일관된 스타일과 테마는 앱의 품질을 높입니다. Material Design 가이드라인을 따르고, 공통 스타일을 정의하여 코드 중복을 줄이세요. Shape, Ripple, Vector Drawable을 활용하면 해상도에 독립적인 UI를 만들 수 있습니다.
