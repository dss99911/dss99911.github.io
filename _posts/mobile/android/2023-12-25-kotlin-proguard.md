---
layout: post
title: "[Android] How to make Proguard keep Kotlin data class"
date: 2023-12-25 01:05:37 +0900
categories: [mobile, android]
tags: [android, proguard, kotlin, data-class, obfuscation]
image: /assets/images/posts/thumbnails/kotlin-proguard.png
redirect_from:
  - /android/2023/12/24/kotlin-proguard.html
---
Whenever call the api, request body and response body should not be obfuscated by Proguard.

# **Several approach**

1. `@keep <class>`
2. `@field:JsonProperty(“fieldname”) <field>`
3. inherit a class which has rule to keep in Proguard
4. keep data class as all the request and response body use data class.

1,2,3 should be taken care by developer whenever create the class. but 4 is not.

So, this article is about no. 4. how to keep the data class  
so, I suggest a little bit tricky workaround.

# How to Keep Data Class

When I search, there was no solution for this.  
so, I suggest a little bit tricky workaround.

```
-keepclasseswithmembers class <com.your.package>.** {  
    public ** component1();  
    <fields>;  
}
```


# Rule explantation

- All data class has component1() method which returns data
- all data class has at least one field.
- almost all the classes doesn’t satisfy criteria above.

I’m not sure that keeping all the data class is good or not.

but I don’t want to miss Proguard rule mistakingly.

so, I suggest this way.
if anyone knows better approach.
kindly let me know.

Thanks :)

---

# Understanding Why This Matters

When Proguard (or R8, which is now the default in Android) obfuscates your code, it renames classes and fields to short, meaningless names like `a`, `b`, `c`. This is great for reducing APK size and making reverse engineering harder, but it breaks serialization.

Consider a data class used as an API response body:

```kotlin
data class UserResponse(
    val name: String,
    val email: String,
    val age: Int
)
```

After obfuscation, the fields might be renamed to `a`, `b`, `c`. When Gson, Moshi, or Jackson tries to parse the JSON response, it looks for fields matching the JSON keys (`name`, `email`, `age`) but finds `a`, `b`, `c` instead. The result: all fields become `null` or default values, and your app silently fails.

---

# Alternative Approaches in Detail

## 1. @Keep Annotation

```kotlin
@Keep
data class UserResponse(
    val name: String,
    val email: String,
    val age: Int
)
```

**Pros**: Simple and explicit.
**Cons**: You must remember to add `@Keep` to every single model class. Miss one, and you get a runtime bug that’s hard to trace.

## 2. @SerializedName / @JsonProperty

```kotlin
data class UserResponse(
    @field:SerializedName("name") val name: String,
    @field:SerializedName("email") val email: String,
    @field:SerializedName("age") val age: Int
)
```

**Pros**: Works regardless of obfuscation, because the serialization library uses the annotation value instead of the field name.
**Cons**: Extremely verbose. Every field in every model class needs an annotation. Easy to make typos in the annotation strings.

## 3. Interface-Based Keep Rule

Create a marker interface and add a Proguard rule for it:

```kotlin
interface KeepForSerialization

data class UserResponse(
    val name: String,
    val email: String,
    val age: Int
) : KeepForSerialization
```

```
-keep class * implements com.your.package.KeepForSerialization { *; }
```

**Pros**: Centralized rule, easy to understand.
**Cons**: Still requires developers to remember to implement the interface.

## 4. The Data Class Approach (Recommended)

The approach described in this article automatically keeps all data classes. Since API request and response models are almost always data classes, this catches them all without any developer action needed.

---

# Common Pitfalls

1. **Forgetting `<fields>`**: Without the `<fields>` part in the Proguard rule, only the `component1()` method is kept, but the actual field names are still obfuscated.

2. **Testing only in debug builds**: Debug builds typically don’t run Proguard. Always test with a release build (or `minifyEnabled true` in debug) to catch obfuscation issues early.

3. **Third-party library models**: Libraries like Retrofit or Room may have their own keep rules bundled in their AAR. Check that they’re being applied correctly.

4. **R8 full mode**: R8 full mode (`android.enableR8.fullMode=true`) is more aggressive than Proguard. Test your keep rules with full mode enabled to ensure they still work.

---

# Verifying Your Proguard Rules

After building a release APK, you can verify which classes are kept:

```bash
# Check the mapping file
cat app/build/outputs/mapping/release/mapping.txt | grep "UserResponse"
```

If you see the class name unchanged in the mapping file, your keep rule is working correctly. If the class appears with an obfuscated name, the rule needs adjustment.