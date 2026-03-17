---
layout: post
title: "EJS Template Engine Guide"
date: 2025-03-22 10:49:00 +0900
categories: [frontend, common]
tags: [ejs, javascript, template-engine, nodejs]
description: "EJS (Embedded JavaScript) template engine guide with syntax, loops, and helpers"
image: /assets/images/posts/thumbnails/2025-12-28-ejs-template-engine-guide.png
redirect_from:
  - "/frontend/common/2025/12/28/ejs-template-engine-guide.html"
---
{% raw %}
## Introduction

**EJS** stands for **E**mbedded **J**ava**S**cript. It is a simple templating language that lets you generate HTML markup with plain JavaScript.

## Basic Syntax

### Script Tags
- `<% %>` - Executes JavaScript code (no output)
- `<%= %>` - Outputs HTML (adds to result)

## Variable Output

Output a variable's value:
```html
<h1><%= title %></h1>
```

## Loop Example

Iterate through an array and create list items:
```html
<h1><%= title %></h1>
<ul>
<% for(var i=0; i<supplies.length; i++) {%>
    <li><%= link_to(supplies[i], 'supplies/'+supplies[i]) %></li>
<% } %>
</ul>
```

## Include Other Templates

Include a partial template:
```html
<% include ../partials/nav.ejs %>
```

## Helper Functions

### link_to
Creates an anchor (`<a>`) tag:
```html
<%= link_to(name, url) %>
```

Example usage in a loop:
```html
<h1><%= title %></h1>
<ul>
<% for(var i=0; i<supplies.length; i++) {%>
    <li><%= link_to(supplies[i], 'supplies/'+supplies[i]) %></li>
<% } %>
</ul>
```

### img_tag
Creates an image tag:
```html
<%= img_tag('images/maid.png') %>
```

## Reference

- [EJS View Helpers Documentation](https://code.google.com/archive/p/embeddedjavascript/wikis/ViewHelpers.wiki)

## Setting Up EJS with Express

EJS is commonly used with the Express.js framework. Here is how to set it up:

### Installation

```bash
npm install ejs
```

### Express Configuration

```javascript
const express = require('express');
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index', {
        title: 'My App',
        users: ['Alice', 'Bob', 'Charlie']
    });
});

app.listen(3000);
```

### Directory Structure

A typical project using EJS follows this structure:

```
project/
├── views/
│   ├── index.ejs
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   │   └── nav.ejs
│   └── pages/
│       ├── about.ejs
│       └── contact.ejs
├── public/
│   ├── css/
│   └── js/
└── app.js
```

## Advanced Syntax

### Unescaped Output

By default, `<%= %>` escapes HTML to prevent XSS attacks. If you need to output raw HTML, use `<%- %>`:

```html
<!-- Escaped (safe) -->
<p><%= userInput %></p>  <!-- &lt;script&gt; becomes visible text -->

<!-- Unescaped (use with trusted content only) -->
<p><%- richContent %></p>  <!-- HTML tags are rendered -->
```

### Comments

```html
<%# This is an EJS comment and will not appear in the output %>
```

### Conditionals

```html
<% if (user.isAdmin) { %>
    <div class="admin-panel">
        <h2>Admin Dashboard</h2>
    </div>
<% } else { %>
    <p>Welcome, <%= user.name %></p>
<% } %>
```

## Partials and Layouts

Partials allow you to break your templates into reusable components. This is one of the most useful features of EJS for maintaining DRY code.

### Creating a Partial

```html
<!-- views/partials/header.ejs -->
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
```

### Using Partials

```html
<!-- views/pages/home.ejs -->
<%- include('../partials/header') %>

<main>
    <h1><%= title %></h1>
    <p>Welcome to our site!</p>
</main>

<%- include('../partials/footer') %>
```

### Passing Data to Partials

You can pass local variables to included partials:

```html
<%- include('../partials/card', { item: product, showPrice: true }) %>
```

## Common Pitfalls

1. **Forgetting to escape user input**: Always use `<%= %>` for user-provided data to prevent XSS attacks. Only use `<%- %>` when you explicitly trust the content.

2. **Variable not defined errors**: If a variable might not be passed to the template, use a default value:
```html
<h1><%= typeof title !== 'undefined' ? title : 'Default Title' %></h1>
```

3. **Whitespace control**: EJS adds whitespace from template tags. Use `-%>` to trim the trailing newline:
```html
<% if (condition) { -%>
    <p>No extra blank line above</p>
<% } -%>
```

## EJS vs Other Template Engines

| Feature | EJS | Pug | Handlebars |
|---------|-----|-----|------------|
| Syntax | HTML with JS tags | Indentation-based | Mustache-style |
| Learning curve | Low | Medium | Low |
| Logic in templates | Full JS | Full JS | Limited |
| Performance | Fast | Fast | Fast |
| Express default | No | No | No |

EJS is a great choice when you want to keep things simple and stay close to plain HTML. Developers who are comfortable with HTML and JavaScript can be productive with EJS very quickly since there is no new syntax to learn.
{% endraw %}
