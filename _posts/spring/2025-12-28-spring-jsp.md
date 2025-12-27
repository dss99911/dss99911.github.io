---
layout: post
title: "Spring Boot JSP 가이드 - 설정부터 Form 처리, 유효성 검증까지"
date: 2025-12-28 12:06:00 +0900
categories: spring
tags: [spring, jsp, jstl, form, validation]
description: "Spring Boot에서 JSP를 사용하는 방법을 알아봅니다. 기본 설정, JSTL 사용법, Form 처리, 서버 사이드 유효성 검증까지 상세히 다룹니다."
---

Spring Boot는 기본적으로 Thymeleaf를 권장하지만, 레거시 프로젝트나 특정 요구사항에 따라 JSP를 사용해야 할 때도 있습니다. 이 글에서는 Spring Boot에서 JSP를 설정하고 활용하는 방법을 알아봅니다.

## JSP 설정

### 의존성 추가

**Gradle:**
```groovy
implementation 'org.apache.tomcat.embed:tomcat-embed-jasper'
implementation 'javax.servlet:jstl'
```

**Maven:**
```xml
<dependency>
    <groupId>org.apache.tomcat.embed</groupId>
    <artifactId>tomcat-embed-jasper</artifactId>
    <scope>provided</scope>
</dependency>
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>jstl</artifactId>
</dependency>
```

### View Resolver 설정

`application.properties`:
```properties
spring.mvc.view.prefix=/WEB-INF/jsp/
spring.mvc.view.suffix=.jsp
```

### JSP 파일 위치

```
src/main/webapp/WEB-INF/jsp/login.jsp
```

> 주의: `src/main/webapp` 디렉토리가 클래스패스에 포함되어야 합니다.

## Expression Language (EL)

JSP에서 Model 데이터에 접근하려면 Expression Language를 사용합니다:

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Welcome</title>
</head>
<body>
    <h1>안녕하세요, ${name}님!</h1>
</body>
</html>
```

## JSTL (JSP Standard Tag Library)

### 태그 라이브러리 선언

```jsp
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
```

### 반복문 (forEach)

```jsp
<table>
    <thead>
        <tr>
            <th>설명</th>
            <th>마감일</th>
            <th>상태</th>
        </tr>
    </thead>
    <tbody>
        <c:forEach items="${todos}" var="todo">
            <tr>
                <td>${todo.desc}</td>
                <td>${todo.targetDate}</td>
                <td>${todo.status}</td>
            </tr>
        </c:forEach>
    </tbody>
</table>
```

### 조건문 (if, choose)

```jsp
<c:if test="${not empty message}">
    <div class="alert">${message}</div>
</c:if>

<c:choose>
    <c:when test="${todo.status == 'DONE'}">
        <span class="badge badge-success">완료</span>
    </c:when>
    <c:otherwise>
        <span class="badge badge-warning">진행중</span>
    </c:otherwise>
</c:choose>
```

## Spring Form 태그

### Form 태그 라이브러리 선언

```jsp
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
```

### 기본 Form 구조

```jsp
<form:form method="post" modelAttribute="todo">
    <fieldset class="form-group">
        <form:label path="desc">설명</form:label>
        <form:input path="desc" type="text" class="form-control" required="required"/>
    </fieldset>

    <fieldset class="form-group">
        <form:label path="targetDate">마감일</form:label>
        <form:input path="targetDate" type="text" class="form-control"/>
    </fieldset>

    <button type="submit" class="btn btn-primary">저장</button>
</form:form>
```

### Controller에서 Form 처리

```java
@Controller
public class TodoController {

    @GetMapping("/add-todo")
    public String showAddTodoPage(ModelMap model) {
        model.addAttribute("todo", new Todo(0, "", "Default Desc", new Date(), false));
        return "todo";
    }

    @PostMapping("/add-todo")
    public String addTodo(ModelMap model, Todo todo) {
        // Todo 저장 로직
        service.addTodo(todo);
        return "redirect:/list-todos";
    }
}
```

### Hidden 필드

Form에서 보이지 않지만 submit 시 전송되어야 하는 값:

```jsp
<form:form method="post" modelAttribute="todo">
    <form:hidden path="id"/>
    <!-- 다른 필드들 -->
</form:form>
```

## 서버 사이드 유효성 검증

### Entity에 유효성 어노테이션 추가

```java
public class Todo {
    private int id;
    private String user;

    @Size(min = 10, message = "최소 10자 이상 입력해주세요.")
    private String desc;

    @NotNull(message = "마감일은 필수입니다.")
    @Future(message = "마감일은 미래 날짜여야 합니다.")
    private Date targetDate;
}
```

### Controller에서 검증 처리

```java
@PostMapping("/add-todo")
public String addTodo(ModelMap model, @Valid Todo todo, BindingResult result) {

    if (result.hasErrors()) {
        return "todo"; // 에러가 있으면 폼 페이지로 돌아감
    }

    service.addTodo(todo);
    return "redirect:/list-todos";
}
```

### JSP에서 에러 메시지 표시

```jsp
<fieldset class="form-group">
    <form:label path="desc">설명</form:label>
    <form:input path="desc" type="text" class="form-control" required="required"/>
    <form:errors path="desc" cssClass="text-danger"/>
</fieldset>
```

## 날짜 포맷팅

### Controller에서 날짜 바인딩 설정

```java
@Controller
public class TodoController {

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, false));
    }
}
```

### JSP에서 날짜 포맷팅 (Form 외부)

```jsp
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>

<td>
    <fmt:formatDate value="${todo.targetDate}" pattern="yyyy-MM-dd"/>
</td>
```

### Date Picker 연동

**의존성 추가:**
```xml
<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>bootstrap-datepicker</artifactId>
    <version>1.0.1</version>
</dependency>
```

**JSP에서 사용:**
```html
<script src="webjars/bootstrap-datepicker/1.0.1/js/bootstrap-datepicker.js"></script>

<form:input path="targetDate" id="targetDate" type="text" class="form-control"/>

<script>
    $('#targetDate').datepicker({
        format: 'dd/mm/yyyy'
    });
</script>
```

## JSP Fragment (공통 코드 분리)

### Header Fragment (header.jspf)

```jsp
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>

<nav class="navbar navbar-default">
    <div class="container">
        <a class="navbar-brand" href="/">My App</a>
        <ul class="nav navbar-nav navbar-right">
            <li><a href="/logout">Logout</a></li>
        </ul>
    </div>
</nav>
```

### Fragment 포함

```jsp
<%@ include file="common/header.jspf" %>

<div class="container">
    <h1>Todo List</h1>
    <!-- 내용 -->
</div>

<%@ include file="common/footer.jspf" %>
```

## 결론

Spring Boot에서 JSP를 사용하려면 추가 설정이 필요하지만, JSTL과 Spring Form 태그를 활용하면 강력한 웹 페이지를 구축할 수 있습니다. 서버 사이드 유효성 검증을 통해 데이터 무결성을 보장하고, Fragment를 활용하여 코드 중복을 줄이세요. 다만, 새로운 프로젝트에서는 Thymeleaf 사용을 권장합니다.
