---
layout: post
title: "JavaScript Fundamentals - Types, Variables, and Basic Operations"
date: 2025-12-28 12:00:00 +0900
categories: javascript
tags: [javascript, fundamentals, types, variables, operators]
description: "JavaScript fundamentals including data types, variables, operators, boolean logic, constants, and type checking"
---

JavaScript is a versatile programming language that powers the modern web. This post covers the fundamental concepts every JavaScript developer should know.

## Data Types

JavaScript has several primitive data types and complex types:

### Primitive Types
- **string** - Text data
- **number** - Numeric values (integers and floats)
- **boolean** - true or false
- **null** - Intentional absence of value
- **undefined** - Uninitialized variable

### Checking Types with typeof

```javascript
typeof "hello"              // Returns "string"
typeof 42                   // Returns "number"
typeof true                 // Returns "boolean"
typeof undefined            // Returns "undefined"
typeof null                 // Returns "object" (this is a known quirk)
typeof [1,2,3,4]           // Returns "object" (not "array")
typeof {name:'John'}        // Returns "object"
typeof function myFunc(){}  // Returns "function"
```

### Checking for undefined

```javascript
if (obj == undefined) {}
if (typeof obj == 'undefined') {}
```

### Checking Object Type

```javascript
function isDate(myDate) {
    return myDate.constructor === Date;
}
```

### instanceof Operator

Use `instanceof` to check if an object is an instance of a specific type:

```javascript
myArray instanceof Array  // Returns true if myArray is an array
```

## Constants

ES6 introduced the `const` keyword for declaring constants:

```javascript
const number = 42;
// number = 50; // This would cause an error
```

## Operators

### Comparison Operators

JavaScript has two types of equality operators:

| Operator | Description |
|----------|-------------|
| `==` | Equal value (with type coercion) |
| `===` | Equal value AND equal type (strict) |
| `!=` | Not equal value |
| `!==` | Not equal value or not equal type |

```javascript
console.log(1 == 1);    // true
console.log("1" == 1);  // true (type coercion)
console.log(1 === 1);   // true
console.log("1" === 1); // false (different types)
```

### Logical OR for Default Values

The `||` operator returns the first truthy value:

```javascript
3000 || 5000  // Returns 3000
0 || 5000     // Returns 5000 (0 is falsy)
```

## Boolean Values

### Falsy Values

The following values are considered false in boolean context:
- `0`
- `-0`
- `""` (empty string)
- `undefined`
- `null`
- `NaN`

### Truthy Gotchas

```javascript
"false"     // true (non-empty string)
5 == "5"    // true (with type coercion)
"2" > "12"  // true (string comparison, "2" > "1")
2 > "John"  // false (NaN comparison)
```

## Strict Mode

Strict mode helps catch common coding mistakes and prevents certain actions:

```javascript
"use strict";

x = 3.14;    // Error! x is not defined

// Can also be used within a function
function myFunction() {
    "use strict";
    y = 3.14;   // Error! y is not defined
}
```

## Code Conventions

Best practices for writing clean JavaScript code:

1. Declare and initialize variables at the top
2. Use camelCase for naming
3. Add spaces around operators
4. Avoid global variables
5. Use primitive types instead of primitive type objects

### Handling Undefined Parameters

```javascript
function myFunction(x, y) {
    if (y === undefined) {
        y = 0;
    }
    // Function body
}
```

## Output Methods

JavaScript provides several ways to output data:

```javascript
document.write("Hello");     // Write to document
alert("Hello");              // Show alert dialog
console.log("Hello");        // Write to console
element.innerHTML = "Hello"; // Write to HTML element
```

## Encoding URIs

When working with URLs, encode special characters:

```javascript
encodeURI(text)  // Encodes a URI
```

## Compatibility Notes

Avoid using string indexing for older browser support:

```javascript
str[0];           // Does not work in IE5, IE6, IE7
str.split("")[0]; // Use this instead
```

---

Understanding these fundamentals is essential for writing robust JavaScript applications. In the next posts, we'll explore more advanced topics like arrays, objects, and asynchronous programming.
