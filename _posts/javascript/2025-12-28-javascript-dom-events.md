---
layout: post
title: "JavaScript DOM Manipulation and Events"
date: 2025-12-28 12:05:00 +0900
categories: javascript
tags: [javascript, dom, events, selectors]
description: "Guide to DOM manipulation, element selection, event handling, and working with forms in JavaScript"
---

The Document Object Model (DOM) allows JavaScript to interact with and modify HTML content. This post covers essential DOM operations and event handling.

## Selecting Elements

### getElementById

```javascript
var element = document.getElementById('demo');
```

### querySelectorAll

Use CSS selectors to find elements:

```javascript
document.querySelectorAll('p#demo');
document.querySelectorAll('.className');
document.querySelectorAll('div > p');
```

## Modifying Elements

### innerHTML

```javascript
element.innerHTML = 'Hello JavaScript';
```

### document.write

```javascript
document.write(5 + 6);  // Writes 11 to the page
```

> **Warning:** Using `document.write()` after the page loads will overwrite the entire document.

## Event Handling

### Event Bubbling vs Capturing

Events can propagate in two directions:

- **Bubbling** (default): Inner element's event is handled first, then outer elements
- **Capturing**: Outer element's event is handled first, then inner elements

```javascript
// useCapture parameter: true for capturing, false for bubbling
document.getElementById("myP").addEventListener("click", myFunction, true);
```

### addEventListener

```javascript
element.addEventListener('click', function() {
    console.log('Clicked!');
});
```

### Programmatically Triggering Click

```javascript
function clickButton(obj) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window,
        0, 0, 0, 0, 0, false, false, false, false, 0, null);
    var cancelled = !obj.dispatchEvent(evt);
}
```

## Working with Forms

### Accessing Form Values

Forms and their elements can be accessed by name:

```javascript
document.forms["myForm"]["fname"].value;
```

### Form Validation

Check if an input is valid (for required, min, max, etc.):

```javascript
var input = document.getElementById("id1");

if (input.checkValidity()) {
    // Input is valid
} else {
    console.log(input.validationMessage);
}

// Check for specific validation errors
if (document.getElementById("id1").validity.rangeOverflow) {
    console.log("Value too large");
}
```

## Location and Navigation

### Getting URL Anchor

```javascript
window.location.hash.substr(1);  // Returns anchor without #
```

### Parsing URL Parameters

```javascript
function getUrlParameter(key, searchString) {
    if (location.search) {
        var search = searchString || location.search;
        var parts = search.substring(1).split('&');

        for (var i = 0; i < parts.length; i++) {
            var pair = parts[i].split('=');
            if (pair[0] === key) {
                return pair[1];
            }
        }
    }
    return null;
}

// Usage
var value = getUrlParameter('page');  // Gets ?page=X value
```

## Date and Time

### Creating Dates

```javascript
new Date();                              // Current date/time
new Date(milliseconds);                  // From milliseconds
new Date("October 13, 2014 11:13:00");   // From string
new Date(2015, 2, 25, 12, 0, 0, 0);      // year, month, day, h, m, s, ms
```

### Date Formats

| Type | Example |
|------|---------|
| ISO Date | "2015-03-25" (International Standard) |
| Short Date | "03/25/2015" |
| Long Date | "Mar 25 2015" or "25 Mar 2015" |
| Full Date | "Wednesday March 25 2015" |

### Date Methods

```javascript
var date = new Date();
date.getYear();      // Returns year - 1900 (117 for 2017)
date.getFullYear();  // Returns full year (2017)
date.getMonth();     // Returns month (0-11, 11 = December)
```

### setTimeout and setInterval

```javascript
// Execute once after delay
setTimeout(function() {
    alert("Hello");
}, 3000);  // 3 seconds

// Execute repeatedly
var intervalId = setInterval(frame, 5);  // Every 5ms

function frame() {
    if (/* condition */) {
        clearInterval(intervalId);  // Stop the interval
    } else {
        // Do something
    }
}
```

## Cookies

### Setting Cookies

```javascript
function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
```

### Getting Cookies

```javascript
function getCookie(name) {
    var cookieName = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookies = decodedCookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length);
        }
    }
    return "";
}
```

## Including External JavaScript

### Script Tag

```html
<script src="myScript.js"></script>
```

## WYSIWYG Editors

WYSIWYG stands for "What You See Is What You Get". These editors allow content to be edited in a form that resembles its appearance when displayed.

Popular JavaScript WYSIWYG editors include:
- TinyMCE
- CKEditor
- Quill
- Draft.js

---

DOM manipulation and event handling are fundamental skills for creating interactive web applications. Understanding these concepts enables you to build dynamic, responsive user interfaces.
