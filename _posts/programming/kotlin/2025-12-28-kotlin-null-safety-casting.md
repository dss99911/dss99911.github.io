---
layout: post
title: "Kotlin Null Safety와 타입 캐스팅"
date: 2025-12-28 12:04:00 +0900
categories: [programming, kotlin]
tags: [kotlin, null-safety, casting, smart-cast, elvis-operator]
description: "Kotlin의 Null Safety 기능과 타입 캐스팅 방법을 알아봅니다. Safe Call, Elvis Operator, Smart Cast에 대해 다룹니다."
---

Kotlin의 가장 큰 장점 중 하나는 null 안전성입니다. 컴파일 타임에 null 관련 오류를 방지할 수 있습니다.

## Nullable과 Non-null 타입

타입 뒤에 `?`를 붙이면 nullable 타입이 됩니다.

```kotlin
var a: String = "abc"
// a = null  // 컴파일 에러!

var b: String? = "abc"
b = null  // OK

// null일 수 있는 변수의 메서드 호출
// val l = b.length  // 에러: 'b'가 null일 수 있음

val l = if (b != null) b.length else -1  // OK
```

## Safe Call Operator (?.)

`?.`를 사용하면 null인 경우 null을 반환하고, 그렇지 않으면 메서드를 호출합니다.

```kotlin
b?.length  // b가 null이면 null 반환

// 체이닝
bob?.department?.head?.name
```

### null이 아닌 경우에만 실행

```kotlin
bob?.department?.head?.let { println(it.name) }

val listWithNulls: List<String?> = listOf("A", null)
for (item in listWithNulls) {
    item?.let { println(it) }  // "A"만 출력, null은 무시
}
```

## Elvis Operator (?:)

좌변이 null이면 우변의 값을 사용합니다.

```kotlin
// 이렇게 쓰던 것을
val l: Int = if (b != null) b.length else -1

// 이렇게 간단히 쓸 수 있음
val l = b?.length ?: -1
```

### return/throw와 함께 사용

```kotlin
fun foo(node: Node): String? {
    val parent = node.getParent() ?: return null
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

### 실용적인 예시

```kotlin
val message = intent?.getMessage() ?: return

ShutterFindActivity.startShutterFindActivity(
    activity ?: return@postDelayed,
    componentName.packageName,
    componentName.className
)
```

## Not-null Assertion Operator (!!)

`!!`를 사용하면 null인 경우 NPE를 발생시킵니다. 확실히 null이 아닌 경우에만 사용하세요.

```kotlin
val l = b!!.length  // b가 null이면 NPE 발생
```

## 타입 체크

`is` 연산자로 타입을 체크합니다.

```kotlin
if (obj is String) { ... }
if (obj !is String) { ... }
```

## Unsafe Cast (as)

형변환이 불가능한 경우 예외가 발생합니다.

```kotlin
val x: String = y as String  // y가 String이 아니면 ClassCastException
```

## Safe Cast (as?)

형변환이 불가능한 경우 null을 반환합니다.

```kotlin
val aInt: Int? = a as? Int  // a가 Int가 아니면 null
```

## Smart Cast

조건문에서 타입 체크 후 자동으로 캐스팅됩니다.

```kotlin
fun demo(x: Any) {
    if (x is String) {
        print(x.length)  // x가 자동으로 String으로 캐스트됨
    }

    if (x !is String) return
    print(x.length)  // 여기서도 x는 String

    // && 와 || 에서도 동작
    if (x !is String || x.length == 0) return

    if (x is String && x.length > 0) {
        print(x.length)
    }
}
```

### when에서의 Smart Cast

```kotlin
when (x) {
    is Int -> print(x + 1)
    is String -> print(x.length + 1)
    is IntArray -> print(x.sum())
}
```

## filterNotNull

nullable 리스트에서 null을 제외합니다.

```kotlin
val nullableList: List<Int?> = listOf(1, 2, null, 4)
val intList: List<Int> = nullableList.filterNotNull()  // [1, 2, 4]
```

## 정리: Safe Call 활용 패턴

```kotlin
// 패턴 1: null이면 기본값
val length = str?.length ?: 0

// 패턴 2: null이면 early return
val user = getUser() ?: return

// 패턴 3: null이면 예외
val name = user?.name ?: throw IllegalStateException("Name required")

// 패턴 4: null이 아닐 때만 처리
user?.let {
    println("User name: ${it.name}")
    sendNotification(it)
}

// 패턴 5: null이면 다른 처리
user?.let {
    processUser(it)
} ?: run {
    createDefaultUser()
}
```

## 다음 단계

Null Safety와 타입 캐스팅에 대해 알아보았습니다. 다음으로 [프로퍼티와 위임](/kotlin/kotlin-properties-delegation)에 대해 알아보세요.
