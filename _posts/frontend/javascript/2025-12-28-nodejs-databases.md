---
layout: post
title: "Node.js Database Integration - MySQL and MongoDB"
date: 2025-12-28 12:09:00 +0900
categories: [frontend, javascript]
tags: [nodejs, mysql, mongodb, database]
description: "Guide to integrating MySQL and MongoDB with Node.js including CRUD operations, queries, and best practices"
image: /assets/images/posts/thumbnails/2025-12-28-nodejs-databases.png
---

Node.js works seamlessly with various databases. This guide covers integration with MySQL and MongoDB.

## MySQL Integration

### Setup

```javascript
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "yourusername",
    password: "yourpassword",
    database: "mydb"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
```

### Basic Query

```javascript
con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM customers", function(err, result) {
        if (err) throw err;
        console.log(result);
    });
});
```

### Insert Operations

```javascript
// Single insert
var sql = "INSERT INTO customers (name, address) VALUES ('John', 'Highway 1')";
con.query(sql, function(err, result) {
    if (err) throw err;
    console.log("1 record inserted");
});

// Multiple insert
var sql = "INSERT INTO customers (name, address) VALUES ?";
var values = [
    ['John', 'Highway 71'],
    ['Peter', 'Lowstreet 4'],
    ['Amy', 'Apple st 652']
];
con.query(sql, [values], function(err, result) {
    if (err) throw err;
    console.log("Records inserted: " + result.affectedRows);
});
```

### Query with Parameters

```javascript
// Prevent SQL injection with placeholders
var sql = 'SELECT * FROM customers WHERE name = ? OR address = ?';
con.query(sql, [name, address], function(err, result) {
    if (err) throw err;
    console.log(result);
});

// Or use escape
var sql = 'SELECT * FROM customers WHERE address = ' + mysql.escape(address);
```

### Result Object

For SELECT operations, result is an array of objects with field properties.

For INSERT/UPDATE operations:

```javascript
{
    fieldCount: 0,
    affectedRows: 14,
    insertId: 0,
    serverStatus: 2,
    warningCount: 0,
    message: 'Records:14 Duplicated: 0 Warnings: 0',
    protocol41: true,
    changedRows: 0
}
```

### Getting Column Information

```javascript
con.query("SELECT name, address FROM customers", function(err, result, fields) {
    if (err) throw err;
    console.log(fields[0].name);  // Column name
});
```

## MongoDB Integration

### Setup

```javascript
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database connected!");
    db.close();
});
```

### Create Collection

```javascript
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.createCollection("customers", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
});
```

### Insert Operations

```javascript
// Insert one
var myobj = { name: "Company Inc", address: "Highway 37" };
db.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
});

// Insert many
var myobj = [
    { name: 'John', address: 'Highway 71'},
    { name: 'Peter', address: 'Lowstreet 4'}
];
db.collection("customers").insertMany(myobj, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    db.close();
});
```

### Find Operations

```javascript
// Find one
db.collection("customers").findOne({}, function(err, result) {
    if (err) throw err;
    console.log(result.name);
    db.close();
});

// Find all
db.collection("customers").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
});
```

### Filtering

```javascript
// Exact match
var query = { address: "Park Lane 38" };

// Regex filter
var query = { address: /^S/ };  // Starts with S

db.collection("customers").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
});
```

### Sorting

```javascript
// 1 for ascending, -1 for descending
var mysort = { name: 1 };

db.collection("customers").find().sort(mysort).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
});
```

### Limit

```javascript
db.collection("customers").find().limit(5).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
});
```

### Update Operations

```javascript
// Update one - all fields
var myquery = { address: "Valley 345" };
var newvalues = { name: "Mickey", address: "Canyon 123" };
db.collection("customers").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
});

// Update one - specific fields only
var newvalues = { $set: { address: "Canyon 123" } };
db.collection("customers").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
});

// Update many
var myquery = { address: /^S/ };
var newvalues = { $set: { name: "Minnie" } };
db.collection("customers").updateMany(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log(res.result.nModified + " document(s) updated");
    db.close();
});
```

### Delete Operations

```javascript
// Delete one
var myquery = { address: 'Mountain 21' };
db.collection("customers").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
});

// Delete many
var myquery = { address: /^O/ };
db.collection("customers").deleteMany(myquery, function(err, obj) {
    if (err) throw err;
    console.log(obj.result.n + " document(s) deleted");
    db.close();
});
```

### Drop Collection

```javascript
db.collection("customers").drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Collection deleted");
    db.close();
});

// Or
db.dropCollection("customers", function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Collection deleted");
    db.close();
});
```

### Join (Aggregation)

```javascript
db.collection('orders').aggregate([
    { $lookup: {
        from: 'products',
        localField: 'product_id',
        foreignField: '_id',
        as: 'orderdetails'
    }}
], function(err, res) {
    if (err) throw err;
    console.log(res);
    db.close();
});

// Result:
// {
//   _id: 1,
//   product_id: 154,
//   status: 1,
//   orderdetails: [{ _id: 154, name: 'Chocolate Heaven' }]
// }
```

## Headless Browser

For web scraping and automation, use Puppeteer:

### Puppeteer Setup

```bash
npm i --save puppeteer
```

### Basic Usage

```javascript
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://example.com');
    await page.screenshot({path: 'example.png'});

    await browser.close();
})();
```

### Options

```javascript
// Show browser window
const browser = await puppeteer.launch({headless: false});

// Use different Chrome version
const browser = await puppeteer.launch({executablePath: '/path/to/Chrome'});

// Wait for network idle
await page.goto(url, {"waitUntil": "networkidle0"});
```

### Page Interaction

```javascript
// Get document handle
const aHandle = await page.evaluateHandle('document');

// Query selectors
const element = await page.$(selector);
const elements = await page.$$(selector);

// Evaluate expressions
const count = await page.$$eval('div', divs => divs.length);
const value = await page.$eval('#search', el => el.value);
const html = await page.$eval('.main', e => e.outerHTML);
```

### Screenshot and PDF

```javascript
// Screenshot
await page.screenshot({path: 'screenshot.png'});

// PDF
await page.pdf({path: 'page.pdf', format: 'A4'});
```

### Chrome Launcher

For more control over Chrome launching:

```javascript
const chromeLauncher = require('chrome-launcher');

chromeLauncher.launch({
    startingUrl: 'https://google.com',
    chromeFlags: ['--headless', '--disable-gpu']
}).then(chrome => {
    console.log(`Chrome debugging port: ${chrome.port}`);
});
```

---

Node.js provides excellent database integration capabilities, making it easy to build full-stack JavaScript applications with either SQL or NoSQL databases.
