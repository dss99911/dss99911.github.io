---
layout: post
title: "Kotlin 컬렉션: Array, List, Map"
date: 2025-12-28 12:11:00 +0900
categories: kotlin
tags: [kotlin, array, list, map, collection, filter, sort]
description: "Kotlin의 컬렉션 타입과 다양한 연산에 대해 알아봅니다. Array, List, Map의 사용법과 람다 연산을 다룹니다."
---

Kotlin은 풍부한 컬렉션 API를 제공합니다. 이 포스트에서는 배열, 리스트, 맵의 사용법을 알아봅니다.

## Array (배열)

### 선언

```kotlin
val arr = arrayOf(1, 2, 3)
val list = listOf(1, 2, 3)
arrayOfNulls<String>(10)  // 고정 크기의 null 배열

// 람다로 초기화
val asc = Array(5) { i -> (i * i).toString() }
```

### 프로퍼티

```kotlin
args.size          // 크기
args.indices       // 인덱스 리스트 (0..size-1)
args.lastIndex     // 마지막 인덱스
args.fill(value)   // 특정 값으로 채우기
```

### 인덱스로 순회

```kotlin
for (index in items.indices) {
    println("item at $index is ${items[index]}")
}
```

### 포함 여부 확인

```kotlin
if ("aaa" in array) {
    // 배열에 "aaa"가 있음
}
```

### 합계

```kotlin
args.sum()
```

## List (리스트)

### 선언

```kotlin
listOf("apple", "banana", "kiwi")  // 불변 리스트
mutableListOf(1, 2, 3)              // 가변 리스트
```

## Map (맵)

### 선언

```kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)  // read-only
val mutableMap = mutableMapOf("a" to 1, "b" to 2)
```

### 접근

```kotlin
println(map["key"])
mutableMap["key"] = value
```

### 순회

```kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

### Destructuring

```kotlin
map.mapValues { (key, value) -> "$value!" }

// 타입 지정
map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }
map.mapValues { (_, value: String) -> "$value!" }
```

## 람다 연산

### 기본 람다 사용

`it`으로 현재 아이템을 참조합니다.

```kotlin
fruits
    .filter { it.startsWith("a") }
    .sortedBy { it }
    .map { it.toUpperCase() }
    .forEach { println(it) }
```

### filter

조건에 맞는 요소만 필터링합니다.

```kotlin
args = args.filter { it.startsWith("a") }

// null 제외
val nullableList: List<Int?> = listOf(1, 2, null, 4)
val intList: List<Int> = nullableList.filterNotNull()
```

### sort

정렬합니다.

```kotlin
args = args.sortedBy { it }
```

### map

각 요소를 변환합니다.

```kotlin
val lengths = names.map { it.length }
```

### forEach

각 요소에 대해 작업을 수행합니다.

```kotlin
items.forEach { println(it) }
```

### 인덱스와 함께

```kotlin
for ((index, value) in array.withIndex()) {
    println("the element at $index is $value")
}
```

## Sequence

지연 계산을 위한 시퀀스를 사용할 수 있습니다.

```kotlin
val fibonacciSeries = sequence {
    var a = 0
    var b = 1
    yield(a)
    yield(b)

    while (true) {
        val c = a + b
        yield(c)
        a = b
        b = c
    }
}

println(fibonacciSeries.take(10).joinToString(","))
```

## 다음 단계

Kotlin 컬렉션에 대해 알아보았습니다. 이로써 Kotlin의 핵심 기능들을 모두 살펴보았습니다!
