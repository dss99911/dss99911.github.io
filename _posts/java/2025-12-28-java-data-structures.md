---
layout: post
title: "Java 자료구조 - LinkedHashSet, Pair, 정렬"
date: 2025-12-28 12:13:00 +0900
categories: java
tags: [java, data-structure, collections, sort]
description: "Java에서 유용한 자료구조와 정렬 방법을 알아봅니다. LinkedHashSet, Pair, Comparator 활용법을 다룹니다."
---

# Java 자료구조

Java에서 유용하게 사용할 수 있는 자료구조와 정렬 방법을 살펴봅니다.

## 유용한 컬렉션

### LinkedHashSet

중복을 허용하지 않으면서 삽입 순서를 유지해야 할 때 사용합니다.

```java
Set<String> linkedSet = new LinkedHashSet<>();
linkedSet.add("first");
linkedSet.add("second");
linkedSet.add("first");  // 중복, 추가되지 않음

// 출력: first, second (삽입 순서 유지)
for (String item : linkedSet) {
    System.out.println(item);
}
```

**특징:**
- `HashSet`의 성능 (O(1) 조회)
- 삽입 순서 보장

### Pair 클래스

Key-Value 쌍을 저장하는 불변(immutable) 클래스입니다.

```java
// JavaFX의 Pair
import javafx.util.Pair;

Pair<String, Integer> pair = new Pair<>("key", 100);
String key = pair.getKey();
Integer value = pair.getValue();
```

**특징:**
- 읽기 전용 (Readonly)
- 값 변경 불가

### SimpleEntry

`Map.Entry`를 구현한 클래스로, value를 변경할 수 있습니다.

```java
import java.util.AbstractMap.SimpleEntry;

SimpleEntry<String, Integer> entry = new SimpleEntry<>("key", 100);
entry.setValue(200);  // value 변경 가능

String key = entry.getKey();
Integer value = entry.getValue();
```

**특징:**
- `setValue()` 메서드로 값 변경 가능
- Map과 함께 사용하기 좋음

## 컬렉션 비교

| 자료구조 | 중복 허용 | 순서 보장 | null 허용 |
|---------|----------|----------|----------|
| HashSet | X | X | O (1개) |
| LinkedHashSet | X | 삽입 순서 | O (1개) |
| TreeSet | X | 정렬 순서 | X |
| ArrayList | O | 삽입 순서 | O |
| LinkedList | O | 삽입 순서 | O |

## 정렬 (Comparator)

### 기본 원리

`compare(o1, o2)` 메서드에서:
- 반환값 < 0: o1이 o2보다 앞
- 반환값 = 0: 동일
- 반환값 > 0: o1이 o2보다 뒤

### 오름차순 정렬

```java
public int compare(Something o1, Something o2) {
    return o1.someValue() - o2.someValue();
}
```

값이 작을수록 앞에 위치합니다.

### 내림차순 정렬

```java
public int compare(Something o1, Something o2) {
    return o2.someValue() - o1.someValue();
}
```

### Lambda 활용

```java
List<Person> people = new ArrayList<>();

// 나이 오름차순
people.sort((p1, p2) -> p1.getAge() - p2.getAge());

// 또는 Comparator 메서드 사용
people.sort(Comparator.comparingInt(Person::getAge));

// 이름으로 정렬
people.sort(Comparator.comparing(Person::getName));

// 역순
people.sort(Comparator.comparing(Person::getName).reversed());
```

### 다중 조건 정렬

```java
people.sort(Comparator
    .comparing(Person::getLastName)
    .thenComparing(Person::getFirstName)
    .thenComparingInt(Person::getAge));
```

### 특정 조건으로 우선 정렬

특정 아이템을 먼저 나오게 하고 싶으면 해당 아이템의 비교 값을 작게 만듭니다.

```java
// VIP를 먼저 정렬
people.sort((p1, p2) -> {
    int score1 = p1.isVip() ? 0 : 1;
    int score2 = p2.isVip() ? 0 : 1;
    return score1 - score2;
});
```

### 정렬 안정성

Java의 `Collections.sort()`와 `Arrays.sort()`는 안정 정렬(stable sort)을 사용합니다. 동일한 비교 값을 가진 요소들은 원래 순서가 유지됩니다.

## 정리

| 용도 | 권장 자료구조/방법 |
|------|------------------|
| 중복 제거 + 순서 유지 | LinkedHashSet |
| Key-Value 쌍 (불변) | Pair |
| Key-Value 쌍 (가변) | SimpleEntry |
| 커스텀 정렬 | Comparator |
| 다중 조건 정렬 | Comparator.comparing().thenComparing() |

Java 8 이상에서는 Comparator의 정적 메서드들을 활용하면 간결하고 읽기 쉬운 정렬 코드를 작성할 수 있습니다.
