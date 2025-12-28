---
layout: post
title: "jQuery Complete Guide - From Basics to Advanced"
date: 2025-12-28 12:06:00 +0900
categories: [frontend, javascript]
tags: [javascript, jquery, dom, ajax]
description: "Comprehensive jQuery guide covering selectors, events, animations, DOM manipulation, AJAX, and best practices"
---

jQuery is a fast, small, and feature-rich JavaScript library that simplifies HTML document traversal, event handling, animation, and AJAX interactions.

## Getting Started

### CDN Installation (Recommended)

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
```

Using a CDN has advantages:
- Users may already have jQuery cached from visiting other sites
- CDNs serve files from servers closest to the user

### Download Installation

```html
<head>
    <script src="jquery-3.2.1.min.js"></script>
</head>
```

### Document Ready

Always wait for the document to be ready before running jQuery code:

```javascript
$(document).ready(function() {
    $("button").click(function() {
        $("p").hide();
    });
});
```

## Basic Syntax

```javascript
$(selector).action()
```

- `$` - Access jQuery
- `selector` - Query HTML elements (uses CSS selector syntax)
- `action()` - Perform action on elements

## Selectors

jQuery uses CSS selector syntax:

```javascript
$(this)              // Current element
$("p")               // All <p> elements
$(".className")      // All elements with class 'className'
$("#id")             // Element with id 'id' (first match only)
$(".class, .other")  // Multiple selectors (OR)
$(".ancestors *")    // All descendants of .ancestors
$("#log-body ul")    // ul inside #log-body (any depth)
```

## Events

### Event Types

| Mouse Events | Keyboard Events | Form Events | Document Events |
|--------------|-----------------|-------------|-----------------|
| click        | keypress        | submit      | load            |
| dblclick     | keydown         | change      | resize          |
| mouseenter   | keyup           | focus       | scroll          |
| mouseleave   |                 | blur        | unload          |

### Single Event

```javascript
$("p").click(function() {
    // action
});
```

### Multiple Events

```javascript
$("p").on({
    mouseenter: function() {
        $(this).css("background-color", "lightgray");
    },
    mouseleave: function() {
        $(this).css("background-color", "lightblue");
    },
    click: function() {
        $(this).css("background-color", "yellow");
    }
});
```

### Hover Event

```javascript
$("#p1").hover(
    function() { alert("You entered p1!"); },
    function() { alert("Bye! You now leave p1!"); }
);
```

### Focus and Blur

```javascript
$("input").focus(function() {
    $(this).css("background-color", "#cccccc");
});

$("input").blur(function() {
    $(this).css("background-color", "#ffffff");
});
```

## Effects and Animations

### Hide/Show

```javascript
$("p").hide();
$("p").show();
$("p").hide(1000);              // With duration
$("p").hide(1000, callback);    // With callback
$(selector).toggle();           // Toggle visibility
$(selector).toggle(true);       // Show
$(selector).toggle(false);      // Hide
```

### Fade Effects

```javascript
$("#div1").fadeIn();
$("#div2").fadeIn("slow");
$("#div3").fadeIn(3000);
$("#div1").fadeOut();
$("#div1").fadeToggle();
$("#div1").fadeTo("slow", 0.15);  // Fade to opacity
```

### Animation

```javascript
// CSS property names must be camelCase
$(selector).animate({params}, speed, callback);

// Example: Move element
$("div").animate({left: '250px'});

// Relative values
$("div").animate({
    left: '250px',
    height: '+=150px',
    width: '+=150px'
});

// Pre-defined values
$("div").animate({height: 'toggle'});

// Animation queue (sequential)
$("button").click(function() {
    var div = $("div");
    div.animate({height: '300px'}, "slow");
    div.animate({width: '300px'}, "slow");
    div.animate({height: '100px'}, "slow");
    div.animate({width: '100px'}, "slow");
});
```

### Stop Animation

```javascript
$(selector).stop(stopAll, goToEnd);
// stopAll: Clear queue (default: false)
// goToEnd: Jump to end (default: false)

