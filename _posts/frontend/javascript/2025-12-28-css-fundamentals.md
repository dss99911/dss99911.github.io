---
layout: post
title: "CSS Fundamentals - Styling Web Pages"
date: 2025-12-28 12:11:00 +0900
categories: [frontend, javascript]
tags: [css, styling, selectors, web-design]
description: "Complete CSS guide covering selectors, properties, pseudo-classes, pseudo-elements, and common styling patterns"
image: /assets/images/posts/thumbnails/2025-12-28-css-fundamentals.png
---

CSS (Cascading Style Sheets) is the language used to style HTML documents. This guide covers essential CSS concepts and techniques.

## Including CSS

### Inline Style

```html
<h1 style="color:blue;margin-left:30px;">Heading</h1>
```

### Internal Stylesheet

```html
<style>
body {
    background-color: linen;
}
h1 {
    color: maroon;
    margin-left: 40px;
}
</style>
```

### External Stylesheet

```html
<head>
    <link rel="stylesheet" type="text/css" href="mystyle.css">
</head>
```

## Syntax

```css
selector {
    property: value;
    property: value;
}
```

Example:

```css
p {
    color: red;
    text-align: center;
}
```

## Comments

```css
p {
    color: red;  /* This is a single-line comment */
    text-align: center;
}

/* This is
   a multi-line
   comment */
```

## Selectors

### Basic Selectors

```css
/* Element selector */
h1 {
    color: red;
}

/* Class selector */
.center {
    text-align: center;
}

/* ID selector */
#para1 {
    color: red;
}

/* Multiple selectors */
h1, h2, p {
    color: red;
}
```

### Combination Selectors

```css
/* Tag + class */
p.center {
    text-align: center;
}

/* Descendant (any depth) */
div p {
    background-color: yellow;
}

/* Direct child only */
div > p {
    background-color: yellow;
}

/* Adjacent sibling (immediately following) */
div + p {
    background-color: yellow;
}

/* General sibling */
div ~ p {
    background-color: yellow;
}
```

### Attribute Selectors

```css
/* Has attribute with value */
a[target="_blank"] {
    background-color: yellow;
}

/* Contains word */
[title~="flower"] {
    border: 5px solid yellow;
}

/* Starts with (word boundary) */
[class|="top"] {
    background: yellow;
}

/* Starts with (any) */
[class^="top"] {
    background: yellow;
}
```

### State Selectors

```css
a:link {
    color: red;
}

a:visited {
    color: purple;
}

a:hover {
    color: blue;
}

a:active {
    color: green;
}
```

Full selector reference: [CSS Selectors](https://www.w3schools.com/cssref/css_selectors.asp)

## Pseudo-Classes

```css
/* Hover state */
a:hover {
    color: blue;
}

/* First child among siblings */
p:first-child {
    color: blue;
}
```

## Pseudo-Elements

```css
/* First letter */
p::first-letter {
    color: #ff0000;
    font-size: xx-large;
}

/* First line */
p::first-line {
    color: #0000ff;
    font-variant: small-caps;
}

/* Before content */
h1::before {
    content: url(icon.png);
}

/* After content */
h1::after {
    content: url(icon.png);
}

/* Selected text */
::selection {
    color: red;
    background: yellow;
}
```

## Properties

### Background

```css
body {
    background-color: #ffffff;
    background-image: url("img_tree.png");
    background-repeat: no-repeat;
    background-position: right top;
    background-attachment: fixed;  /* Don't scroll with page */
}

/* Shorthand */
body {
    background: #ffffff url("img_tree.png") no-repeat right top;
}
```

### Colors

```css
color: blue;
color: #FF0000;
color: rgb(255, 165, 0);
```

### Margins and Padding

```css
margin-left: 20px;
padding: 5px;
```

> **Note:** Do not add space between value and unit: `margin-left: 20px;` (correct) vs `margin-left: 20 px;` (incorrect)

### Border

```css
border: 1px solid grey;
border-collapse: collapse;  /* For tables */
```

## Values

### Colors

```css
color: rgb(255, 165, 0);
color: blue;
color: #FF0000;
```

### Images

```css
background-image: url("paper.gif");
```

### Repeat

```css
background-repeat: repeat-x;
background-repeat: repeat-y;
background-repeat: no-repeat;
```

### Position

```css
background-position: right top;
```

## CSS Counter

Automatic numbering with counters:

```css
body {
    counter-reset: section;
}

h1::before {
    counter-increment: section;
    content: "Section " counter(section) ". ";
}
```

## Common Patterns

### Fixed Width with Word Wrap

```css
.content {
    display: block;
    max-width: 500px;
    word-wrap: break-word;
}
```

### Striped Table

```css
table, th, td {
    border: 1px solid grey;
    border-collapse: collapse;
    padding: 5px;
}

table tr:nth-child(odd) {
    background-color: #f1f1f1;
}

table tr:nth-child(even) {
    background-color: #ffffff;
}
```

## Cascading Rules

When multiple rules apply to the same element:

1. Different properties from all matching rules are combined
2. Same properties use the last/most specific rule
3. Inline styles override stylesheets
4. `!important` overrides everything

---

CSS is essential for creating visually appealing and well-structured web pages. Understanding selectors and the cascade is key to writing maintainable stylesheets.
