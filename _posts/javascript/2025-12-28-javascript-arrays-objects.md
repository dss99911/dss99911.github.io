---
layout: post
title: "JavaScript Arrays and Objects - Complete Guide"
date: 2025-12-28 12:02:00 +0900
categories: javascript
tags: [javascript, arrays, objects, data-structures]
description: "Comprehensive guide to arrays and objects in JavaScript including manipulation methods, sorting, and best practices"
---

Arrays and objects are the fundamental data structures in JavaScript. Understanding how to work with them effectively is crucial for any JavaScript developer.

## Arrays

In JavaScript, arrays use numbered indexes.

### Array Methods

#### Adding and Removing Elements

```javascript
const fruits = ["Apple", "Banana"];

// Add to end
fruits.push("Orange");           // ["Apple", "Banana", "Orange"]

// Remove from end
const last = fruits.pop();       // Returns "Orange", array is now ["Apple", "Banana"]

// Add to beginning
fruits.unshift("Mango");         // ["Mango", "Apple", "Banana"]

// Remove from beginning
const first = fruits.shift();    // Returns "Mango", array is now ["Apple", "Banana"]
```

#### Splice - The Swiss Army Knife

```javascript
const fruits = ["Apple", "Banana", "Cherry", "Date"];

// Remove 2 elements starting at index 1
fruits.splice(1, 2);             // ["Apple", "Date"]

// Insert elements at index 2 (remove 0 elements)
fruits.splice(2, 0, "Lemon", "Kiwi");  // ["Apple", "Date", "Lemon", "Kiwi"]
```

#### Combining and Slicing

```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];

// Combine arrays
const combined = arr1.concat(arr2);  // [1, 2, 3, 4]

// Extract portion (like substring)
const fruits = ["Apple", "Banana", "Cherry", "Date"];
const sliced = fruits.slice(1, 3);   // ["Banana", "Cherry"]
```

### Checking if Array

```javascript
// ECMAScript 5+
Array.isArray(fruits);  // true

// Constructor check
function isArray(arr) {
    return arr.constructor === Array;
}

// instanceof
fruits instanceof Array;  // true
```

### Converting to String

```javascript
const arr = ["Apple", "Banana", "Cherry"];
arr.toString();   // "Apple,Banana,Cherry"
arr.join(" - ");  // "Apple - Banana - Cherry"
```

### Sorting Arrays

```javascript
// Basic sort (alphabetically)
const fruits = ["Banana", "Apple", "Cherry"];
fruits.sort();    // ["Apple", "Banana", "Cherry"]
fruits.reverse(); // ["Cherry", "Banana", "Apple"]

// Numeric sort (requires compare function)
const points = [40, 100, 1, 5, 25, 10];

// Ascending
points.sort(function(a, b) { return a - b; });  // [1, 5, 10, 25, 40, 100]

// Descending
points.sort(function(a, b) { return b - a; });  // [100, 40, 25, 10, 5, 1]

// Random shuffle
points.sort(function(a, b) { return 0.5 - Math.random(); });
```

### Finding Min and Max

```javascript
const arr = [40, 100, 1, 5, 25, 10];
Math.max.apply(null, arr);  // 100
Math.min.apply(null, arr);  // 1
```

### Array Gotchas

#### Accessing Out-of-Bounds Index

```javascript
const arr = [1, 2, 3];
arr[10];  // undefined (not an error)

// Useful for loop termination
for (let i = 0; arr[i]; i++) {
    console.log(arr[i]);  // Stops when undefined
}
```

#### Named Indexes Convert to Object

```javascript
const person = [];
person["firstName"] = "John";
person["lastName"] = "Doe";
person.length;  // 0 (it's now an object, not array)
person[0];      // undefined
```

#### Avoid new Array()

```javascript
// Bad - ambiguous with single number
var points = new Array(40);  // Creates array with 40 empty slots

// Good - always use literal syntax
var points = [];
var numbers = [40, 100, 1, 5];
```

## Objects

In JavaScript, objects use named indexes.

### Creating Objects

```javascript
// Object literal
const person = {
    firstName: "John",
    lastName: "Doe",
    age: 50,
    eyeColor: "blue"
};

// Constructor function
function Person(first, last, age, eye) {
    this.firstName = first;
    this.lastName = last;
    this.age = age;
    this.eyeColor = eye;
    this.changeName = function(name) {
        this.lastName = name;
    };
}

const myFather = new Person("John", "Doe", 50, "blue");
```

### Accessing Properties

```javascript
// Dot notation
person.firstName;

// Bracket notation
person["firstName"];
```

### Modifying Objects

#### Read-Only Properties

```javascript
const obj = {};
Object.defineProperty(obj, "x", { value: 0, writable: false });
// obj.x = 1; // Silently fails (or throws in strict mode)
```

#### Custom Getters and Setters

```javascript
const obj = {
    get x() { return 0; },
    set x(value) { /* custom logic */ }
};

obj.x;     // Calls getter
obj.x = 1; // Calls setter
```

#### Deleting Properties

```javascript
delete person.age;  // Removes age property
```

### Prototype Modification

```javascript
// Add property to all instances
Person.prototype.nationality = "English";

// Add method to all instances
Person.prototype.fullName = function() {
    return this.firstName + " " + this.lastName;
};
```

## Map

JavaScript ES6 introduced the Map object for key-value pairs:

```javascript
const map = new Map();

// Setting values
map.set(1, "a");
map.set("key", "value");

// Getting values
map.get(1);  // "a"

// Iterating
const iterator = map.entries();
while (true) {
    const next = iterator.next();
    if (next.value === undefined) break;
    console.log(next.value);  // [1, "a"], ["key", "value"]
}

// Other methods
map.keys();    // Iterator of keys
map.values();  // Iterator of values
```

## Loops

### For-In Loop

```javascript
// Object iteration
const person = { fname: "John", lname: "Doe", age: 25 };
for (let key in person) {
    console.log(person[key]);  // John, Doe, 25
}

// Array iteration (returns indexes)
const arr = ["a", "b", "c"];
for (let index in arr) {
    console.log(arr[index]);  // a, b, c
}
```

### forEach Method

```javascript
const numbers = [4, 9, 16, 25];

numbers.forEach(function(item, index) {
    console.log("index[" + index + "]: " + item);
});
// index[0]: 4
// index[1]: 9
// index[2]: 16
// index[3]: 25
```

---

Arrays and objects are the backbone of JavaScript data handling. Mastering these structures and their methods will make you a more effective JavaScript developer.
