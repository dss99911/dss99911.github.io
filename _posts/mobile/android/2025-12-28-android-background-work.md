---
layout: post
title: "Android 백그라운드 작업 가이드"
date: 2025-12-28 12:06:00 +0900
categories: [mobile, android]
tags: [android, service, jobscheduler, workmanager, alarm]
description: "Android에서 백그라운드 작업을 처리하는 방법을 알아봅니다. Service, JobScheduler, WorkManager, AlarmManager 등을 다룹니다."
image: /assets/images/posts/thumbnails/2025-12-28-android-background-work.png
---

# Android 백그라운드 작업 가이드

Android에서 백그라운드 작업을 효율적으로 처리하는 방법을 알아봅니다.

## Service

### Service vs IntentService

**Service**
- 메인 스레드에서 실행
- 장시간 작업은 별도 스레드 필요
- 수동으로 종료해야 함

**IntentService**
- 워커 스레드에서 실행
- 순차적으로 요청 처리
- 작업 완료 후 자동 종료

### Service 기본 사용

```kotlin
class MyService : Service() {
    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // 백그라운드 작업 수행
        return START_NOT_STICKY
    }
}
```

### Activity와 Service 통신

**Messenger 사용**

```kotlin
// Activity
val messenger = Messenger(handler)
val intent = Intent(this, MyService::class.java)
intent.putExtra("messenger", messenger)
startService(intent)
```

```kotlin
// Service
val messenger = intent.getParcelableExtra<Messenger>("messenger")
val message = Message.obtain()
message.what = MSG_RESULT
message.obj = result
messenger?.send(message)
```

**Handler 정의**

```kotlin
class IncomingHandler(activity: MainActivity) : Handler(Looper.getMainLooper()) {
    private val activityRef = WeakReference(activity)

    override fun handleMessage(msg: Message) {
        val activity = activityRef.get() ?: return
        when (msg.what) {
            MSG_RESULT -> activity.handleResult(msg.obj)
        }
    }
}
```

## JobScheduler

Android 5.0+에서 사용 가능한 배터리 효율적인 작업 스케줄러입니다.

### JobService 구현

```kotlin
class MyJobService : JobService() {
    private var isWorking = false
    private var jobCancelled = false

    override fun onStartJob(params: JobParameters): Boolean {
        isWorking = true
        doWorkAsync(params)
        return isWorking  // true면 작업 진행 중
    }

    override fun onStopJob(params: JobParameters): Boolean {
        jobCancelled = true
        return isWorking  // true면 재스케줄 필요
    }

    private fun doWorkAsync(params: JobParameters) {
        thread {
            // 작업 수행
            if (!jobCancelled) {
                // 작업 완료
                jobFinished(params, false)
            }
        }
    }
}
```

### Manifest 등록

```xml
<service
    android:name=".MyJobService"
    android:permission="android.permission.BIND_JOB_SERVICE" />
```

### Job 스케줄링

```kotlin
val componentName = ComponentName(this, MyJobService::class.java)

val jobInfo = JobInfo.Builder(JOB_ID, componentName)
    .setRequiredNetworkType(JobInfo.NETWORK_TYPE_UNMETERED)
    .setRequiresCharging(true)
    .setRequiresDeviceIdle(true)
    .setPersisted(true)  // 재부팅 후에도 유지
    .build()

val jobScheduler = getSystemService(Context.JOB_SCHEDULER_SERVICE) as JobScheduler
val result = jobScheduler.schedule(jobInfo)

if (result == JobScheduler.RESULT_SUCCESS) {
    Log.d(TAG, "Job scheduled!")
}
```

### JobInfo 옵션

```kotlin
JobInfo.Builder(jobId, componentName)
    // 네트워크 조건
    .setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY)
    // 충전 중일 때만
    .setRequiresCharging(true)
    // 기기 유휴 상태일 때만
    .setRequiresDeviceIdle(true)
    // 최소 대기 시간
    .setMinimumLatency(5000)
    // 최대 대기 시간
    .setOverrideDeadline(10000)
    // 주기적 실행 (15분 이상)
    .setPeriodic(15 * 60 * 1000)
    // ContentProvider 변경 감지
    .addTriggerContentUri(...)
    .build()
```

