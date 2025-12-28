---
layout: post
title: "Golang 시작하기 - 개요, 프레임워크, 학습 자료"
date: 2025-12-28
categories: [programming, golang]
tags: [golang, go, framework, learning]
---

Go 언어의 개요와 시작에 필요한 정보를 알아봅니다.

## 학습 자료

- [YouTube: Go Tutorial](https://www.youtube.com/watch?v=GDHET-k4zz4)

## 웹 프레임워크

일반적으로 Go로 웹 애플리케이션을 작성할 때는 프레임워크를 사용하지 않는 것이 권장됩니다.

- [Go Web Application Structure](https://aaf.engineering/go-web-application-structure-pt-1/)

### 프레임워크 목록

- **Revel**
- **Beego**
- **Gin**
- **Buffalo** - 웹 개발용 프레임워크

## 라이브러리

- **Gin** - 자동 재컴파일, 라이브 빌드 서버 도구
- **Buffalo** - 웹 개발용 프레임워크

## 의존성 관리

- **dep** - Go 의존성 관리 도구

## 커뮤니티

- [GoLand Slack Community](https://go.jetbrains.com/g70bzQO0e10LVD0MQ600URi)

## Go의 장점

### 변수 스왑이 간편

```go
x, y := 0, 1
x, y = y, x
fmt.Println(x, y)
```

### 다중 반환값 지원

함수에서 여러 값을 반환할 수 있습니다.

## 코딩 규칙

### 함수 이름

- **대문자**로 시작: 외부에서 호출 가능 (exported)
- **소문자**로 시작: 패키지 내부용 (unexported)

## 개발 팁

### 코드 포맷팅

커밋 전에 `go fmt` 실행을 권장합니다.

### GoLand IDE 기능

- **여러 프로젝트 Attach**: Open Project 시 프로젝트 여러 개를 attach 가능
- **SQL 실행**: SQL -> Show Intention Actions -> Run query in console
- **데이터베이스 연결 기능**
