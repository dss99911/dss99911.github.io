---
layout: post
title: "CSS Complete Guide"
date: 2025-12-28 12:00:00 +0900
categories: frontend
tags: [css, styling, frontend, web]
description: "CSS complete guide including selectors, properties, pseudo-classes, and styling techniques"
---

## Basic Syntax

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

## Including CSS

### Inline Style
```html
<h1 style="color:blue;margin-left:30px;">This is a heading</h1>
```

### Internal Style
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

### External Style
```html
<head>
    <link rel="stylesheet" type="text/css" href="mystyle.css">
</head>
```

## Style Cascading Rules

When the same tag or ID has duplicate styles:
- If properties are different, all are applied
- If properties are the same, the last processed style is applied

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

Reference: [W3Schools CSS Selectors](https://www.w3schools.com/cssref/css_selectors.asp)

### ID Selector
```css
#para1 {
    text-align: center;
    color: red;
}
```

### Class Selector
```css
.center {
    text-align: center;
    color: red;
}
```

### Tag Selector
```css
h1 {
    text-align: center;
    color: red;
}
```

### State Selector
```css
a:link {
    color: red;
}
```

### Multiple Selector
```css
h1, h2, p {
    text-align: center;
    color: red;
}
```

### Tag + Class Combination
Only `<p>` elements with class `center`:
```css
p.center {
    text-align: center;
    color: red;
}
```

### Descendant Selector
All `<p>` inside `<div>` (not just direct children):
```css
div p {
    background-color: yellow;
}
```

### Child Selector
Only direct child `<p>` elements:
```css
div > p {
    background-color: yellow;
}
```

### Adjacent Sibling Selector
`<p>` immediately after `<div>`:
```css
div + p {
    background-color: yellow;
}
```

### General Sibling Selector
All `<p>` siblings of `<div>`:
```css
div ~ p {
    background-color: yellow;
}
```

### Attribute Selector
```css
a[target="_blank"] {
    background-color: yellow;
}
```

### Attribute Contains Selector
Elements where title contains "flower":
```css
[title~="flower"] {
    border: 5px solid yellow;
}
```

### Attribute Starts With Selector
Class starting with "top" (word-separated like "top" or "top-aa"):
```css
[class|="top"] {
    background: yellow;
}
```

Class starting with "top" (any prefix like "topaa"):
```css
[class^="top"] {
    background: yellow;
}
```

## Pseudo-classes

Reference: Selectors for element states

### Hover
```css
a:hover {
    color: blue;
}
```

### First Child
First child among siblings:
```css
p:first-child {
    color: blue;
}
```

## Pseudo-elements

Reference: [W3Schools CSS Pseudo-elements](https://www.w3schools.com/css/css_pseudo_elements.asp)

### First Letter
```css
p::first-letter {
    color: #ff0000;
    font-size: xx-large;
}
```

### First Line
```css
p::first-line {
    color: #0000ff;
    font-variant: small-caps;
}
```

### Before Element
Add image before tag:
```css
h1::before {
    content: url(smiley.gif);
}
```

### After Element
Add image after tag:
```css
h1::after {
    content: url(smiley.gif);
}
```

### Selection Style
Style for selected text:
```css
::selection {
    color: red;
    background: yellow;
}
```

## CSS Values

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

## Properties

### Background
```css
body {
    background-color: #ffffff;
    background-image: url("img_tree.png");
    background-repeat: no-repeat;
    background-position: right top;
    background-attachment: fixed;  /* Does not move on scroll */
}

/* Shorthand */
body {
    background: #ffffff url("img_tree.png") no-repeat right top;
}
```

### Text
```css
color: red;  /* text color */
```

### Margin
```css
margin-left: 20px;
```

## Border

### Basic Border
```css
border: 1px solid grey;
```

### Collapse Borders
```css
border-collapse: collapse;
```

### Padding
```css
padding: 5px;
```

## Table Styling

### Striped Rows
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

## CSS Counter

Reference: [W3Schools CSS Counters](https://www.w3schools.com/css/css_counters.asp)

Auto-incrementing numbers before tags:
```css
h1::before {
    counter-increment: section;
    content: "Section " counter(section) ". ";
}
```

## Useful Style Techniques

### Fixed Width with Word Wrap
```css
style="display: block; max-width: 500px; word-wrap: break-word"
```

## Common Errors

**Important**: Do not add a space between the property value and the unit.

Wrong: `margin-left: 20 px;`

Correct: `margin-left: 20px;`

## Reference
- [W3Schools CSS Border](https://www.w3schools.com/css/css_border.asp)
