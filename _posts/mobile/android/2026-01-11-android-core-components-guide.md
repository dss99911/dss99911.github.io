---
layout: post
title: "Android Core Components Guide - Activity, Fragment, Service, and Broadcast"
date: 2026-01-11
categories: [mobile, android]
tags: [android, kotlin, activity, fragment, service, broadcast, lifecycle, permissions]
---

Understanding Android's core components is essential for building robust applications. This guide covers Activity lifecycle, Fragment management, Services, Broadcast receivers, and Runtime permissions.

## Table of Contents

1. [Activity Lifecycle](#activity-lifecycle)
2. [Fragment](#fragment)
3. [Service](#service)
4. [Broadcast Receiver](#broadcast-receiver)
5. [Intent](#intent)
6. [Runtime Permissions](#runtime-permissions)

## Activity Lifecycle

### Lifecycle Callbacks

| Callback | Description |
|----------|-------------|
| `onCreate()` | Activity created, initialize UI |
| `onStart()` | Activity becoming visible |
| `onResume()` | Activity in foreground, interactive |
| `onPause()` | Another activity partially covers this one |
| `onStop()` | Activity no longer visible |
| `onDestroy()` | Activity being destroyed |

### Key Considerations

1. **Force Kill**: When force killed, `onDestroy()` is NOT called
2. **onPause vs onStop**: `onPause()` called when partially covered, `onStop()` when fully covered
3. **State Loss**: `onSaveInstanceState()` called before `onStop()`. Fragment commits after this cause crashes

```kotlin
// Avoid state loss in fragment transactions
supportFragmentManager.beginTransaction()
    .replace(R.id.container, fragment)
    .commitAllowingStateLoss() // Use with caution
```

### Lifecycle Observer

Monitor lifecycle events from external components:

```kotlin
class MyObserver : LifecycleObserver {
    @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
    fun onResume() {
        // Connect to resource
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_PAUSE)
    fun onPause() {
        // Disconnect from resource
    }
}

// Register observer
lifecycle.addObserver(MyObserver())

// Check current state
if (lifecycle.currentState.isAtLeast(Lifecycle.State.RESUMED)) {
    // Safe to update UI
}
```

### Activity Lifecycle Callbacks

Monitor all activities in your app:

```kotlin
class MyApplication : Application() {
    private var activityCount = 0

    override fun onCreate() {
        super.onCreate()

        registerActivityLifecycleCallbacks(object : ActivityLifecycleCallbacks {
            override fun onActivityStarted(activity: Activity) {
                activityCount++
            }

            override fun onActivityStopped(activity: Activity) {
                activityCount--
                if (activityCount == 0) {
                    // App is in background
                }
            }
            // ... other callbacks
        })
    }

    fun isAppInForeground() = activityCount > 0
}
```

## Fragment

### XML Declaration

```xml
<fragment
    android:name="com.example.MyFragment"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    tools:layout="@layout/fragment_my"/>
```

### Back Stack Management

```kotlin
override fun onBackPressed() {
    val fragmentManager = supportFragmentManager
    if (fragmentManager.backStackEntryCount > 0) {
        fragmentManager.popBackStack()
    } else {
        finish()
    }
}
```

### Common Issues

#### Context Null Issue

Fragment's `getContext()` can return null when fragment is detached:

```kotlin
// BAD: May crash
val inflater = LayoutInflater.from(context)

// GOOD: Check for null
context?.let { ctx ->
    val inflater = LayoutInflater.from(ctx)
}

// Or check if attached
if (isAdded) {
    // Safe to use context
}
```

#### Lifecycle Awareness

```kotlin
// Check if fragment is added before operations
if (fragment.isAdded) {
    // Safe to perform operations
}

// Retain instance across configuration changes
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    retainInstance = true // Deprecated in favor of ViewModel
}
```

### Fragment without Back Stack

If fragment is added via XML (not back stack), `onResume()` may not be invoked when returning.

## Service

### IntentService (Deprecated)

Simple service that runs on its own worker thread:

```kotlin
class MyIntentService : IntentService("MyIntentService") {
    override fun onHandleIntent(intent: Intent?) {
        // Runs on worker thread
        // Called sequentially if multiple requests
        // Stops automatically when work is done
    }
}
```

**Note**: IntentService is deprecated. Use WorkManager or coroutines instead.

### Service

Standard service runs on main thread:

```kotlin
class MyService : Service() {
    private val binder = LocalBinder()

    inner class LocalBinder : Binder() {
        fun getService(): MyService = this@MyService
    }

    override fun onBind(intent: Intent): IBinder = binder

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Start background work on separate thread
        thread {
            // Long-running operation
        }
        return START_STICKY
    }
}
```

### Communication with Activity

Using Messenger:

```kotlin
// Activity - Send messenger to service
class MainActivity : AppCompatActivity() {
    private val handler = IncomingHandler(this)
    private val messenger = Messenger(handler)

    fun startMyService() {
        val intent = Intent(this, MyService::class.java).apply {
            putExtra("messenger", messenger)
        }
        startService(intent)
    }

    class IncomingHandler(activity: MainActivity) : Handler(Looper.getMainLooper()) {
        private val activityRef = WeakReference(activity)

        override fun handleMessage(msg: Message) {
            activityRef.get()?.let { activity ->
                when (msg.what) {
                    1 -> {
                        // Handle message from service
                    }
                }
            }
        }
    }
}
```

```kotlin
// Service - Send message to activity
class MyService : Service() {
    private var activityMessenger: Messenger? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        activityMessenger = intent?.getParcelableExtra("messenger")
        return START_STICKY
    }

    private fun sendToActivity(messageId: Int, data: Any?) {
        try {
            val message = Message.obtain().apply {
                what = messageId
                obj = data
            }
            activityMessenger?.send(message)
        } catch (e: RemoteException) {
            Log.e("Service", "Error sending message to activity")
        }
    }
}
```

## Broadcast Receiver

### LocalBroadcastManager

For in-process communication only (deprecated, use LiveData or EventBus):

```kotlin
// Register receiver
LocalBroadcastManager.getInstance(this).registerReceiver(
    messageReceiver,
    IntentFilter("custom-event-name")
)

// Send broadcast
val intent = Intent("custom-event-name").apply {
    putExtra("data", "value")
}
LocalBroadcastManager.getInstance(this).sendBroadcast(intent)

// Unregister
LocalBroadcastManager.getInstance(this).unregisterReceiver(messageReceiver)
```

### Ordered Broadcast

Receive results from broadcast:

```kotlin
sendOrderedBroadcast(intent, null)
```

### Implicit Broadcast Restrictions

Starting from Android 8.0 (Oreo), implicit broadcasts cannot be registered in manifest (with some exceptions):

- Use explicit broadcasts
- Register receivers dynamically in code
- Check [exceptions list](https://developer.android.com/about/versions/oreo/background#broadcasts)

## Intent

### Share Intent with Chooser

```kotlin
val shareIntent = Intent(Intent.ACTION_SEND).apply {
    type = "text/plain"
    putExtra(Intent.EXTRA_TEXT, "Message to share")
}

val additionalIntent = Intent() // Additional option

val chooser = Intent.createChooser(shareIntent, "Share via").apply {
    putExtra(Intent.EXTRA_INITIAL_INTENTS, arrayOf(additionalIntent))
}

startActivity(chooser)
```

### LabeledIntent

Add custom label and icon to intent in chooser:

```kotlin
val labeledIntent = LabeledIntent(
    intent,
    packageName,
    R.string.custom_label,
    R.drawable.custom_icon
)
```

## Runtime Permissions

### Permission Levels

| Level | Description |
|-------|-------------|
| Normal | Automatically granted at install |
| Dangerous | Requires runtime permission (Android 6.0+) |
| Signature | Granted to apps signed with same certificate |

### Permission Flow

1. Check if permission is granted
2. If not, request permission
3. Handle permission result
4. If denied permanently, guide user to settings

### Check and Request

```kotlin
if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
    != PackageManager.PERMISSION_GRANTED) {
    ActivityCompat.requestPermissions(
        this,
        arrayOf(Manifest.permission.CAMERA),
        CAMERA_PERMISSION_CODE
    )
}
```

### Handle Result

```kotlin
override fun onRequestPermissionsResult(
    requestCode: Int,
    permissions: Array<String>,
    grantResults: IntArray
) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults)

    when (requestCode) {
        CAMERA_PERMISSION_CODE -> {
            if (grantResults.isNotEmpty() &&
                grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission granted
                openCamera()
            } else {
                // Permission denied
                if (!shouldShowRequestPermissionRationale(Manifest.permission.CAMERA)) {
                    // Permanently denied - guide to settings
                    showSettingsDialog()
                }
            }
        }
    }
}
```

### Permission Helper Class

```kotlin
class PermissionHelper(private val fragment: Fragment) {

    private val requestCodeMap = mutableMapOf<Int, PermissionCallback>()
    private var requestCode = 0

    fun requestPermissions(
        permissions: Array<String>,
        callback: PermissionCallback
    ) {
        val code = requestCode++
        requestCodeMap[code] = callback
        fragment.requestPermissions(permissions, code)
    }

    fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        val callback = requestCodeMap.remove(requestCode) ?: return

        val denied = mutableListOf<String>()
        var hasPermanentDenied = false

        permissions.forEachIndexed { index, permission ->
            if (grantResults[index] != PackageManager.PERMISSION_GRANTED) {
                denied.add(permission)
                if (!fragment.shouldShowRequestPermissionRationale(permission)) {
                    hasPermanentDenied = true
                }
            }
        }

        when {
            denied.isEmpty() -> callback.onGranted()
            hasPermanentDenied -> callback.onDeniedPermanently(denied)
            else -> callback.onDenied(denied)
        }
    }

    interface PermissionCallback {
        fun onGranted()
        fun onDenied(permissions: List<String>)
        fun onDeniedPermanently(permissions: List<String>)
    }
}
```

### Usage

```kotlin
permissionHelper.requestPermissions(
    arrayOf(Manifest.permission.CAMERA),
    object : PermissionHelper.PermissionCallback {
        override fun onGranted() {
            openCamera()
        }

        override fun onDenied(permissions: List<String>) {
            showRationale()
        }

        override fun onDeniedPermanently(permissions: List<String>) {
            showSettingsGuide()
        }
    }
)
```

### Hardware Feature Declaration

```xml
<uses-feature
    android:name="android.hardware.camera"
    android:required="false"/>
```

```kotlin
if (packageManager.hasSystemFeature(PackageManager.FEATURE_CAMERA)) {
    // Device has camera
}
```

### ADB Permission Commands

```bash
# Grant permission
adb shell pm grant com.example.app android.permission.CAMERA

# Revoke permission
adb shell pm revoke com.example.app android.permission.CAMERA
```

### SMS Retriever API

Receive OTP SMS without SMS permission:

```kotlin
// Use Google's SMS Retriever API
// https://developers.google.com/identity/sms-retriever/
```

## Best Practices

### Lifecycle

1. Use ViewModel to survive configuration changes
2. Use LiveData for lifecycle-aware data observation
3. Always check lifecycle state before UI updates

### Fragments

1. Use ViewModel for data sharing between fragments
2. Check `isAdded` before context operations
3. Use Navigation component for navigation

### Services

1. Use WorkManager for deferrable background work
2. Use foreground service for long-running visible tasks
3. Clean up resources in onDestroy

### Permissions

1. Request permissions just-in-time when needed
2. Provide clear rationale for permission requests
3. Handle all denial cases gracefully

## References

- [Activity Lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle)
- [Fragment Transactions](https://www.androiddesignpatterns.com/2013/08/fragment-transaction-commit-state-loss.html)
- [Permissions Overview](https://developer.android.com/guide/topics/permissions/overview)
- [SMS Retriever API](https://developers.google.com/identity/sms-retriever/)
