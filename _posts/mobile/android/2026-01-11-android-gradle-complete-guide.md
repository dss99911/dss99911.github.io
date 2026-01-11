---
layout: post
title: "Android Gradle Complete Guide - Build Configuration and Optimization"
date: 2026-01-11
categories: [mobile, android]
tags: [android, gradle, build, kotlin, groovy]
---

Gradle is the build system for Android projects, providing powerful configuration options for managing dependencies, build variants, flavors, and more. This guide covers essential Gradle configurations for Android development.

## Table of Contents

1. [Android Block Overview](#android-block-overview)
2. [Default Configuration](#default-configuration)
3. [Build Types](#build-types)
4. [Product Flavors](#product-flavors)
5. [Dependencies](#dependencies)
6. [Value Sharing](#value-sharing)
7. [Variant Filter](#variant-filter)
8. [Custom Plugin](#custom-plugin)
9. [Packaging Options](#packaging-options)
10. [Common Errors and Solutions](#common-errors-and-solutions)
11. [Command Line Usage](#command-line-usage)

## Android Block Overview

The `android` block in your module's `build.gradle` contains all Android-specific configurations:

```groovy
android {
    compileSdkVersion
    defaultConfig
    buildTypes
    signingConfigs
    productFlavors
    lintOptions
    packagingOptions
    testOptions
    compileOptions
}
```

## Default Configuration

The `defaultConfig` block sets default values that apply to all build variants:

```groovy
android {
    defaultConfig {
        applicationId "com.example.test"
        minSdkVersion 15
        targetSdkVersion 26
        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
}
```

## Build Types

Build types define how your app is built. The most common are `debug` and `release`:

```groovy
android {
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        debug {
            minifyEnabled false
            debuggable true
        }
    }
}
```

### Common Build Type Options

- `minifyEnabled`: Enable code shrinking with R8/ProGuard
- `proguardFiles`: Specify ProGuard rules files
- `debuggable`: Enable debugging
- `signingConfig`: Configure signing
- `buildConfigField`: Add custom BuildConfig fields

## Product Flavors

Product flavors allow you to create different versions of your app:

```groovy
android {
    flavorDimensions 'buildType'

    productFlavors {
        mock {
            dimension 'buildType'
            applicationIdSuffix = ".mock"
        }
        prod {
            dimension 'buildType'
        }
    }
}
```

### Version Name Suffix

Add a suffix to version names for specific flavors:

```groovy
productFlavors {
    minApi24 {
        versionNameSuffix "-minApi24"
    }
}
```

## Dependencies

### Basic Dependency Declaration

```groovy
dependencies {
    // Include all JARs from libs folder
    implementation fileTree(dir: 'libs', include: ['*.jar'])

    // Android testing
    androidTestImplementation 'androidx.test:runner:1.4.0'

    // Unit testing
    testImplementation 'junit:junit:4.13.2'
}
```

### Build-Specific Dependencies

Add dependencies for specific build types or flavors:

```groovy
dependencies {
    releaseImplementation project(path: ':library', configuration: 'release')
    debugImplementation project(path: ':library', configuration: 'debug')
}
```

### Implementation vs Compile vs API

| Keyword | Visibility | Use Case |
|---------|------------|----------|
| `implementation` | Hidden from consumers | Default choice, encapsulates dependencies |
| `api` | Exposed to consumers | When consumers need access to the dependency |
| `compile` (deprecated) | Exposed to consumers | Legacy, use `api` instead |

```groovy
dependencies {
    // Only this module can access OkHttp directly
    implementation 'com.squareup.okhttp3:okhttp:4.9.0'

    // Consumers of this module can also access Gson
    api 'com.google.code.gson:gson:2.8.9'
}
```

## Value Sharing

### Between Project and Modules

Define common values in the root `build.gradle` and reference them in modules:

```groovy
// root build.gradle
ext {
    // SDK and tools
    minSdkVersion = 21
    targetSdkVersion = 33
    compileSdkVersion = 33

    // App dependencies
    supportLibraryVersion = '28.0.0'
    kotlinVersion = '1.8.0'

    // Testing
    junitVersion = '4.13.2'
    mockitoVersion = '4.0.0'
    espressoVersion = '3.4.0'
}
```

```groovy
// module build.gradle
android {
    compileSdkVersion rootProject.ext.compileSdkVersion

    defaultConfig {
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
    }
}

dependencies {
    implementation "androidx.appcompat:appcompat:$rootProject.supportLibraryVersion"
}
```

### From Module to Manifest

Pass values from Gradle to the AndroidManifest using `manifestPlaceholders`:

```groovy
android {
    defaultConfig {
        manifestPlaceholders = [facebookAppId: "someId123"]
    }

    productFlavors {
        flavor1 {
            // Uses default
        }
        flavor2 {
            manifestPlaceholders = [facebookAppId: "anotherId456"]
        }
    }
}
```

```xml
<!-- AndroidManifest.xml -->
<meta-data
    android:name="com.facebook.sdk.ApplicationId"
    android:value="${facebookAppId}"/>
```

### From System Environment

Read environment variables (useful for CI/CD):

```groovy
def buildNumber = System.getenv("BUILD_NUMBER") as Integer ?: 0

android {
    defaultConfig {
        versionCode buildNumber
    }
}
```

## Variant Filter

Control which build variants are generated:

```groovy
android {
    variantFilter { variant ->
        // Skip mock-release variant
        if (variant.buildType.name == 'release'
            && variant.flavors[0].name == 'mock') {
            variant.setIgnore(true)
        }
    }
}
```

### Variant Filter Properties

- `buildType`: Access the build type
- `defaultConfig`: Access default configuration
- `flavors`: Access the list of flavors
- `setIgnore(boolean)`: Exclude this variant

## Custom Plugin

Create custom Gradle plugins for Android:

```groovy
class AndroidAspectJXPlugin implements Plugin<Project> {

    @Override
    void apply(Project project) {
        project.repositories {
            mavenLocal()
        }

        project.dependencies {
            implementation 'org.aspectj:aspectjrt:1.9.7'
        }

        project.extensions.create("aspectjx", AspectjExtension)

        if (project.plugins.hasPlugin(AppPlugin)) {
            // Add build time trace
            project.gradle.addListener(new TimeTrace())

            // Register transform
            AppExtension android = project.extensions.getByType(AppExtension)
            android.registerTransform(new AspectTransform(project))
        }
    }
}
```

### Key Plugin Concepts

- `AppPlugin`: Corresponds to `com.android.application`
- `AppExtension`: The `android {}` block
- `project.extensions`: Access or create extension objects

## Packaging Options

Exclude files from the final APK:

```groovy
android {
    packagingOptions {
        exclude 'LICENSE.txt'
        exclude 'META-INF/DEPENDENCIES'
        exclude 'META-INF/LICENSE'
        exclude 'META-INF/NOTICE'
    }
}
```

### Common Use Cases

- Exclude duplicate license files
- Exclude conflicting META-INF files
- Remove unnecessary resources

## Common Errors and Solutions

### Firebase Library Conflicts

When Firebase causes library conflicts:

```groovy
// Explicitly declare support library versions
implementation "com.android.support:appcompat-v7:$support_library_version"
implementation "com.android.support:support-v4:$support_library_version"
```

### Check Dependency Versions

View the dependency tree:

```bash
./gradlew :app:dependencies
```

### Module Dependency Issues with Firebase

Use `api` instead of `implementation` for cross-module dependencies:

```groovy
// Instead of implementation
api 'com.google.firebase:firebase-analytics:21.0.0'
```

This ensures all modules have access to Firebase and avoids version conflicts.

## Command Line Usage

### Build and Install

```bash
# Build and install release variant
./gradlew :app:installLiveRelease

# Build with debug output
./gradlew :app:installLiveRelease --debug > buildLog.txt

# Clean build
./gradlew clean

# Build APK
./gradlew assembleRelease

# Build AAB (Android App Bundle)
./gradlew bundleRelease
```

### Common Gradle Tasks

```bash
# List all tasks
./gradlew tasks

# Run unit tests
./gradlew test

# Run instrumented tests
./gradlew connectedAndroidTest

# Check dependencies
./gradlew :app:dependencies

# Lint check
./gradlew lint
```

## Best Practices

### 1. Use Version Catalogs (Gradle 7.0+)

```toml
# gradle/libs.versions.toml
[versions]
kotlin = "1.8.0"
retrofit = "2.9.0"

[libraries]
kotlin-stdlib = { module = "org.jetbrains.kotlin:kotlin-stdlib", version.ref = "kotlin" }
retrofit = { module = "com.squareup.retrofit2:retrofit", version.ref = "retrofit" }
```

```groovy
dependencies {
    implementation libs.kotlin.stdlib
    implementation libs.retrofit
}
```

### 2. Optimize Build Speed

```groovy
android {
    compileOptions {
        // Enable incremental compilation
        incremental true
    }
}
```

### 3. Use BuildConfig for Environment-Specific Values

```groovy
buildTypes {
    debug {
        buildConfigField "String", "API_URL", '"https://api-dev.example.com"'
    }
    release {
        buildConfigField "String", "API_URL", '"https://api.example.com"'
    }
}
```

```kotlin
// In code
val apiUrl = BuildConfig.API_URL
```

### 4. Separate Test Dependencies

```groovy
dependencies {
    // Unit tests
    testImplementation 'junit:junit:4.13.2'
    testImplementation 'org.mockito:mockito-core:4.0.0'

    // Instrumented tests
    androidTestImplementation 'androidx.test.ext:junit:1.1.3'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.4.0'
}
```

## Conclusion

Understanding Gradle configuration is essential for efficient Android development. By properly configuring build types, flavors, dependencies, and other options, you can create flexible build systems that support multiple app variants and environments.

## References

- [Android Gradle Plugin DSL Reference](https://developer.android.com/reference/tools/gradle-api)
- [Configure Your Build](https://developer.android.com/studio/build)
- [Gradle User Guide](https://docs.gradle.org/current/userguide/userguide.html)
