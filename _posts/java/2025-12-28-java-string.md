---
layout: post
title: "Java String 다루기 - 정규식, StringTokenizer, ReflectionToStringBuilder"
date: 2025-12-28 12:00:00 +0900
categories: java
tags: [java, string, regex, tokenizer]
description: "Java에서 String을 효율적으로 다루는 방법과 정규식 그룹, StringTokenizer, 객체 필드 출력 방법을 알아봅니다."
---

# Java String 다루기

Java에서 String을 효과적으로 다루는 여러 가지 방법을 살펴봅니다.

## 객체 필드를 문자열로 출력하기

디버깅이나 로깅 시 객체의 모든 필드 값을 보고 싶을 때 `ReflectionToStringBuilder`를 사용할 수 있습니다.

### Maven 의존성 추가

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.4</version>
</dependency>
```

### 사용 예시

```java
ReflectionToStringBuilder.toString(user, ToStringStyle.MULTI_LINE_STYLE)
```

출력 결과:
```
com.mms.mja.blog.demo.yaml.User@36d4b5c[
  name=Test User
  age=30
  address={line1=My Address Line 1, line2=Address line 2, city=Washington D.C., zip=20000}
  roles={User,Editor}
]
```

## 정규식 그룹 (Regex Groups)

정규식에서 그룹을 사용하면 특정 패턴을 캡처하고 대체할 수 있습니다.

### 기본 사용법

```java
String pattern = "(\\w)(\\s+)([\\.,])";
System.out.println(EXAMPLE_TEST.replaceAll(pattern, "$1$3"));
```

- `$1`, `$2`, `$3`은 각각 첫 번째, 두 번째, 세 번째 그룹을 참조합니다.

### 특수문자 이스케이프

```java
searchValue = searchValue.replaceAll("([\\\\\\%\\_])", "\\\\$1");
```

백슬래시, 퍼센트, 언더스코어와 같은 특수문자 앞에 백슬래시를 추가하는 예시입니다.

## StringTokenizer

문자열을 특정 구분자(delimiter)로 나누어 토큰화할 수 있습니다.

### 생성자

```java
StringTokenizer(String str, String delim)
```

- 기본 구분자는 공백(' ')입니다.

### 사용 예시

```java
for (StringTokenizer stringTokenizer = new StringTokenizer("test test test");
     stringTokenizer.hasMoreTokens(); ) {
    String s = stringTokenizer.nextToken();
    System.out.println(s);
}
```

출력:
```
test
test
test
```

### 다른 구분자 사용

```java
String nextToken(String delim)
```

`nextToken()` 메서드에 구분자를 전달하여 동적으로 구분자를 변경할 수도 있습니다.

## 문자열 배열 조인

배열의 요소들을 특정 구분자로 연결하는 유틸리티 메서드:

```java
public static String join(Object[] array, String delimiter) {
    if (array == null || array.length == 0) {
        return null;
    }
    if (delimiter == null) {
        delimiter = "";
    }
    StringBuilder b = new StringBuilder();
    for (int i = 0; i < array.length; i++) {
        b.append(String.valueOf(array[i]));
        if (i != array.length - 1) {
            b.append(delimiter);
        }
    }
    return b.toString();
}
```

Java 8 이상에서는 `String.join()` 또는 `Collectors.joining()`을 사용할 수 있습니다:

```java
// Java 8+
String result = String.join(", ", array);

// Stream 사용
String result = Arrays.stream(array)
    .map(String::valueOf)
    .collect(Collectors.joining(", "));
```

## 참고

- `StringTokenizer`는 레거시 클래스입니다. Java 8 이상에서는 `String.split()` 또는 Stream API 사용을 권장합니다.
- 정규식 성능이 중요한 경우 `Pattern.compile()`을 사용하여 패턴을 미리 컴파일하세요.
