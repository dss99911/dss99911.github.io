---
layout: post
title: "Groovy 데이터 처리 - File, JSON, XML"
date: 2025-12-28 16:00:00 +0900
categories: java
tags: [java, groovy, jvm, json, xml, file]
description: "Groovy에서 파일, JSON, XML을 처리하는 방법에 대해 알아봅니다."
---

# File 처리

## 상대 경로

```groovy
new File('../aspectjx')
```

## 파일 읽기

```groovy
// 각 라인 출력하기
new File("E:/Example.txt").eachLine { line ->
    println "line : $line"
}

// 전체 문자열 가져오기
File file = new File("E:/Example.txt")
println file.text
```

## 파일 쓰기

```groovy
new File('E:/', 'Example.txt').withWriter('utf-8') { writer ->
    writer.writeLine 'Hello World'
}
```

## 파일 복사

```groovy
def src = new File("E:/Example.txt")
def dst = new File("E:/Example1.txt")
dst << src.text
```

## 파일 시스템 탐색

```groovy
// 드라이브 목록 확인 (C:\, D:\)
def rootFiles = new File("test").listRoots()
rootFiles.each { file ->
    println file.absolutePath
}

// 폴더의 파일들 탐색
new File("E:/Temp").eachFile() { file ->
    println file.getAbsolutePath()
}

// 재귀적 탐색
new File("E:/Temp").eachFileRecurse { file ->
    println file.getAbsolutePath()
}
```

## 파일 속성

```groovy
File file = new File("E:/Example.txt")
println "The file ${file.absolutePath} has ${file.length()} bytes"
```

---

# JSON 처리

## toJson

### 객체 없이 직접 기입

```groovy
def builder = new groovy.json.JsonBuilder()

def root = builder.students {
    student {
        studentname 'Joe'
        studentid '1'

        Marks(
            Subject1: 10,
            Subject2: 20,
            Subject3: 30,
        )
    }
}
println(builder.toString())
```

### 객체가 있을 때

```groovy
import groovy.json.JsonOutput

class Example {
    static void main(String[] args) {
        def output = JsonOutput.toJson([name: 'John', ID: 1])
        println(output)
    }
}
```

```groovy
import groovy.json.JsonOutput

class Example {
    static void main(String[] args) {
        def output = JsonOutput.toJson([
            new Student(name: 'John', ID: 1),
            new Student(name: 'Mark', ID: 2)
        ])
        println(output)
    }
}

class Student {
    String name
    int ID
}
```

### 리스트일 때

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

---

# XML 처리

## XML Markup Builder

Map과 closure로 XML을 생성합니다. pseudo method를 호출해서 예외를 캐치하여 메서드명과 attribute를 파악합니다.

### XML 파일로 저장

```groovy
def builder = new groovy.xml.MarkupBuilder(new FileWriter("orders.xml"))

builder.orders {
    for (i in orderlist) {
        order {
            no(i.orderNo)
            description(i.description)
            customer {
                name(firstname: i.orderedBy.name)
                email(i.orderedBy.email)
            }
        }
    }
}
```

### 기본 사용법

```groovy
import groovy.xml.MarkupBuilder

def mB = new MarkupBuilder()

// Compose the builder
mB.collection(shelf: 'New Arrivals') {
    movie(title: 'Enemy Behind')
    type('War, Thriller')
    format('DVD')
    year('2003')
    rating('PG')
    stars(10)
    description('Talk about a US-Japan war')
}
```

### Map에서 XML 생성

```groovy
import groovy.xml.MarkupBuilder

class Example {
    static void main(String[] args) {
        def mp = [
            1: ['Enemy Behind', 'War, Thriller', 'DVD', '2003', 'PG', '10', 'Talk about a US-Japan war'],
            2: ['Transformers', 'Anime, Science Fiction', 'DVD', '1989', 'R', '8', 'A scientific fiction'],
            3: ['Trigun', 'Anime, Action', 'DVD', '1986', 'PG', '10', 'Vash the Stampede'],
            4: ['Ishtar', 'Comedy', 'VHS', '1987', 'PG', '2', 'Viewable boredom']
        ]

        def mB = new MarkupBuilder()

        // Compose the builder
        def MOVIEDB = mB.collection('shelf': 'New Arrivals') {
            mp.each { sd ->
                mB.movie('title': sd.value[0]) {
                    type(sd.value[1])
                    format(sd.value[2])
                    year(sd.value[3])
                    rating(sd.value[4])
                    stars(sd.value[4])
                    description(sd.value[5])
                }
            }
        }
    }
}
```

출력:

```xml
<collection shelf="New Arrivals">
    <movie title="Enemy Behind">
        <type>War, Thriller</type>
        <format>DVD</format>
        <year>2003</year>
        <rating>PG</rating>
        <stars>10</stars>
        <description>Talk about a US-Japan war</description>
    </movie>

    <movie title="Transformers">
        <type>Anime, Science Fiction</type>
        <format>DVD</format>
        <year>1989</year>
        <rating>R</rating>
        <stars>8</stars>
        <description>A scientific fiction</description>
    </movie>

    <movie title="Trigun">
        <type>Anime, Action</type>
        <format>DVD</format>
        <year>1986</year>
        <rating>PG</rating>
        <stars>10</stars>
        <description>Vash the Stampede!</description>
    </movie>

    <movie title="Ishtar">
        <type>Comedy</type>
        <format>VHS</format>
        <year>1987</year>
        <rating>PG</rating>
        <stars>2</stars>
        <description>Viewable boredom</description>
    </movie>
</collection>
```

## XML Parsing

```groovy
import groovy.xml.MarkupBuilder
import groovy.util.*

class Example {
    static void main(String[] args) {
        def parser = new XmlParser()
        def doc = parser.parse("D:\\Movies.xml")

        doc.movie.each { bk ->
            print("Movie Name:")
            println "${bk['@title']}"

            print("Movie Type:")
            println "${bk.type[0].text()}"

            print("Movie Format:")
            println "${bk.format[0].text()}"

            print("Movie year:")
            println "${bk.year[0].text()}"

            print("Movie rating:")
            println "${bk.rating[0].text()}"

            print("Movie stars:")
            println "${bk.stars[0].text()}"

            print("Movie description:")
            println "${bk.description[0].text()}"
            println("*******************************")
        }
    }
}
```
