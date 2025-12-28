---
layout: post
title: "Kotlin 제어문: if, when, for, while"
date: 2025-12-28 12:03:00 +0900
categories: [programming, kotlin]
tags: [kotlin, if, when, for, while, range, control-flow]
description: "Kotlin의 제어문을 알아봅니다. if/when 표현식, for/while 루프, Range에 대해 다룹니다."
---

Kotlin의 제어문은 표현식(expression)으로 사용할 수 있어 더욱 간결한 코드를 작성할 수 있습니다.

## if 표현식

Kotlin에서 `if`는 표현식으로 값을 반환할 수 있습니다.

```kotlin
val language = if (args.size == 0) "EN" else args[0]
```

### 블록을 사용한 if 표현식

블록의 마지막 표현식이 반환값이 됩니다.

```kotlin
val max = if (a > b) {
    print("Choose a")
    a  // 반환값
} else {
    print("Choose b")
    b  // 반환값
}
```

## when 표현식

`when`은 Java의 `switch`를 대체하는 강력한 표현식입니다.

### 기본 사용법

```kotlin
println(when (language) {
    "EN" -> "Hello!"
    "FR" -> "Salut!"
    "IT" -> "Ciao!"
    else -> "Sorry, I can't greet you in $language yet"
})
```

### 여러 조건을 같이 처리

```kotlin
when (obj) {
    1, 2, 3 -> println("One or 2 or 3")
    "Hello" -> println("Greeting")
    is Long -> println("Long")
    !is String -> println("Not a string")
    else -> println("Unknown")
}
```

### 표현식을 조건으로 사용

```kotlin
when (x) {
    parseInt(s) -> print("s encodes x")
    else -> print("s does not encode x")
}
```

### 조건 없이 사용 (if-else if 체인 대체)

```kotlin
when {
    x.isOdd() -> print("x is odd")
    x.isEven() -> print("x is even")
    else -> print("x is funny")
}
```

### Range와 함께 사용

```kotlin
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}
```

## Range

Range는 범위를 나타내는 Kotlin의 기능입니다.

### 기본 Range

```kotlin
if (x in 1..y - 1)
    println("OK")

for (a in 1..5 - 1)
    print("${a} ")

if (x !in 0..array.size - 1)
    println("Out: array has only ${array.size} elements. x = ${x}")

for (i in 1..4) print(i)  // "1234" 출력
for (i in 4..1) print(i)  // 아무것도 출력하지 않음
```

### 역순 Range

```kotlin
for (i in 4 downTo 1) print(i)  // "4321" 출력
```

### Step

```kotlin
for (i in 1..4 step 2) print(i)      // "13" 출력
for (i in 4 downTo 1 step 2) print(i)  // "42" 출력
```

### 마지막 요소 제외 (until)

```kotlin
for (i in 1 until 10) {  // i in [1, 10), 10은 제외됨
    println(i)
}
```

## for 루프

### 기본 사용법

```kotlin
for (name in args)
    println("Hello, $name!")
```

### 인덱스로 순회

```kotlin
for (i in args.indices)
    println(args[i])
```

### 인덱스와 값 함께 사용

```kotlin
for ((index, value) in array.withIndex()) {
    println("the element at $index is $value")
}

for ((k, v) in map) {
    println("$k -> $v")
}
```

### 역순 순회

```kotlin
for (i in (size - limit - 1) downTo 0) {
    // ...
}
```

### 라벨과 break/continue

```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop  // 외부 루프 탈출
    }
}
```

### forEach와 return

```kotlin
// 람다에서 return 사용 시 주의
fun foo() {
    ints.forEach {
        if (it == 0) return  // foo() 함수 자체에서 return!
        print(it)
    }
}

// 라벨 사용
fun foo() {
    ints.forEach lit@ {
        if (it == 0) return@lit  // forEach의 현재 iteration에서만 return
        print(it)
    }
}

// 암시적 라벨
fun foo() {
    ints.forEach {
        if (it == 0) return@forEach
        print(it)
    }
}

// 익명 함수 사용
fun foo() {
    ints.forEach(fun(value: Int) {
        if (value == 0) return  // 익명 함수에서 return
        print(value)
    })
}
```

### iterate 중 제거

```kotlin
list.removeAll { it > 5 }
```

## while 루프

### 기본 while

```kotlin
while (x > 0) {
    x--
}
```

### do-while

```kotlin
do {
    val y = retrieveData()
} while (y != null)  // y는 여기서 사용 가능
```

## 커스텀 Iterator

`for` 루프에서 사용할 수 있는 커스텀 이터레이터를 만들 수 있습니다.

필요한 함수들:
- `iterator()` - Iterator를 반환하는 함수
- `next()` - 다음 요소를 반환
- `hasNext()` - 다음 요소가 있는지 확인

모든 함수에 `operator` 키워드가 필요합니다.

```kotlin
class DateRange(val start: MyDate, val end: MyDate) : Iterable<MyDate> {
    override operator fun iterator(): Iterator<MyDate> {
        return object : Iterator<MyDate> {
            var current = start

            override fun hasNext(): Boolean = current <= end

            override fun next(): MyDate {
                val result = current
                current = current.nextDay()
                return result
            }
        }
    }
}

// 사용
for (date in DateRange(startDate, endDate)) {
    println(date)
}
```

## 다음 단계

제어문에 대해 알아보았습니다. 다음으로 [Null Safety와 타입 캐스팅](/kotlin/kotlin-null-safety-casting)에 대해 알아보세요.
