---
layout: post
title: "Kotlin 제네릭: in, out, 타입 파라미터"
date: 2025-12-28 12:06:00 +0900
categories: [programming, kotlin]
tags: [kotlin, generics, variance, in, out, reified]
description: "Kotlin의 제네릭 시스템을 알아봅니다. 공변성(out), 반공변성(in), 타입 제약, Star Projection에 대해 다룹니다."
image: /assets/images/posts/thumbnails/2025-12-28-kotlin-generics.png
---

Kotlin의 제네릭은 Java와 비슷하지만 `in`과 `out` 키워드를 통해 더 안전한 타입 시스템을 제공합니다.

## 기본 제네릭

### 클래스

```kotlin
class Box<T>(t: T) {
    var value = t
}

val box: Box<Int> = Box<Int>(1)

// 타입 추론 가능한 경우 생략
val box = Box(1)
```

### 함수

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts)
        result.add(t)
    return result
}
```

## 공변성과 반공변성

`Food -> FastFood -> Burger` 순으로 클래스가 확장된다고 가정합니다.

### out 키워드 (공변성, Covariance)

Java의 `? extends T`와 동일합니다.

- **의미**: T를 출력(return)만 하고, 입력(parameter)으로 받지 않음
- **용어**: Producer (생산자)
- **가능한 할당**: `Source<String>` -> `Source<Any>`

```kotlin
abstract class Source<out T> {
    abstract fun nextT(): T
}

fun demo(strs: Source<String>) {
    val objects: Source<Any> = strs  // OK! T는 out 파라미터
}
```

#### 지역 변수에서 out 사용

서브타입을 파라미터로 입력할 수 있습니다.

```kotlin
fun copy(from: Array<out Any>, to: Array<Any?>) {
    assert(from.size == to.size)
    for (i in from.indices)
        to[i] = from[i]
}

val ints: Array<Int> = arrayOf(1, 2, 3)
val any: Array<Any?> = arrayOfNulls(3)
copy(ints, any)  // ints를 from에 전달 가능
```

### in 키워드 (반공변성, Contravariance)

Java의 `? super T`와 동일합니다.

- **의미**: T를 입력(parameter)으로만 받고, 출력하지 않음
- **용어**: Consumer (소비자)
- **가능한 할당**: `Comparable<Number>` -> `Comparable<Double>`

```kotlin
abstract class Comparable<in T> {
    abstract fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
    x.compareTo(1.0)  // Double은 Number의 하위 타입
    val y: Comparable<Double> = x  // OK!
}
```

#### 지역 변수에서 in 사용

슈퍼타입을 파라미터로 입력할 수 있습니다.

```kotlin
fun fill(dest: Array<in Int>, value: Int) {
    dest[0] = value
}

val objects: Array<Any?> = arrayOfNulls(1)
fill(objects, 1)  // objects를 dest에 전달 가능
assertEquals(objects[0], 1)
```

## Star Projection (*)

`in`이나 `out`이 없는 경우, `*`로 어떤 타입이든 올 수 있음을 나타냅니다.

```kotlin
fun printArray(array: Array<*>) {
    array.forEach { println(it) }
}
```

## 제네릭 제약

### Upper Bound

Java의 `extends`와 동일합니다.

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) { ... }
```

### Multiple Upper Bounds

여러 제약을 걸 때는 `where` 절을 사용합니다.

```kotlin
fun <T> cloneWhenGreater(list: List<T>, threshold: T): List<T>
    where T : Comparable<T>,
          T : Cloneable {
    return list.filter { it > threshold }.map { it.clone() }
}
```

## 제네릭 확장 함수

모든 클래스에 적용되는 확장 함수를 만들 수 있습니다.

```kotlin
fun <T> T.basicToString(): String {
    return ""
}
```

## Platform Type (!)

Java에서 온 타입은 `T!`로 표현되며, `T` 또는 `T?`일 수 있습니다.

```kotlin
// T! means "T or T?"
```

## Reified 타입

inline 함수에서 제네릭 타입 정보를 런타임에 사용할 수 있습니다.

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}

// 사용
treeNode.findParentOfType<MyTreeNode>()
```

```kotlin
object YamlReader {
    inline fun <reified T> read(path: String): T =
        ObjectMapper(YAMLFactory()).readValue(File(path), T::class.java)
}
```

## 정리: in과 out 사용 시점

| 상황 | 키워드 | 예시 |
|------|--------|------|
| 값을 생산(return)만 함 | `out` | `Source<out T>`, `List<out T>` |
| 값을 소비(parameter)만 함 | `in` | `Comparable<in T>`, `Consumer<in T>` |
| 값을 생산하고 소비함 | 없음 | `MutableList<T>` |

## 다음 단계

제네릭에 대해 알아보았습니다. 다음으로 [확장 함수](/kotlin/kotlin-extensions)에 대해 알아보세요.
