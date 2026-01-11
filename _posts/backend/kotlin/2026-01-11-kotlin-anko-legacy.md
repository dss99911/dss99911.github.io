---
layout: post
title: "Anko Library for Android (Legacy): A Historical Reference"
date: 2026-01-11
categories: [backend, kotlin]
tags: [kotlin, android, anko, legacy]
image: /assets/images/posts/kotlin-anko.png
---

**Note: Anko is deprecated and no longer maintained.** This article serves as a historical reference for codebases that still use Anko. For new projects, use Jetpack Compose or standard Android APIs.

## What was Anko?

Anko was a Kotlin library that made Android development faster and easier. It provided:
- DSL for building layouts programmatically
- SQLite helpers
- Intent helpers
- Coroutine support
- Common utilities

The library was deprecated by JetBrains in favor of Jetpack Compose and Kotlin's standard library improvements.

## Setup (Historical)

```groovy
// build.gradle
dependencies {
    implementation "org.jetbrains.anko:anko:0.10.8"
}

ext.anko_version = '0.10.8'
```

## Why Anko was Popular

Anko addressed several pain points with XML layouts:
- XML is not typesafe
- XML is not null-safe
- XML parsing wastes CPU and battery
- XML prevents code reuse
- Repetitive boilerplate code

## Anko Commons

Common utilities for Android development:

### Intent Helpers

```kotlin
// Traditional way
val intent = Intent(this, SomeActivity::class.java)
intent.putExtra("id", 5)
intent.setFlag(Intent.FLAG_ACTIVITY_SINGLE_TOP)
startActivity(intent)

// Anko way
startActivity(intentFor<SomeActivity>("id" to 5).singleTop())
```

### Quick Actions

| Action | Anko Function |
|--------|---------------|
| Make a call | `makeCall(number)` |
| Send SMS | `sendSMS(number, text)` |
| Browse web | `browse(url)` |
| Share text | `share(text, subject)` |
| Send email | `email(email, subject, text)` |

### Toast and Snackbar

```kotlin
// Toast
toast("Hello!")
toast(R.string.message)
longToast("Long message")

// Snackbar
snackbar(view, "Message")
longSnackbar(view, "Long message")
snackbar(view, "Action!", "Click") { doSomething() }
```

### Dialogs

```kotlin
// Alert dialog
alert("Title", "Message") {
    yesButton { toast("Yes clicked") }
    noButton { }
}.show()

// AppCompat dialog
alert(Appcompat, "Message").show()

// Custom dialog
alert {
    customView {
        editText()
    }
}.show()

// List selector
val countries = listOf("USA", "UK", "Korea")
selector("Select country", countries) { _, index ->
    toast("Selected: ${countries[index]}")
}

// Progress dialog
val dialog = progressDialog("Loading...", "Please wait")
```

## Anko Layouts

Programmatic UI building with a DSL:

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        verticalLayout {
            padding = dip(16)

            textView("Hello, Anko!") {
                textSize = 20f
            }.lparams(width = matchParent)

            button("Click me") {
                onClick { toast("Clicked!") }
            }.lparams(width = matchParent) {
                topMargin = dip(8)
            }

            editText {
                hint = "Enter text"
            }.lparams(width = matchParent)
        }
    }
}
```

### Custom View Extension

```kotlin
inline fun ViewManager.mapView(init: MapView.() -> Unit = {}): MapView {
    return ankoView({ MapView(it) }, theme = 0, init = init)
}

// Usage
mapView {
    // Configure MapView
}
```

### Dimension Helpers

```kotlin
val pixelValue = dip(16)    // 16dp to pixels
val spValue = sp(14)        // 14sp to pixels
```

## Anko Coroutines

Helper functions for coroutines:

```kotlin
// Weak reference to avoid memory leaks
val ref = activity.asReference()

async(UI) {
    val data = bg { fetchData() }
    ref().updateUI(data.await())
}
```

## Modern Alternatives

### For Layouts
Use **Jetpack Compose**:
```kotlin
@Composable
fun Greeting() {
    Column(modifier = Modifier.padding(16.dp)) {
        Text("Hello, Compose!", fontSize = 20.sp)
        Button(onClick = { /* ... */ }) {
            Text("Click me")
        }
    }
}
```

### For Coroutines
Use **kotlinx.coroutines** with lifecycle-aware scopes:
```kotlin
lifecycleScope.launch {
    val data = withContext(Dispatchers.IO) { fetchData() }
    updateUI(data)
}
```

### For Dialogs
Use **Material Components**:
```kotlin
MaterialAlertDialogBuilder(context)
    .setTitle("Title")
    .setMessage("Message")
    .setPositiveButton("OK") { _, _ -> }
    .show()
```

### For Intents
Use **Kotlin extension functions**:
```kotlin
inline fun <reified T : Activity> Context.startActivity(
    vararg extras: Pair<String, Any?>
) {
    val intent = Intent(this, T::class.java)
    extras.forEach { (key, value) ->
        when (value) {
            is Int -> intent.putExtra(key, value)
            is String -> intent.putExtra(key, value)
            // ... handle other types
        }
    }
    startActivity(intent)
}
```

## Migration Guide

1. **Layouts**: Migrate to Jetpack Compose or XML layouts
2. **Dialogs**: Use Material Components DialogBuilder
3. **Coroutines**: Use kotlinx.coroutines with lifecycle scope
4. **Intents**: Create your own extension functions
5. **SQLite**: Use Room persistence library

## Conclusion

While Anko was innovative for its time, the Android ecosystem has evolved with better solutions. Jetpack Compose provides a modern, declarative UI framework. Kotlin's coroutines library is now mature and well-integrated. If you're maintaining legacy Anko code, plan a gradual migration to modern alternatives.
