---
layout: post
title: "Groovy Collection - Set, List, Map, Range"
date: 2025-12-28 15:40:00 +0900
categories: [programming, java]
tags: [java, groovy, jvm, collection]
description: "Groovy의 Collection 타입인 Set, List, Map, Range에 대해 알아봅니다."
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
