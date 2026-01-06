---
layout: post
title: "HTML Fundamentals - Building Web Pages"
date: 2025-12-28 12:12:00 +0900
categories: [frontend, javascript]
tags: [html, web, forms, semantic]
description: "Essential HTML guide covering tags, forms, meta tags, semantic elements, and best practices"
image: /assets/images/posts/thumbnails/2025-12-28-html-fundamentals.png
---

HTML (HyperText Markup Language) is the standard markup language for creating web pages. This guide covers essential HTML concepts.

## Meta Tags

### Character Encoding

```html
<meta charset="utf-8">
```

### Viewport

The viewport meta tag controls page dimensions and scaling on mobile devices:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## Semantic Tags

### Navigation

```html
<nav>
    <a href="/html/">HTML</a> |
    <a href="/css/">CSS</a> |
    <a href="/js/">JavaScript</a>
</nav>
```

### Mark (Highlight)

```html
<p>This is <mark>highlighted</mark> text.</p>
```

### Abbreviation

```html
<abbr title="World Health Organization">WHO</abbr>
```

Hovering over the abbreviation shows the full title.

### Blockquote

```html
<blockquote>
    <p>For 50 years, WWF has been protecting...</p>
    <footer>From WWF's website</footer>
</blockquote>
```

## Forms

### Basic Form Structure

```html
<form method="post" action="/submit">
    <fieldset>
        <label>Description</label>
        <input name="desc"/>
    </fieldset>
    <button type="submit">Add</button>
</form>
```

### Form Attributes

| Attribute | Description |
|-----------|-------------|
| `action` | URL to submit form to |
| `method` | HTTP method (get/post) |
| `enctype` | Encoding type (default: `application/x-www-form-urlencoded`) |

### File Upload

```html
<form action="/upload" method="POST" enctype="multipart/form-data">
    <input type="file" name="file" size="50"/>
    <input type="submit" value="Upload File"/>
</form>
```

### Form Validation

```html
<!-- Required field -->
<input type="text" name="fname" required>

<!-- Min/Max values -->
<input type="number" id="id1" min="100" max="300" required>

<!-- Custom validation -->
<form name="myForm" onsubmit="return validateForm()" method="post">
    <input type="text" name="fname">
    <input type="submit" value="Submit">
</form>

<!-- Disable validation -->
<form novalidate>...</form>
```

## Select Dropdown

```html
<select class="form-control" name="type" required>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
</select>
```

## Data URIs

Embed images directly in HTML using base64 encoding:

```html
<img width="16" height="16" alt="star"
     src="data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKu...">
```

Format: `data:[<mime type>][;charset=<charset>][;base64],<encoded data>`

## Layout Snippets

### Float Elements to Edges

```html
<p style="text-align:left;">
    <button>Confirm</button>
    <span style="float:right;">
        <button>Cancel</button>
    </span>
</p>
```

---

HTML provides the structure for web content. Combined with CSS for styling and JavaScript for interactivity, it forms the foundation of modern web development.
