---
layout: post
title: "Java 테스트 작성하기 - JUnit 기초"
date: 2025-12-28 12:08:00 +0900
categories: [programming, java]
tags: [java, junit, testing, unit-test]
description: "JUnit을 사용한 Java 단위 테스트 작성 방법과 생명주기 어노테이션을 알아봅니다."
---

# Java 테스트 작성하기 - JUnit 기초

JUnit은 Java에서 가장 널리 사용되는 테스트 프레임워크입니다. 기본적인 생명주기 어노테이션을 살펴봅니다.

## 생명주기 어노테이션

### @Before

각 테스트 메서드 실행 전에 호출됩니다.

```java
@Before
public void setUp() {
    // 각 테스트 전 초기화 작업
}
```

### @After

각 테스트 메서드 실행 후에 호출됩니다.

```java
@After
public void tearDown() {
    // 각 테스트 후 정리 작업
}
```

### @BeforeClass

테스트 클래스의 모든 테스트 실행 전에 한 번만 호출됩니다.

```java
@BeforeClass
public static void setUpClass() {
    // 클래스 레벨 초기화 (static이어야 함)
}
```

**주의:** `@BeforeClass`가 붙은 메서드는 반드시 `static`이어야 합니다.

### @AfterClass

테스트 클래스의 모든 테스트 실행 후에 한 번만 호출됩니다.

```java
@AfterClass
public static void tearDownClass() {
    // 클래스 레벨 정리 (static이어야 함)
}
```

## 실행 순서

```
@BeforeClass (1회)
  ├─ @Before
  │    └─ @Test (test1)
  ├─ @After
  ├─ @Before
  │    └─ @Test (test2)
  ├─ @After
  └─ ...
@AfterClass (1회)
```

## 전체 예시

```java
public class CalculatorTest {

    private Calculator calculator;

    @BeforeClass
    public static void setUpClass() {
        System.out.println("테스트 클래스 시작");
        // 데이터베이스 연결, 테스트 데이터 로드 등
    }

    @AfterClass
    public static void tearDownClass() {
        System.out.println("테스트 클래스 종료");
        // 데이터베이스 연결 해제, 리소스 정리 등
    }

    @Before
    public void setUp() {
        System.out.println("테스트 시작");
        calculator = new Calculator();
    }

    @After
    public void tearDown() {
        System.out.println("테스트 종료");
        calculator = null;
    }

    @Test
    public void testAdd() {
        assertEquals(5, calculator.add(2, 3));
    }

    @Test
    public void testSubtract() {
        assertEquals(1, calculator.subtract(3, 2));
    }
}
```

## JUnit 4 vs JUnit 5

| JUnit 4 | JUnit 5 | 설명 |
|---------|---------|------|
| `@Before` | `@BeforeEach` | 각 테스트 전 |
| `@After` | `@AfterEach` | 각 테스트 후 |
| `@BeforeClass` | `@BeforeAll` | 클래스 전체 전 |
| `@AfterClass` | `@AfterAll` | 클래스 전체 후 |
| `@Test` | `@Test` | 테스트 메서드 |
| `@Ignore` | `@Disabled` | 테스트 비활성화 |

## JUnit 5 예시

```java
import org.junit.jupiter.api.*;

class CalculatorTest {

    @BeforeAll
    static void setUpClass() {
        // 클래스 레벨 초기화
    }

    @BeforeEach
    void setUp() {
        // 각 테스트 전 초기화
    }

    @Test
    void testAdd() {
        // 테스트 코드
    }

    @AfterEach
    void tearDown() {
        // 각 테스트 후 정리
    }

    @AfterAll
    static void tearDownClass() {
        // 클래스 레벨 정리
    }
}
```

## 참고

- JUnit 5에서는 테스트 클래스와 메서드가 `public`이 아니어도 됩니다.
- `@BeforeAll`과 `@AfterAll`은 기본적으로 `static`이어야 하지만, `@TestInstance(Lifecycle.PER_CLASS)` 사용 시 인스턴스 메서드로 사용 가능합니다.