$("#panel").stop();
```

## DOM Manipulation

### Get/Set Content

```javascript
$("#test").text();           // Get text content
$("#test").text("New text"); // Set text content
$("#test").html();           // Get HTML content
$("input").val();            // Get form field value
```

### Get/Set Attributes

```javascript
$("#w3s").attr("href");                    // Get attribute
$("#w3s").attr("href", "https://new.url"); // Set attribute
```

### Add Elements

```javascript
$("p").append("Appended text");      // Add at end
$("p").prepend("Prepended text");    // Add at beginning
$("body").append(txt1, txt2, txt3);  // Add multiple
$("img").after("Text after");        // Add after element
$("img").before("Text before");      // Add before element
```

### Remove Elements

```javascript
$("#div1").remove();           // Remove element
$("#div1").empty();            // Remove children
$("p").remove(".test");        // Remove with filter
$("p").remove(".test, .demo"); // Remove multiple classes
```

### CSS Classes

```javascript
$("div").addClass("important blue");    // Add classes
$("div").removeClass("blue");           // Remove class
$("div").toggleClass("highlight");      // Toggle class
$("p").css("background-color");         // Get CSS property
$("p").css("background-color", "yellow"); // Set CSS property
$("p").css({                            // Set multiple
    "background-color": "yellow",
    "font-size": "200%"
});
```

### Dimensions

```javascript
$("#div1").width();        // Content width
$("#div1").height();       // Content height
$("#div1").innerWidth();   // Including padding
$("#div1").innerHeight();
$("#div1").outerWidth();   // Including padding + border
$("#div1").outerHeight();
$("#div1").outerWidth(true);  // Including margin
```

## Traversing

### Ancestors

```javascript
$("span").parent();           // Direct parent
$("span").parents();          // All ancestors
$("span").parents("ul");      // Specific ancestor
$("span").parentsUntil("div"); // Ancestors between
```

### Descendants

```javascript
$("div").children();          // Direct children
$("div").find("span");        // Find in descendants
$("div").find("*");           // All descendants
```

### Siblings

```javascript
$("h2").siblings();
$("h2").next();
$("h2").nextAll();
$("h2").nextUntil("h6");
$("h2").prev();
$("h2").prevAll();
$("h2").prevUntil("h1");
```

### Filtering

```javascript
$("div").first();          // First element
$("div").last();           // Last element
$("p").eq(1);              // Element at index
$("p").filter(".intro");   // Filter by selector
$("p").filter(function(){}); // Filter by function
$("p").not(".intro");      // Exclude selector
```

## Method Chaining

Chain multiple methods together:

```javascript
$("#p1").css("color", "red").slideUp(2000).slideDown(2000);
```

## AJAX

### Load Content

```javascript
$(selector).load(URL, data, callback);
$("#div1").load("demo_test.txt");
$("#div1").load("demo_test.txt #p1");  // Load specific element

// With callback
$("button").click(function() {
    $("#div1").load("demo_test.txt", function(responseTxt, statusTxt, xhr) {
        if (statusTxt == "success")
            alert("Content loaded successfully!");
        if (statusTxt == "error")
            alert("Error: " + xhr.status + ": " + xhr.statusText);
    });
});
```

### GET Request

```javascript
$.get(URL, callback);

$.get("demo_test.asp", function(data, status) {
    alert("Data: " + data + "\nStatus: " + status);
});
```

### POST Request

```javascript
$.post(URL, data, callback);

$.post("demo_test_post.asp",
    {
        name: "Donald Duck",
        city: "Duckburg"
    },
    function(data, status) {
        alert("Data: " + data + "\nStatus: " + status);
    }
);
```

### Create Query String

```javascript
var personObj = {
    firstname: "John",
    lastname: "Doe",
    age: 50
};

$.param(personObj);
// Returns: firstname=John&lastname=Doe&age=50
```

## Handling Conflicts

If `$` conflicts with other libraries:

```javascript
$.noConflict();

// Use jQuery instead of $
jQuery(document).ready(function() {
    jQuery("button").click(function() {
        jQuery("p").text("jQuery is still working!");
    });
});

// Or use $ in a limited scope
$.noConflict();
jQuery(document).ready(function($) {
    $("button").click(function() {
        $("p").text("jQuery is still working!");
    });
});

// Or assign to different variable
var jq = $.noConflict();
jq(document).ready(function() {
    jq("button").click(function() {
        jq("p").text("jQuery is still working!");
    });
});
```

## Plugins

Extend jQuery with plugins: [http://plugins.jquery.com/](http://plugins.jquery.com/)

---

jQuery simplifies JavaScript programming and provides a consistent API across browsers. While modern vanilla JavaScript has caught up in many areas, jQuery remains useful for legacy projects and quick prototyping.
