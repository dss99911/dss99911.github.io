---
layout: post
title: "Groovy 기초 - 문법, 변수, 문자열, 연산자, 제어문"
date: 2025-12-28 15:20:00 +0900
categories: java
tags: [java, groovy, jvm]
description: "Groovy의 기본 문법, 변수 선언, 문자열 처리, 연산자, 조건문과 반복문에 대해 알아봅니다."
---

# Groovy 기초

Groovy는 JVM 기반 언어로, Java와 유사하면서도 더 간결한 문법을 제공합니다.

## 기본 문법

세미콜론은 생략 가능합니다:

```groovy
String a = "HelloWorld"
println('Groovy' =~ 'Gro*vy')
```

---

# 변수 (Variable)

타입을 선언하는 것과 안 하는 것이 있습니다.

## 변수 선언

```groovy
// def 키워드 사용
def a = 1

// 타입 명시
int a = 1

// Map
def employee = ["Ken": 21, "John": 25, "Sally": 22]
// 빈 Map
def emptyMap = [:]
```

## Dynamic Typing

`def`를 사용하면 다른 타입을 할당할 수 있습니다:

```groovy
def var1
var1 = 'a'
println var1.class   // will print class java.lang.String
var1 = 1
println var1.class   // will print class java.lang.Integer

def method1() { /* method body */ }
```

---

# 문자열 (String)

작은따옴표(')와 큰따옴표(") 둘 다 사용 가능합니다.

## 여러 줄 문자열

`"""` 또는 `'''`로 문자열을 묶을 수 있습니다:

```groovy
"""abc"abc"""  // -> abc"abc
```

## 문자열 인덱싱

```groovy
String sample = "Hello world"
println(sample[4])      // Print the 5th character: 'o'
println(sample[-1])     // Print the last character: 'd'
println(sample[1..2])   // Prints a string from Index 1 to 2: 'el'
println(sample[4..2])   // Prints a string from Index 4 back to 2: 'oll'
```

## 문자열 반복

```groovy
String a = "Hello"
println("Hello" * 3)  // HelloHelloHello
println(a * 3)        // HelloHelloHello
```

## 문자열 템플릿 (GString)

`${변수명}`으로 변수를 참조합니다:

```groovy
File file = new File("E:/Example.txt")
println "The file ${file.absolutePath} has ${file.length()} bytes"
```

---

# 연산자 (Operator)

## 범위 연산자 (..)

```groovy
def range = 5..10    // [5, 6, 7, 8, 9, 10]

1..10      // An example of an inclusive Range
1..<10     // An example of an exclusive Range
'a'..'x'   // Ranges can also consist of characters
10..1      // Ranges can also be in descending order
'x'..'a'   // Ranges can also consist of characters and be in descending order
```

## 정규식 연산자

```groovy
'Groovy' =~ 'oo'      // Matcher 객체 반환
'Groovy' ==~ 'Groovy' // true/false 반환
```

---

# 조건문 (if)

## Ternary Operator

```groovy
(condition2 > 0) ? println("Positive") : println("Negative")
```

## Elvis Operator

변수가 null이면 기본값 사용, 그렇지 않으면 변수 사용:

```groovy
def inputName
String username = inputName ?: "guest"
```

## Switch

다양한 타입과 매칭 가능:

```groovy
def checkInput(def input) {
    switch(input) {
        case [3, 4, 5]:
            println("Array Matched")
            break
        case 10..15:
            println("Range Matched")
            break
        case Integer:
            println("Integer Matched")
            break
        case ~/\w+/:
            println("Pattern Matched")
            break
        case String:
            println("String Matched")
            break
        default:
            println("Nothing Matched")
            break
    }
}

checkInput(3)           // will print Array Matched
checkInput(1)           // will print Integer Matched
checkInput(10)          // will print Range Matched
checkInput("abcd abcd") // will print String Matched
checkInput("abcd")      // will print Pattern Matched
```

---

# 반복문 (For)

## each 메서드

### List

```groovy
def lst = [11, 12, 13, 14]
lst.each { println it }
```

### Map

```groovy
def mp = ["TopicName": "Maps", "TopicDescription": "Methods in Maps"]
mp.each { println it }
mp.each { println "${it.key} maps to: ${it.value}" }

// key, value 분리
ageMap.each { key, value ->
    println "Name is " + key
    println "Age is " + value
}

// entry 사용
ageMap.each { entry ->
    println "Name is " + entry.key
    println "Age is " + entry.value
}
```

### 조건부 처리

```groovy
def lst = [1, 2, 3, 4]
lst.each { println it }
println("The list will only display those numbers which are divisible by 2")
lst.each { num -> if (num % 2 == 0) println num }
```

## for 루프

```groovy
// Traditional for loop
for (int i = 0; i < 3; i++) { /* do something */ }

// Loop over a Range
for (i in 1..5) println(i)

// Array iteration
def arr = ["Apple", "Banana", "Mango"]
for (i in arr) println(i)

// for applied on Set
for (i in ([10, 10, 11, 11, 12, 12] as Set)) println(i)
```

## while 루프

```groovy
int count = 0
while (count < 5) {
    println count++
}
```

---

# Duck Typing

`+` 연산자를 수행할 수 있는 객체이면, 어떤 객체든 상관없이 처리할 수 있습니다. Java의 경우 클래스별로 따로 처리해주어야 합니다.

```groovy
def calculate(a, b, c) { return (a + b) * c }

example1 = calculate(1, 2, 3)
example2 = calculate([1], [2, 3], 2)
example3 = calculate('apples ', 'and oranges, ', 3)
```

---

# Test

## assert

```groovy
assert 1 == 2
```
