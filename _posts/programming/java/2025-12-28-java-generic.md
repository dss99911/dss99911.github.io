---
layout: post
title: "Java Generic 활용하기"
date: 2025-12-28 12:05:00 +0900
categories: [programming, java]
tags: [java, generic, type-parameter]
description: "Java Generic의 고급 활용법을 알아봅니다. 메서드 레벨 제네릭과 타입 추론을 포함합니다."
---

# Java Generic 활용하기

Java Generic을 활용하면 타입 안전성을 유지하면서 재사용 가능한 코드를 작성할 수 있습니다.

## 메서드 레벨 Generic

메서드 호출 시 반환 타입을 호출자가 결정할 수 있게 하는 패턴입니다.

### 기본 사용법

```java
<T> T getT() {
    // ...
}
```

호출 시 반환 타입에 따라 자동으로 타입이 추론됩니다:

```java
Integer t = getT();  // T는 Integer로 추론
String t = getT();   // T는 String으로 추론
```

## Sneaky Throw 패턴

Lombok에서 사용하는 고급 Generic 기법입니다. Checked Exception을 Unchecked Exception처럼 던질 수 있게 합니다.

```java
public static RuntimeException sneakyThrow(Throwable t) {
    if (t == null) throw new NullPointerException("t");
    Lombok.<RuntimeException>sneakyThrow0(t);
    return null;
}

@SuppressWarnings("unchecked")
private static <T extends Throwable> void sneakyThrow0(Throwable t) throws T {
    throw (T) t;
}
```

### 동작 원리

1. `sneakyThrow0` 메서드는 제네릭 타입 `T`가 `Throwable`을 상속받도록 제한합니다.
2. 호출 시 `Lombok.<RuntimeException>sneakyThrow0(t)`로 타입을 명시적으로 지정합니다.
3. 컴파일러는 `RuntimeException`으로 타입을 추론하지만, 실제로는 어떤 Throwable이든 던질 수 있습니다.
4. 이는 Java의 제네릭이 컴파일 타임에만 검사되고, 런타임에는 타입 정보가 지워지는(Type Erasure) 특성을 이용합니다.

## 제네릭 메서드 명시적 호출

제네릭 메서드를 호출할 때 타입을 명시적으로 지정할 수 있습니다:

```java
// 명시적 타입 지정
String result = ClassName.<String>genericMethod();

// 타입 추론
String result = ClassName.genericMethod();
```

## Bounded Type Parameter

타입 파라미터에 제약을 둘 수 있습니다:

```java
// T는 Number를 상속받는 타입만 가능
public <T extends Number> double sum(List<T> numbers) {
    return numbers.stream()
        .mapToDouble(Number::doubleValue)
        .sum();
}
```

## 다중 바운드

여러 타입을 동시에 상속받도록 제약할 수 있습니다:

```java
// T는 Comparable과 Serializable을 모두 구현해야 함
public <T extends Comparable<T> & Serializable> T max(T a, T b) {
    return a.compareTo(b) > 0 ? a : b;
}
```

## 와일드카드

### 상한 경계 (Upper Bounded)

```java
// Number 또는 그 하위 타입
public void process(List<? extends Number> list) {
    // 읽기만 가능, 쓰기 불가
}
```

### 하한 경계 (Lower Bounded)

```java
// Integer 또는 그 상위 타입
public void addNumbers(List<? super Integer> list) {
    list.add(1);  // 쓰기 가능
    list.add(2);
}
```

### PECS 원칙

Producer-Extends, Consumer-Super

- **Producer**: 데이터를 제공하는 경우 `? extends T`
- **Consumer**: 데이터를 소비하는 경우 `? super T`

```java
public void copy(List<? extends T> source, List<? super T> destination) {
    for (T item : source) {
        destination.add(item);
    }
}
```

## 정리

| 문법 | 의미 | 용도 |
|------|------|------|
| `<T>` | 타입 파라미터 | 클래스/메서드 정의 |
| `<T extends X>` | 상한 경계 | T는 X의 하위 타입 |
| `<? extends T>` | 와일드카드 상한 | 읽기 전용 |
| `<? super T>` | 와일드카드 하한 | 쓰기 전용 |
| `<?>` | 무제한 와일드카드 | 모든 타입 허용 |
