---
layout: post
title: "Golang 시작하기 - 개요, 프레임워크, 학습 자료"
date: 2025-12-28
categories: [programming, golang]
tags: [golang, go, framework, learning]
image: /assets/images/posts/thumbnails/2025-12-28-golang-getting-started.png
redirect_from:
  - "/programming/golang/2025/12/28/golang-getting-started.html"
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

---

## Go의 기본 문법

### 변수 선언

Go는 정적 타입 언어이면서도 타입 추론을 지원합니다.

```go
// 명시적 타입 선언
var name string = "Go"
var age int = 15

// 타입 추론 (함수 내부에서만 사용 가능)
name := "Go"
age := 15

// 여러 변수 동시 선언
var (
    x int    = 10
    y string = "hello"
)
```

### 구조체 (Struct)

Go에는 클래스가 없지만 구조체와 메서드를 조합하여 객체지향적인 코드를 작성할 수 있습니다.

```go
type Person struct {
    Name string
    Age  int
}

func (p Person) Greet() string {
    return fmt.Sprintf("Hello, I'm %s", p.Name)
}

func main() {
    p := Person{Name: "Kim", Age: 30}
    fmt.Println(p.Greet())
}
```

### 인터페이스

Go의 인터페이스는 암시적으로 구현됩니다. `implements` 키워드 없이 메서드만 구현하면 자동으로 인터페이스를 만족합니다.

```go
type Speaker interface {
    Speak() string
}

type Dog struct{}

func (d Dog) Speak() string {
    return "Woof!"
}
// Dog은 자동으로 Speaker 인터페이스를 구현
```

### 에러 처리

Go는 예외(exception) 대신 반환값으로 에러를 처리합니다. 이 방식은 에러 처리를 명시적으로 만들어 코드의 안정성을 높입니다.

```go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}

result, err := divide(10, 0)
if err != nil {
    log.Fatal(err)
}
```

---

## Go 모듈 시스템

Go 1.11부터 도입된 Go Modules는 현재 공식 의존성 관리 시스템입니다. 기존 `dep`과 `GOPATH` 방식을 대체합니다.

```bash
# 새 모듈 초기화
go mod init github.com/username/project

# 의존성 추가 (import 후 자동으로 추가됨)
go mod tidy

# 의존성 다운로드
go mod download
```

`go.mod` 파일이 프로젝트 루트에 생성되어 의존성 정보를 관리합니다. `go.sum` 파일은 각 의존성의 체크섬을 기록하여 무결성을 보장합니다.

---

## 동시성 (Goroutine과 Channel)

Go의 가장 큰 강점 중 하나는 내장된 동시성 지원입니다.

```go
// Goroutine: go 키워드로 간단하게 생성
go func() {
    fmt.Println("별도 고루틴에서 실행")
}()

// Channel: 고루틴 간 안전한 데이터 통신
ch := make(chan string)
go func() {
    ch <- "Hello from goroutine"
}()
msg := <-ch
fmt.Println(msg)
```

Goroutine은 OS 스레드보다 훨씬 가볍습니다(약 2KB의 스택). 수천 개의 Goroutine을 동시에 실행해도 메모리 부담이 적어 높은 동시성이 필요한 서버 프로그램에 적합합니다.

### Select 문

여러 Channel에서 동시에 대기할 때 `select`를 사용합니다. 어떤 Channel이 먼저 준비되든 해당 case가 실행됩니다.

```go
func main() {
    ch1 := make(chan string)
    ch2 := make(chan string)

    go func() {
        time.Sleep(1 * time.Second)
        ch1 <- "one"
    }()

    go func() {
        time.Sleep(2 * time.Second)
        ch2 <- "two"
    }()

    // 먼저 도착하는 메시지를 처리
    select {
    case msg := <-ch1:
        fmt.Println("Received from ch1:", msg)
    case msg := <-ch2:
        fmt.Println("Received from ch2:", msg)
    case <-time.After(3 * time.Second):
        fmt.Println("Timeout!")
    }
}
```

### WaitGroup

여러 Goroutine이 모두 완료될 때까지 대기할 때 `sync.WaitGroup`을 사용합니다.

```go
func main() {
    var wg sync.WaitGroup

    for i := 0; i < 5; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            fmt.Printf("Worker %d done\n", id)
        }(i)
    }

    wg.Wait() // 모든 Goroutine이 완료될 때까지 대기
    fmt.Println("All workers done")
}
```

---

## 테스트 작성

Go는 테스트를 위한 내장 패키지 `testing`을 제공합니다. 파일명이 `_test.go`로 끝나면 테스트 파일로 인식됩니다.

```go
// math.go
package math

func Add(a, b int) int {
    return a + b
}

// math_test.go
package math

import "testing"

func TestAdd(t *testing.T) {
    result := Add(2, 3)
    if result != 5 {
        t.Errorf("Add(2, 3) = %d; want 5", result)
    }
}

// 테이블 기반 테스트 (Table-Driven Test)
func TestAddTableDriven(t *testing.T) {
    tests := []struct {
        a, b, expected int
    }{
        {1, 2, 3},
        {0, 0, 0},
        {-1, 1, 0},
        {100, 200, 300},
    }

    for _, tt := range tests {
        result := Add(tt.a, tt.b)
        if result != tt.expected {
            t.Errorf("Add(%d, %d) = %d; want %d",
                tt.a, tt.b, result, tt.expected)
        }
    }
}
```

```bash
# 테스트 실행
go test ./...

# 커버리지 확인
go test -cover ./...

# 벤치마크 실행
go test -bench=. ./...
```

---

## 웹 서버 작성 (표준 라이브러리)

Go의 표준 라이브러리만으로도 충분히 실용적인 웹 서버를 만들 수 있습니다.

```go
package main

import (
    "encoding/json"
    "log"
    "net/http"
)

type Response struct {
    Message string `json:"message"`
    Status  int    `json:"status"`
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
    resp := Response{Message: "OK", Status: 200}
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(resp)
}

func main() {
    http.HandleFunc("/health", healthHandler)

    log.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

### Gin 프레임워크 예시

더 풍부한 기능이 필요하다면 Gin 프레임워크를 사용합니다:

```go
package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

    r.GET("/health", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "message": "OK",
        })
    })

    r.GET("/users/:id", func(c *gin.Context) {
        id := c.Param("id")
        c.JSON(http.StatusOK, gin.H{
            "id": id,
        })
    })

    r.Run(":8080")
}
```

---

## Go vs 다른 언어 비교

| 항목 | Go | Python | Java | Rust |
|------|-----|--------|------|------|
| 타입 시스템 | 정적 | 동적 | 정적 | 정적 |
| 컴파일 속도 | 매우 빠름 | 인터프리터 | 느림 | 느림 |
| 실행 속도 | 빠름 | 느림 | 빠름 | 매우 빠름 |
| 동시성 | Goroutine (내장) | asyncio | Thread/Virtual Thread | async/await |
| 학습 곡선 | 낮음 | 매우 낮음 | 중간 | 높음 |
| 메모리 관리 | GC | GC | GC | 소유권 시스템 |
| 바이너리 크기 | 단일 바이너리 | 런타임 필요 | JVM 필요 | 단일 바이너리 |

Go는 특히 **마이크로서비스**, **CLI 도구**, **네트워크 프로그래밍**, **DevOps 도구** 분야에서 강점을 보입니다. Docker, Kubernetes, Terraform 등 유명한 인프라 도구들이 Go로 작성되었습니다.
