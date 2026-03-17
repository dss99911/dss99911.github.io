---
layout: post
title: "Thymeleaf Template Engine Guide"
date: 2025-10-08 09:33:00 +0900
categories: [frontend, common]
tags: [thymeleaf, java, spring, template-engine]
description: "Thymeleaf template engine basic guide for Java Spring applications"
image: /assets/images/posts/thumbnails/2025-12-28-thymeleaf-template-engine-guide.png
redirect_from:
  - "/frontend/common/2025/12/28/thymeleaf-template-engine-guide.html"
---

## Introduction

Thymeleaf is a modern server-side Java template engine for web and standalone environments. It's commonly used with Spring Framework.

## Setup

Add the Thymeleaf namespace to your HTML:
```html
<html xmlns:th="http://thymeleaf.org">
```

## Variable Expression

### Display Variable Value

Use `th:text` to display variable values:
```html
<h4 th:text="${user.name}"></h4>
```

## Conditional Display

### th:if Attribute

Display content conditionally:
```html
<p th:if="${param.error}">
    Bad Credentials: ${param.error}
</p>
```

## Common Thymeleaf Attributes

| Attribute | Description |
|-----------|-------------|
| `th:text` | Replace text content |
| `th:if` | Conditional rendering |
| `th:unless` | Negative conditional rendering |
| `th:each` | Loop iteration |
| `th:href` | Dynamic link |
| `th:src` | Dynamic source |
| `th:value` | Form field value |
| `th:object` | Form backing object |
| `th:field` | Form field binding |

## Reference

- [Thymeleaf Official Documentation](https://www.thymeleaf.org/documentation.html)

## Spring Boot Integration

Thymeleaf integrates seamlessly with Spring Boot. Simply add the dependency and templates are automatically resolved.

### Maven Dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

### Gradle Dependency

```groovy
implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
```

### Controller Example

```java
@Controller
public class UserController {

    @GetMapping("/users")
    public String listUsers(Model model) {
        List<User> users = userService.findAll();
        model.addAttribute("users", users);
        model.addAttribute("title", "User List");
        return "users/list";  // resolves to templates/users/list.html
    }
}
```

Templates are placed in `src/main/resources/templates/` by default.

## Iteration with th:each

Loop through collections to generate repeated HTML elements:

```html
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        <tr th:each="user, iterStat : ${users}">
            <td th:text="${user.name}">John</td>
            <td th:text="${user.email}">john@example.com</td>
            <td th:text="${user.active ? 'Active' : 'Inactive'}">Active</td>
        </tr>
    </tbody>
</table>
```

The iteration status variable (`iterStat`) provides useful properties:

| Property | Description |
|----------|-------------|
| `index` | Zero-based index |
| `count` | One-based index |
| `size` | Total number of elements |
| `even` / `odd` | Boolean for even/odd iteration |
| `first` / `last` | Boolean for first/last element |

## URL Expressions

Thymeleaf provides a special syntax for building URLs with `@{}`:

```html
<!-- Static resource -->
<link th:href="@{/css/style.css}" rel="stylesheet">

<!-- Path variable -->
<a th:href="@{/users/{id}(id=${user.id})}">View</a>

<!-- Query parameter -->
<a th:href="@{/users(page=${currentPage}, size=10)}">Next</a>

<!-- Combines path variable and query parameter -->
<a th:href="@{/users/{id}/edit(id=${user.id}, tab='profile')}">Edit</a>
```

## Form Handling

Thymeleaf provides powerful form binding capabilities with Spring MVC:

```html
<form th:action="@{/users}" th:object="${userForm}" method="post">
    <div>
        <label>Name:</label>
        <input type="text" th:field="*{name}"/>
        <span th:if="${#fields.hasErrors('name')}"
              th:errors="*{name}" class="error"></span>
    </div>
    <div>
        <label>Email:</label>
        <input type="email" th:field="*{email}"/>
        <span th:if="${#fields.hasErrors('email')}"
              th:errors="*{email}" class="error"></span>
    </div>
    <div>
        <label>Role:</label>
        <select th:field="*{role}">
            <option th:each="role : ${roles}"
                    th:value="${role}"
                    th:text="${role.displayName}">Role</option>
        </select>
    </div>
    <button type="submit">Save</button>
</form>
```

The `th:object` attribute binds the form to a model object, and `th:field` handles both the `name` attribute and the value binding automatically.

## Fragment Reuse (Layouts)

Fragments allow you to define reusable template components:

### Defining Fragments

```html
<!-- templates/fragments/layout.html -->
<header th:fragment="header">
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>
</header>

<footer th:fragment="footer(year)">
    <p>&copy; <span th:text="${year}">2025</span> My Company</p>
</footer>
```

### Using Fragments

```html
<!-- templates/pages/home.html -->
<div th:insert="~{fragments/layout :: header}"></div>

<main>
    <h1>Welcome</h1>
</main>

<div th:replace="~{fragments/layout :: footer(${#dates.year(#dates.createNow())})}"></div>
```

The difference between `th:insert` and `th:replace`:
- `th:insert` inserts the fragment inside the host tag
- `th:replace` replaces the host tag entirely with the fragment

## Utility Objects

Thymeleaf provides built-in utility objects accessible with the `#` prefix:

| Object | Purpose | Example |
|--------|---------|---------|
| `#strings` | String operations | `${#strings.isEmpty(name)}` |
| `#numbers` | Number formatting | `${#numbers.formatDecimal(price, 1, 2)}` |
| `#dates` | Date formatting | `${#dates.format(date, 'yyyy-MM-dd')}` |
| `#lists` | List operations | `${#lists.size(items)}` |
| `#objects` | Object null check | `${#objects.nullSafe(obj, 'default')}` |

## Natural Templates Advantage

One of Thymeleaf's greatest strengths is that templates are valid HTML files. This means designers can open and view them in a browser without a running server. The `th:text` attributes are ignored by browsers, and the placeholder content is displayed instead:

```html
<!-- This is valid HTML that displays "John Doe" in a browser -->
<!-- When processed by Thymeleaf, it shows the actual user name -->
<span th:text="${user.name}">John Doe</span>
```

This makes Thymeleaf particularly well-suited for teams where designers and developers collaborate on the same template files.
