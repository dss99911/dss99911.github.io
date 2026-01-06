---
layout: post
title: "Java Annotation Processor와 코드 생성 기법"
date: 2025-12-28 12:07:00 +0900
categories: [programming, java]
tags: [java, annotation, lombok, code-generation]
description: "Java Annotation Processor의 동작 원리와 Lombok이 사용하는 코드 생성 기법을 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-java-annotation-processor.png
---

# Java Annotation Processor와 코드 생성 기법

Java에서 컴파일 타임에 코드를 생성하거나 변경하는 여러 가지 기법을 살펴봅니다.

## Annotation Processor 개요

Annotation Processor는 컴파일 타임에 어노테이션을 처리하여 추가적인 작업을 수행합니다.

## 코드 생성/변경 기법

### 1. Java 소스 파일 추가 (표준 방식)

Annotation Processor의 일반적인 사용 방식입니다.

- 기존 소스 파일을 수정하지 않음
- 새로운 Java 소스 파일을 생성
- 예: Dagger, MapStruct, AutoValue

```java
@AutoValue
public abstract class Person {
    public abstract String name();
    public abstract int age();

    public static Person create(String name, int age) {
        return new AutoValue_Person(name, age);
    }
}
// AutoValue_Person.java가 자동 생성됨
```

### 2. 소스 파일 직접 수정 (Lombok 방식)

Lombok은 Eclipse/javac 컴파일러의 내부 API를 사용하여 AST(Abstract Syntax Tree)를 직접 수정합니다.

**특징:**
- 기존 클래스에 코드를 주입
- 컴파일러 종속적인 방법 사용
- 표준이 아닌 내부 API 사용

**참고 문서:** [Project Lombok Trick Explained](http://notatube.blogspot.in/2010/11/project-lombok-trick-explained.html)

### 3. 런타임 바이트코드 조작

CGLib이나 ASM 같은 라이브러리를 사용하여 런타임에 바이트코드를 조작합니다.

**사용 사례:**
- Spring AOP의 프록시 생성
- Hibernate의 Lazy Loading
- Mockito의 Mock 객체 생성

```java
// CGLib을 사용한 프록시 생성 예시
Enhancer enhancer = new Enhancer();
enhancer.setSuperclass(MyClass.class);
enhancer.setCallback(new MethodInterceptor() {
    @Override
    public Object intercept(Object obj, Method method,
            Object[] args, MethodProxy proxy) throws Throwable {
        // 메서드 호출 전후 처리
        return proxy.invokeSuper(obj, args);
    }
});
MyClass proxy = (MyClass) enhancer.create();
```

### 4. 클래스 파일 바이트코드 후처리

컴파일된 .class 파일을 빌드 단계에서 수정합니다.

**특징:**
- 빌드 파이프라인에 통합
- 컴파일 후 별도의 처리 단계 필요
- AspectJ의 컴파일 타임 위빙 등

## 기법 비교

| 기법 | 시점 | 장점 | 단점 |
|------|------|------|------|
| 소스 파일 추가 | 컴파일 타임 | 표준 방식, 투명함 | 새 클래스 필요 |
| AST 수정 | 컴파일 타임 | 기존 클래스 수정 | 컴파일러 종속 |
| 런타임 바이트코드 | 런타임 | 유연함 | 성능 오버헤드 |
| 클래스 파일 후처리 | 빌드 타임 | 강력함 | 빌드 복잡도 증가 |

## Lombok 동작 원리

Lombok이 `@Data` 어노테이션을 처리하는 과정:

1. **javac 실행**: 컴파일러가 Lombok을 Annotation Processor로 로드
2. **AST 접근**: 컴파일러의 내부 API를 통해 AST에 접근
3. **AST 수정**: getter, setter, equals, hashCode 등의 메서드를 AST에 추가
4. **바이트코드 생성**: 수정된 AST로부터 바이트코드 생성

이는 공식 API가 아닌 내부 API를 사용하므로:
- Java 버전 업그레이드 시 호환성 문제 가능
- IDE 플러그인 필요 (실제 소스에는 없는 메서드이므로)

## 정리

- 표준적인 코드 생성이 필요하면 **Annotation Processor**를 통한 소스 파일 추가
- 기존 클래스 수정이 필요하면 **Lombok** 스타일 또는 **바이트코드 조작** 고려
- 런타임 동적 기능이 필요하면 **CGLib/ASM** 활용
