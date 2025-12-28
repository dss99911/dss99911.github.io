---
layout: post
title: "Template Engines - EJS, Freemarker, and Thymeleaf"
date: 2025-12-28 12:13:00 +0900
categories: [frontend, javascript]
tags: [ejs, freemarker, thymeleaf, templates]
description: "Complete guide to template engines including EJS for Node.js, Freemarker for Java, and Thymeleaf for Spring"
---

Template engines help generate dynamic HTML by combining templates with data. This guide covers three popular template engines.

## EJS (Embedded JavaScript)

EJS is a simple templating language that lets you generate HTML markup with plain JavaScript.

### Syntax

```html
<% %>  <!-- Executed but not output -->
<%= %> <!-- Output the value (HTML escaped) -->
```

### Variables

```html
<h1><%= title %></h1>
```

### Loops

```html
<h1><%= title %></h1>
<ul>
<% for(var i=0; i<supplies.length; i++) { %>
    <li><%= supplies[i] %></li>
<% } %>
</ul>
```

### Links

```html
<%= link_to(name, url) %>

<!-- Example -->
<% for(var i=0; i<supplies.length; i++) { %>
    <li><%= link_to(supplies[i], 'supplies/' + supplies[i]) %></li>
<% } %>
```

### Images

```html
<%= img_tag('images/logo.png') %>
```

### Include

```html
<% include ../partials/nav.ejs %>
```

---

## Freemarker

Freemarker is a template engine for Java applications.

### Basic Syntax

```ftl
${variable}                    <!-- Interpolation -->
<#directiveName parameters>    <!-- Predefined directive -->
<@mydirective parameters>      <!-- User-defined directive -->
[#-- this is a comment --]     <!-- Comment -->
```

### Variables

```ftl
<#assign seq = ["foo", "bar", "baz"]>
<#assign x++>
<#assign x="Hello ${user}!">
${x}
```

### Conditionals

```ftl
<#if x == 1>
    x is 1
<#elseif x == 2>
    x is 2
<#else>
    x is something else
</#if>
```

### Loops

```ftl
<#list 1..3 as n>
    ${n}
</#list>

<#list users as user>
    <tr>
        <td>${user.firstname}</td>
        <td>${user.lastname}</td>
    </tr>
</#list>
```

### Arrays

```ftl
<!-- Declaration -->
["foo", "bar", 123.45]

<!-- Access -->
products[5]

<!-- Sub-array -->
products[20..29]

<!-- Concatenation -->
users + ["guest"]

<!-- Methods -->
${testSequence?size}
${testSequence?join(", ")}
```

### Maps

```ftl
<!-- Declaration -->
{"name":"green mouse", "price":150}

<!-- Access -->
user.name
user["name"]

<!-- Iteration -->
<#list user?keys as prop>
    ${prop} = ${user.get(prop)}
</#list>

<!-- Concatenation -->
passwords + { "joe": "secret42" }
```

### Strings

```ftl
"Foo" or 'Foo'
"It's \"quoted\""
${r"${raw}"} <!-- Raw string -->

<!-- Operations -->
name[0]           <!-- Character -->
name[0..4]        <!-- Substring (inclusive) -->
name[0..<5]       <!-- Substring (exclusive) -->
name[5..]         <!-- From index to end -->

<!-- Concatenation -->
<#assign s = "Hello " + user + "!">

<!-- Methods -->
${testString?upper_case}
${testString?cap_first}
```

### Numbers

```ftl
${1.999?int}   <!-- 1 -->
${-1.999?int}  <!-- -1 -->
```

### Type Casting

```ftl
${3 + "5"}              <!-- "35" (string concatenation) -->
123?string              <!-- Number to string -->
${married?string("yes", "no")}  <!-- Boolean to string -->
```

### Functions

```ftl
<#function avg x y>
    <#return (x + y) / 2>
</#function>

${avg(10, 20)}
```

### Macros

```ftl
<#macro greet name>
    Hello, ${name}!
</#macro>

<@greet name="John"/>

<!-- With default values -->
<#macro defaultHead title="Default Title">
    <title>${title}</title>
</#macro>

<!-- Nested content -->
<#macro box>
    <div class="box">
        <#nested>
    </div>
</#macro>

<@box>
    <p>Content inside box</p>
</@box>
```

### Exception Handling

```ftl
<#attempt>
    Optional: ${thisMayFail}
<#recover>
    Oops! Something went wrong.
</#attempt>

<!-- Missing values -->
${mouse!"No mouse."}  <!-- Default if null -->
<#if mouse??>         <!-- Check if exists -->
    Mouse found
</#if>
```

### Import and Include

```ftl
<#import "/mylib.ftl" as my>
<#include "/footer/${company}.html">
```

### Operators

```ftl
<!-- Arithmetic -->
(x * 1.5 + 10) / 2 - y % 100

<!-- Comparison -->
x == y, x != y, x < y, x > y, x >= y, x <= y
x lt y, x lte y, x gt y, x gte y

<!-- Logical -->
!registered && (firstVisit || fromEurope)

<!-- Assignment -->
=, +=, -=, *=, /=, %=, ++, --
```

### Compute Audience

For JavaScript or URL values (non-human readable):

```ftl
<a href="/product?id=${product.id?c}">Details</a>
${someBoolean?c}
```

---

## Thymeleaf

Thymeleaf is a modern server-side Java template engine for Spring applications.

### Setup

```html
<html xmlns:th="http://thymeleaf.org">
```

### Display Values

```html
<h4 th:text="${user.name}"></h4>

<p th:if="${param.error}">
    Bad Credentials: ${param.error}
</p>
```

### Conditionals

```html
<div th:if="${condition}">
    Shown if condition is true
</div>

<div th:unless="${condition}">
    Shown if condition is false
</div>

<div th:switch="${user.role}">
    <p th:case="'admin'">Admin User</p>
    <p th:case="'user'">Regular User</p>
    <p th:case="*">Unknown Role</p>
</div>
```

### Loops

```html
<tr th:each="user : ${users}">
    <td th:text="${user.name}">Name</td>
    <td th:text="${user.email}">Email</td>
</tr>
```

### Attributes

```html
<a th:href="@{/users/{id}(id=${user.id})}">View User</a>
<img th:src="@{/images/logo.png}">
<input th:value="${user.name}">
```

---

## Comparison

| Feature | EJS | Freemarker | Thymeleaf |
|---------|-----|------------|-----------|
| Platform | Node.js | Java | Java/Spring |
| Syntax | `<%= %>` | `${}` | `th:*` |
| Natural Templates | No | No | Yes |
| Logic in Template | Yes | Yes | Limited |
| Learning Curve | Low | Medium | Medium |

Each template engine has its strengths:
- **EJS** - Simple JavaScript templating for Node.js
- **Freemarker** - Powerful features for Java applications
- **Thymeleaf** - Natural templates that work as valid HTML

---

Choose the template engine that best fits your technology stack and project requirements.
