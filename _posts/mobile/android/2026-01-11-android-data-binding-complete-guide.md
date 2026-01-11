---
layout: post
title: "Android Data Binding Complete Guide - From Basics to Advanced"
date: 2026-01-11
categories: [mobile, android]
tags: [android, kotlin, data-binding, mvvm, jetpack]
---

Data Binding is a powerful library in Android Jetpack that allows you to bind UI components in your layouts to data sources in your app using a declarative format. This comprehensive guide covers everything from basic setup to advanced techniques.

## Table of Contents

1. [Setup](#setup)
2. [Basic XML Syntax](#basic-xml-syntax)
3. [Working with Code](#working-with-code)
4. [Observable Data](#observable-data)
5. [Binding Adapters](#binding-adapters)
6. [Listener Binding](#listener-binding)
7. [XML Operations](#xml-operations)
8. [Advanced Techniques](#advanced-techniques)
9. [View Binding](#view-binding)
10. [ViewStub Binding](#viewstub-binding)
11. [Common Issues and Solutions](#common-issues-and-solutions)

## Setup

To enable Data Binding in your Android project, add the following to your `build.gradle` file:

```groovy
// For Kotlin projects
apply plugin: 'kotlin-kapt'

android {
    ...
    dataBinding {
        enabled = true
    }
}
```

## Basic XML Syntax

Data Binding layouts start with a `<layout>` tag and contain a `<data>` section for variables:

```xml
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android">
    <data>
        <variable name="user" type="com.example.User"/>
    </data>

    <LinearLayout
        android:orientation="vertical"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@{user.firstName}"/>

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@{user.lastName}"/>
    </LinearLayout>
</layout>
```

### Null Safety

Data Binding automatically handles null values. If `user` is null, `user.name` returns the default value (null for String, 0 for int).

### Imports

You can import classes for use in expressions:

```xml
<data>
    <import type="android.view.View"/>
    <import type="com.example.real.estate.View" alias="Vista"/>
</data>

<TextView
    android:visibility="@{user.isAdult ? View.VISIBLE : View.GONE}"/>
```

### Generic Types

```xml
<data>
    <import type="java.util.List"/>
    <variable name="userList" type="List&lt;User&gt;"/>
</data>
```

### String Literals

```xml
android:text='@{map["firstName"]}'
android:text="@{map[`firstName`]}"
android:text="@{map['firstName']}"
```

### Resource References

```xml
android:padding="@{large ? @dimen/largePadding : @dimen/smallPadding}"
android:text="@{@string/nameFormat(firstName, lastName)}"
android:text="@{@plurals/banana(bananaCount)}"
```

### Include Layouts

Pass variables to included layouts:

```xml
<include layout="@layout/name"
    bind:user="@{user}"/>
```

### Referencing Other Views

You can reference other views directly in expressions. Changes to the referenced view automatically update:

```xml
<EditText
    android:id="@+id/txt_a"
    android:text="Hello World!" />

<TextView
    android:text="@{txtA.text}"/>
```

### Preview Default Values

Set default values for the layout preview:

```xml
android:text="@{@string/refresh, default=Preview Text}"
android:layout_height="@{viewModel.expanded ? @dimen/dp_118 : @dimen/dp_118, default=wrap_content}"
```

## Working with Code

### Getting Binding Instance

```kotlin
// In Activity
val binding = DataBindingUtil.setContentView<MainActivityBinding>(this, R.layout.main_activity)

// Or using generated class
val binding = MainActivityBinding.inflate(layoutInflater)

// From existing view
val binding = MyLayoutBinding.bind(viewRoot)

// Unknown layout ID
val binding = DataBindingUtil.inflate<ViewDataBinding>(layoutInflater, layoutId, parent, attachToParent)
```

### For Lists and RecyclerView

```kotlin
val binding = ListItemBinding.inflate(layoutInflater, viewGroup, false)
// or
val binding = DataBindingUtil.inflate<ListItemBinding>(layoutInflater, R.layout.list_item, viewGroup, false)
```

### Setting ViewModel

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    val binding = DataBindingUtil.setContentView<MainActivityBinding>(this, R.layout.main_activity)
    val user = User("Test", "User")
    binding.user = user
}
```

### Accessing Views

With binding, you can access views by ID directly:

```kotlin
val binding = DataBindingUtil.inflate<FragmentRechargeAllPlanBinding>(inflater, R.layout.fragment_recharge_all_plan, container, false)
binding.viewPager.adapter = mAdapter
binding.tabLayout.setupWithViewPager(binding.viewPager)
```

### Listening for Changes

```kotlin
binding.addOnPropertyChangedCallback(callback) // Called when viewmodel changes
viewModel.addOnPropertyChangedCallback(callback) // Called when viewmodel properties change
```

## Observable Data

### Observable Objects

Extend `BaseObservable` and use `@Bindable` annotation:

```kotlin
class User : BaseObservable() {
    @get:Bindable
    var firstName: String = ""
        set(value) {
            field = value
            notifyPropertyChanged(BR.firstName)
        }

    @get:Bindable
    var lastName: String = ""
        set(value) {
            field = value
            notifyPropertyChanged(BR.lastName)
        }
}
```

### Observable Fields

Use observable field wrappers for simpler implementation:

```kotlin
class User {
    val firstName = ObservableField<String>()
    val lastName = ObservableField<String>()
    val age = ObservableInt()
}
```

Available types:
- `ObservableBoolean`, `ObservableByte`, `ObservableChar`
- `ObservableShort`, `ObservableInt`, `ObservableLong`
- `ObservableFloat`, `ObservableDouble`, `ObservableParcelable`
- `ObservableArrayMap`, `ObservableArrayList`

## Binding Adapters

Binding Adapters allow you to customize how data is bound to views.

### Basic Adapter

```kotlin
@BindingAdapter("android:paddingLeft")
fun setPaddingLeft(view: View, padding: Int) {
    view.setPadding(padding, view.paddingTop, view.paddingRight, view.paddingBottom)
}
```

### Multiple Parameters

```kotlin
@BindingAdapter("imageUrl", "error")
fun loadImage(view: ImageView, url: String, error: Drawable) {
    Picasso.with(view.context).load(url).error(error).into(view)
}
```

```xml
<ImageView
    app:imageUrl="@{venue.imageUrl}"
    app:error="@{@drawable/venueError}"/>
```

### Optional Parameters

```kotlin
@BindingAdapter(value = ["src", "placeholder", "error", "blur", "cropCircle"], requireAll = false)
fun loadImage(view: ImageView, src: String?, placeholder: Drawable?, error: Drawable?, blur: Boolean?, cropCircle: Boolean?) {
    // Implementation
}
```

### Getting Old Value

```kotlin
@BindingAdapter("android:paddingLeft")
fun setPaddingLeft(view: View, oldPadding: Int, newPadding: Int) {
    if (oldPadding != newPadding) {
        view.setPadding(newPadding, view.paddingTop, view.paddingRight, view.paddingBottom)
    }
}
```

### Layout Width Binding

```kotlin
@BindingAdapter("android:layout_width")
fun setLayoutWidth(view: View, width: Float) {
    val layoutParams = view.layoutParams ?: return
    layoutParams.width = width.toInt()
    view.layoutParams = layoutParams
}
```

### Binding Method

Map an attribute to a different method name:

```kotlin
@BindingMethods(
    BindingMethod(type = Switch::class, attribute = "android:thumb", method = "setThumbDrawable"),
    BindingMethod(type = Switch::class, attribute = "android:track", method = "setTrackDrawable")
)
class SwitchBindingAdapter
```

### InverseBindingAdapter

For two-way data binding with custom conversion:

```kotlin
object Converter {
    @InverseMethod("stringToDate")
    fun dateToString(view: EditText, oldValue: Long, value: Long): String {
        // Converts long to String
    }

    fun stringToDate(view: EditText, oldValue: String, value: String): Long {
        // Converts String to long
    }
}
```

```xml
android:text="@={Converter.dateToString(viewmodel.birthDate)}"
```

## Listener Binding

### Method Reference

```kotlin
class MyHandlers {
    fun onClickFriend(view: View) { ... }
}
```

```xml
<TextView
    android:onClick="@{handlers::onClickFriend}"/>
```

### Lambda Expressions

```xml
<Button
    android:onClick="@{() -> presenter.onSaveClick(task)}"/>

<!-- With view parameter -->
<Button
    android:onClick="@{(view) -> presenter.onSaveClick(task)}"/>
```

### Other Listeners

```xml
<CheckBox
    android:onCheckedChanged="@{(cb, isChecked) -> presenter.completeChanged(task, isChecked)}"/>
```

For listeners with return values, the method must also return a value:

```xml
android:onLongClick="@{() -> fragment.onMessageLongClick()}"
```

```kotlin
fun onMessageLongClick(): Boolean { }
```

### Void Expression

```xml
android:onClick="@{(v) -> v.isVisible() ? doSomething() : void}"
```

## XML Operations

### Basic Operations

```xml
android:text="@{String.valueOf(index + 1)}"
android:visibility="@{age < 13 ? View.GONE : View.VISIBLE}"
android:transitionName='@{"image_" + id}'
```

### Null Coalescing Operator

```xml
android:text="@{user.displayName ?? user.lastName}"
```

### Collections

```xml
<data>
    <import type="android.util.SparseArray"/>
    <import type="java.util.Map"/>
    <import type="java.util.List"/>
    <variable name="list" type="List&lt;String&gt;"/>
    <variable name="sparse" type="SparseArray&lt;String&gt;"/>
    <variable name="map" type="Map&lt;String, String&gt;"/>
</data>

android:text="@{list[index]}"
android:text="@{sparse[index]}"
android:text="@{map[key]}"
```

### Special Characters

- `&&` operator: Use `&amp;&amp;`
- `<` operator: Use `&lt;`
- Generic types: `Map&lt;String, String&gt;`

## Advanced Techniques

### Custom Splashing Animation

```kotlin
@BindingAdapter("isSplashing")
fun setIsSplashing(view: View, isSplashing: Boolean) {
    val tag = view.tag
    val animatorSet = if (tag == null || tag !is AnimatorSet) {
        getAnimator(view)
    } else {
        tag
    }

    if (isSplashing && !animatorSet.isStarted) {
        animatorSet.start()
    } else if (!isSplashing) {
        animatorSet.cancel()
        view.alpha = 1f
    }
    view.tag = animatorSet
}
```

### Include with Parameters

```xml
<!-- included_layout.xml -->
<layout>
    <data>
        <variable name="title" type="java.lang.String"/>
    </data>
    <TextView android:text="@{title}"/>
</layout>

<!-- main_layout.xml -->
<include layout="@layout/included_layout"
    app:title="@{@string/title}"/>
```

### Custom Binding Class Names

See [official documentation](https://developer.android.com/topic/libraries/data-binding/index.html) for customizing binding class names.

### Immediate Binding

Force immediate binding execution:

```kotlin
binding.executePendingBindings()
```

### RecyclerView Binding

```kotlin
override fun onBindViewHolder(holder: BindingHolder, position: Int) {
    val item = items[position]
    holder.binding.setVariable(BR.item, item)
    holder.binding.executePendingBindings()
}
```

## View Binding

Views with IDs generate public final fields in the binding class:

```xml
<TextView
    android:id="@+id/firstName"
    android:text="@{user.firstName}"/>
```

Generated binding class:

```kotlin
public final TextView firstName
```

This is faster than `findViewById` for multiple views.

## ViewStub Binding

ViewStub works with data binding but has some limitations:

- Binding works: `bind:viewModel="@{viewModel}"`
- If binding value is null, data binding is ignored
- Need to inflate and control visibility in code
- Custom binding adapters may not work
- Standard attributes like `android:visibility` work

### Usage Pattern

```kotlin
if (viewStub.parent != null) {
    viewStub.inflate()
} else {
    viewStub.visibility = View.VISIBLE
}
```

## Common Issues and Solutions

### Issue: Value Not Set

If values are not being set, check if you're setting the viewmodel before creating it.

### Issue: View Layout Not Ready

When setting values before the view layout is ready (`view.isLaidOut()` returns false):

```kotlin
view.post { view.setSelection(position) }
```

### Issue: Import Name Error

Incorrect import names in XML cause compile errors without clear messages. Double-check your import statements.

### Issue: Background/Src Resource IDs

When using resource IDs for `background` or `src`, numbers are interpreted as colors. Convert to drawable first.

## Best Practices

1. **Use ObservableField for Simple Cases**: For simple data binding, `ObservableField` is easier than implementing `BaseObservable`.

2. **Always Handle Null**: Data binding handles null gracefully, but be explicit about null handling for clarity.

3. **Use executePendingBindings() in RecyclerView**: Call this in `onBindViewHolder` to ensure immediate binding.

4. **Leverage Two-Way Binding**: Use `@={}` syntax for two-way binding with EditText and other input views.

5. **Create Reusable Binding Adapters**: Create a centralized file for common binding adapters to avoid duplication.

## Conclusion

Android Data Binding is a powerful tool that reduces boilerplate code, improves type safety, and enables cleaner MVVM architecture. By mastering the techniques covered in this guide, you can build more maintainable and efficient Android applications.

## References

- [Official Android Data Binding Documentation](https://developer.android.com/topic/libraries/data-binding)
- [Data Binding Expressions](https://developer.android.com/topic/libraries/data-binding/expressions)
