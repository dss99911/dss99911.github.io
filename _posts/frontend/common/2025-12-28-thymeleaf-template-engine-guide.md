---
layout: post
title: "Thymeleaf Template Engine Guide"
date: 2025-12-28 12:00:00 +0900
categories: [frontend, common]
tags: [thymeleaf, java, spring, template-engine]
description: "Thymeleaf template engine basic guide for Java Spring applications"
image: /assets/images/posts/thumbnails/2025-12-28-thymeleaf-template-engine-guide.png
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
