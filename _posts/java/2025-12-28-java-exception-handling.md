---
layout: post
title: "Java 예외 처리 - try-finally와 try-with-resources"
date: 2025-12-28 12:12:00 +0900
categories: java
tags: [java, exception, try-catch, try-with-resources]
description: "Java에서 예외를 처리하는 방법과 리소스 관리를 위한 try-finally, try-with-resources 패턴을 알아봅니다."
---

# Java 예외 처리

Java에서 예외를 처리하고 리소스를 안전하게 관리하는 방법을 살펴봅니다.

## try-finally 패턴

### 사용 이유

메서드를 끝낼 때 처리해야 할 작업이 있는데, 여러 분기에서 return하는 경우를 생각해 봅시다.

**문제 상황:**
```java
public void process() {
    Resource resource = acquire();

    if (condition1) {
        cleanup();  // 정리 코드 중복
        return;
    }

    if (condition2) {
        cleanup();  // 정리 코드 중복
        return;
    }

    // 처리 로직
    cleanup();  // 정리 코드 중복
}
```

**해결책 - finally 사용:**
```java
public void process() {
    Resource resource = acquire();
    try {
        if (condition1) {
            return;
        }

        if (condition2) {
            return;
        }

        // 처리 로직
    } finally {
        cleanup();  // 한 번만 작성
    }
}
```

`finally` 블록은 어떤 경로로 메서드를 빠져나가든 항상 실행됩니다.

## 리소스 관리

### 전통적인 방식 (try-finally)

```java
private static void printFile() throws IOException {
    InputStream input = null;

    try {
        input = new FileInputStream("file.txt");

        int data = input.read();
        while (data != -1) {
            System.out.print((char) data);
            data = input.read();
        }
    } finally {
        if (input != null) {
            input.close();
        }
    }
}
```

### 개선된 방식 (try-with-resources, Java 7+)

`AutoCloseable` 인터페이스를 구현한 리소스는 자동으로 닫힙니다.

```java
private static void printFile() throws IOException {
    try (InputStream input = new FileInputStream("file.txt")) {
        int data = input.read();
        while (data != -1) {
            System.out.print((char) data);
            data = input.read();
        }
    }
    // input.close()가 자동 호출됨
}
```

### 여러 리소스 관리

```java
try (FileInputStream fis = new FileInputStream("input.txt");
     FileOutputStream fos = new FileOutputStream("output.txt");
     BufferedReader reader = new BufferedReader(new InputStreamReader(fis))) {

    String line;
    while ((line = reader.readLine()) != null) {
        fos.write(line.getBytes());
    }
}
// 모든 리소스가 역순으로 자동 close됨
```

## try-catch-finally 실행 순서

```java
try {
    // 1. 정상 실행 시도
    riskyOperation();
} catch (Exception e) {
    // 2. 예외 발생 시 실행
    handleException(e);
} finally {
    // 3. 항상 실행 (정상/예외 모두)
    cleanup();
}
```

### return과 finally

```java
public int getValue() {
    try {
        return 1;
    } finally {
        System.out.println("finally 실행");  // return 전에 실행됨
    }
}
```

**주의:** finally에서 return하면 try의 return을 덮어씁니다 (권장하지 않음).

## 예외 처리 모범 사례

### 1. 구체적인 예외 잡기

```java
// 좋음
try {
    readFile();
} catch (FileNotFoundException e) {
    // 파일 없음 처리
} catch (IOException e) {
    // 기타 IO 오류 처리
}

// 나쁨
try {
    readFile();
} catch (Exception e) {
    // 모든 예외를 동일하게 처리
}
```

### 2. 예외 정보 보존

```java
try {
    // ...
} catch (IOException e) {
    throw new MyException("파일 처리 중 오류", e);  // 원인 예외 포함
}
```

### 3. 리소스는 try-with-resources 사용

```java
// 권장
try (Connection conn = getConnection();
     PreparedStatement stmt = conn.prepareStatement(sql)) {
    // ...
}
```

## 정리

| 패턴 | 사용 시점 |
|------|----------|
| try-catch | 예외를 처리해야 할 때 |
| try-finally | 정리 작업이 필요할 때 |
| try-with-resources | AutoCloseable 리소스 관리 |
| try-catch-finally | 예외 처리와 정리 작업 모두 필요할 때 |

Java 7 이상에서는 리소스 관리에 반드시 try-with-resources를 사용하세요. 코드가 간결해지고 리소스 누수를 방지할 수 있습니다.
