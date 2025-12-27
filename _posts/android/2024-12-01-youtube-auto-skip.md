---
layout: post
title: "Android YouTube Auto Skip - Automatically Skip Ads using Accessibility Service"
date: 2024-12-01 01:05:37 +0900
categories: android
description: "Open source Android app that automatically skips YouTube ads using Accessibility Service. Learn how it works and how to build and use it."
tags: [Android, YouTube, Accessibility Service, Automation, Open Source]
---

An Android app that automatically skips YouTube ads by detecting and pressing the "Skip" button using Accessibility Service.

## Overview

This app runs in the background and monitors the YouTube app for the "Skip Ad" button. When detected, it automatically presses the button, allowing you to enjoy videos without manually skipping ads.

## How It Works

The app uses Android's **Accessibility Service** to:
1. Monitor the screen for UI elements
2. Detect when the YouTube "Skip Ad" button appears
3. Automatically perform a click action on the button
4. Check every 2 seconds for new skip opportunities

## Source Code

The complete source code is available on GitHub:
- **Repository**: [https://github.com/dss99911/youtube-skip](https://github.com/dss99911/youtube-skip)

## Installation & Usage

### Step 1: Build the App
```bash
git clone https://github.com/dss99911/youtube-skip.git
cd youtube-skip
./gradlew assembleDebug
```

Or open the project in Android Studio and build from there.

### Step 2: Install the App
```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

Or install directly from Android Studio.

### Step 3: Enable Accessibility Service
1. Open **Settings** on your Android device
2. Go to **Accessibility**
3. Find the YouTube Auto Skip app
4. Enable the Accessibility Service
5. Grant necessary permissions

### Step 4: Start Using
- Open YouTube and play any video
- The app will automatically detect and skip ads
- The skip button is checked every 2 seconds

## Technical Details

### Accessibility Service Implementation

The core of this app is an Accessibility Service that:
- Listens for `AccessibilityEvent` from the YouTube app
- Searches the view hierarchy for the skip button
- Performs click actions programmatically

### Key Files
- `AccessibilityService` implementation for screen monitoring
- Button detection logic using content description matching
- Periodic checking mechanism

## Limitations

- Only works with the official YouTube app
- Requires Accessibility Service permission
- May not work with YouTube updates that change button IDs
- Battery usage increases slightly due to background monitoring

## Privacy & Security

- The app only monitors the YouTube app
- No data is collected or transmitted
- All processing happens locally on device
- Open source for full transparency

## Legal Considerations

This app is for educational purposes. Using automation to skip ads may violate YouTube's Terms of Service. Use at your own discretion.

