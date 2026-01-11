---
layout: post
title: "Android Firebase Integration Guide - Analytics, FCM Push, and Dynamic Links"
date: 2026-01-11
categories: [mobile, android]
tags: [android, kotlin, firebase, analytics, fcm, push-notifications, deep-links]
---

Firebase provides a comprehensive suite of tools for Android development. This guide covers essential Firebase services: Analytics, Cloud Messaging (FCM), and Dynamic Links.

## Table of Contents

1. [Setup](#setup)
2. [Firebase Analytics](#firebase-analytics)
3. [Firebase Cloud Messaging (FCM)](#firebase-cloud-messaging-fcm)
4. [Firebase Dynamic Links](#firebase-dynamic-links)

## Setup

### Add Firebase to Your Project

1. Add the Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Download `google-services.json` and place it in your app module
3. Add dependencies:

```groovy
// Project-level build.gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
    }
}

// App-level build.gradle
plugins {
    id 'com.google.gms.google-services'
}

dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.0.0')
    implementation 'com.google.firebase:firebase-analytics-ktx'
    implementation 'com.google.firebase:firebase-messaging-ktx'
    implementation 'com.google.firebase:firebase-dynamic-links-ktx'
}
```

## Firebase Analytics

Firebase Analytics provides insights into app usage and user engagement.

### Basic Event Logging

```kotlin
val firebaseAnalytics = Firebase.analytics

// Log a simple event
firebaseAnalytics.logEvent(FirebaseAnalytics.Event.SELECT_CONTENT) {
    param(FirebaseAnalytics.Param.ITEM_ID, "id123")
    param(FirebaseAnalytics.Param.ITEM_NAME, "Product Name")
    param(FirebaseAnalytics.Param.CONTENT_TYPE, "product")
}
```

### Custom Events

```kotlin
fun logViewItem(tag: String, category: String, packageName: String) {
    val bundle = Bundle().apply {
        putString("Tag", tag)
        putString("Category", category)
        putString("PackageName", packageName)
    }

    firebaseAnalytics.logEvent(FirebaseAnalytics.Event.VIEW_ITEM, bundle)
}
```

### Predefined Events

Firebase provides [predefined events](https://support.google.com/firebase/answer/6317498) for common scenarios:

- `FirebaseAnalytics.Event.ADD_TO_CART`
- `FirebaseAnalytics.Event.PURCHASE`
- `FirebaseAnalytics.Event.SIGN_UP`
- `FirebaseAnalytics.Event.LOGIN`
- `FirebaseAnalytics.Event.VIEW_ITEM`

### Debugging Analytics

#### Enable Verbose Logging

```bash
adb shell setprop log.tag.FA VERBOSE
adb shell setprop log.tag.FA-SVC VERBOSE
adb logcat -v time -s FA FA-SVC
```

#### Debug View (Real-time)

Send events directly to the Debug View in Firebase Console:

```bash
# Enable debug mode
adb shell setprop debug.firebase.analytics.app your.package.name

# Disable debug mode
adb shell setprop debug.firebase.analytics.app .none.
```

### Best Practices for Analytics

1. **Use Categories**: To distinguish data within events, use category parameters
2. **Consistent Naming**: Follow a consistent naming convention for custom events
3. **Don't Over-log**: Focus on meaningful events that provide actionable insights

## Firebase Cloud Messaging (FCM)

FCM enables push notifications and messaging to your Android app.

### Setup

```kotlin
class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        // Send token to your server
        sendTokenToServer(token)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        // Handle notification
        remoteMessage.notification?.let { notification ->
            showNotification(notification.title, notification.body)
        }

        // Handle data payload
        if (remoteMessage.data.isNotEmpty()) {
            handleDataPayload(remoteMessage.data)
        }
    }

    private fun showNotification(title: String?, body: String?) {
        val intent = Intent(this, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        }

        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE
        )

        val channelId = "default_channel"
        val notification = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()

        val notificationManager = getSystemService(NotificationManager::class.java)
        notificationManager.notify(0, notification)
    }
}
```

### Manifest Configuration

```xml
<service
    android:name=".MyFirebaseMessagingService"
    android:exported="false">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT"/>
    </intent-filter>
</service>
```

### Get FCM Token

```kotlin
FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
    if (task.isSuccessful) {
        val token = task.result
        Log.d("FCM", "Token: $token")
    }
}
```

### Topic Subscription

```kotlin
// Subscribe to topic
FirebaseMessaging.getInstance().subscribeToTopic("news")
    .addOnCompleteListener { task ->
        if (task.isSuccessful) {
            Log.d("FCM", "Subscribed to news topic")
        }
    }

// Unsubscribe from topic
FirebaseMessaging.getInstance().unsubscribeFromTopic("news")
```

### Push Delivery Challenges

Push notification delivery rates can vary significantly, especially in regions with network issues:

- [FCM Push Best Practices](https://www.youtube.com/watch?v=RPQsW-dEpxY)
- [Mobile Push Impressions Analysis](https://theblog.adobe.com/mobile-push-impressions-in-india-the-opportunity-ahead/)

#### Factors Affecting Delivery

1. **Network connectivity**
2. **Battery optimization settings**
3. **Device manufacturer restrictions (e.g., Xiaomi, Huawei)**
4. **App background restrictions**

## Firebase Dynamic Links

Dynamic Links are smart URLs that direct users to specific content based on context (app installed, platform, etc.).

### Features

- **Short Links**: Google-provided shortened URLs
- **Smart Routing**: Different behavior based on app installation status
  - App installed: Open specific screen (deep link)
  - App not installed: Redirect to Play Store or custom URL
  - Desktop: Redirect to web URL

### Creating Dynamic Links

#### Firebase Console

1. Go to Firebase Console > Dynamic Links
2. Create a new dynamic link with:
   - Long link URL
   - iOS behavior
   - Android behavior
   - Campaign tracking options

#### Programmatically

```kotlin
val dynamicLink = Firebase.dynamicLinks.dynamicLink {
    link = Uri.parse("https://example.com/product?id=123")
    domainUriPrefix = "https://example.page.link"

    androidParameters("com.example.android") {
        minimumVersion = 125
    }

    socialMetaTagParameters {
        title = "Check out this product"
        description = "Amazing product description"
        imageUrl = Uri.parse("https://example.com/image.png")
    }
}

val dynamicLinkUri = dynamicLink.uri
```

#### Create Short Link

```kotlin
val shortLinkTask = Firebase.dynamicLinks.shortLinkAsync {
    longLink = Uri.parse(dynamicLink.uri.toString())
}.addOnSuccessListener { (shortLink, flowchartLink) ->
    // Short link created
    Log.d("DynamicLinks", "Short link: $shortLink")
}
```

### Handling Dynamic Links

```kotlin
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        handleDynamicLink()
    }

    private fun handleDynamicLink() {
        Firebase.dynamicLinks
            .getDynamicLink(intent)
            .addOnSuccessListener { pendingDynamicLinkData ->
                val deepLink: Uri? = pendingDynamicLinkData?.link

                deepLink?.let { link ->
                    // Handle the deep link
                    val productId = link.getQueryParameter("id")
                    navigateToProduct(productId)
                }
            }
            .addOnFailureListener { e ->
                Log.e("DynamicLinks", "Error getting dynamic link", e)
            }
    }
}
```

### Deep Link Behavior

| Scenario | Behavior |
|----------|----------|
| App installed | Open app to specific screen |
| App not installed (mobile) | Redirect to Play Store |
| Desktop | Redirect to configured web URL |
| Instant App enabled | Launch Instant App |

### Campaign Tracking

Add UTM parameters for campaign tracking:

```kotlin
val dynamicLink = Firebase.dynamicLinks.dynamicLink {
    link = Uri.parse("https://example.com/promo")
    domainUriPrefix = "https://example.page.link"

    googleAnalyticsParameters {
        source = "email"
        medium = "newsletter"
        campaign = "summer_sale"
    }
}
```

## Best Practices

### Analytics

1. Use meaningful event names and parameters
2. Enable debug mode during development
3. Test events appear in Debug View before release

### FCM

1. Handle both notification and data payloads
2. Create notification channels for Android 8.0+
3. Test on various device manufacturers (especially Chinese OEMs)

### Dynamic Links

1. Always provide fallback URLs
2. Use social meta tags for link previews
3. Track campaign performance with UTM parameters

## Troubleshooting

### Analytics Events Not Appearing

1. Check if debug mode is enabled
2. Verify internet connectivity
3. Wait up to 24 hours for events to appear in dashboard

### FCM Token Issues

1. Ensure Google Play Services is available
2. Check if app is properly configured in Firebase Console
3. Verify `google-services.json` is up to date

### Dynamic Links Not Working

1. Verify domain prefix is properly configured
2. Check if app SHA fingerprints are registered
3. Test with Firebase Dynamic Links Test Tool

## References

- [Firebase Analytics Events](https://support.google.com/firebase/answer/6317498)
- [FCM Setup](https://firebase.google.com/docs/cloud-messaging/android/client)
- [Dynamic Links Documentation](https://firebase.google.com/docs/dynamic-links)
