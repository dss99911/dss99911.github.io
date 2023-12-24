---
layout: post
title: "[Android] How to make Proguard keep Kotlin data class"
date: 2023-12-25 01:05:37 +0900
categories: android
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