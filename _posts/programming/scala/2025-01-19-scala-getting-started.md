---
layout: post
title: "Scala 시작하기 - 프로젝트 생성과 SBT 설정"
date: 2025-12-28
categories: [programming, scala]
tags: [scala, sbt, setup]
image: /assets/images/posts/thumbnails/2025-12-28-scala-getting-started.png
redirect_from:
  - "/programming/scala/2025/12/28/scala-getting-started.html"
---

Scala 프로젝트를 생성하고 SBT를 설정하는 방법을 알아봅니다.

## 참고 자료

- [Building a Scala Project with IntelliJ and SBT](https://docs.scala-lang.org/getting-started/intellij-track/building-a-scala-project-with-intellij-and-sbt.html)
- [ScalaFiddle](https://scalafiddle.io/) - 온라인 Scala 실행 환경

## 프로젝트 생성

IntelliJ IDEA에서 Scala 프로젝트를 생성할 수 있습니다.

## 메인 진입점 추가

```scala
object HelloWorld extends App {
  println("Hello, World!")
}
```

## SBT Assembly 플러그인

Fat JAR을 생성하기 위한 sbt-assembly 플러그인 설정입니다.

### project/plugin.sbt

```scala
addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.15.0")
```

### build.sbt 설정

```scala
name := "my-project"
version := "1.0"
scalaVersion := "2.13.12"

// 의존성 추가
libraryDependencies ++= Seq(
  "org.scalatest" %% "scalatest" % "3.2.17" % Test,
  "com.typesafe" % "config" % "1.4.3"
)

// assembly 설정 (Fat JAR 생성 시)
assembly / assemblyMergeStrategy := {
  case PathList("META-INF", _*) => MergeStrategy.discard
  case _ => MergeStrategy.first
}
```

Fat JAR을 생성하려면 터미널에서 `sbt assembly`를 실행하면 `target/scala-{version}/` 디렉토리에 JAR 파일이 생성됩니다.

---

## Scala 기본 문법

### 변수 선언

Scala에서는 `val`(불변)과 `var`(가변) 두 가지 방식으로 변수를 선언합니다. 함수형 프로그래밍 스타일을 따르려면 가능한 한 `val`을 사용하는 것이 좋습니다.

```scala
val name: String = "Scala"   // 불변 (재할당 불가)
var count: Int = 0           // 가변 (재할당 가능)

// 타입 추론
val message = "Hello"        // String으로 추론
val number = 42              // Int로 추론
```

### 함수 정의

```scala
// 기본 함수
def greet(name: String): String = {
  s"Hello, $name!"
}

// 한 줄 함수 (중괄호 생략)
def square(x: Int): Int = x * x

// 기본값이 있는 파라미터
def connect(host: String = "localhost", port: Int = 8080): String = {
  s"$host:$port"
}

connect()                    // "localhost:8080"
connect("example.com", 443)  // "example.com:443"
connect(port = 3000)         // "localhost:3000"
```

### Case Class

Case class는 데이터를 담는 불변 클래스를 간결하게 정의하는 방법입니다. `equals`, `hashCode`, `toString`, `copy` 메서드가 자동으로 생성됩니다.

```scala
case class Person(name: String, age: Int)

val p1 = Person("Kim", 30)
val p2 = p1.copy(age = 31)      // 불변이므로 copy로 새 객체 생성
println(p1 == p2)                // false (값 비교)
```

### Pattern Matching

Scala의 패턴 매칭은 Java의 switch보다 훨씬 강력합니다.

```scala
def describe(x: Any): String = x match {
  case 0 => "zero"
  case i: Int if i > 0 => "positive integer"
  case s: String => s"string: $s"
  case (a, b) => s"tuple: ($a, $b)"
  case _ => "something else"
}

// case class와 함께 사용
sealed trait Shape
case class Circle(radius: Double) extends Shape
case class Rectangle(width: Double, height: Double) extends Shape

def area(shape: Shape): Double = shape match {
  case Circle(r) => math.Pi * r * r
  case Rectangle(w, h) => w * h
}
```

---

## 컬렉션

Scala의 컬렉션은 불변(immutable)이 기본이며, 풍부한 함수형 메서드를 제공합니다.

```scala
val numbers = List(1, 2, 3, 4, 5)

numbers.map(_ * 2)           // List(2, 4, 6, 8, 10)
numbers.filter(_ % 2 == 0)   // List(2, 4)
numbers.reduce(_ + _)        // 15
numbers.flatMap(n => List(n, n * 10))  // List(1, 10, 2, 20, ...)

// Map
val scores = Map("Kim" -> 95, "Lee" -> 87, "Park" -> 92)
scores.getOrElse("Kim", 0)   // 95
scores + ("Choi" -> 88)      // 새 Map 반환
```

---

## SBT 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `sbt compile` | 소스 코드 컴파일 |
| `sbt run` | 메인 클래스 실행 |
| `sbt test` | 테스트 실행 |
| `sbt console` | Scala REPL 시작 (프로젝트 클래스 사용 가능) |
| `sbt assembly` | Fat JAR 생성 |
| `sbt clean` | 빌드 결과물 삭제 |
| `sbt ~compile` | 파일 변경 시 자동 컴파일 |

SBT 셸 모드에서는 `sbt`를 실행한 뒤 명령어를 직접 입력할 수 있어 JVM 시작 시간을 절약할 수 있습니다.

---

## Option, Either, Try: 안전한 에러 처리

Scala는 `null` 대신 `Option`, `Either`, `Try`를 사용하여 안전하게 값의 부재나 에러를 처리합니다.

### Option

값이 있거나 없을 수 있는 경우에 사용합니다. `Some(value)` 또는 `None`으로 표현됩니다.

```scala
// null 대신 Option 사용
def findUser(id: Int): Option[String] = {
  val users = Map(1 -> "Kim", 2 -> "Lee")
  users.get(id)  // Option[String] 반환
}

findUser(1)  // Some("Kim")
findUser(99) // None

// 안전한 값 추출
val name = findUser(1).getOrElse("Unknown")  // "Kim"

// map, flatMap과 함께 사용
val greeting = findUser(1).map(n => s"Hello, $n")  // Some("Hello, Kim")

// for comprehension으로 여러 Option 조합
val result = for {
  user <- findUser(1)
  if user.length > 2
} yield s"Found: $user"
```

### Either

성공 또는 실패를 명시적으로 표현할 때 사용합니다. `Right`가 성공, `Left`가 실패를 나타냅니다.

```scala
def divide(a: Int, b: Int): Either[String, Double] = {
  if (b == 0) Left("Cannot divide by zero")
  else Right(a.toDouble / b)
}

divide(10, 3) match {
  case Right(result) => println(s"Result: $result")
  case Left(error)   => println(s"Error: $error")
}
```

### Try

예외가 발생할 수 있는 코드를 안전하게 감싸는 용도로 사용합니다.

```scala
import scala.util.{Try, Success, Failure}

val result = Try("123".toInt)  // Success(123)
val failed = Try("abc".toInt)  // Failure(NumberFormatException)

result match {
  case Success(value) => println(s"Parsed: $value")
  case Failure(ex)    => println(s"Failed: ${ex.getMessage}")
}

// getOrElse로 기본값 지정
val num = Try("abc".toInt).getOrElse(0)  // 0
```

---

## Implicit과 Type Class

Scala의 implicit은 강력하지만 남용하면 코드를 이해하기 어렵게 만들 수 있습니다. 대표적인 사용 사례를 알아봅니다.

### Implicit Parameters

함수 호출 시 자동으로 전달되는 매개변수입니다. ExecutionContext나 설정 객체 전달에 자주 사용됩니다.

```scala
implicit val defaultGreeting: String = "Hello"

def greet(name: String)(implicit greeting: String): String = {
  s"$greeting, $name!"
}

greet("Kim")  // "Hello, Kim!" (implicit 값 자동 전달)
```

### Implicit Conversions (Scala 2)

Scala 3에서는 `given`/`using`으로 대체되었지만, Scala 2 코드에서는 여전히 많이 사용됩니다.

```scala
// Scala 3의 given/using 문법
given defaultGreeting: String = "Hello"

def greet(name: String)(using greeting: String): String = {
  s"$greeting, $name!"
}
```

---

## Futures와 비동기 프로그래밍

Scala의 `Future`는 비동기 연산을 표현합니다.

```scala
import scala.concurrent.{Future, Await}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

// 비동기 작업 정의
val futureResult: Future[Int] = Future {
  Thread.sleep(1000)  // 시뮬레이션용
  42
}

// 콜백으로 결과 처리
futureResult.onComplete {
  case Success(value) => println(s"Got: $value")
  case Failure(ex)    => println(s"Failed: ${ex.getMessage}")
}

// 여러 Future 조합
val combined = for {
  a <- Future(10)
  b <- Future(20)
} yield a + b  // Future(30)

// 결과 대기 (테스트용, 프로덕션에서는 피할 것)
val result = Await.result(combined, 5.seconds)
```

---

## Scala와 Java 상호운용

Scala는 JVM 위에서 동작하므로 Java 라이브러리를 직접 사용할 수 있습니다. 다만 컬렉션 변환에 주의가 필요합니다.

```scala
import scala.jdk.CollectionConverters._

// Java 컬렉션 → Scala 컬렉션
val javaList = new java.util.ArrayList[String]()
javaList.add("hello")
val scalaList: Seq[String] = javaList.asScala.toSeq

// Scala 컬렉션 → Java 컬렉션
val scalaMap = Map("key" -> "value")
val javaMap: java.util.Map[String, String] = scalaMap.asJava
```

---

## Scala 버전 선택 가이드

| 버전 | 특징 | 추천 대상 |
|------|------|----------|
| **Scala 2.12** | Spark 3.x와 호환 | Spark 프로젝트 |
| **Scala 2.13** | 최신 라이브러리 지원 | 일반 프로젝트 |
| **Scala 3** | 새로운 문법, 개선된 타입 시스템 | 신규 프로젝트 |

Apache Spark를 사용하는 경우 Spark 버전에 맞는 Scala 버전을 선택해야 합니다. Spark 3.x는 주로 Scala 2.12를, Spark 3.4+는 Scala 2.13도 지원합니다.
