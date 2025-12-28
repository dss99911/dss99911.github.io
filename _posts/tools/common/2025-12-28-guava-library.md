---
layout: post
title: "Google Guava 라이브러리 완벽 가이드"
date: 2025-12-28 12:10:00 +0900
categories: [tools, common]
tags: [guava, java, google, collections, utilities]
description: "Google Guava 라이브러리의 주요 기능들 - Collections, Cache, String 처리, Range 등을 예제와 함께 설명합니다."
---

Guava는 Google에서 개발한 오픈소스 Java 라이브러리입니다. 컬렉션, 캐싱, 기본 타입 지원, 동시성, 문자열 처리, I/O 등 다양한 유틸리티를 제공합니다.

## 1. Guava의 장점

- **표준화**: Google에서 관리
- **효율성**: 빠르고 효율적인 Java 표준 라이브러리 확장
- **최적화**: 고도로 최적화됨
- **함수형 프로그래밍**: Java에 함수형 처리 기능 추가
- **유틸리티**: 개발에 자주 필요한 유틸리티 클래스 제공
- **검증**: 표준 failsafe 검증 메커니즘
- **베스트 프랙티스**: 좋은 코딩 관행 강조

## 2. String 처리

### Joiner

null을 건너뛰며 문자열 연결:

```java
System.out.println(Joiner.on(",")
    .skipNulls()
    .join(Arrays.asList(1, 2, 3, 4, 5, null, 6)));
// 출력: 1,2,3,4,5,6
```

### Splitter

문자열 분할 및 정제:

```java
System.out.println(Splitter.on(',')
    .trimResults()
    .omitEmptyStrings()
    .split("the ,quick, ,brown, fox, jumps, over, the, lazy, little dog."));
```

### CharMatcher

문자 매칭 및 변환:

```java
// 공백 정규화
CharMatcher.WHITESPACE.trimAndCollapseFrom("     Mahesh     Parashar ", ' ')
// 결과: "Mahesh Parashar"

// 숫자를 별표로 치환
CharMatcher.JAVA_DIGIT.replaceFrom("mahesh123", "*")
// 결과: "mahesh***"

// 숫자와 소문자만 유지
CharMatcher.JAVA_DIGIT.or(CharMatcher.JAVA_LOWER_CASE).retainFrom("mahesh123")
// 결과: "mahesh123"
```

### CaseFormat

명명 규칙 변환:

```java
CaseFormat.LOWER_HYPHEN.to(CaseFormat.LOWER_CAMEL, "test-data")
// 결과: "testData"

CaseFormat.LOWER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, "test_data")
// 결과: "testData"

CaseFormat.UPPER_UNDERSCORE.to(CaseFormat.UPPER_CAMEL, "test_data")
// 결과: "TestData"
```

## 3. Collections

### BiMap

양방향 맵 (value도 중복 불가):

```java
BiMap<String, Integer> biMap = HashBiMap.create();
biMap.put("one", 1);
biMap.put("two", 2);

// 역방향 조회
biMap.inverse().get(1);  // "one"
```

### Table

Row, Column, Value 구조의 테이블:

```java
// Table<R, C, V> == Map<R, Map<C, V>>
Table<String, String, String> employeeTable = HashBasedTable.create();

employeeTable.put("IBM", "101", "Mahesh");
employeeTable.put("IBM", "102", "Ramesh");
employeeTable.put("Microsoft", "111", "Sohan");
employeeTable.put("TCS", "121", "Ram");

// row로 조회
Map<String, String> ibmEmployees = employeeTable.row("IBM");
for (Map.Entry<String, String> entry : ibmEmployees.entrySet()) {
    System.out.println("Emp Id: " + entry.getKey() + ", Name: " + entry.getValue());
}

// 모든 row key
Set<String> employers = employeeTable.rowKeySet();

// column으로 조회
Map<String, String> column102 = employeeTable.column("102");
```

## 4. LoadingCache

자동 로딩 캐시:

