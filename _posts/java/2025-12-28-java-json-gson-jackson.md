---
layout: post
title: "Java JSON 처리 - Gson과 Jackson 사용법"
date: 2025-12-28 12:04:00 +0900
categories: java
tags: [java, json, gson, jackson, serialization]
description: "Java에서 JSON을 처리하는 두 가지 인기 라이브러리인 Gson과 Jackson의 사용법을 알아봅니다."
---

# Java JSON 처리 - Gson과 Jackson

Java에서 JSON을 다루는 두 가지 대표적인 라이브러리인 Gson과 Jackson의 사용법을 살펴봅니다.

## Gson

Google에서 개발한 JSON 라이브러리입니다.

### 기본 사용법

```java
Gson gson = new Gson();

// 객체 -> JSON
String json = gson.toJson(object);

// JSON -> 객체
MyClass obj = gson.fromJson(json, MyClass.class);
```

### 제네릭 타입 변환

List나 Map 같은 제네릭 타입을 변환할 때는 `TypeToken`을 사용합니다.

```java
// List 타입 변환
Type listType = new TypeToken<ArrayList<ComplexMsgRule>>() {}.getType();
List<ComplexMsgRule> list = gson.fromJson(json, listType);

// 또 다른 예시
Type cityListType = new TypeToken<List<City>>() {}.getType();
List<City> cities = gson.fromJson(json, cityListType);
```

### JSON String에서 JsonObject 가져오기

```java
JsonObject jsonObject = gson.fromJson(messageReviewSearch, JsonObject.class);
```

### @Expose 어노테이션

특정 필드만 직렬화/역직렬화에 포함시킬 때 사용합니다.

```java
public class User {
    @Expose
    private String name;     // 직렬화 대상

    @Expose
    private int age;         // 직렬화 대상

    private String password; // 직렬화 제외
}
```

```java
GsonBuilder builder = new GsonBuilder();
builder = builder.excludeFieldsWithoutExposeAnnotation();
Gson gson = builder.disableHtmlEscaping().create();
```

### @SerializedName 어노테이션

JSON 필드명과 Java 필드명이 다를 때 매핑합니다.

```java
public class User {
    @SerializedName("id")
    private String userId;

    @SerializedName("user_name")
    private String userName;
}
```

### 주의사항

- `Map`을 상속받아 필드를 정의한 경우, 해당 필드는 자동으로 직렬화에서 제외됩니다.

### Pretty Printing

디버깅이나 로깅을 위한 가독성 좋은 JSON 출력:

```java
public void printObj(Object obj) {
    System.out.println(new GsonBuilder()
        .setPrettyPrinting()
        .serializeNulls()
        .create()
        .toJson(obj));
}
```

Kotlin 확장 함수로 사용:

```kotlin
fun Any?.printObj() {
    println(GsonBuilder()
        .setPrettyPrinting()
        .serializeNulls()
        .create()
        .toJson(this))
}
```

## Jackson

FasterXML에서 개발한 고성능 JSON 라이브러리입니다.

### @JsonIgnoreProperties

setter나 생성자 파라미터에 없는 JSON 필드를 무시합니다.

```java
@JsonIgnoreProperties(ignoreUnknown = true)
public class User {
    private String name;
    private int age;
    // JSON에 'email' 필드가 있어도 에러 발생하지 않음
}
```

이 어노테이션 없이 알 수 없는 필드가 있으면 `UnrecognizedPropertyException`이 발생합니다.

### ObjectMapper 전역 설정

개별 클래스에 어노테이션을 붙이지 않고 전역으로 설정할 수도 있습니다.

```java
ObjectMapper mapper = new ObjectMapper();
mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
```

## Gson vs Jackson 비교

| 특성 | Gson | Jackson |
|------|------|---------|
| 성능 | 좋음 | 매우 좋음 |
| API 복잡도 | 간단 | 다소 복잡 |
| 기능 | 기본적 | 풍부함 |
| 스트리밍 API | 지원 | 지원 |
| 어노테이션 | @Expose, @SerializedName | @JsonProperty, @JsonIgnore 등 |
| 제네릭 처리 | TypeToken | TypeReference |

## 선택 가이드

- **Gson**: 간단한 JSON 처리, 빠른 개발이 필요할 때
- **Jackson**: 고성능 필요, 복잡한 JSON 처리, Spring과 함께 사용할 때

## 참고

Spring Boot에서는 Jackson이 기본 JSON 라이브러리로 포함되어 있어, 별도 설정 없이 바로 사용할 수 있습니다.
