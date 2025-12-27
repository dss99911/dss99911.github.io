---
layout: post
title: "Java 멀티스레드 프로그래밍 - Thread, synchronized, volatile"
date: 2025-12-28 12:02:00 +0900
categories: java
tags: [java, thread, concurrency, synchronized, volatile]
description: "Java에서 멀티스레드 프로그래밍을 위한 ThreadPoolExecutor, synchronized, volatile, atomic의 개념과 사용법을 알아봅니다."
---

# Java 멀티스레드 프로그래밍

Java에서 동시성(Concurrency)을 다루는 방법을 살펴봅니다.

## ThreadPoolExecutor

요청을 큐에 쌓고, 스레드 풀의 가용 범위 안에서 처리합니다.

### 기본 사용법

```java
BlockingQueue<Runnable> mDownloadWorkQueue = new LinkedBlockingQueue<Runnable>();

ThreadPoolExecutor executor = new ThreadPoolExecutor(
    CORE_POOL_SIZE,
    MAXIMUM_POOL_SIZE,
    KEEP_ALIVE_TIME,
    KEEP_ALIVE_TIME_UNIT,
    mDownloadWorkQueue
);
```

### 주요 개념

- **corePoolSize**: 유휴 스레드가 있어도 이 크기까지 스레드가 증가합니다.
- **maximumPoolSize**: 스레드 풀의 최대 크기입니다.
- **keepAliveTime**: corePoolSize를 초과하는 유휴 스레드가 이 시간 이상 유휴 상태면 종료됩니다.

### LinkedBlockingQueue

- **Linked**: LinkedList 기반 구현
- **Blocking**: 큐가 가득 차면 추가 작업이 큐가 빌 때까지 블록됩니다.

## Thread Interrupt

스레드를 안전하게 중단하는 방법입니다.

```java
// 다른 스레드에서 인터럽트 발생
thread.interrupt();

// 스레드 내부에서 인터럽트 체크
if (Thread.interrupted()) {
    return;
}

// sleep 중 인터럽트가 걸리면 InterruptedException 발생
try {
    Thread.sleep(1000);
    System.out.println("task");
} catch (InterruptedException e) {
    throw new RuntimeException("Thread interrupted..." + e);
}
```

## synchronized, volatile, atomic

동시성 제어를 위한 세 가지 접근 방식의 차이점을 이해하는 것이 중요합니다.

### 두 가지 핵심 개념

1. **Mutual Exclusion (상호 배제)**: 한 번에 하나의 스레드만 임계 영역(critical section)을 실행할 수 있습니다.
2. **Visibility (가시성)**: 한 스레드가 공유 데이터를 변경하면 다른 스레드에서 그 변경 사항이 보입니다.

### volatile

`volatile`은 가시성만 보장하고, 상호 배제는 보장하지 않습니다.

```java
private volatile boolean flag = false;
```

**동작 원리:**
- 하드웨어 상 스레드별로 static 변수에 대해 CPU 캐시를 가지고 있습니다.
- `volatile`은 이 캐시를 사용하지 않고 항상 메인 메모리에서 읽고 씁니다.
- 따라서 다른 스레드의 변경 사항이 즉시 반영됩니다.

**주의:** 대부분의 경우 상호 배제와 가시성이 모두 필요하므로, `volatile`만으로는 충분하지 않습니다.

### synchronized

상호 배제와 가시성을 모두 보장합니다.

```java
// 인스턴스 메서드에 사용 - 객체 단위 락
public synchronized void method() {
    // ...
}

// static 메서드에 사용 - 클래스 단위 락
public static synchronized void staticMethod() {
    // ...
}

// 블록 사용 - 특정 객체에 대한 락
synchronized(object) {
    // ...
}

// 클래스 단위 락
synchronized(Apple.class) {
    // ...
}
```

**중요:** 메서드에 붙는 `synchronized` 키워드는:
- 멤버 메서드: 해당 객체에 대한 락
- static 메서드: 해당 클래스에 대한 락

### atomic

`java.util.concurrent.atomic` 패키지의 클래스들은 락 없이 원자적 연산을 제공합니다.

```java
AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();  // 원자적 증가
counter.compareAndSet(expected, newValue);  // CAS 연산
```

## 비교표

| 특성 | volatile | synchronized | atomic |
|------|----------|--------------|--------|
| 상호 배제 | X | O | O (연산 단위) |
| 가시성 | O | O | O |
| 성능 | 좋음 | 보통 | 좋음 |
| 복합 연산 | X | O | 제한적 |

## 참고사항

- 단순 플래그 읽기/쓰기만 필요한 경우 `volatile`을 사용할 수 있습니다.
- 복합 연산(read-modify-write)이 필요하면 `synchronized`나 `atomic`을 사용하세요.
- 카운터나 누적 값에는 `AtomicInteger`, `AtomicLong` 등이 효율적입니다.

## 참고 자료

- [GeeksforGeeks - Volatile keyword in Java](https://www.geeksforgeeks.org/volatile-keyword-in-java/)
