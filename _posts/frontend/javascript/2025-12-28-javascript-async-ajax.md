---
layout: post
title: "JavaScript Async, AJAX, and JSONP - Handling Asynchronous Operations"
date: 2025-12-28 12:04:00 +0900
categories: [frontend, javascript]
tags: [javascript, async, ajax, promises, jsonp]
description: "Complete guide to asynchronous JavaScript including async/await, Promises, AJAX, and JSONP for cross-domain requests"
image: /assets/images/posts/thumbnails/2025-12-28-javascript-async-ajax.png
---

JavaScript is single-threaded but excels at handling asynchronous operations. This post covers the essential concepts of async programming in JavaScript.

## Understanding Asynchronous JavaScript

JavaScript is single-threaded, meaning there's no way to truly block execution. Instead, we use callbacks, Promises, and async/await for handling asynchronous operations.

## Async/Await (ES2017+)

The `async` and `await` keywords provide a cleaner way to work with Promises.

### Basic Async Function

An async function automatically wraps its return value in a Promise:

```javascript
async function f() {
    return 1;
}

f().then(alert);  // 1
```

This is equivalent to:

```javascript
async function f() {
    return Promise.resolve(1);
}

f().then(alert);  // 1
```

### Await Keyword

Use `await` to pause execution until a Promise resolves:

```javascript
async function asyncCall() {
    console.log('calling');
    var result = await resolveAfter2Seconds();
    console.log(result);  // "resolved"
}

function resolveAfter2Seconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, 2000);
    });
}

asyncCall();
```

### Immediately Invoked Async Function

```javascript
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
})();
```

### Wait/Sleep Function

```javascript
await new Promise((resolve, reject) => setTimeout(resolve, 3000));
```

## Promises

Promises represent the eventual result of an asynchronous operation.

### Creating a Promise

```javascript
function resolveAfter2Seconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, 2000);
    });
}
```

## AJAX (Asynchronous JavaScript And XML)

AJAX allows you to update parts of a web page without reloading the entire page.

### Basic AJAX with XMLHttpRequest

```javascript
function loadDoc() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        // readyState 4 = response is ready
        // status 200 = OK
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("demo").innerHTML = this.responseText;
        }
    };

    xhttp.open("GET", "ajax_info.txt", true);
    xhttp.send();
}
```

### POST Request with Headers

```javascript
var xhttp = new XMLHttpRequest();
xhttp.open("POST", "ajax_url", true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhttp.send("fname=Henry&lname=Ford");
```

### Reusable AJAX Function

```javascript
function loadDoc(url, callback) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this);
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();
}

function myFunction(xhttp) {
    document.getElementById("demo").innerHTML = xhttp.responseText;
}

// Usage
loadDoc('ajax_info.txt', myFunction);
```

### XMLHttpRequest Methods

| Method | Description |
|--------|-------------|
| `open(method, url, async, user, psw)` | Configures the request |
| `send()` | Sends the request (GET) |
| `send(string)` | Sends the request with data (POST) |
| `setRequestHeader(header, value)` | Sets HTTP header |
| `abort()` | Cancels the request |

### XMLHttpRequest Properties

- `onreadystatechange` - Event handler for state changes
- `readyState` - Current state (0-4)
- `status` - HTTP status code
- `responseText` - Response as text
- `responseXML` - Response as XML

### Older Browser Support (IE5/IE6)

```javascript
var xmlhttp;
if (window.XMLHttpRequest) {
    // Modern browsers
    xmlhttp = new XMLHttpRequest();
} else {
    // Old IE browsers
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
```

## JSONP (JSON with Padding)

JSONP is a technique for making cross-domain requests, which AJAX cannot do due to same-origin policy.

### How JSONP Works

JSONP uses the `<script>` tag instead of XMLHttpRequest:

```html
<script src="demo_jsonp.php"></script>
```

Server returns JavaScript that calls a predefined function:

```php
<?php
$myJSON = '{ "name":"John", "age":30, "city":"New York" }';
echo "myFunc(" . $myJSON . ");";
?>
```

When loaded, this executes `myFunc` with the JSON data as a parameter.

### Dynamic JSONP Request

```javascript
function clickButton() {
    var script = document.createElement("script");
    var data = { "table": "products", "limit": 10 };
    script.src = "demo_jsonp.php?x=" + JSON.stringify(data);
    document.body.appendChild(script);
}

function myFunc(data) {
    // Handle the response
    console.log(data);
}
```

## JSON Operations

### Parsing and Stringifying

```javascript
// JSON string to object
var obj = JSON.parse('{"name":"John","age":30}');

// Object to JSON string
var json = JSON.stringify({name: "John", age: 30});
```

### Custom Parser

Handle special types like dates during parsing:

```javascript
var text = '{"name":"John","birth":"1985-01-15"}';

var obj = JSON.parse(text, function(key, value) {
    if (key == "birth") {
        return new Date(value);
    }
    return value;
});
```

### Adding Functions to Parsed JSON

```javascript
var text = '{ "name":"John", "age":"function() {return 30;}" }';
var obj = JSON.parse(text);
obj.age = eval("(" + obj.age + ")");
console.log(obj.age());  // 30
```

> **Warning:** Using `eval()` is dangerous and should be avoided with untrusted data.

## Security Considerations

### Same-Origin Policy

AJAX requests are restricted to the same domain for security reasons. To make cross-domain requests, you need:

1. **CORS** (Cross-Origin Resource Sharing) - Server-side configuration
2. **JSONP** - For GET requests only
3. **Proxy** - Server-side proxy on your domain

---

Understanding asynchronous JavaScript is essential for building modern web applications. These patterns allow you to create responsive, non-blocking user interfaces.
