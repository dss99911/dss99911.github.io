---
layout: post
title: "Scala 시작하기 - 프로젝트 생성과 SBT 설정"
date: 2025-12-28
categories: [programming, scala]
tags: [scala, sbt, setup]
image: /assets/images/posts/thumbnails/2025-12-28-scala-getting-started.png
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
