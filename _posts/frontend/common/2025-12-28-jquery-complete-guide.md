---
layout: post
title: "jQuery Complete Guide"
date: 2025-12-28 12:00:00 +0900
categories: [frontend, common]
tags: [jquery, javascript, frontend, dom]
description: "jQuery complete guide including selectors, events, AJAX, animations, and DOM manipulation"
image: /assets/images/posts/thumbnails/2025-12-28-jquery-complete-guide.png
---

## Setup

### Using Google CDN (Recommended)
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
```

Advantages of using hosted jQuery from Google or Microsoft:
- Many users already have downloaded jQuery from these CDNs when visiting other sites
- It will be loaded from cache when they visit your site, leading to faster loading time
- Most CDNs serve files from the server closest to the user

### Download
Download from: [http://jquery.com/download/](http://jquery.com/download/)
```html
<head>
    <script src="jquery-3.2.1.min.js"></script>
</head>
```

### Initialization
It is recommended to process code after document ready. Some views are not initialized and can't hide or get view information.
```javascript
$(document).ready(function(){
    $("button").click(function(){
        $("p").hide();
    });
});
```

### Conflict Fix ($ symbol)
```javascript
// Option 1: Use jQuery instead of $
$.noConflict();
jQuery(document).ready(function(){
    jQuery("button").click(function(){
        jQuery("p").text("jQuery is still working!");
    });
});

// Option 2: Use $ in specific block
$.noConflict();
jQuery(document).ready(function($){
    $("button").click(function(){
        $("p").text("jQuery is still working!");
    });
});

// Option 3: Change variable name
var jq = $.noConflict();
jq(document).ready(function(){
    jq("button").click(function(){
        jq("p").text("jQuery is still working!");
    });
});
```

## Basic Syntax

```javascript
$(selector).action()
```

- `$` sign to define/access jQuery
- `(selector)` to "query (or find)" HTML elements
- `action()` to be performed on the element(s)

## Selectors

Same syntax as CSS selectors.

| Selector | Description |
|----------|-------------|
| `$(this)` | Current element |
| `$("p")` | All `<p>` elements |
| `$(".className")` | All elements with 'className' class |
| `$("#id")` | Element with 'id' (gets only first, ID is unique) |
| `$(".class, .class")` | Comma is OR operation |
| `$(".ancestors *")` | All inner elements of ancestors class |
| `$("#log-body ul")` | ul inside of #log-body (not just direct child) |

References:
- [CSS Selectors](https://www.w3schools.com/cssref/css_selectors.asp)
- [jQuery Selectors](https://www.w3schools.com/jquery/jquery_selectors.asp)
- [jQuery Selector Reference](https://www.w3schools.com/jquery/jquery_ref_selectors.asp)

## Events

| Mouse Events | Keyboard Events | Form Events | Document/Window Events |
|--------------|-----------------|-------------|------------------------|
| click | keypress | submit | load |
| dblclick | keydown | change | resize |
| mouseenter | keyup | focus | scroll |
| mouseleave | | blur | unload |

### Set Single Event
```javascript
$("p").click(function(){
    // action goes here!
});
```

### Set Multiple Events
```javascript
$("p").on({
    mouseenter: function(){
        $(this).css("background-color", "lightgray");
    },
    mouseleave: function(){
        $(this).css("background-color", "lightblue");
    },
    click: function(){
        $(this).css("background-color", "yellow");
    }
});
```

### Hover Event
```javascript
$("#p1").hover(
    function(){
        alert("You entered p1!");
    },
    function(){
        alert("Bye! You now leave p1!");
    }
);
```

### Form Events
```javascript
// Focus
$("input").focus(function(){
    $(this).css("background-color", "#cccccc");
});

// Blur
$("input").blur(function(){
    $(this).css("background-color", "#ffffff");
});
```

## Method Chaining

```javascript
$("#p1").css("color", "red").slideUp(2000).slideDown(2000);
```

## View Actions

Reference: [jQuery Effects Reference](https://www.w3schools.com/jquery/jquery_ref_effects.asp)

### Hide/Show
```javascript
$("p").click(function(){
    $(this).hide();
});

$(selector).hide(speed)
$(selector).hide(speed, callback)  // callback invoked after completed

$(selector).toggle(speed, easing, callback)
$(selector).toggle(true/false)  // true: show, false: hide
```

### Fade Effects
```javascript
// fadeIn
$("button").click(function(){
    $("#div1").fadeIn();
    $("#div2").fadeIn("slow");
    $("#div3").fadeIn(3000);
});

// fadeOut, fadeToggle work similarly

// fadeTo - change to specific opacity
$("button").click(function(){
    $("#div1").fadeTo("slow", 0.15);
    $("#div2").fadeTo("slow", 0.4);
    $("#div3").fadeTo("slow", 0.7);
});
```

## Animation

Reference: [jQuery Effects Reference](https://www.w3schools.com/jquery/jquery_ref_effects.asp)

### Syntax
```javascript
$(selector).animate({params}, speed, callback);
```

Note: CSS property names should be camel-cased (padding-left -> paddingLeft)

### Move Elements
By default, all HTML elements have a static position and cannot be moved. To manipulate position, first set the CSS position property to relative, fixed, or absolute!

```javascript
$("button").click(function(){
    $("div").animate({left: '250px'});
});
```
```html
<div style="background:#98bf21;height:100px;width:100px;position:absolute;"></div>
```

### Relative Values
```javascript
$("button").click(function(){
    $("div").animate({
        left: '250px',
        height: '+=150px',
        width: '+=150px'
    });
});
```

### Pre-defined Values
Values: "show", "hide", "toggle"
```javascript
$("button").click(function(){
    $("div").animate({
        height: 'toggle'
    });
});
```

### Animation Queue
Set animation on same element, then animations are processed one by one:
```javascript
$("button").click(function(){
    var div = $("div");
    div.animate({height: '300px', opacity: '0.4'}, "slow");
    div.animate({width: '300px', opacity: '0.8'}, "slow");
    div.animate({height: '100px', opacity: '0.4'}, "slow");
    div.animate({width: '100px', opacity: '0.8'}, "slow");
});
```

### Stop Animation
```javascript
$(selector).stop(stopAll, goToEnd);
// stopAll: if true, queue will be cleared (default: false)
// goToEnd: if true, current animation will finish with end value (default: false)

