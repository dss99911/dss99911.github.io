---
layout: post
title: "CSS Complete Guide - Selectors, Pseudo-classes, and Styling"
date: 2026-01-11
categories: [frontend, common]
tags: [css, web, frontend, styling, selectors]
description: "Comprehensive CSS guide covering selectors, pseudo-classes, pseudo-elements, properties, and practical styling techniques"
image: /assets/images/posts/2026-01-11-css-complete-guide.png
---

CSS (Cascading Style Sheets) is the language used to style HTML documents. This guide covers the essential concepts and techniques for mastering CSS.

## CSS Syntax

The basic syntax consists of a selector and declaration block:

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

## Linking CSS to HTML

### Inline Style
```html
<h1 style="color:blue;margin-left:30px;">This is a heading</h1>
```

### Internal Style (Embedded)
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

## CSS Cascade Rules

When multiple styles apply to the same element:
- If properties are different, all styles are applied
- If properties conflict, the last processed style takes precedence

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

### Element Selector
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

### Multiple Selectors
```css
h1, h2, p {
    text-align: center;
    color: red;
}
```

### Tag + Class Combination
```css
p.center {
    text-align: center;
    color: red;
}
```

### Descendant Selector
Selects all descendants (not just direct children):
```css
div p {
    background-color: yellow;
}
```

### Child Selector
Selects only direct children:
```css
div > p {
    background-color: yellow;
}
```

### Adjacent Sibling Selector
Selects the element immediately following:
```css
div + p {
    background-color: yellow;
}
```

### General Sibling Selector
Selects all siblings:
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
Matches when title contains "flower":
```css
[title~="flower"] {
    border: 5px solid yellow;
}
```

### Attribute Starts With Selector
Matches "top" or "top-xxx" (hyphen-separated):
```css
[class|="top"] {
    background: yellow;
}
```

Without hyphen requirement:
```css
[class^="top"] {
    background: yellow;
}
```

## Pseudo-classes

Pseudo-classes select elements based on their state.

### Hover State
```css
a:hover {
    color: blue;
}
```

### First Child
Selects elements that are the first child among siblings:
```css
p:first-child {
    color: blue;
}
```

### nth-child for Alternating Styles
Perfect for creating striped tables:
```css
table tr:nth-child(odd) {
    background-color: #f1f1f1;
}

table tr:nth-child(even) {
    background-color: #ffffff;
}
```

## Pseudo-elements

Reference: [W3Schools Pseudo-elements](https://www.w3schools.com/css/css_pseudo_elements.asp)

Pseudo-elements style specific parts of an element.

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

### Before - Add Content Before Element
```css
h1::before {
    content: url(smiley.gif);
}
```

### After - Add Content After Element
```css
h1::after {
    content: url(smiley.gif);
}
```

### Selection Styling
Style text when selected by user:
```css
::selection {
    color: red;
    background: yellow;
}
```

## CSS Counters

Reference: [W3Schools CSS Counters](https://www.w3schools.com/css/css_counters.asp)

Automatically number elements:
```css
h1::before {
    counter-increment: section;
    content: "Section " counter(section) ". ";
}
```

## Common Properties

### Background Properties
```css
body {
    background-color: #ffffff;
    background-image: url("img_tree.png");
    background-repeat: no-repeat;
    background-position: right top;
    background-attachment: fixed; /* Background stays fixed during scroll */
}

/* Shorthand */
body {
    background: #ffffff url("img_tree.png") no-repeat right top;
}
```

### Text Color
```css
p {
    color: blue;
}
```

### Margins
```css
div {
    margin-left: 20px;
}
```

## CSS Values

### Colors
```css
/* RGB */
color: rgb(255, 165, 0);

/* Named colors */
color: blue;

/* Hexadecimal */
color: #FF0000;
```

### Images
```css
background-image: url("paper.gif");
```

### Repeat Values
```css
background-repeat: repeat-x;
background-repeat: repeat-y;
background-repeat: no-repeat;
```

### Position Values
```css
background-position: right top;
```

## Border Styling

### Basic Border
```css
border: 1px solid grey;
```

### Collapsed Borders (for tables)
```css
table {
    border-collapse: collapse;
}
```

### Padding
```css
td {
    padding: 5px;
}
```

### Complete Striped Table Example
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

## Practical Styling Techniques

### Fixed Width with Word Wrap
```css
.fixed-width {
    display: block;
    max-width: 500px;
    word-wrap: break-word;
}
```

## Common Mistakes to Avoid

**Do not add space between value and unit:**

```css
/* Wrong */
margin-left: 20 px;

/* Correct */
margin-left: 20px;
```

## Resources

- [W3Schools CSS Reference](https://www.w3schools.com/css/)
- [W3Schools CSS Selectors](https://www.w3schools.com/cssref/css_selectors.asp)
- [W3Schools CSS Border](https://www.w3schools.com/css/css_border.asp)
- [MDN CSS Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS)
