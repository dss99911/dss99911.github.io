---
layout: post
title: "Groovy 클래스와 메서드 - Class, Method, Closure, Trait"
date: 2025-12-28 15:30:00 +0900
categories: java
tags: [java, groovy, jvm, closure]
description: "Groovy의 클래스, 메서드, Closure, Trait에 대해 알아봅니다."
---

# Class (클래스)

## 인스턴스 초기화

생성자 없이 named parameter로 초기화 가능:

```groovy
class User {
    String username
    int age
}

// without constructor
def user = new User(username: "Joe", age: 1)
```

---

# Method (메서드)

## 메서드 선언

```groovy
class Example {
    static def DisplayName() {
        println("This is how methods work in groovy")
        println("This is an example of a simple method")
    }

    static void main(String[] args) {
        DisplayName()
    }
}
```

## 파라미터가 있는 메서드

```groovy
class Example {
    static void sum(int a, int b) {
        int c = a + b
        println(c)
    }

    static void main(String[] args) {
        sum(10, 5)
    }
}
```

## 파라미터 기본값

```groovy
class Example {
    static void sum(int a, int b = 5) {
        int c = a + b
        println(c)
    }

    static void main(String[] args) {
        sum(6)  // 결과: 11
    }
}
```

## Duck Typing

`+`를 지원하면 어떤 타입이든 사용 가능:

```groovy
def addition(a, b) { return a + b }

addition(1, 2)              // Output: 3
addition([1, 2], [4, 5])    // Output: [1, 2, 4, 5]
addition('Hi ', 3)          // Output: Hi 3
```

## 클래스에 연산자 정의

```groovy
class Person {
    String name

    // 첫 번째 방법
    public Person plus(Person p2) {
        // write your own implementation
    }

    // 두 번째 방법
    def methodMissing(String name, args) {
        if (name.startsWith("plus")) {
            // write your own implementation
            return "plus method intercepted"
        } else {
            println "Method name does not start with plus"
            throw new MissingMethodException(name, this.class, args)
        }
    }
}

p1 = new Person()
p2 = new Person()
p3 = p1 + p2
```

---

# Closure (클로저)

## 기본 사용법

```groovy
class Example {
    static void main(String[] args) {
        def clos = { println "Hello World" }
        clos.call()
        // or
        clos()
    }
}
```

## 파라미터 사용

```groovy
class Example {
    static void main(String[] args) {
        def clos = { param -> println "Hello ${param}" }
        clos.call("World")
        clos("World")
    }
}
```

## 암시적 파라미터 (it)

파라미터가 하나일 때 `it` 사용:

```groovy
class Example {
    static void main(String[] args) {
        def clos = { println "Hello ${it}" }
        clos.call("World")
    }
}
```

## 외부 변수 참조

final처럼 동작하지만 변수값 변경 가능:

```groovy
class Example {
    static void main(String[] args) {
        def str1 = "Hello"
        def clos = { param -> println "${str1} ${param}" }
        clos.call("World")

        // We are now changing the value of the String str1 which is referenced in the closure
        str1 = "Welcome"
        clos.call("World")
    }
}
```

## 컬렉션과 함께 사용

### List

```groovy
class Example {
    static void main(String[] args) {
        def lst = [11, 12, 13, 14]
        lst.each { println it }
    }
}
```

### Map

```groovy
class Example {
    static void main(String[] args) {
        def mp = ["TopicName": "Maps", "TopicDescription": "Methods in Maps"]
        mp.each { println it }
        mp.each { println "${it.key} maps to: ${it.value}" }
    }
}
```

## collect 메서드

새로운 리스트 생성:

```groovy
class Example {
    static void main(String[] args) {
        def lst = [1, 2, 3, 4]
        def newlst = []
        newlst = lst.collect { element -> return element * element }
        println(newlst)  // ==> [1, 4, 9, 16]
    }
}
```

## Delegate

다른 클래스에서 closure를 실행:

```groovy
class PrintValue {
    def printClosure = {
        println myValue
    }
}

def pcl = new PrintValue().printClosure
pcl()  // Output: MissingPropertyException: No such property
```

delegate로 해결:

```groovy
class PrintHandler {
    def myValue = "I'm Defined Here"
}

def pcl = new PrintValue().printClosure
pcl.delegate = new PrintHandler()
pcl()  // OUTPUT: I'm Defined Here
```

## Delegate Strategy

owner에 property가 이미 있으면 기본적으로 OWNER_FIRST 전략으로 owner의 property를 사용합니다. delegate의 property를 사용하려면 DELEGATE_FIRST 사용:

```groovy
def pcl = new PrintValue().printClosure
pcl.resolveStrategy = Closure.DELEGATE_FIRST
pcl.delegate = new PrintHandler()
pcl()
```

---

# Trait (Interface와 유사)

```groovy
class Example {
    static void main(String[] args) {
        Student st = new Student()
        st.StudentID = 1

        println(st.DisplayMarks())
        println(st.DisplayTotal())
    }
}

trait Marks {
    void DisplayMarks() {
        println("Marks1")
    }
}

trait Total {
    void DisplayTotal() {
        println("Total")
    }
}

class Student implements Marks, Total {
    int StudentID
}
```
