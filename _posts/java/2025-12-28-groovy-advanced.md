---
layout: post
title: "Groovy 고급 기능 - DSL, Meta Object Programming, Template Engine"
date: 2025-12-28 15:50:00 +0900
categories: java
tags: [java, groovy, jvm, dsl, metaprogramming]
description: "Groovy의 DSL, Meta Object Programming, Template Engine에 대해 알아봅니다."
---

# DSL (Domain Specific Language)

DSL 또는 도메인 특화 언어는 특정 도메인에 맞게 설계된 언어입니다.

## 메서드 괄호 및 '.' 생략

문장을 좀 더 읽기 쉽고, 번거로운 기호들을 생략하기 위해 사용합니다.

```groovy
println 'message'
```

`a b c d`는 `a(b).c(d)`와 동일합니다.

## 예제

```groovy
def builder = new groovy.json.JsonBuilder()

class Student {
    String name
}

def studentlist = [
    new Student(name: "Joe"),
    new Student(name: "Mark"),
    new Student(name: "John")
]

builder studentlist, { Student student -> name student.name }
println(builder)
```

파라미터가 여러 개인 경우 `,`로 구분합니다.

## DSL 클래스 예제

```groovy
class EmailDsl {
    String toText
    String fromText
    String body

    /**
     * This method accepts a closure which is essentially the DSL. Delegate the
     * closure methods to the DSL class so the calls can be processed
     */
    def static make(closure) {
        EmailDsl emailDsl = new EmailDsl()
        // any method called in closure will be delegated to the EmailDsl class
        closure.delegate = emailDsl
        closure()
    }

    /**
     * Store the parameter as a variable and use it later to output a memo
     */
    def to(String toText) {
        this.toText = toText
    }

    def from(String fromText) {
        this.fromText = fromText
    }

    def body(String bodyText) {
        this.body = bodyText
    }
}

EmailDsl.make {
    to "Nirav Assar"
    from "Barack Obama"
    body "How are things? We are doing well. Take care"
}
```

**핵심 포인트:**
- `closure.delegate = emailDsl`로 closure 안에서 호출하는 메서드를 해당 인스턴스에서 호출할 수 있도록 합니다.
- return이 없으면 마지막 값을 리턴합니다.

---

# Meta Object Programming

선언되든 안 되든 필드나 메서드 호출 시 호출되는 메서드를 정의할 수 있습니다.

## GroovyInterceptable 구현

```groovy
class Example {
    static void main(String[] args) {
        Student mst = new Student()
        mst.Name = "Joe"
        mst.ID = 1

        println(mst.Name)
        println(mst.ID)
        mst.AddMarks()
    }
}

class Student implements GroovyInterceptable {
    protected dynamicProps = [:]

    void setProperty(String pName, val) {
        dynamicProps[pName] = val
    }

    def getProperty(String pName) {
        dynamicProps[pName]
    }

    def invokeMethod(String name, Object args) {
        return "called invokeMethod $name $args"
    }
}
```

## Metaclass로 private 필드 접근

reflection과 같이 private 필드에 접근:

```groovy
class Example {
    static void main(String[] args) {
        Student mst = new Student()
        println mst.getName()
        mst.metaClass.setAttribute(mst, 'name', 'Mark')
        println mst.getName()
    }
}

class Student {
    private String name = "Joe"

    public String getName() {
        return this.name
    }
}
```

---

# Template Engine

## 문자열 템플릿과 바인딩

```groovy
def text = 'This Tutorial focuses on $TutorialName. In this tutorial you will learn about $Topic'

def binding = ["TutorialName": "Groovy", "Topic": "Templates"]
def engine = new groovy.text.SimpleTemplateEngine()
def template = engine.createTemplate(text).make(binding)

println template
```

## 파일에 템플릿 저장하고 바인딩

`Student.template` 파일:

```xml
<Student>
    <name>${name}</name>
    <ID>${id}</ID>
    <subject>${subject}</subject>
</Student>
```

```groovy
import groovy.text.*
import java.io.*

def file = new File("D:/Student.template")
def binding = ['name': 'Joe', 'id': 1, 'subject': 'Physics']

def engine = new SimpleTemplateEngine()
def template = engine.createTemplate(file)
def writable = template.make(binding)

println writable
```

출력:

```xml
<Student>
    <name>Joe</name>
    <ID>1</ID>
    <subject>Physics</subject>
</Student>
```

---

# Swing (UI)

## 기본 GUI

```groovy
import groovy.swing.SwingBuilder
import javax.swing.*

// Create a builder
def myapp = new SwingBuilder()

// Compose the builder
def myframe = myapp.frame(
    title: 'Tutorials Point',
    location: [200, 200],
    size: [400, 300],
    defaultCloseOperation: WindowConstants.EXIT_ON_CLOSE
) {
    label(text: 'Hello world')
}

// Display the form
myframe.setVisible(true)
```

## 입력 폼

```groovy
import groovy.swing.SwingBuilder
import javax.swing.*
import java.awt.*

def myapp = new SwingBuilder()

def myframe = myapp.frame(
    title: 'Tutorials Point',
    location: [200, 200],
    size: [400, 300],
    defaultCloseOperation: WindowConstants.EXIT_ON_CLOSE
) {
    panel(layout: new GridLayout(3, 2, 5, 5)) {
        label(text: 'Student Name:', horizontalAlignment: JLabel.RIGHT)
        textField(text: '', columns: 10)

        label(text: 'Subject Name:', horizontalAlignment: JLabel.RIGHT)
        textField(text: '', columns: 10)

        label(text: 'School Name:', horizontalAlignment: JLabel.RIGHT)
        textField(text: '', columns: 10)
    }
}

myframe.setVisible(true)
```

## 버튼

```groovy
import groovy.swing.SwingBuilder
import javax.swing.*
import java.awt.*

def myapp = new SwingBuilder()

def DisplayA = {
    println("Option A")
}

def DisplayB = {
    println("Option B")
}

def buttonPanel = {
    myapp.panel(constraints: BorderLayout.SOUTH) {
        button(text: 'Option A', actionPerformed: DisplayA)
        button(text: 'Option B', actionPerformed: DisplayB)
    }
}

def mainPanel = {
    myapp.panel(layout: new BorderLayout()) {
        label(
            text: 'Which Option do you want',
            horizontalAlignment: JLabel.CENTER,
            constraints: BorderLayout.CENTER
        )
        buttonPanel()
    }
}

def myframe = myapp.frame(
    title: 'Tutorials Point',
    location: [100, 100],
    size: [400, 300],
    defaultCloseOperation: WindowConstants.EXIT_ON_CLOSE
) {
    mainPanel()
}

myframe.setVisible(true)
```

### Frame Attributes

- `title`
- `location`
- `size`
- `defaultCloseOperation`: WindowConstants.EXIT_ON_CLOSE

### Closure

- `label(text: 'Hello world')`
