---
layout: post
title: "Java Stream과 Lambda 완벽 가이드"
date: 2025-12-28 12:01:00 +0900
categories: [programming, java]
tags: [java, stream, lambda, functional-programming, flatmap]
description: "Java 8의 Stream API와 Lambda 표현식을 활용하는 방법을 상세히 알아봅니다. flatMap, 메서드 참조, 생성자 참조까지 다룹니다."
image: /assets/images/posts/thumbnails/2025-12-28-java-stream-lambda.png
---

# Java Stream과 Lambda

Java 8에서 도입된 함수형 프로그래밍 기능인 Stream API와 Lambda 표현식을 살펴봅니다.

## Lambda 표현식

### 기본 문법

```java
(argument-list) -> {body}
```

### 인터페이스 구현

익명 클래스 대신 Lambda를 사용하여 간결하게 표현할 수 있습니다.

```java
interface Drawable {
    public void draw();
}
```

익명 클래스:
```java
Drawable d = new Drawable() {
    public void draw() {
        System.out.println("Drawing " + width);
    }
};
```

Lambda:
```java
Drawable d2 = () -> {
    System.out.println("Drawing " + width);
};
```

### 다중 파라미터

```java
interface Addable {
    int add(int a, int b);
}

public class LambdaExpressionExample {
    public static void main(String[] args) {
        // 타입 추론 사용
        Addable ad1 = (a, b) -> (a + b);
        System.out.println(ad1.add(10, 20));  // 30

        // 명시적 타입 선언
        Addable ad2 = (int a, int b) -> (a + b);
        System.out.println(ad2.add(100, 200));  // 300
    }
}
```

### forEach 루프

```java
List<String> list = new ArrayList<>();
list.add("ankit");
list.add("mayank");
list.add("irfan");
list.add("jai");

list.forEach(n -> System.out.println(n));
```

## 메서드 참조

### 정적 메서드 참조

```java
ContainingClass::staticMethodName
```

```java
interface Sayable {
    void say();
}

public class MethodReference {
    public static void saySomething() {
        System.out.println("Hello, this is static method.");
    }

    public static void main(String[] args) {
        Sayable sayable = MethodReference::saySomething;
        sayable.say();
    }
}
```

스레드에서 활용:
```java
Thread t2 = new Thread(MethodReference::ThreadStatus);
t2.start();
```

다중 파라미터:
```java
class Arithmetic {
    public static int add(int a, int b) {
        return a + b;
    }
}

BiFunction<Integer, Integer, Integer> adder = Arithmetic::add;
int result = adder.apply(10, 20);  // 30
```

### 인스턴스 메서드 참조

```java
containingObject::instanceMethodName
```

```java
interface Sayable {
    void say();
}

public class MethodReference {
    public void saySomething() {
        System.out.println("Hello, this is non-static method.");
    }

    public static void main(String[] args) {
        MethodReference methodReference = new MethodReference();
        Sayable sayable = methodReference::saySomething;
        sayable.say();

        // 익명 객체 사용
        Sayable sayable2 = new MethodReference()::saySomething;
        sayable2.say();
    }
}
```

### 생성자 참조

```java
ClassName::new
```

```java
interface Messageable {
    Message getMessage(String msg);
}

class Message {
    public Message(String msg) {
        System.out.print(msg);
    }
}

public class ConstructorReference {
    public static void main(String[] args) {
        Messageable hello = Message::new;
        hello.getMessage("Hello");
    }
}
```

## Stream flatMap

`map` 연산이 하나의 요소를 하나의 요소로 변환하는 반면, `flatMap`은 하나의 요소를 여러 개의 요소(또는 0개)로 변환할 수 있습니다.

### 계층 구조 예시

```java
class Foo {
    String name;
    List<Bar> bars = new ArrayList<>();

    Foo(String name) {
        this.name = name;
    }
}

class Bar {
    String name;

    Bar(String name) {
        this.name = name;
    }
}
```

### 데이터 생성

```java
List<Foo> foos = new ArrayList<>();

// Foo 객체 생성
IntStream
    .range(1, 4)
    .forEach(i -> foos.add(new Foo("Foo" + i)));

// Bar 객체 생성
foos.forEach(f ->
    IntStream
        .range(1, 4)
        .forEach(i -> f.bars.add(new Bar("Bar" + i + " <- " + f.name))));
```

### flatMap 사용

```java
foos.stream()
    .flatMap(f -> f.bars.stream())
    .forEach(b -> System.out.println(b.name));

// 출력:
// Bar1 <- Foo1
// Bar2 <- Foo1
// Bar3 <- Foo1
// Bar1 <- Foo2
// Bar2 <- Foo2
// Bar3 <- Foo2
// Bar1 <- Foo3
// Bar2 <- Foo3
// Bar3 <- Foo3
```

3개의 Foo 객체가 9개의 Bar 객체로 변환됩니다.

### 한 줄로 표현하기

```java
IntStream.range(1, 4)
    .mapToObj(i -> new Foo("Foo" + i))
    .peek(f -> IntStream.range(1, 4)
        .mapToObj(i -> new Bar("Bar" + i + " <- " + f.name))
        .forEach(f.bars::add))
    .flatMap(f -> f.bars.stream())
    .forEach(b -> System.out.println(b.name));
```

## Optional의 flatMap

`flatMap`은 `Optional` 클래스에서도 사용할 수 있어 null 체크를 우아하게 처리할 수 있습니다.

### 중첩 구조 예시

```java
class Outer {
    Nested nested;
}

class Nested {
    Inner inner;
}

class Inner {
    String foo;
}
```

### 기존 방식 (null 체크)

```java
Outer outer = new Outer();
if (outer != null && outer.nested != null && outer.nested.inner != null) {
    System.out.println(outer.nested.inner.foo);
}
```

### Optional flatMap 사용

```java
Optional.of(new Outer())
    .flatMap(o -> Optional.ofNullable(o.nested))
    .flatMap(n -> Optional.ofNullable(n.inner))
    .flatMap(i -> Optional.ofNullable(i.foo))
    .ifPresent(System.out::println);
```

각 `flatMap` 호출은 객체가 존재하면 해당 객체를 감싸는 `Optional`을, 없으면 빈 `Optional`을 반환합니다.

## 정리

| 개념 | 설명 |
|------|------|
| Lambda | 익명 함수를 간결하게 표현 |
| 메서드 참조 | 기존 메서드를 Lambda 대신 사용 |
| 생성자 참조 | 생성자를 메서드 참조처럼 사용 |
| map | 1:1 변환 |
| flatMap | 1:N 변환 (스트림 평탄화) |
| Optional.flatMap | null-safe한 중첩 객체 접근 |