$("#stop").click(function(){
    $("#panel").stop();
});
```

## HTML/CSS Methods

Reference: [jQuery HTML Reference](https://www.w3schools.com/jquery/jquery_ref_html.asp)

### Access Content
- `text()`, `text(text)` - Sets or returns the text content
- `html()`, `html(text)` - Sets or returns the content including HTML markup
- `val()`, `val(value)` - Sets or returns the value of form fields

```javascript
$("#btn1").click(function(){
    alert("Text: " + $("#test").text());
});

$("#btn2").click(function(){
    alert("HTML: " + $("#test").html());
});
```

### Access Attributes
```javascript
$("#w3s").attr("href")
$("#w3s").attr("href", "https://example.com")
```

### Callback Function
```javascript
// i is index in invoked elements
$("#test1").text(function(i, origText){
    return "Old text: " + origText + " New text: Hello world! (index: " + i + ")";
});
```

### Add Elements
```javascript
// Append at end
$("p").append("Some appended text.");

// Append multiple elements
$("body").append(txt1, txt2, txt3);

// Prepend at beginning
$("p").prepend("Some prepended text.");

// Add after/before
$("img").after("Some text after");
$("img").before("Some text before");
```

### Remove Elements
```javascript
$("#div1").remove();     // Remove element
$("#div1").empty();      // Remove children

// Filter elements to be removed
$("p").remove(".test");
$("p").remove(".test, .demo");
```

### CSS Classes
```javascript
$("button").click(function(){
    $("h1, h2, p").addClass("blue");
    $("div").addClass("important");
});

// Add multiple classes
$("#div1").addClass("important blue");

// Remove class
$("h1, h2, p").removeClass("blue");

// Toggle class
$("h1").toggleClass("highlight");
```

### CSS Properties
```javascript
// Get CSS property
$("p").css("background-color");

// Set CSS property
$("p").css("background-color", "yellow");

// Set multiple properties
$("p").css({"background-color": "yellow", "font-size": "20px"});
```

### Dimensions
- `width()`, `height()` - Content dimensions
- `innerWidth()`, `innerHeight()` - Includes padding
- `outerWidth()`, `outerHeight()` - Includes padding and border
- `outerWidth(true)`, `outerHeight(true)` - Includes margin too

```javascript
$("#div1").width()
$("#div1").width(100)
```

## Filter Methods

```javascript
// First element
$("div").first();

// Last element
$("div").last();

// By index (starts from 0)
$("p").eq(1);

// Filter by selector
$("p").filter(".intro");
$("p").filter(function(){});

// Exclude by selector
$("p").not(".intro");
```

## Traversing Methods

Reference: [jQuery Traversing Reference](https://www.w3schools.com/jquery/jquery_ref_traversing.asp)

### Ancestors
```javascript
// Direct parent
$("span").parent();

// All ancestors
$("span").parents();

// Ancestors of specific tag
$("span").parents("ul");

// Ancestors between two elements
$("span").parentsUntil("div");
```

### Descendants
```javascript
// Direct children
$("div").children();

// Find in all descendants
$("div").find("span");
$("div").find("*");  // All descendants
```

### Siblings
```javascript
$("h2").siblings();     // All siblings
$("h2").next();         // Next sibling
$("h2").nextAll();      // All next siblings
$("h2").nextUntil();    // Until specific element
$("h2").prev();         // Previous sibling
$("h2").prevAll();      // All previous siblings
$("h2").prevUntil();    // Until specific element
```

## AJAX

Reference: [jQuery AJAX Reference](https://www.w3schools.com/jquery/jquery_ref_ajax.asp)

AJAX = Asynchronous JavaScript and XML.

### Load Method
```javascript
$(selector).load(URL, data, callback);

// Load content into element
$("#div1").load("demo_test.txt");

// Load specific element from file
$("#div1").load("demo_test.txt #p1");
```

### Callback Parameters
- responseTxt - contains the resulting content if the call succeeds
- statusTxt - contains the status of the call
- xhr - contains the XMLHttpRequest object

```javascript
$("button").click(function(){
    $("#div1").load("demo_test.txt", function(responseTxt, statusTxt, xhr){
        if(statusTxt == "success")
            alert("External content loaded successfully!");
        if(statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
    });
});
```

### GET Method
```javascript
$.get(URL, callback);

$.get("demo_test.asp", function(data, status){
    alert("Data: " + data + "\nStatus: " + status);
});
```

### Make GET Parameters
```javascript
$.param(obj)

// Example
personObj = {
    firstname: "John",
    lastname: "Doe",
    age: 50,
    eyecolor: "blue"
};
$("div").text($.param(personObj));
// => firstname=John&lastname=Doe&age=50&eyecolor=blue
```

### POST Method
```javascript
$.post(URL, data, callback);

$.post("demo_test_post.asp",
    {
        name: "Donald Duck",
        city: "Duckburg"
    },
    function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
    }
);
```

## Plugins

Find jQuery plugins at: [http://plugins.jquery.com/](http://plugins.jquery.com/)
