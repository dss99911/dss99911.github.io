---
layout: post
title: "Kotlin 기본 문법: 변수, 타입, 문자열"
date: 2025-12-28 12:00:00 +0900
categories: kotlin
tags: [kotlin, variables, types, string, basics]
description: "Kotlin의 기본 문법을 알아봅니다. 변수 선언, 기본 타입, 숫자, 문자, 문자열 처리 방법을 다룹니다."
---

Kotlin은 간결하고 안전한 프로그래밍 언어입니다. 이 포스트에서는 Kotlin의 가장 기본적인 문법들을 살펴보겠습니다.

## 변수 선언

Kotlin에서는 `var`와 `val` 두 가지 키워드로 변수를 선언합니다.

### Mutable 변수 (var)

변경 가능한 변수는 `var` 키워드를 사용합니다.

```kotlin
var i = 0  // Int 타입이 추론됨
i = 10     // 값 변경 가능
```

### Read-only 변수 (val)

읽기 전용 변수는 `val` 키워드를 사용합니다. Java의 `final`과 유사합니다.

```kotlin
val a: Int = 1
val b = 2           // Int 타입이 추론됨
val c: Int          // 초기화 없이 선언
c = 3               // 나중에 초기화

// c = 4            // 컴파일 에러! val은 재할당 불가
```

### Nullable과 Non-null 타입

Kotlin의 가장 큰 특징 중 하나는 타입 시스템에서 null을 구분한다는 것입니다. `?`는 nullable을 의미합니다.

```kotlin
var a: String = "abc"
// a = null          // 컴파일 에러! Non-null 타입

var b: String? = "abc"
b = null             // OK! Nullable 타입
```

### 상수 (const)

컴파일 타임 상수는 `const val`로 선언합니다.

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"
```

`const`는 다음 조건을 만족해야 합니다:
- Top-level이거나 object의 멤버
- String 또는 primitive 타입으로 초기화
- 커스텀 getter가 없음

### 커스텀 Getter/Setter

```kotlin
var aa: Int
    get() = field * 2
    set(value) {
        field = value
    }
```

## 기본 타입

Kotlin에서 자주 사용되는 기본 타입들입니다.

```kotlin
String
Int
Array<String>
List<String>
ArrayList<String>
Any          // Java의 Object처럼 어떤 것이라도 올 수 있음
IntArray
```

## 숫자 타입

### 리터럴

```kotlin
val decimal = 123        // 10진수
val long = 123L          // Long 타입
val hex = 0x0F           // 16진수
val binary = 0b00001011  // 2진수
// 8진수는 지원하지 않음

val double = 123.5       // Double 타입
val float = 123.5f       // Float 타입
```

### 형변환

```kotlin
val str = "123"
val num = str.toInt()
```

### 특수 배열 클래스

boxing overhead가 없는 primitive 배열 클래스들이 있습니다.

```kotlin
// ByteArray, ShortArray, IntArray 등
val x: IntArray = intArrayOf(1, 2, 3)
x[0] = x[1] + x[2]
```

### Random

```kotlin
import kotlin.random.Random

val randomNumber = Random.nextInt(10)  // 0~9 사이의 랜덤 숫자
```

## 문자 타입

### 이스케이프 문자

```kotlin
'\t'  // 탭
'\b'  // 백스페이스
'\n'  // 줄바꿈
'\r'  // 캐리지 리턴
'\''  // 작은따옴표
'\"'  // 큰따옴표
'\\'  // 백슬래시
'\$'  // 달러 기호
```

### 유니코드

```kotlin
val char = '\uFF00'
```

## 문자열

### 문자열 템플릿

Kotlin에서는 `$` 기호를 사용하여 문자열 내에 변수나 표현식을 삽입할 수 있습니다.

```kotlin
// 변수 참조
for (name in args) {
    println("Hello, $name!")
}

// 표현식 (중괄호 필요)
println("Hello, ${args[0]}!")
println("${s1.replace("is", "was")}, but now is $a")
```

### Raw String (멀티라인)

삼중 따옴표를 사용하면 여러 줄의 문자열을 그대로 사용할 수 있습니다.

```kotlin
val text = """
    for (c in "foo")
        print(c)
"""

// 달러 기호 사용
val price = """${'$'}9.99"""
```

### trimMargin

들여쓰기를 정리할 때 유용합니다.

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
""".trimMargin()
```

### 정규표현식으로 포함 여부 확인

```kotlin
fun String.isTruebalance(): Boolean =
    this.contains("(?i)OTP.*TRUEBALANCE".toRegex())
```

## Import

패키지 임포트 시 별칭을 사용할 수 있습니다.

```kotlin
import bar.Bar as bBar  // bBar로 bar.Bar를 사용
```

## 다음 단계

이제 Kotlin의 기본 문법을 알았으니, 다음으로는 [클래스와 객체](/kotlin/kotlin-classes-objects)에 대해 알아보세요.
