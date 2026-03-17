---
layout: post
title: "HTML Fundamentals - Building Web Pages"
date: 2025-07-16 09:39:00 +0900
categories: [frontend, javascript]
tags: [html, web, forms, semantic]
description: "Essential HTML guide covering tags, forms, meta tags, semantic elements, and best practices"
image: /assets/images/posts/thumbnails/2025-12-28-html-fundamentals.png
redirect_from:
  - "/frontend/javascript/2025/12/28/html-fundamentals.html"
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

## Tables

### Basic Table Structure

```html
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Alice</td>
            <td>30</td>
            <td>Seoul</td>
        </tr>
        <tr>
            <td>Bob</td>
            <td>25</td>
            <td>Tokyo</td>
        </tr>
    </tbody>
</table>
```

### Spanning Rows and Columns

```html
<table>
    <tr>
        <td rowspan="2">Merged Rows</td>
        <td>Cell 1</td>
    </tr>
    <tr>
        <td>Cell 2</td>
    </tr>
    <tr>
        <td colspan="2">Merged Columns</td>
    </tr>
</table>
```

## Semantic HTML5 Elements

Semantic elements clearly describe their meaning to both the browser and the developer. Using them improves accessibility and SEO.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Semantic HTML</title>
</head>
<body>
    <header>
        <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
        </nav>
    </header>

    <main>
        <article>
            <h1>Article Title</h1>
            <p>Article content...</p>
        </article>

        <aside>
            <h2>Related Links</h2>
            <ul>
                <li><a href="#">Link 1</a></li>
            </ul>
        </aside>
    </main>

    <footer>
        <p>&copy; 2025 My Website</p>
    </footer>
</body>
</html>
```

### Key Semantic Elements

| Element | Purpose |
|---------|---------|
| `<header>` | Introductory content or navigation links |
| `<nav>` | Navigation links section |
| `<main>` | Main content of the document (one per page) |
| `<article>` | Self-contained content (blog post, news article) |
| `<section>` | Thematic grouping of content |
| `<aside>` | Side content (sidebar, related links) |
| `<footer>` | Footer for a document or section |
| `<figure>` | Self-contained content with optional caption |
| `<time>` | Date/time representation |

## Media Elements

### Audio

```html
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">
    Your browser does not support the audio element.
</audio>
```

### Video

```html
<video width="640" height="360" controls poster="thumbnail.jpg">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    Your browser does not support the video element.
</video>
```

### Responsive Images

```html
<!-- srcset for different screen densities -->
<img src="image-1x.jpg"
     srcset="image-1x.jpg 1x, image-2x.jpg 2x"
     alt="Responsive image">

<!-- picture element for art direction -->
<picture>
    <source media="(min-width: 800px)" srcset="large.jpg">
    <source media="(min-width: 400px)" srcset="medium.jpg">
    <img src="small.jpg" alt="Responsive image">
</picture>
```

## Accessibility Best Practices

Writing accessible HTML ensures that your web pages are usable by everyone, including people using screen readers.

1. **Always use alt text on images**: Describe the image content for screen readers
```html
<img src="chart.png" alt="Sales chart showing 20% growth in Q4 2025">
```

2. **Use proper heading hierarchy**: Do not skip heading levels (h1 to h3 without h2)

3. **Label form elements**: Every input should have an associated label
```html
<label for="email">Email:</label>
<input type="email" id="email" name="email" aria-required="true">
```

4. **Use ARIA attributes when needed**: Add extra context for assistive technologies
```html
<button aria-label="Close dialog" onclick="closeModal()">X</button>
```

5. **Ensure keyboard navigation**: All interactive elements should be reachable via Tab key

## HTML Entity References

Common special characters that need encoding:

| Character | Entity | Numeric |
|-----------|--------|---------|
| `<` | `&lt;` | `&#60;` |
| `>` | `&gt;` | `&#62;` |
| `&` | `&amp;` | `&#38;` |
| `"` | `&quot;` | `&#34;` |
| ` ` (non-breaking space) | `&nbsp;` | `&#160;` |
| `©` | `&copy;` | `&#169;` |

---

HTML provides the structure for web content. Combined with CSS for styling and JavaScript for interactivity, it forms the foundation of modern web development. Understanding semantic HTML, accessibility patterns, and proper form handling is essential for building high-quality web pages that work well for all users and rank well in search engines.
