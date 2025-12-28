---
layout: post
title: "Java 싱글톤 패턴 구현하기"
date: 2025-12-28 12:11:00 +0900
categories: [programming, java]
tags: [java, design-pattern, singleton]
description: "Java에서 싱글톤 패턴을 구현하는 방법과 static 초기화 블록을 활용한 안전한 구현을 알아봅니다."
---

# Java 싱글톤 패턴 구현하기

싱글톤 패턴은 클래스의 인스턴스가 하나만 존재하도록 보장하는 디자인 패턴입니다.

## Static 초기화 블록을 이용한 구현

클래스 로딩 시점에 인스턴스를 생성하는 방법입니다.

```java
public class PhotoManager {

    private static final PhotoManager sInstance;
    private static final TimeUnit KEEP_ALIVE_TIME_UNIT;

    static {
        // 상수 초기화
        KEEP_ALIVE_TIME_UNIT = TimeUnit.SECONDS;

        // 싱글톤 인스턴스 생성
        sInstance = new PhotoManager();
    }

    // private 생성자
    private PhotoManager() {
        // 초기화 로직
    }

    public static PhotoManager getInstance() {
        return sInstance;
    }
}
```

## 다양한 싱글톤 구현 방법

### 1. Eager Initialization (즉시 초기화)

```java
public class Singleton {
    private static final Singleton INSTANCE = new Singleton();

    private Singleton() {}

    public static Singleton getInstance() {
        return INSTANCE;
    }
}
```

**장점:** 간단하고 스레드 안전
**단점:** 사용하지 않아도 인스턴스 생성됨

### 2. Lazy Initialization with synchronized

```java
public class Singleton {
    private static Singleton instance;

    private Singleton() {}

    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

**장점:** 필요할 때만 생성
**단점:** 매번 동기화 오버헤드

### 3. Double-Checked Locking

```java
public class Singleton {
    private static volatile Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

**장점:** Lazy + 효율적인 동기화
**주의:** `volatile` 키워드 필수 (Java 5+)

### 4. Initialization-on-demand Holder (권장)

```java
public class Singleton {
    private Singleton() {}

    private static class Holder {
        private static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return Holder.INSTANCE;
    }
}
```

**장점:**
- Lazy initialization
- 스레드 안전 (클래스 로딩 메커니즘 활용)
- 동기화 오버헤드 없음

### 5. Enum Singleton (Effective Java 권장)

```java
public enum Singleton {
    INSTANCE;

    public void doSomething() {
        // 메서드 구현
    }
}
```

**장점:**
- 직렬화 안전
- 리플렉션 공격 방어
- 가장 간결함

**사용:**
```java
Singleton.INSTANCE.doSomething();
```

## 구현 방법 비교

| 방법 | Lazy | 스레드 안전 | 직렬화 안전 | 복잡도 |
|------|------|------------|------------|--------|
| Eager | X | O | X | 낮음 |
| Synchronized | O | O | X | 낮음 |
| Double-Checked | O | O | X | 중간 |
| Holder | O | O | X | 낮음 |
| Enum | X | O | O | 낮음 |

## 직렬화 문제 해결

Enum 외의 방법에서 직렬화 시 새 인스턴스가 생성되는 것을 방지:

```java
public class Singleton implements Serializable {
    private static final long serialVersionUID = 1L;
    private static final Singleton INSTANCE = new Singleton();

    private Singleton() {}

    public static Singleton getInstance() {
        return INSTANCE;
    }

    // 역직렬화 시 기존 인스턴스 반환
    protected Object readResolve() {
        return INSTANCE;
    }
}
```

## 권장사항

1. 대부분의 경우: **Holder 패턴** 사용
2. 직렬화가 필요한 경우: **Enum 싱글톤** 사용
3. Spring 환경: 스프링 빈으로 관리 (기본이 싱글톤 스코프)

## 주의사항

- 싱글톤은 전역 상태를 만들어 테스트를 어렵게 할 수 있습니다.
- 가능하면 의존성 주입(DI)을 고려하세요.
- 멀티스레드 환경에서는 상태 관리에 주의하세요.
