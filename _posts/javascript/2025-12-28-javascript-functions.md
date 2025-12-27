---
layout: post
title: "JavaScript Functions - Declaration, Hoisting, and Advanced Patterns"
date: 2025-12-28 12:03:00 +0900
categories: javascript
tags: [javascript, functions, hoisting, closures]
description: "Complete guide to JavaScript functions including declaration patterns, hoisting, this keyword, call/apply methods, and generators"
---

Functions are first-class citizens in JavaScript, meaning they can be passed around like any other value. This post covers everything you need to know about JavaScript functions.

## Function Declaration

There are several ways to declare functions in JavaScript:

### Standard Declaration

```javascript
function myFunction(a, b) {
    return a * b;
}
```

### Anonymous Function (Function Expression)

```javascript
const myFunction = function(a, b) {
    return a * b;
};
```

### Function Constructor (Not Recommended)

```javascript
const myFunction = new Function("a", "b", "return a * b");
```

## Function Hoisting

JavaScript hoists function declarations, allowing you to call functions before they're defined:

```javascript
// This works!
myFunction(5);  // Returns 25

function myFunction(y) {
    return y * y;
}
```

> **Note:** Function expressions are NOT hoisted. Only function declarations are.

## Self-Invoking Functions (IIFE)

Immediately Invoked Function Expressions execute automatically:

```javascript
(function() {
    var x = "Hello!!";  // I will invoke myself
    console.log(x);
})();
```

## Arguments Object

Functions have access to an `arguments` object containing all passed parameters:

```javascript
function findMax() {
    var max = -Infinity;
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] > max) {
            max = arguments[i];
        }
    }
    return max;
}

findMax(1, 123, 500, 115, 44, 88);  // Returns 500
```

### Arguments Properties

```javascript
arguments.length;  // Number of arguments
arguments[0];      // First argument
```

## The `this` Keyword

Understanding `this` is crucial in JavaScript:

### In Global Context

```javascript
function myFunction() {
    return this;
}
myFunction();  // Returns window object (in browser)
```

### In Object Constructor

```javascript
function Person(firstName, lastName) {
    this.firstName = firstName;  // 'this' refers to the new object
    this.lastName = lastName;
}

var person = new Person("John", "Doe");
```

### Global Scope

Any variable or function declared without an owner belongs to the `window` object:

```javascript
var x = 10;          // window.x
function test() {}   // window.test
```

## call() and apply()

These methods allow you to borrow methods from other objects:

### call() Method

```javascript
const person = {
    fullName: function() {
        return this.firstName + " " + this.lastName;
    }
};

const myObject = {
    firstName: "John",
    lastName: "Doe"
};

person.fullName.call(myObject);  // "John Doe"
```

### apply() Method

Similar to `call()`, but accepts an array of arguments:

```javascript
Math.max.apply(null, [1, 2, 3]);  // 3

const person = {
    fullName: function(city, country) {
        return this.firstName + " " + this.lastName + ", " + city + ", " + country;
    }
};

person.fullName.apply(myObject, ["Oslo", "Norway"]);
```

## Generator Functions and yield

ES6 introduced generator functions that can pause and resume execution:

### Basic Generator

```javascript
function* generator() {
    console.log(0);
    yield 1;
    yield 2;
    yield 3;
}

let iterator = generator();
iterator.next();  // { value: 1, done: false }
iterator.next();  // { value: 2, done: false }
iterator.next();  // { value: 3, done: false }
iterator.next();  // { value: undefined, done: true }
```

### Fibonacci Generator Example

```javascript
function* fibonacci() {
    var fn1 = 0;
    var fn2 = 1;
    while (true) {
        var current = fn1;
        fn1 = fn2;
        fn2 = current + fn1;
        var reset = yield current;
        if (reset) {
            fn1 = 0;
            fn2 = 1;
        }
    }
}

var sequence = fibonacci();
console.log(sequence.next().value);     // 0
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 2
console.log(sequence.next().value);     // 3
console.log(sequence.next().value);     // 5
console.log(sequence.next().value);     // 8
console.log(sequence.next(true).value); // 0 (reset)
console.log(sequence.next().value);     // 1
```

## Built-in Functions

### setTimeout

Execute code after a delay:

```javascript
setTimeout(function() {
    alert("Hello");
}, 3000);  // 3 seconds
```

### setInterval

Execute code repeatedly:

```javascript
var id = setInterval(frame, 5);  // Every 5ms

function frame() {
    if (/* test for finished */) {
        clearInterval(id);
    } else {
        /* code to execute */
    }
}
```

## Error Handling

JavaScript uses try-catch blocks similar to Java:

```javascript
try {
    // Code that might throw an error
    throw "Something went wrong";
} catch (err) {
    console.log(err.name);     // Error name
    console.log(err.message);  // Error message
}

// Throwing different types
throw "Too big";    // Throw a string
throw 500;          // Throw a number
```

## Control Flow

### Labels and break

You can label code blocks and break out of them:

```javascript
list: {
    text += cars[0] + "<br>";
    text += cars[1] + "<br>";
    text += cars[2] + "<br>";
    break list;  // Exit the block
    text += cars[3] + "<br>";  // Not executed
    text += cars[4] + "<br>";
    text += cars[5] + "<br>";
}
```

## Debugging

### Console Methods

```javascript
console.log("Basic logging");

// View all properties of an object
for (var p in theObject) {
    console.log(p);
}
```

---

Functions are the heart of JavaScript programming. Understanding these concepts will help you write more elegant and efficient code.
