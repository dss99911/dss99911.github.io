---
layout: post
title: "EJS Template Engine Guide"
date: 2025-12-28 12:00:00 +0900
categories: frontend
tags: [ejs, javascript, template-engine, nodejs]
description: "EJS (Embedded JavaScript) template engine guide with syntax, loops, and helpers"
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
{% endraw %}
