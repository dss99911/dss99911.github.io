---
layout: post
title: "Android 권한 (Permission) 완벽 가이드"
date: 2025-12-28 12:12:00 +0900
categories: [mobile, android]
tags: [android, permission, runtime-permission, security]
description: "Android 권한 시스템을 이해하고 올바르게 구현하는 방법을 알아봅니다. 런타임 권한, 권한 그룹, 베스트 프랙티스를 다룹니다."
---

# Android 권한 (Permission) 완벽 가이드

Android 권한 시스템을 올바르게 이해하고 구현하는 방법을 알아봅니다.

## 권한 종류

### Protection Level

1. **Normal**: 설치 시 자동 부여, 사용자 승인 불필요
   - 예: `INTERNET`, `VIBRATE`, `ACCESS_NETWORK_STATE`

2. **Dangerous**: 런타임에 사용자 승인 필요
   - 예: `CAMERA`, `READ_CONTACTS`, `ACCESS_FINE_LOCATION`

3. **Signature**: 같은 서명의 앱만 사용 가능
   - 예: `BIND_ACCESSIBILITY_SERVICE`

## 런타임 권한

Android 6.0 (API 23)+ 및 `targetSdkVersion 23` 이상에서 필요합니다.

### 권한 확인

```kotlin
if (ContextCompat.checkSelfPermission(
        this,
        Manifest.permission.CAMERA
    ) == PackageManager.PERMISSION_GRANTED
) {
    // 권한 있음
    openCamera()
} else {
    // 권한 요청 필요
    requestCameraPermission()
}
```

### 권한 요청

```kotlin
private val requestPermissionLauncher = registerForActivityResult(
    ActivityResultContracts.RequestPermission()
) { isGranted ->
    if (isGranted) {
        openCamera()
    } else {
        showPermissionDeniedMessage()
    }
}

private fun requestCameraPermission() {
    when {
        shouldShowRequestPermissionRationale(Manifest.permission.CAMERA) -> {
            // 권한 필요 이유 설명 후 요청
            showPermissionRationale()
        }
        else -> {
            requestPermissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }
}
```

### 여러 권한 동시 요청

```kotlin
private val requestMultiplePermissions = registerForActivityResult(
    ActivityResultContracts.RequestMultiplePermissions()
) { permissions ->
    permissions.entries.forEach { (permission, isGranted) ->
        when {
            isGranted -> Log.d(TAG, "$permission granted")
            shouldShowRequestPermissionRationale(permission) -> {
                // 거부됨, 다시 설명 가능
            }
            else -> {
                // 영구 거부됨
            }
        }
    }
}

// 요청
requestMultiplePermissions.launch(
    arrayOf(
        Manifest.permission.CAMERA,
        Manifest.permission.RECORD_AUDIO
    )
)
```

## 권한 플로우

```
권한 확인 -> 없음 -> shouldShowRationale?
                      -> Yes: 설명 보여주기 -> 권한 요청
                      -> No: 권한 요청
                            -> 허용: 기능 사용
                            -> 거부:
                                -> shouldShowRationale = true: 재요청 가능
                                -> shouldShowRationale = false: 영구 거부됨
```

### 영구 거부 처리

```kotlin
private fun handlePermanentDenial() {
    AlertDialog.Builder(this)
        .setTitle("권한 필요")
        .setMessage("이 기능을 사용하려면 설정에서 권한을 허용해주세요.")
        .setPositiveButton("설정으로 이동") { _, _ ->
            openAppSettings()
        }
        .setNegativeButton("취소", null)
        .show()
}

private fun openAppSettings() {
    Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
        data = Uri.fromParts("package", packageName, null)
        startActivity(this)
    }
}
```

## 권한 그룹

같은 그룹의 권한 중 하나를 허용하면 그룹 내 다른 권한도 자동 허용됩니다.

**주의**: 권한 그룹은 변경될 수 있으므로 각 권한을 개별적으로 체크하세요.

## 하드웨어 기능

```xml
<uses-feature
    android:name="android.hardware.camera"
    android:required="false" />
```

```kotlin
if (packageManager.hasSystemFeature(PackageManager.FEATURE_CAMERA)) {
    // 카메라 기능 사용 가능
}
```

## BroadcastReceiver 권한

특정 권한이 있는 앱의 브로드캐스트만 수신:

```xml
<receiver
    android:name=".SmsReceiver"
    android:permission="android.permission.BROADCAST_SMS"
    android:exported="true">
    <intent-filter>
        <action android:name="android.provider.Telephony.SMS_RECEIVED" />
    </intent-filter>
</receiver>
```

## ADB로 권한 테스트

```bash
# 권한 부여
adb shell pm grant com.example.app android.permission.CAMERA

# 권한 해제
adb shell pm revoke com.example.app android.permission.CAMERA
```

## Permission Helper 클래스

```kotlin
class PermissionHelper(private val activity: ComponentActivity) {

    private var callback: ((Boolean) -> Unit)? = null

    private val launcher = activity.registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val allGranted = permissions.values.all { it }
        callback?.invoke(allGranted)
    }

    fun requestPermissions(
        permissions: Array<String>,
        onResult: (Boolean) -> Unit
    ) {
        callback = onResult

        val notGranted = permissions.filter {
            ContextCompat.checkSelfPermission(activity, it) !=
                PackageManager.PERMISSION_GRANTED
        }

        if (notGranted.isEmpty()) {
            onResult(true)
            return
        }

        launcher.launch(notGranted.toTypedArray())
    }

    fun hasPermission(permission: String): Boolean {
        return ContextCompat.checkSelfPermission(activity, permission) ==
            PackageManager.PERMISSION_GRANTED
    }

    fun shouldShowRationale(permission: String): Boolean {
        return activity.shouldShowRequestPermissionRationale(permission)
    }
}
```

### 사용 예시

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var permissionHelper: PermissionHelper

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        permissionHelper = PermissionHelper(this)
    }

    private fun checkCameraPermission() {
        permissionHelper.requestPermissions(
            arrayOf(Manifest.permission.CAMERA)
        ) { granted ->
            if (granted) {
                openCamera()
            } else {
                handlePermissionDenied()
            }
        }
    }
}
```

## SMS 권한 없이 OTP 받기

SMS Retriever API 사용:

```kotlin
val client = SmsRetriever.getClient(this)
client.startSmsRetriever()
    .addOnSuccessListener { /* 리스너 시작됨 */ }
    .addOnFailureListener { /* 실패 */ }
```

## 주의사항

1. **권한 그룹 변경 가능**: 각 권한을 개별 체크
2. **설정에서 해제 가능**: 이전에 허용했어도 다시 체크 필요
3. **권한 거부 시 앱 재시작**: `onTerminate()` 호출되지 않음
4. **권한 허용 후 거부**: 영구 거부 기록 초기화됨

## 결론

런타임 권한은 사용자 프라이버시 보호를 위해 중요합니다. 권한 요청 이유를 명확히 설명하고, 필요할 때만 요청하며, 거부되었을 때의 대체 플로우를 제공하세요.
