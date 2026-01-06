---
layout: post
title: "JavaScript Strings and Numbers - Complete Guide"
date: 2025-12-28 12:01:00 +0900
categories: [frontend, javascript]
tags: [javascript, strings, numbers, methods]
description: "Complete guide to working with strings and numbers in JavaScript including methods, parsing, and common operations"
image: /assets/images/posts/thumbnails/2025-12-28-javascript-strings-numbers.png
---

Strings and numbers are fundamental data types in JavaScript. This guide covers everything you need to know about working with them effectively.

## Strings

### String Methods

JavaScript provides many useful string methods:

```javascript
str.includes("text")      // Returns true if string contains "text" (like Java's contains)
str.lastIndexOf("text")   // Returns last index of "text"
str.substr(start, length) // Returns substring by length
str.slice(start, end)     // Returns substring (like substring, allows negative numbers)
str.length                // Returns string length
```

### Template Literals (ES6)

Template literals allow embedded expressions:

```javascript
const name = "World";
const greeting = `Hello ${name}!`;  // "Hello World!"

const completed = true;
console.log(`Status: ${completed}`);  // "Status: true"
```

### String Compatibility Note

Avoid accessing strings like arrays in older browsers:

```javascript
str[0];           // Does not work in IE5, IE6, IE7
str.split("")[0]; // Use this instead for compatibility
```

## Numbers

### Parsing Numbers

```javascript
parseInt("10")          // Returns 10
Number.isInteger(num)   // Check if number is an integer

// Check if value is a valid number
Number.isInteger(parseInt("1"))  // true
```

### Special Number Values

#### Infinity

```javascript
var myNumber = 2;
while (myNumber != Infinity) {
    myNumber = myNumber * myNumber;  // Eventually reaches Infinity
}

var x = 2 / 0;        // Infinity
typeof Infinity;      // Returns "number"
```

#### NaN (Not a Number)

```javascript
var x = 100 / "Apple";  // NaN
isNaN(x);               // true
```

### Number Formatting with toFixed()

```javascript
var x = 9.656;
x.toFixed(0);  // Returns "10"
x.toFixed(2);  // Returns "9.66"
```

### Floating Point Precision Issues

JavaScript uses floating point arithmetic which can cause precision issues:

```javascript
var x = 0.1;
var y = 0.2;
var z = x + y;  // 0.30000000000000004 (not 0.3!)

// Solution: Use integer math
var z = (x * 10 + y * 10) / 10;  // 0.3
```

## Regular Expressions

Regular expressions provide powerful pattern matching for strings.

### Replace with Regex

```javascript
// Replace all occurrences (global flag)
str = "Please visit Microsoft and Microsoft!";
var result = str.replace(/Microsoft/g, "W3Schools");

// Case-insensitive replacement
var result = str.replace(/microsoft/i, "W3Schools");
```

### Testing Patterns

```javascript
var pattern = /e/;
pattern.test("The best things in life are free!");  // Returns true
```

### Extracting Matches

```javascript
/e/.exec("The best things in life are free!");  // Returns "e"
```

## Custom Prototypes

You can extend built-in types with custom methods:

```javascript
// Add a contains method to String prototype
String.prototype.contains = function(text) {
    return this.indexOf(text) != -1;
};

// Usage
"Hello World".contains("World");  // true
```

> **Note:** While possible, extending built-in prototypes is generally not recommended in production code as it can cause conflicts with other libraries.

## Practical Examples

### Validating User Input

```javascript
function isValidNumber(input) {
    const num = parseInt(input);
    return !isNaN(num) && Number.isInteger(num);
}

isValidNumber("42");    // true
isValidNumber("3.14");  // false (not an integer after parseInt)
isValidNumber("hello"); // false
```

### Formatting Currency

```javascript
function formatCurrency(amount) {
    return "$" + amount.toFixed(2);
}

formatCurrency(19.5);   // "$19.50"
formatCurrency(100);    // "$100.00"
```

### Checking for Substrings

```javascript
const text = "JavaScript is awesome!";

// Modern approach (ES6+)
text.includes("awesome");  // true

// Older approach (pre-ES6)
text.indexOf("awesome") !== -1;  // true
```

---

Understanding strings and numbers is essential for any JavaScript developer. These fundamental operations form the building blocks for more complex data manipulation tasks.
