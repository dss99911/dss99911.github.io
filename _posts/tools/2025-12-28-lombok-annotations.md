---
layout: post
title: "Lombok 완벽 가이드 - 모든 어노테이션 총정리"
date: 2025-12-28 12:08:00 +0900
categories: tools
tags: [lombok, java, annotation, boilerplate]
description: "Lombok의 모든 어노테이션을 예제와 함께 상세히 설명합니다. 보일러플레이트 코드를 줄이는 방법을 알아봅니다."
---

Lombok은 Java의 보일러플레이트 코드를 줄여주는 라이브러리입니다. 어노테이션 프로세싱을 통해 컴파일 시점에 코드를 생성합니다.

## 1. @Getter / @Setter

필드에 대한 getter/setter 메서드를 자동 생성합니다.

### Lombok 코드

```java
public class GetterSetterExample {
    @Getter @Setter private int age = 10;
    @Setter(AccessLevel.PROTECTED) private String name;
}
```

### 생성되는 코드

```java
public class GetterSetterExample {
    private int age = 10;
    private String name;

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    protected void setName(String name) {
        this.name = name;
    }
}
```

## 2. @Getter(lazy=true)

lazy initialization을 지원합니다. 처음 호출될 때만 값을 계산합니다.

```java
@Getter(lazy = true)
private final double[] cached = expensive();

private double[] expensive() {
    // 비용이 큰 연산
    return new double[1000000];
}
```

## 3. @NonNull

null 체크 코드를 자동 생성합니다.

### Lombok 코드

```java
public NonNullExample(@NonNull Person person) {
    super("Hello");
    this.name = person.getName();
}
```

### 생성되는 코드

```java
public NonNullExample(@NonNull Person person) {
    super("Hello");
    if (person == null) {
        throw new NullPointerException("person");
    }
    this.name = person.getName();
}
```

## 4. @ToString

toString() 메서드를 자동 생성합니다.

```java
@ToString
public class ToStringExample {
    private String name;
    private int age;
}
```

참고: [Lombok @ToString](https://projectlombok.org/features/ToString)

## 5. @EqualsAndHashCode

equals()와 hashCode() 메서드를 자동 생성합니다.

```java
@EqualsAndHashCode
public class EqualsExample {
    private String name;
    private int age;
}
```

참고: [Lombok @EqualsAndHashCode](https://projectlombok.org/features/EqualsAndHashCode)

## 6. @Data

다음 어노테이션들의 조합입니다:
- `@ToString`
- `@EqualsAndHashCode`
- `@Getter` (모든 필드)
- `@Setter` (non-final 필드)
- `@RequiredArgsConstructor`

```java
@Data
public class DataExample {
    private final String name;
    private int age;
}
```

참고: [Lombok @Data](https://projectlombok.org/features/Data)

## 7. @Value

`@Data`의 불변(immutable) 버전입니다. 모든 필드가 private final이 되고, setter는 생성되지 않습니다.

```java
@Value
public class ValueExample {
    String name;
    int age;
}
```

참고: [Lombok @Value](https://projectlombok.org/features/Value)

## 8. @Builder

빌더 패턴을 자동 구현합니다.

```java
@Builder
public class BuilderExample {
    private String name;
    private int age;
}

// 사용
BuilderExample example = BuilderExample.builder()
    .name("John")
    .age(30)
    .build();
```

참고: [Lombok @Builder](https://projectlombok.org/features/Builder)

## 9. @RequiredArgsConstructor

`final` 필드나 `@NonNull` 필드를 파라미터로 받는 생성자를 생성합니다.

```java
@RequiredArgsConstructor
public class ConstructorExample {
    private final String name;
    @NonNull private String email;
    private int age;  // 포함되지 않음
}
```

참고: [Lombok Constructor Annotations](https://projectlombok.org/features/constructor)

## 10. @Cleanup

리소스를 자동으로 정리합니다.

### Lombok 코드

```java
public static void main(String[] args) throws IOException {
    @Cleanup InputStream in = new FileInputStream(args[0]);
    @Cleanup OutputStream out = new FileOutputStream(args[1]);
    byte[] b = new byte[10000];
    while (true) {
        int r = in.read(b);
        if (r == -1) break;
        out.write(b, 0, r);
    }
}
```

### 생성되는 코드

```java
public static void main(String[] args) throws IOException {
    InputStream in = new FileInputStream(args[0]);
    try {
        OutputStream out = new FileOutputStream(args[1]);
        try {
            byte[] b = new byte[10000];
            while (true) {
                int r = in.read(b);
                if (r == -1) break;
                out.write(b, 0, r);
            }
        } finally {
            if (out != null) {
                out.close();
            }
        }
    } finally {
        if (in != null) {
            in.close();
        }
    }
}
```

## 11. @SneakyThrows

checked exception을 unchecked처럼 던질 수 있게 합니다.

```java
@SneakyThrows
public void run() {
    throw new IOException();  // catch 필요 없음
}
```

사용 사례:
- 예외가 발생할 가능성이 없는 경우
- Runnable 등 checked exception을 선언할 수 없는 인터페이스 구현 시

## 12. @Log / @Slf4j

로거를 자동 생성합니다.

### Lombok 코드

```java
@Slf4j
public class LogExample {
    public void doSomething() {
        log.info("Something happened");
    }
}
```

### 생성되는 코드

```java
public class LogExample {
    private static final org.slf4j.Logger log =
        org.slf4j.LoggerFactory.getLogger(LogExample.class);

    public void doSomething() {
        log.info("Something happened");
    }
}
```

지원하는 로거:
- `@Log` (java.util.logging)
- `@Log4j` / `@Log4j2`
- `@Slf4j`
- `@CommonsLog`
- `@JBossLog`

## 13. val

타입 추론과 final을 동시에 적용합니다.

```java
val list = new ArrayList<String>();
// 다음과 동일:
// final ArrayList<String> list = new ArrayList<String>();
```

## 14. 유용한 링크

- [Lombok 공식 문서 - 모든 기능](https://projectlombok.org/features/all)
- [Lombok 동작 원리](http://notatube.blogspot.in/2010/11/project-lombok-trick-explained.html)

## 15. 설치 및 설정

### Maven

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>
```

### Gradle

```groovy
compileOnly 'org.projectlombok:lombok:1.18.30'
annotationProcessor 'org.projectlombok:lombok:1.18.30'
```

### IDE 설정

IntelliJ IDEA:
1. `Settings > Plugins`에서 Lombok 플러그인 설치
2. `Settings > Build, Execution, Deployment > Compiler > Annotation Processors`에서 "Enable annotation processing" 활성화
