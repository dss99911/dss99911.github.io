---
layout: post
title: "Kotlin 기타 기능: Annotation, Enum, Exception, 문서화"
date: 2025-12-28 12:08:00 +0900
categories: kotlin
tags: [kotlin, annotation, enum, exception, documentation, visibility]
description: "Kotlin의 어노테이션, Enum 클래스, 예외 처리, 문서화, 가시성 수정자에 대해 알아봅니다."
---

이 포스트에서는 Kotlin의 다양한 기능들을 살펴봅니다.

## 어노테이션 (Annotation)

### Use-site Target

생성자 파라미터에 어노테이션을 적용할 때 대상을 지정할 수 있습니다.

```kotlin
class Example(
    @field:Ann val foo,    // Java 필드에 적용
    @get:Ann val bar,      // Java getter에 적용
    @param:Ann val quux    // Java 생성자 파라미터에 적용
)
```

### 같은 대상에 여러 어노테이션

```kotlin
class Example {
    @set:[Inject VisibleForTesting]
    var collaborator: Collaborator
}
```

## Enum 클래스

### 기본 선언

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```

### 파라미터와 함께

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

### 메서드 정의

```kotlin
enum class ProtocolState {
    WAITING {
        override fun signal() = TALKING
    },
    TALKING {
        override fun signal() = WAITING
    };

    abstract fun signal(): ProtocolState
}
```

### 제네릭으로 접근

`reified` 타입과 함께 사용하면 제네릭으로 enum 값에 접근할 수 있습니다.

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumValues<T>().joinToString { it.name })
}

printAllValues<RGB>()  // "RED, GREEN, BLUE" 출력
```

## 예외 처리 (Exception)

Kotlin에서는 Java와 달리 checked exception이 없습니다. try-catch가 필수가 아닙니다.

### 표현식으로서의 try

```kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }
    // result 사용
}

val a: Int? = try { parseInt(input) } catch (e: NumberFormatException) { null }
```

### @Throws 어노테이션

Java 코드에서 호출될 때 예외를 명시하고 싶을 때 사용합니다.

```kotlin
@Throws(IOException::class)
override fun intercept(
    request: HttpRequest,
    body: ByteArray,
    execution: ClientHttpRequestExecution
): ClientHttpResponse {
    // ...
}
```

## 가시성 수정자 (Visibility Modifiers)

기본값은 `public`입니다.

```kotlin
// public: 어디서나 접근 가능 (기본값)
// private: 같은 클래스/파일 내에서만 접근 가능
// protected: 같은 클래스와 하위 클래스에서 접근 가능
// internal: 같은 모듈 내에서 접근 가능
```

### internal 수정자

같은 모듈 내에서만 접근할 수 있습니다. Java의 package-private과 유사하지만 모듈 단위입니다.

```kotlin
internal class InternalClass {
    internal fun internalMethod() { ... }
}
```

### protected 멤버 오버라이드

`protected` 멤버를 오버라이드할 때 가시성을 명시하지 않으면 `protected`로 유지됩니다.

```kotlin
open class Base {
    protected open fun method() { }
}

class Derived : Base() {
    override fun method() { }  // 여전히 protected
}
```

## 문서화 (Documentation)

### 주석

```kotlin
// 한 줄 주석

/* 여러 줄
   주석 */
```

### KDoc

Kotlin의 문서화 시스템입니다. [공식 문서](https://kotlinlang.org/docs/reference/kotlin-doc.html)

```kotlin
/**
 * 함수 설명
 *
 * @param name 파라미터 설명
 * @return 반환값 설명
 * @constructor 생성자 설명
 */
fun example(name: String): Int {
    return name.length
}
```

## 코드 컨벤션

### 네이밍 스타일

- camelCase 사용 (이름에 언더스코어 피하기)
- 타입은 대문자로 시작
- 메서드와 프로퍼티는 소문자로 시작
- 4 스페이스 들여쓰기
- public 함수는 KDoc 작성

### 콜론

타입과 슈퍼타입을 구분할 때는 콜론 앞에 공백, 인스턴스와 타입을 구분할 때는 공백 없음:

```kotlin
interface Foo<out T : Any> : Bar {
    fun foo(a: Int): T
}
```

### 람다

중괄호 주변과 화살표 주변에 공백을 사용합니다. 가능하면 람다를 괄호 밖에 전달합니다.

```kotlin
list.filter { it > 10 }.map { element -> element * 2 }
```

중첩되지 않은 짧은 람다에서는 `it`을 사용하고, 중첩된 람다에서는 파라미터를 명시합니다.

### 클래스 헤더 포맷

짧은 헤더는 한 줄에:

```kotlin
class Person(id: Int, name: String)
```

긴 헤더는 줄바꿈:

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) {
    // ...
}
```

여러 인터페이스:

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker {
    // ...
}
```

### Unit 생략

함수가 `Unit`을 반환하면 생략합니다:

```kotlin
fun foo() {  // ": Unit" 생략
}
```

### 함수 vs 프로퍼티

인자 없는 함수 대신 프로퍼티를 선호하는 경우:
- 예외를 던지지 않음
- O(1) 복잡도
- 계산 비용이 적음 (또는 첫 실행 시 캐시됨)
- 호출할 때마다 같은 결과 반환

## 비트 연산자

Kotlin에서는 비트 연산자가 함수 형태입니다:

```kotlin
shl(bits)  // signed shift left (Java의 <<)
shr(bits)  // signed shift right (Java의 >>)
ushr(bits) // unsigned shift right (Java의 >>>)
and(bits)  // bitwise and
or(bits)   // bitwise or
xor(bits)  // bitwise xor
inv()      // bitwise inversion

val x = (1 shl 2) and 0x000FF000
```

## 비교 연산자

```kotlin
=== // 객체가 완전히 동일한지 (참조 비교)
==  // equals()와 동일

val a: Int = 10000
print(a === a)  // true

val boxedA: Int? = a
val anotherBoxedA: Int? = a
print(boxedA === anotherBoxedA)  // false (다른 박싱 객체)
```

## 다음 단계

Kotlin의 기타 기능들에 대해 알아보았습니다. 다음으로 [코루틴과 동시성](/kotlin/kotlin-coroutines)에 대해 알아보세요.