```java
LoadingCache<String, Employee> employeeCache = CacheBuilder.newBuilder()
    .maximumSize(100)                         // 최대 100개
    .expireAfterAccess(30, TimeUnit.MINUTES)  // 30분 후 만료
    .build(new CacheLoader<String, Employee>() {
        @Override
        public Employee load(String empId) throws Exception {
            return getFromDatabase(empId);
        }
    });

try {
    // 첫 호출 시 DB에서 로드
    System.out.println(employeeCache.get("100"));
    System.out.println(employeeCache.get("103"));

    // 두 번째 호출 시 캐시에서 반환
    System.out.println(employeeCache.get("100"));  // DB 호출 없음
} catch (ExecutionException e) {
    e.printStackTrace();
}
```

## 5. Ordering

정렬 및 비교:

```java
// 자연 순서 정렬
Ordering<Comparable> ordering = Ordering.natural();

// Comparator에서 생성
Ordering<String> ordering = Ordering.from(comparator);

// 정렬
Collections.sort(numbers, ordering);

// 정렬 확인
ordering.isOrdered(numbers);

// 최소/최대
ordering.min(numbers);
ordering.max(numbers);

// 역순
ordering.reverse();

// null 처리
ordering.nullsFirst();
ordering.nullsLast();
```

## 6. Range

범위 처리:

```java
// [a, b] = { x | a <= x <= b }
Range<Integer> range1 = Range.closed(0, 9);

// (a, b) = { x | a < x < b }
Range<Integer> range2 = Range.open(0, 9);

// (a, b] = { x | a < x <= b }
Range<Integer> range3 = Range.openClosed(0, 9);

// [a, b) = { x | a <= x < b }
Range<Integer> range4 = Range.closedOpen(0, 9);

// (9, infinity)
Range<Integer> range5 = Range.greaterThan(9);

// 포함 여부 확인
range1.contains(5);                              // true
range1.containsAll(Ints.asList(1, 2, 3));       // true

// 경계 확인
range1.lowerEndpoint();   // 0
range1.upperEndpoint();   // 9
range5.hasUpperBound();   // false

// 범위 포함 여부
range1.encloses(Range.closed(3, 5));            // true

// 연결 여부
range1.isConnected(Range.closed(9, 20));        // true

// 교집합
range1.intersection(Range.closed(5, 15));       // [5, 9]

// 합집합 (span)
range1.span(Range.closed(5, 15));               // [0, 15]

// Range를 Set으로 변환
ContiguousSet.create(range1, DiscreteDomain.integers())
```

## 7. Primitive Utilities

기본 타입 유틸리티:

```java
// 다양한 기본 타입 지원
Ints, Bytes, Chars, Shorts, Longs, Floats, Doubles, Booleans

// 예시
Ints.asList(1, 2, 3);
Ints.join(",", 1, 2, 3);
Ints.max(1, 2, 3);
Ints.min(1, 2, 3);
```

### IntMath / LongMath

정수 연산 최적화 (Math 클래스는 double/float 사용으로 느림):

```java
IntMath.gcd(12, 8);                    // 최대공약수: 4
IntMath.factorial(5);                  // 팩토리얼: 120
IntMath.isPowerOfTwo(16);              // 2의 거듭제곱 여부: true
IntMath.divide(10, 3, RoundingMode.FLOOR);  // 나눗셈: 3
```

## 8. Throwables

예외 처리 유틸리티:

```java
try {
    someMethod();
} catch (Exception e) {
    // 스택 트레이스를 문자열로
    String stackTrace = Throwables.getStackTraceAsString(e);

    // 원인 체인
    List<Throwable> causes = Throwables.getCausalChain(e);

    // 루트 원인
    Throwable rootCause = Throwables.getRootCause(e);
}
```

## 참고 자료

- [Guava Tutorial](https://www.tutorialspoint.com/guava/guava_overview.htm)
- [Guava Wiki](https://github.com/google/guava/wiki)
