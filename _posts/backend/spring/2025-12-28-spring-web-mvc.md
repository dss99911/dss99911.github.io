---
layout: post
title: "Spring Web MVC 완벽 가이드 - Controller, Session, Bootstrap 연동"
date: 2025-12-28 12:01:00 +0900
categories: [backend, spring]
tags: [spring, spring-mvc, controller, session, web, bootstrap]
description: "Spring MVC의 요청 처리 흐름부터 Controller 작성법, Session 관리, Bootstrap 연동까지 웹 개발에 필요한 핵심 내용을 다룹니다."
image: /assets/images/posts/thumbnails/2025-12-28-spring-web-mvc.png
---

Spring MVC는 웹 애플리케이션 개발을 위한 강력한 프레임워크입니다. 이 글에서는 MVC 패턴의 요청 처리 흐름부터 Controller 작성, Session 관리, 그리고 Bootstrap 연동까지 살펴보겠습니다.

## Spring MVC 요청 처리 흐름

Spring MVC에서 HTTP 요청이 처리되는 과정을 이해하는 것은 매우 중요합니다.

### 요청 처리 순서

1. **DispatcherServlet**이 HTTP 요청을 수신
2. URL을 기반으로 적절한 **Controller**를 식별
3. Controller가 **비즈니스 로직**을 실행
4. Controller가 **Model**과 **View Name**을 DispatcherServlet에 반환
5. **ViewResolver**를 통해 올바른 View를 식별
6. Model 데이터를 View에 전달하고 실행
7. HTTP 응답을 클라이언트에 반환

> DispatcherServlet은 Front Controller 패턴의 구현체입니다.

## Embedded Tomcat

Spring Boot는 내장 Tomcat을 제공하여 별도의 WAS 설치 없이 웹 애플리케이션을 실행할 수 있습니다. `spring-boot-starter-web` 의존성만 추가하면 자동으로 구성됩니다.

## Controller 작성

### 기본 Controller

```java
@Controller
class LoginController {

    @RequestMapping("/login")
    String login() {
        return "loginPage"; // View 이름 반환
    }
}
```

### HTTP 메서드 제한

GET 요청만 허용하려면:

```java
@RequestMapping(value="/login", method = RequestMethod.GET)
public String login() {
    return "loginPage";
}
```

Spring 4.3 이후에는 더 간결한 어노테이션을 사용할 수 있습니다:

```java
@GetMapping("/login")
public String login() {
    return "loginPage";
}

@PostMapping("/login")
public String processLogin() {
    return "redirect:/home";
}
```

### View 없이 응답 반환

REST API처럼 직접 응답 본문을 반환하려면:

```java
@RequestMapping("/login")
@ResponseBody
String login() {
    return "Login Success"; // 문자열 그대로 응답
}
```

### 요청 파라미터 받기

```java
@GetMapping("/login")
public String login(@RequestParam String name) {
    // /login?name=value
    return "loginPage";
}
```

### Model을 View에 전달

```java
@GetMapping("/login")
public String login(ModelMap model) {
    model.put("name", "홍길동");
    return "loginPage"; // View에서 ${name}으로 접근 가능
}
```

### 리다이렉트

단순히 View 이름만 반환하면 해당 View만 렌더링됩니다. 다른 URL로 리다이렉트하려면:

```java
@RequestMapping("/login")
public String login() {
    return "redirect:/loginPage"; // /loginPage URL로 리다이렉트
}
```

> 리다이렉트와 포워드의 차이: 리다이렉트는 새로운 요청을 생성하고, 포워드는 서버 내부에서 요청을 전달합니다.

## Session 관리

HTTP는 무상태(stateless) 프로토콜이므로, 사용자 정보를 유지하려면 Session을 사용해야 합니다.

### @SessionAttributes 사용

`ModelMap`에 추가된 값 중 지정된 속성만 Session에 저장합니다:

```kotlin
// 로그인 처리
fun login(model: ModelMap) {
    model.put("name", "홍길동") // 값 추가
}

@SessionAttributes("name") // "name" 속성을 Session에 저장
@Controller
class TodoController {

    @GetMapping("/todo")
    fun getTodo(model: ModelMap): String {
        val name = model.get("name") // Session에서 값 가져오기
        return "todoPage"
    }
}
```

### Session 속성 삭제

Session에서 속성을 제거하려면 `SessionStatus`를 사용합니다:

```java
@PostMapping("/logout")
public String logout(SessionStatus status) {
    status.setComplete(); // Session 속성 정리
    return "redirect:/login";
}
```

## Bootstrap 연동

Spring Boot에서 Bootstrap을 WebJars를 통해 쉽게 사용할 수 있습니다.

### Maven 의존성 추가

```xml
<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>bootstrap</artifactId>
    <version>3.3.6</version>
</dependency>
<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>jquery</artifactId>
    <version>1.9.1</version>
</dependency>
```

### HTML에서 사용

의존성 추가 후, WebJars 경로를 통해 리소스에 접근합니다:

```html
<!-- jQuery -->
<script src="webjars/jquery/1.9.1/jquery.min.js"></script>

<!-- Bootstrap JS -->
<script src="webjars/bootstrap/3.3.6/js/bootstrap.min.js"></script>

<!-- Bootstrap CSS -->
<link href="webjars/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
```

> 최신 버전의 Bootstrap을 사용하려면 버전 번호를 업데이트하세요.

### 최신 Bootstrap 5 사용 예시

```xml
<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>bootstrap</artifactId>
    <version>5.3.2</version>
</dependency>
```

```html
<link href="webjars/bootstrap/5.3.2/css/bootstrap.min.css" rel="stylesheet">
<script src="webjars/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>
```

## 결론

Spring MVC는 체계적인 웹 애플리케이션 개발을 위한 강력한 프레임워크입니다. DispatcherServlet을 중심으로 한 요청 처리 흐름을 이해하고, Controller에서 다양한 어노테이션을 활용하면 효율적인 웹 개발이 가능합니다. Session 관리와 Bootstrap 연동까지 마스터하면 실무에서 바로 활용할 수 있는 수준이 됩니다.
