---
layout: post
title: "Android Data Binding 완벽 가이드"
date: 2025-12-28 12:00:00 +0900
categories: [mobile, android]
tags: [android, databinding, mvvm, kotlin, xml]
description: "Android Data Binding의 기본 사용법부터 고급 기능까지 상세히 알아봅니다. BindingAdapter, Observable, ViewStub 등 다양한 활용법을 다룹니다."
image: /assets/images/posts/thumbnails/2025-12-28-android-data-binding-complete-guide.png
---

# Android Data Binding 완벽 가이드

Android Data Binding은 UI 컴포넌트를 데이터 소스와 선언적으로 바인딩할 수 있게 해주는 라이브러리입니다. 이를 통해 boilerplate 코드를 줄이고 MVVM 패턴을 쉽게 구현할 수 있습니다.

## 기본 설정

### Gradle 설정

```kotlin
android {
    ...
    dataBinding {
        enabled = true
    }
}
```

### 레이아웃 파일 구조

Data Binding을 사용하려면 레이아웃 파일을 `<layout>` 태그로 감싸야 합니다.

```xml
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android">
    <data>
        <variable
            name="user"
            type="com.example.User" />
    </data>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@{user.name}" />
    </LinearLayout>
</layout>
```

## XML에서의 표현식 사용

### 기본 표현식

```xml
<!-- 문자열 연결 -->
android:text="@{String.valueOf(index + 1)}"
android:visibility="@{age > 13 ? View.GONE : View.VISIBLE}"
android:text="@{user.lastName ?? user.firstName}"
```

### Null 처리

```xml
<!-- Null 병합 연산자 -->
android:text="@{user.displayName ?? user.lastName}"

<!-- 조건부 표시 -->
android:visibility="@{user.isAdult ? View.VISIBLE : View.GONE}"
```

### 리소스 참조

```xml
android:padding="@{large? @dimen/largePadding : @dimen/smallPadding}"
android:text="@{@string/nameFormat(firstName, lastName)}"
android:text="@{@plurals/banana(bananaCount)}"
```

### Import 사용

```xml
<data>
    <import type="android.view.View"/>
    <import type="com.example.MyStringUtils"/>
</data>
```

## Listener Binding

### Method Reference

```xml
<Button
    android:onClick="@{handlers::onClickFriend}" />
```

### Lambda Expression

```xml
<Button
    android:onClick="@{() -> presenter.onSaveClick(task)}" />

<!-- 파라미터 전달 -->
<Button
    android:onClick="@{(view) -> presenter.onButtonClick(view, user)}" />
```

## Observable 데이터

### ObservableField 사용

```kotlin
class User {
    val firstName = ObservableField<String>()
    val lastName = ObservableField<String>()
    val age = ObservableInt()
}
```

### LiveData와 함께 사용

```kotlin
class UserViewModel : ViewModel() {
    val userName: LiveData<String> = MutableLiveData()
}
```

```xml
<data>
    <variable
        name="viewModel"
        type="com.example.UserViewModel" />
</data>

<TextView
    android:text="@{viewModel.userName}" />
```

Activity에서 LifecycleOwner 설정이 필요합니다:

```kotlin
binding.lifecycleOwner = this
```

## BindingAdapter

커스텀 속성을 만들어 더 강력한 바인딩을 구현할 수 있습니다.

### 기본 BindingAdapter

```kotlin
@BindingAdapter("imageUrl")
fun loadImage(view: ImageView, url: String?) {
    url?.let {
        Glide.with(view.context)
            .load(it)
            .into(view)
    }
}
```

```xml
<ImageView
    app:imageUrl="@{user.profileImageUrl}" />
```

### 복수 속성 BindingAdapter

```kotlin
@BindingAdapter("imageUrl", "placeholder")
fun loadImageWithPlaceholder(
    view: ImageView,
    url: String?,
    placeholder: Drawable?
) {
    Glide.with(view.context)
        .load(url)
        .placeholder(placeholder)
        .into(view)
}
```

### 기존 속성 오버라이드

```kotlin
@BindingAdapter("android:text")
fun setText(view: TextView, text: String?) {
    // 커스텀 로직 추가
    view.text = text?.uppercase()
}
```

## ViewStub과 Data Binding

ViewStub은 필요할 때만 inflate되는 경량 뷰입니다.

```xml
<ViewStub
    android:id="@+id/stub"
    android:inflatedId="@+id/subTree"
    android:layout="@layout/mySubTree"
    android:layout_width="120dp"
    android:layout_height="40dp" />
```

```kotlin
binding.stub.setOnInflateListener { _, inflated ->
    val stubBinding: MySubTreeBinding = DataBindingUtil.bind(inflated)!!
    stubBinding.user = user
}
binding.stub.inflate()
```

## View Binding과의 차이

View Binding은 Data Binding의 경량 버전으로, 표현식 바인딩 없이 뷰 참조만 제공합니다.

### View Binding 설정

```kotlin
android {
    buildFeatures {
        viewBinding = true
    }
}
```

### 사용 예시

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.textView.text = "Hello"
    }
}
```

## Include 레이아웃에 변수 전달

```xml
<!-- included_layout.xml -->
<layout>
    <data>
        <variable name="title" type="String"/>
    </data>
    <TextView
        android:text="@{title}"/>
</layout>

<!-- main_layout.xml -->
<include
    layout="@layout/included_layout"
    app:title="@{@string/app_title}"/>
```

## 자주 발생하는 이슈와 해결책

### 빌드 에러

- `@BindingAdapter`와 `@JvmStatic`을 함께 사용할 때는 companion object 안에 정의해야 합니다.
- 표현식에서 사용하는 클래스는 반드시 import 해야 합니다.

### 성능 최적화

- 복잡한 표현식은 ViewModel에서 처리하고 결과만 바인딩합니다.
- ObservableField보다 LiveData 사용을 권장합니다.

## 결론

Data Binding은 Android 앱 개발에서 UI와 데이터 로직을 분리하는 강력한 도구입니다. MVVM 아키텍처와 함께 사용하면 유지보수성이 높은 코드를 작성할 수 있습니다. 초기 학습 곡선이 있지만, 익숙해지면 개발 생산성이 크게 향상됩니다.