### Job 취소

```kotlin
val jobScheduler = getSystemService(JOB_SCHEDULER_SERVICE) as JobScheduler
jobScheduler.cancel(JOB_ID)
// 또는 모든 Job 취소
jobScheduler.cancelAll()
```

## AlarmManager

정확한 시간에 작업을 실행해야 할 때 사용합니다.

### 기본 사용

```kotlin
val alarmManager = getSystemService(ALARM_SERVICE) as AlarmManager
val intent = Intent(this, AlarmReceiver::class.java)
val pendingIntent = PendingIntent.getBroadcast(
    this, 0, intent, PendingIntent.FLAG_IMMUTABLE
)

// 정확한 시간에 실행 (Doze 모드에서도)
alarmManager.setExactAndAllowWhileIdle(
    AlarmManager.RTC_WAKEUP,
    triggerAtMillis,
    pendingIntent
)
```

### Doze 모드에서 알람

```kotlin
// Doze 모드에서도 동작 (단, 제한적으로 사용)
alarmManager.setAndAllowWhileIdle(...)
alarmManager.setExactAndAllowWhileIdle(...)
```

## 배터리 최적화

### Doze 모드

Android 6.0+에서 기기가 유휴 상태일 때 배터리 절약을 위해 적용됩니다.

**제한 사항:**
- 네트워크 접근 차단
- Wake Lock 무시
- 표준 AlarmManager 지연
- JobScheduler 지연
- Sync Adapter 지연

### App Standby

앱이 오랜 시간 사용되지 않으면 제한됩니다.

### 배터리 최적화 예외 요청

```kotlin
val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
intent.data = Uri.parse("package:$packageName")
startActivity(intent)
```

## 버전별 제한 사항

### Android 8.0 (Oreo) 이상

**Background Service 제한:**
- 백그라운드에서 `startService()` 호출 불가
- Foreground Service 또는 JobScheduler 사용 필요

```kotlin
// Foreground Service로 시작
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
    startForegroundService(intent)
} else {
    startService(intent)
}
```

**Broadcast 제한:**
- Manifest에 등록된 암시적 브로드캐스트 대부분 수신 불가
- 예외 목록: [Broadcast Exceptions](https://developer.android.com/guide/components/broadcast-exceptions)

### Android 10 (Q) 이상

**백그라운드 Activity 시작 제한:**
- 백그라운드에서 Activity 시작 불가
- 알림을 통해 사용자 액션으로 시작해야 함

```kotlin
// Full-screen Intent로 대체
val notification = NotificationCompat.Builder(context, CHANNEL_ID)
    .setFullScreenIntent(pendingIntent, true)
    .build()
```

## Handler

UI 스레드와 백그라운드 스레드 간 통신에 사용합니다.

```kotlin
class MyHandler(looper: Looper) : Handler(looper) {
    override fun handleMessage(msg: Message) {
        when (msg.what) {
            MSG_UPDATE_UI -> {
                // UI 업데이트
            }
        }
    }
}

// 사용
val handler = MyHandler(Looper.getMainLooper())
handler.post { /* UI 작업 */ }
handler.postDelayed({ /* 지연 작업 */ }, 1000)
```

## 결론

Android 버전이 올라갈수록 백그라운드 작업에 대한 제한이 강화되고 있습니다. JobScheduler나 WorkManager를 사용하여 시스템과 협력적으로 작업을 스케줄링하고, Foreground Service는 사용자에게 명확히 보여야 할 때만 사용하세요.

**권장 사항:**
- 즉시 실행: Coroutine, Thread
- 지연 가능: JobScheduler, WorkManager
- 정확한 시간: AlarmManager
- 지속적인 작업: Foreground Service
