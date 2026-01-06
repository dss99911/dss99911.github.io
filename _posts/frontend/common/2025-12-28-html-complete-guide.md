---
layout: post
title: "HTML Complete Guide"
date: 2025-12-28 12:00:00 +0900
categories: [frontend, common]
tags: [html, frontend, web, markup]
description: "HTML complete guide including tags, forms, meta tags, and useful snippets"
image: /assets/images/posts/thumbnails/2025-12-28-html-complete-guide.png
---

## Meta Tags

### Charset
Specifies character encoding for the HTML document:
```html
<meta charset="utf-8">
```

### Viewport
Gives the browser instructions on how to control the page's dimensions and scaling. Adjusts to browser screen size:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## Forms

### Basic Form Structure
All fields should be wrapped in fieldset:
```html
<form method="post">
    <fieldset>
        <label>Description</label>
        <input name="desc"/>
    </fieldset>
    <button type="submit">add</button>
</form>
```

### Form Attributes

| Attribute | Description |
|-----------|-------------|
| `action` | URI to submit to |
| `method` | get or post |
| `enctype` | Content type for submission |

The `enctype` attribute specifies the content type used to submit the form to the server (when method is "post"):
- Default: `application/x-www-form-urlencoded`
- For file uploads: `multipart/form-data`

### File Upload Form
```html
<form action="http://127.0.0.1:8081/file_upload" method="POST"
      enctype="multipart/form-data">
    <input type="file" name="file" size="50" />
    <br />
    <input type="submit" value="Upload File" />
</form>
```

### Form Validation

#### Submit Validation
Return false to prevent submission:
```html
<form name="myForm" action="/action_page_post.php"
      onsubmit="return validateForm()" method="post">
    Name: <input type="text" name="fname">
    <input type="submit" value="Submit">
</form>
```

#### novalidate Attribute
Disables browser validation (e.g., email format check for type='email'):
```html
<form novalidate>
```

#### required Attribute
```html
<input type="text" name="fname" required>
```

#### min, max Attributes
```html
<input id="id1" type="number" min="100" max="300" required>
```

## Select Tag

```html
<select class="form-control" ng-model="messageCollect.receiveType" required>
    <option value="1">USSD</option>
    <option value="2">SMS</option>
    <option value="3">BOTH</option>
</select>
```

## Semantic HTML Tags

### Navigation Bar
```html
<nav>
    <a href="/html/">HTML</a> |
    <a href="/css/">CSS</a> |
    <a href="/js/">JavaScript</a> |
    <a href="/jquery/">jQuery</a>
</nav>
```

### Mark Tag
Highlights text:
```html
<mark>highlighted text</mark>
```

### Abbreviation Tag
Shows full text on hover:
```html
<abbr title="World Health Organization">WHO</abbr>
```

### Blockquote Tag
With Bootstrap, styling is automatically applied:
```html
<blockquote>
    <p>For 50 years, .... 5 million globally.</p>
    <footer>From WWF's website</footer>
</blockquote>
```

## Data URI Images (Embedded Images)

Reference: [CSS-Tricks Data URIs](https://css-tricks.com/data-uris/)

Embed images directly in HTML using Base64 encoding:
```html
<img width="16" height="16" alt="star"
     src="data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVS..." />
```

Format:
```
data:[<mime type>][;charset=<charset>][;base64],<encoded data>
```

## Useful Snippets

### Position Elements at Left and Right Ends
```html
<p style="text-align:left;">
    <button>OK</button>
    <span style="float:right;"><button>Cancel</button></span>
</p>
```
