---
layout: post
title: "Java 파일 입출력 기초"
date: 2025-12-28 12:15:00 +0900
categories: java
tags: [java, file, io, nio]
description: "Java에서 파일을 다루는 기본적인 방법을 알아봅니다. 임시 파일 생성과 파일 작업의 기초를 다룹니다."
---

# Java 파일 입출력 기초

Java에서 파일을 다루는 기본적인 방법을 살펴봅니다.

## 임시 파일 생성

유니크한 이름을 가진 임시 파일을 생성할 수 있습니다.

### File.createTempFile()

```java
File tempFile = File.createTempFile("prefix-", ".zip");
// 결과: prefix-12312124.zip (유니크한 숫자가 자동으로 붙음)
```

**특징:**
- 시스템 임시 디렉토리에 생성됨
- 파일명에 유니크한 숫자가 자동 추가됨
- 충돌 없이 안전하게 파일 생성

### 지정된 디렉토리에 생성

```java
File directory = new File("/custom/temp/dir");
File tempFile = File.createTempFile("prefix-", ".zip", directory);
```

### NIO.2 사용 (Java 7+)

```java
import java.nio.file.Files;
import java.nio.file.Path;

// 임시 파일 생성
Path tempFile = Files.createTempFile("prefix", ".suffix");

// 임시 디렉토리 생성
Path tempDir = Files.createTempDirectory("prefix");
```

## 파일 자동 삭제

### deleteOnExit()

JVM 종료 시 파일을 자동으로 삭제합니다.

```java
File tempFile = File.createTempFile("temp", ".txt");
tempFile.deleteOnExit();
```

**주의사항:**
- 정상 종료 시에만 동작
- 강제 종료 시 삭제되지 않음
- 많은 파일에 사용 시 메모리 문제 가능

### try-with-resources로 파일 삭제

```java
Path tempFile = Files.createTempFile("temp", ".txt");
try {
    // 파일 사용
    Files.write(tempFile, "content".getBytes());
    // ...
} finally {
    Files.deleteIfExists(tempFile);
}
```

## 기본 파일 작업 (NIO.2)

### 파일 읽기

```java
// 전체 내용 읽기
String content = Files.readString(Path.of("file.txt"));

// 라인별 읽기
List<String> lines = Files.readAllLines(Path.of("file.txt"));

// 바이트 배열로 읽기
byte[] bytes = Files.readAllBytes(Path.of("file.bin"));
```

### 파일 쓰기

```java
// 문자열 쓰기
Files.writeString(Path.of("file.txt"), "content");

// 라인 쓰기
List<String> lines = Arrays.asList("line1", "line2");
Files.write(Path.of("file.txt"), lines);

// 바이트 쓰기
Files.write(Path.of("file.bin"), byteArray);
```

### 파일 복사/이동

```java
// 복사
Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);

// 이동
Files.move(source, target, StandardCopyOption.ATOMIC_MOVE);
```

## 파일 정보 확인

```java
Path path = Path.of("file.txt");

boolean exists = Files.exists(path);
boolean isDirectory = Files.isDirectory(path);
boolean isRegularFile = Files.isRegularFile(path);
long size = Files.size(path);
FileTime lastModified = Files.getLastModifiedTime(path);
```

## 디렉토리 작업

```java
// 디렉토리 생성
Files.createDirectory(Path.of("newDir"));

// 중첩 디렉토리 생성
Files.createDirectories(Path.of("parent/child/grandchild"));

// 디렉토리 내용 나열
try (Stream<Path> stream = Files.list(Path.of("dir"))) {
    stream.forEach(System.out::println);
}

// 재귀적으로 탐색
try (Stream<Path> stream = Files.walk(Path.of("dir"))) {
    stream.filter(Files::isRegularFile)
          .forEach(System.out::println);
}
```

## 정리

| 작업 | 권장 방법 |
|------|----------|
| 임시 파일 | Files.createTempFile() |
| 파일 읽기 | Files.readString(), Files.readAllLines() |
| 파일 쓰기 | Files.writeString(), Files.write() |
| 파일 복사 | Files.copy() |
| 파일 이동 | Files.move() |

Java 7 이상에서는 NIO.2 (java.nio.file) 패키지를 사용하는 것이 권장됩니다. 더 직관적이고 강력한 API를 제공합니다.
