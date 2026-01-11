---
layout: post
title: "Android App Optimization Guide - Performance, Memory, and APK Size"
date: 2026-01-11
categories: [mobile, android]
tags: [android, kotlin, optimization, performance, memory, proguard]
---

Optimizing Android applications is crucial for providing a great user experience. This guide covers essential optimization techniques for performance, memory management, APK size reduction, and battery efficiency.

## Table of Contents

1. [Performance Optimization](#performance-optimization)
2. [Memory Leak Prevention](#memory-leak-prevention)
3. [APK Size Management](#apk-size-management)
4. [Network Optimization](#network-optimization)
5. [Battery Optimization](#battery-optimization)

## Performance Optimization

### StrictMode

Use StrictMode to detect performance issues during development:

```kotlin
if (BuildConfig.DEBUG) {
    StrictMode.setThreadPolicy(
        StrictMode.ThreadPolicy.Builder()
            .detectDiskReads()
            .detectDiskWrites()
            .detectNetwork()
            .penaltyLog()
            .build()
    )
    StrictMode.setVmPolicy(
        StrictMode.VmPolicy.Builder()
            .detectLeakedSqlLiteObjects()
            .detectLeakedClosableObjects()
            .penaltyLog()
            .build()
    )
}
```

### Memory Profiling

#### Heap Check Method

1. Open Android Device Monitor (ADM)
2. Trigger "Cause GC" (Garbage Collection)
3. Analyze objects still in memory after GC - these may indicate memory leaks

#### Memory Analyzer Tool (MAT)

Use Memory Monitor to identify leaks, then analyze with MAT:

```bash
adb shell dumpsys meminfo | grep your.package.name
```

### Key Performance Metrics

- **Responsiveness**: Use StrictMode to detect UI thread delays
- **Memory**: Monitor heap allocation patterns
- **Battery**: Minimize connection establishment overhead

## Memory Leak Prevention

### Common Memory Leak Causes

#### 1. Animation Leaks

Animations keep references during their lifecycle. Always cancel in `onDestroy()`:

```kotlin
override fun onDestroy() {
    super.onDestroy()
    animator?.cancel()
    animation?.cancel()
}
```

#### 2. Observer/Listener Leaks

Always remove observers when done:

```kotlin
override fun onDestroy() {
    super.onDestroy()
    view.viewTreeObserver.removeOnScrollChangedListener(scrollListener)
}
```

#### 3. postDelayed Leaks

Handler's postDelayed holds references until execution:

```kotlin
private val handler = Handler(Looper.getMainLooper())
private val runnable = Runnable { /* work */ }

override fun onDestroy() {
    super.onDestroy()
    handler.removeCallbacks(runnable)
}
```

#### 4. Static Inner Class Pattern

Non-static inner classes hold implicit references to outer class:

```kotlin
// BAD: Inner class holds reference to Activity
class MyActivity : AppCompatActivity() {
    inner class MyHandler : Handler() {
        // Holds implicit reference to MyActivity
    }
}

// GOOD: Static inner class with WeakReference
class MyActivity : AppCompatActivity() {
    companion object {
        class MyHandler(activity: MyActivity) : Handler(Looper.getMainLooper()) {
            private val activityRef = WeakReference(activity)

            override fun handleMessage(msg: Message) {
                activityRef.get()?.let { activity ->
                    // Safe to use activity
                }
            }
        }
    }
}
```

### Context Leak Prevention

#### Drawable Callbacks

Drawables hold callbacks to their views, which reference Activities:

```kotlin
// When done with drawable
drawable.callback = null
```

#### Activity vs Application Context

| Use Case | Context Type |
|----------|--------------|
| UI operations | Activity Context |
| Singletons | Application Context |
| Background work | Application Context |
| Lifecycle-bound operations | Activity Context |

```kotlin
// For long-lived objects, use Application context
class MySingleton private constructor(context: Context) {
    private val appContext = context.applicationContext

    companion object {
        fun getInstance(context: Context) = MySingleton(context)
    }
}
```

#### Thread Inner Classes

Avoid creating threads as inner classes:

```kotlin
// BAD: Anonymous Runnable holds reference to outer class
Thread {
    // This Runnable holds reference to enclosing Activity
}.start()

// GOOD: Use ViewModel or CoroutineScope
viewModelScope.launch {
    // Work here
}
```

### Object Size Analysis

- **Shallow Size**: Size of the object itself
- **Retained Size**: Size including all objects it references (garbage if this object is collected)

### IntentService for Background Tasks

Use IntentService for repeated background tasks - resources are released immediately after completion:

```kotlin
class LogService : IntentService("LogService") {
    override fun onHandleIntent(intent: Intent?) {
        // Perform logging work
        // Resources released automatically when done
    }
}
```

## APK Size Management

### Analysis Tools

#### Method Count Check

Use [methodscount.com](http://www.methodscount.com/) to check library method counts.

Note: Apps exceeding 64K methods require MultiDex.

#### APK Analyzer

Drag APK file into Android Studio to analyze contents.

### Code Optimization

#### Remove Unused Code

```groovy
android {
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### Selective Google Play Services

Only include needed APIs:

```groovy
// BAD: Includes all Play Services
implementation 'com.google.android.gms:play-services:+'

// GOOD: Include only what you need
implementation 'com.google.android.gms:play-services-auth:20.0.0'
implementation 'com.google.android.gms:play-services-maps:18.0.0'
```

### Resource Optimization

#### Language Filtering

Include only necessary language resources:

```groovy
android {
    defaultConfig {
        resConfigs "en", "ko" // Only English and Korean
    }
}
```

#### Shrink Resources

Automatically remove unused resources:

```groovy
android {
    buildTypes {
        release {
            shrinkResources true
            minifyEnabled true
        }
    }
}
```

#### Strict Shrink Mode

```xml
<!-- res/raw/keep.xml -->
<resources xmlns:tools="http://schemas.android.com/tools"
    tools:shrinkMode="strict"
    tools:keep="@drawable/used_dynamically"
    tools:discard="@drawable/unused_image"/>
```

### Image Optimization

#### WebP Format

Convert images to WebP for smaller file sizes:
- Right-click image in Android Studio -> Convert to WebP

#### TinyPNG

Use [TinyPNG](https://tinypng.com/) for lossy compression with minimal quality loss.

#### Vector Drawables

Use vector drawables for icons instead of multiple density PNGs:

```xml
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="@color/primary"
        android:pathData="M12,2L2,7l10,5l10,-5L12,2z"/>
</vector>
```

## Network Optimization

### Traffic Monitoring

Use TrafficStats to measure network usage per thread:

```kotlin
import android.net.TrafficStats

// Set thread stats tag
TrafficStats.setThreadStatsTag(Thread.currentThread().id.toInt())

// Get stats
val rxBytes = TrafficStats.getUidRxBytes(Process.myUid())
val txBytes = TrafficStats.getUidTxBytes(Process.myUid())
```

### Best Practices

1. **Batch Requests**: Combine multiple small requests into one
2. **Caching**: Use HTTP caching headers and local caching
3. **Compression**: Enable GZIP for API responses
4. **Pagination**: Load data in chunks
5. **Prefetching**: Load data before it's needed

```kotlin
// OkHttp cache configuration
val cacheSize = 10L * 1024 * 1024 // 10 MB
val cache = Cache(context.cacheDir, cacheSize)

val okHttpClient = OkHttpClient.Builder()
    .cache(cache)
    .build()
```

## Battery Optimization

### Connection Cost

Opening and closing connections consumes more power than actual data transfer:

```kotlin
// BAD: Multiple separate connections
suspend fun loadData() {
    api.getData1()
    api.getData2()
    api.getData3()
}

// GOOD: Single combined request
suspend fun loadAllData() {
    api.getAllData() // Combined endpoint
}
```

### Job Scheduling

Use WorkManager for deferrable background work:

```kotlin
val constraints = Constraints.Builder()
    .setRequiredNetworkType(NetworkType.CONNECTED)
    .setRequiresBatteryNotLow(true)
    .build()

val workRequest = OneTimeWorkRequestBuilder<SyncWorker>()
    .setConstraints(constraints)
    .build()

WorkManager.getInstance(context).enqueue(workRequest)
```

### Sensor and Location Usage

```kotlin
// Use balanced power/accuracy
val locationRequest = LocationRequest.create().apply {
    priority = LocationRequest.PRIORITY_BALANCED_POWER_ACCURACY
    interval = 60000 // 1 minute
    fastestInterval = 30000
}
```

## Best Practices Summary

### Performance
- Use StrictMode in debug builds
- Profile with Android Profiler
- Avoid work on main thread

### Memory
- Cancel animations in onDestroy
- Remove observers/listeners
- Use static inner classes with WeakReference
- Use Application context for long-lived objects

### APK Size
- Enable ProGuard/R8
- Shrink resources
- Use WebP or vector drawables
- Include only needed Play Services APIs

### Battery
- Batch network requests
- Use WorkManager for background work
- Use efficient location strategies

## References

- [Memory Analyzer Tool (MAT)](https://www.eclipse.org/mat/)
- [TrafficStatsCompat](https://developer.android.com/reference/android/support/v4/net/TrafficStatsCompat)
- [Shrink Your App](https://developer.android.com/studio/build/shrink-code)
- [Android Profiler](https://developer.android.com/studio/profile/android-profiler)
