---
layout: post
title: "Groovy Collection - Set, List, Map, Range"
date: 2025-02-22 19:39:00 +0900
categories: [programming, java]
tags: [java, groovy, jvm, collection]
description: "Groovy의 Collection 타입인 Set, List, Map, Range에 대해 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-groovy-collection.png
redirect_from:
  - "/programming/java/2025/12/28/groovy-collection.html"
---

# Groovy Collection

Groovy는 다양한 컬렉션 타입을 지원하며, Java보다 간결한 문법을 제공합니다.

## Set

```groovy
// Creating a Set
def Set1 = [1, 2, 1, 4, 5, 9] as Set
Set Set2 = new HashSet(['a', 'b', 'c', 'd'])

// Modifying a Set
Set2.add(1)
Set2.add(9)
Set2.addAll([4, 5])        // Set2: [1, d, 4, b, 5, c, a, 9]
Set2.remove(1)
Set2.removeAll([4, 5])     // Set2: [d, b, c, a, 9]

// Union of Set
Set Union = Set1 + Set2    // Union: [1, 2, 4, 5, 9, d, b, c, a]

// Intersection of Set
Set intersection = Set1.intersect(Set2)  // Intersection: [9]

// Complement of Set
Set Complement = Union.minus(Set1)       // Complement: [d, b, c, a]
```

---

## List

```groovy
// Creating a List
def list1 = ['a', 'b', 'c', 'd']
def list2 = [3, 2, 1, 4, 5] as List

// Reading a List
println list1[1]           // Output: b
println list2.get(4)       // Output: 5
println list1.get(5)       // Throws IndexOutOfBoundsException
```

### 유틸리티 메서드

```groovy
// Sort a List
println list2.sort()       // Output: [1, 2, 3, 4, 5]

// Reverse a list
println list1.reverse()    // Output: [d, c, b, a]

// Finding elements
println ("Max:" + list2.max() + ":Last:" + list1.last())
// Output: Max:5:Last:d

println list2.find({ it % 2 == 0 })     // Output: 2
println list2.findAll({ it % 2 == 0 })  // Output: [2, 4]
```

---

## Map

```groovy
// 두 표기법은 동일
Map m1 = [name: "Groovy"]
Map m1 = ["name": "Groovy"]

// 변수를 키로 사용
String s1 = "name"
Map m1 = [(s1): "Groovy"]

def m2 = [id: 1, title: "Mastering Groovy"] as Map
```

### Map 접근

```groovy
m2.get("id")
m2["id"]
```

### Map 검증

```groovy
ageMap.any { entry -> entry.value > 25 }   // 하나라도 만족하면 true
ageMap.every { entry -> entry.value > 18 } // 모두 만족하면 true
```

---

## Range

```groovy
def range1 = 1..10
Range range2 = 'a'..'e'

// Iteration
range1.each { println it }

// Validation
range1.any { it > 5 }
range1.every { it > 0 }

// Step
List l1 = range1.step(2)    // Output: [1, 3, 5, 7, 9]

// Properties
range1.getFrom()            // Output: 1
range1.getTo()              // Output: 10
range1.isReverse()          // Output: false (값이 증가하는지 감소하는지 확인)
```

---

## 컬렉션 공통 메서드

Groovy의 컬렉션은 Java보다 훨씬 풍부한 함수형 메서드를 기본 제공합니다. 이 메서드들은 List, Set, Map 등 다양한 컬렉션에서 사용할 수 있습니다.

### collect (map)

각 요소를 변환하여 새로운 리스트를 생성합니다.

```groovy
def numbers = [1, 2, 3, 4, 5]
def doubled = numbers.collect { it * 2 }
// doubled: [2, 4, 6, 8, 10]
```

### inject (reduce/fold)

컬렉션의 요소를 누적하여 단일 값을 생성합니다.

```groovy
def sum = [1, 2, 3, 4, 5].inject(0) { acc, val -> acc + val }
// sum: 15
```

### groupBy

주어진 조건에 따라 요소를 그룹화합니다.

```groovy
def words = ['apple', 'banana', 'avocado', 'blueberry']
def grouped = words.groupBy { it[0] }
// grouped: [a: ['apple', 'avocado'], b: ['banana', 'blueberry']]
```

### each와 eachWithIndex

```groovy
['a', 'b', 'c'].each { println it }

['a', 'b', 'c'].eachWithIndex { item, index ->
    println "${index}: ${item}"
}
```

---

## Map 고급 활용

### 스프레드 연산자 (Spread Operator)

```groovy
def map1 = [a: 1, b: 2]
def map2 = [c: 3, d: 4]
def merged = map1 + map2
// merged: [a: 1, b: 2, c: 3, d: 4]
```

### Map에서 collect 사용

```groovy
def ages = [Kim: 25, Lee: 30, Park: 28]
def descriptions = ages.collect { name, age ->
    "${name} is ${age} years old"
}
// descriptions: ['Kim is 25 years old', 'Lee is 30 years old', 'Park is 28 years old']
```

### findAll과 find

```groovy
def ages = [Kim: 25, Lee: 30, Park: 28]
def over27 = ages.findAll { name, age -> age > 27 }
// over27: [Lee: 30, Park: 28]
```

---

## Java와의 차이점

Groovy 컬렉션을 사용할 때 Java 개발자가 알아두면 좋은 차이점입니다:

| 기능 | Java | Groovy |
|------|------|--------|
| 리스트 생성 | `Arrays.asList(1, 2, 3)` | `[1, 2, 3]` |
| 맵 생성 | `Map.of("key", "val")` | `[key: "val"]` |
| 타입 변환 | 캐스팅 필요 | `as` 키워드 |
| null 안전 접근 | Optional 사용 | `?.` 연산자 |
| 함수형 처리 | Stream API | 기본 메서드 |

Groovy는 Java와 100% 호환되므로 기존 Java 컬렉션 메서드도 그대로 사용할 수 있습니다. 다만 Groovy의 내장 메서드가 더 간결하고 읽기 쉬운 경우가 많으므로 적극적으로 활용하는 것이 좋습니다.
