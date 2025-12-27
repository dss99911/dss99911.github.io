---
layout: post
title: "Go 언어 시작하기: 기초와 개발 환경"
date: 2025-12-28 12:10:00 +0900
categories: language
tags: [golang, go, programming, google]
description: "Go 언어의 장점, 코딩 규칙, 프레임워크, 개발 환경 설정을 소개합니다."
---

## Go 언어 소개

Go(Golang)는 Google에서 개발한 정적 타입, 컴파일 언어입니다.

### 주요 장점

1. **간결한 문법**: C와 유사하지만 더 간결
2. **빠른 컴파일**: 대규모 프로젝트도 빠르게 컴파일
3. **동시성 지원**: goroutine과 channel로 쉬운 동시성 처리
4. **가비지 컬렉션**: 자동 메모리 관리
5. **정적 바이너리**: 의존성 없는 단일 실행 파일

### 편리한 기능

```go
// 스왑이 간편
x, y := 0, 1
x, y = y, x
fmt.Println(x, y)  // 1 0

// 다중 리턴
func divmod(a, b int) (int, int) {
    return a / b, a % b
}

quotient, remainder := divmod(10, 3)
```

---

## 코딩 규칙

### 접근 제어

Go에서는 이름의 첫 글자 대소문자로 접근 수준을 결정합니다:

```go
// 대문자로 시작 = Public (외부 패키지에서 접근 가능)
func PublicFunction() {}
type PublicStruct struct {}

// 소문자로 시작 = Private (패키지 내부에서만 접근 가능)
func privateFunction() {}
type privateStruct struct {}
```

### 포맷팅

커밋 전에 항상 `gofmt` 실행:

```bash
# 포맷팅
gofmt -w .

# 또는 go fmt 사용
go fmt ./...
```

---

## Hello World

### 기본 프로그램

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

### 실행

```bash
# 직접 실행
go run main.go

# 빌드 후 실행
go build -o myapp
./myapp
```

---

## 프로젝트 구조

### 모듈 초기화

```bash
go mod init github.com/username/project
```

### 권장 디렉토리 구조

```
project/
├── cmd/
│   └── myapp/
│       └── main.go
├── internal/
│   └── ...
├── pkg/
│   └── ...
├── go.mod
└── go.sum
```

---

## 의존성 관리

Go Modules를 사용한 의존성 관리:

```bash
# 의존성 추가
go get github.com/some/package

# 의존성 정리
go mod tidy

# 의존성 다운로드
go mod download

# 벤더 디렉토리 생성
go mod vendor
```

---

## 프레임워크와 라이브러리

### 웹 프레임워크

Go에서는 일반적으로 프레임워크 없이 표준 라이브러리만으로 웹 개발이 가능하지만, 필요시 아래 프레임워크 사용:

| 프레임워크 | 특징 |
|-----------|------|
| **Gin** | 경량, 빠른 성능 |
| **Echo** | 미니멀, 확장성 |
| **Beego** | 풀스택, MVC |
| **Fiber** | Express.js 스타일 |
| **Chi** | 경량 라우터 |

### 유용한 라이브러리

- **Buffalo**: 풀스택 웹 개발 프레임워크
- **Gin (live reload)**: 자동 재컴파일, 실시간 빌드 서버 도구

### Gin 프레임워크 예제

```go
package main

import "github.com/gin-gonic/gin"

func main() {
    r := gin.Default()

    r.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "pong",
        })
    })

    r.Run()  // :8080에서 실행
}
```

---

## 개발 도구

### GoLand (JetBrains IDE)

- SQL 쿼리 실행: Show Intention Actions -> Run query in console
- 데이터베이스 연결 기능 내장
- 프로젝트 여러 개 동시 열기 (Attach)

### VS Code

Go 확장 프로그램 설치:

```json
{
    "go.useLanguageServer": true,
    "go.formatTool": "goimports",
    "go.lintTool": "golangci-lint"
}
```

---

## 아키텍처 참고

웹 애플리케이션 구조에 대한 좋은 참고 자료:
- [Go Web Application Structure](https://aaf.engineering/go-web-application-structure-pt-1/)

### 일반적인 구조 패턴

```
├── handlers/     # HTTP 핸들러
├── models/       # 데이터 모델
├── repository/   # 데이터베이스 접근
├── services/     # 비즈니스 로직
├── middleware/   # 미들웨어
└── config/       # 설정
```

---

## 커뮤니티

- [Gophers Slack](https://gophers.slack.com) - Go 개발자 커뮤니티
- [Go Forum](https://forum.golangbridge.org/)
- [Reddit r/golang](https://www.reddit.com/r/golang/)

---

## 학습 리소스

### 공식 자료

- [Go Tour](https://tour.golang.org/)
- [Effective Go](https://golang.org/doc/effective_go.html)
- [Go by Example](https://gobyexample.com/)

### 동영상 강좌

- [Go 기초 강좌 (YouTube)](https://www.youtube.com/watch?v=GDHET-k4zz4)

---

## 앞으로 배울 것

1. **고루틴과 채널**: Go의 동시성 모델
2. **인터페이스**: 덕 타이핑 방식의 인터페이스
3. **에러 처리**: Go 스타일의 에러 핸들링
4. **테스팅**: 내장 테스팅 프레임워크
5. **Docker**: Go 애플리케이션 컨테이너화
