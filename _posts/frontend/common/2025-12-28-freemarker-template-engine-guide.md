---
layout: post
title: "Freemarker Template Engine Guide"
date: 2025-12-28 12:00:00 +0900
categories: [frontend, common]
tags: [freemarker, java, template-engine, backend]
description: "Freemarker template engine complete guide including directives, macros, functions, and data types"
image: /assets/images/posts/thumbnails/2025-12-28-freemarker-template-engine-guide.png
---

## Basic Syntax

### Interpolation
Insert values into the output: `${ ... }`

### FTL Tags (Directives)

**Predefined directives** use `#`:
```html
<#directiveName parameters>
</#directiveName>
```

**User-defined directives** use `@`:
```html
<@mydirective parameters>...</@mydirective>
```

### Include Files
```html
<#include "header.html">
```

### Comments
```html
<#-- this is a comment -->

${user <#-- The name of user -->}
```

### Computer Audience
For JavaScript fields, URLs with boolean or number values (not for human audience):
```html
<a href="/shop/productdetails?id=${product.id?c}">Details...</a>
${someBoolean?c}
```

## Variables

Reference: [Freemarker assign directive](http://freemarker.org/docs/ref_directive_assign.html)

### Declaration
```html
<#assign seq = ["foo", "bar", "baz"]>
<#assign x++>

<#assign
  seq = ["foo", "bar", "baz"]
  x++
>

<#assign x="Hello ${user}!">

<#assign x>
  <#list 1..3 as n>
    ${n} <@myMacro />
  </#list>
</#assign>

<#-- Assign in other namespace -->
<#assign bgColor="red" in my>
```

### Usage
```html
${x}
```

### Special Variables
Predefined variables use dot prefix:
```html
.variable_name
```

## Data Types

### String
```html
"Foo" or 'Foo' or "It's \"quoted\"" or 'It\'s "quoted"'
${r"${foo}"}  <#-- raw data -->
```

**Get character:**
```html
name[0]
```

**Substring:**
```html
name[0..4]   <#-- Inclusive end -->
name[0..<5]  <#-- Exclusive end -->
name[0..*5]  <#-- Length-based (lenient) -->
name[5..]    <#-- Remove starting -->
```

**Concatenation:**
```html
<#assign s = "Hello " + user + "!">
```

**Methods:**
```html
${testString?upper_case?html}
${testSequence[1]?cap_first}
```

### Number

**Float to int conversion:**
```html
${1.999?int}   <#-- => 1 -->
${-1.999?int}  <#-- => -1 -->
```

### Array

**Declaration:**
```html
["foo", "bar", 123.45]
```

**Get element:**
```html
products[5]
```

**Sub Array:**
```html
products[20..29]
```

**Concatenation:**
```html
users + ["guest"]
```

**Methods:**
```html
${testSequence?size}
${testSequence?join(", ")}
```

### Map

**Declaration:**
```html
{"name":"green mouse", "price":150}
```

**Get value:**
```html
user.name
user["name"]
${user[prop]}
```

**Concatenation:**
```html
passwords + { "joe": "secret42" }
```

**Iterate over keys:**
```html
<#list user?keys as prop>
    ${prop} = ${user.get(prop)}
</#list>
```

### Range
```html
0..9       <#-- 0 to 9 inclusive -->
0..<10     <#-- 0 to 9 (exclusive end) -->
0..!10     <#-- same as above -->
0..        <#-- infinite range starting from 0 -->
```

## Type Casting

Freemarker is strict about type conversion:
```html
${3 * "5"}  <#-- WRONG! -->
${3 + "5"}  <#-- => "35" (string concatenation) -->
```

**Number to string:**
```html
123?string
```

**Boolean to string:**
```html
${married?string("yes", "no")}
```

## Operators

### Arithmetic
```html
(x * 1.5 + 10) / 2 - y % 100
```

### Comparison
```html
x == y, x != y, x < y, x > y, x >= y, x <= y
x lt y, x lte y, x gt y, x gte y

<#if (x > y)>  <#-- can use parentheses -->
```

Note: `<#if 1 == "1">` will cause an error (type mismatch).

### Logical
```html
||   <#-- Logical or -->
&&   <#-- Logical and -->
!    <#-- Logical not -->

!registered && (firstVisit || fromEurope)
```

### Assignment
```html
=, +=, -=, *=, /=, %=, ++, --
```

## Control Structures

### If Statement
Reference: [Freemarker if directive](http://freemarker.org/docs/ref_directive_if.html)

```html
<#if x == 1>
  x is 1
</#if>

<#if x == 1>
  x is 1
<#else>
  x is not 1
</#if>

<#if x == 1>
  x is 1
<#elseif x == 2>
  x is 2
<#elseif x == 3>
  x is 3
</#if>
```

### Loop (List)

**Number repeat:**
```html
<#list 1..3 as n>
    ${n}
</#list>
```

**Array loop:**
```html
<#list seq[1..3] as i>${i}</#list>

<#list array as item>
</#list>
```

**Table example:**
```html
<table class="datatable">
    <tr>
        <th>Firstname</th>
        <th>Lastname</th>
    </tr>
    <#list users as user>
    <tr>
        <td>${user.firstname}</td>
        <td>${user.lastname}</td>
    </tr>
    </#list>
</table>
```

## Exception Handling

### Try-Recover
```html
<#attempt>
  Optional content: ${thisMayFails}
<#recover>
  Ops! The optional content is not available.
</#attempt>
```

### Missing Values (Default)
When expression has problems or is null:
```html
${mouse!"No mouse."}

<#assign mouse="Jerry">
${mouse!"No mouse."}  <#-- outputs "Jerry" -->
```

Syntax variations:
- `unsafe_expr!default_expr`
- `unsafe_expr!` (empty default)
- `(unsafe_expr)!default_expr`
- `(unsafe_expr)!`

### Missing Value Check
```html
<#if mouse??>
  Mouse found
<#else>
  No mouse found
</#if>
```

### Error Info
Reference: [Freemarker special variables](http://freemarker.org/docs/ref_specvar.html)
```html
${.error}
```

## Functions

### Declaration
```html
<#function avg x y>
  <#return (x + y) / 2>
</#function>

<#function avg nums...>
  <#local sum = 0>
  <#list nums as num>
    <#local sum += num>
  </#list>
  <#if nums?size != 0>
    <#return sum / nums?size>
  </#if>
</#function>
```

### Usage
```html
${avg(10, 20)}
${avg(10, 20, 30, 40)}
${avg()!"N/A"}
```

### Built-in Methods
If method has no parameters, `()` can be omitted. Use `?` instead of `.`:
```html
${testString?upper_case}
${testString?upper_case?html}
```

## Macros

### Declaration
```html
<#macro macroName param1 param2>
  ...
</#macro>
```

### Usage
```html
<@macroName param1=val1 param2=val2/>
```

**Merge string with variable:**
```html
<@messageInfoView index=index+"denom" obj=obj+".messageInfo" title="Message Information"/>
```

### Default Value
```html
<#macro defaultHead title="True">
```

### Nested Content
```html
<#macro macroName>
  <#nested>
</#macro>

<@macroName>
  <p>nested Code</p>
</@macroName>
```

### Variable Arguments
```html
<#macro defaultHead title="True Balance - MMS Console" extra...>
  ${extra["ngApp"]}
</#macro>
```

## Import and Include

### Import
```html
<#import "/mylib.ftl" as my>  <#-- my is namespace -->
```

### Include
```html
<#include "/footer/${company}.html">
```

### Assign Variable to Namespace
```html
<#assign bgColor="red" in my>
```

## Reference Links

- [Overall Structure](http://freemarker.org/docs/dgui_template_overallstructure.html)
- [Directive Reference](http://freemarker.org/docs/ref_directives.html)
- [Built-in Methods](http://freemarker.org/docs/ref_builtins.html)
