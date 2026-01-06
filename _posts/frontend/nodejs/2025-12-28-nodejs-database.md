---
layout: post
title: "Node.js 데이터베이스 연동 - MongoDB와 MySQL"
date: 2025-12-28
categories: [frontend, nodejs]
tags: [nodejs, mongodb, mysql, database]
image: /assets/images/posts/thumbnails/2025-12-28-nodejs-database.png
---

Node.js에서 MongoDB와 MySQL 데이터베이스를 연동하는 방법을 알아봅니다.

## MongoDB

### 연결

```javascript
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
});
```

### 테이블(컬렉션) 만들기

```javascript
db.createCollection("customers", function(err, res) {
    if (err) throw err;
    console.log("Table created!");
    db.close();
});
```

### Insert One

```javascript
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var myobj = { name: "Company Inc", address: "Highway 37" };
    db.collection("customers").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 record inserted");
        db.close();
    });
});
```

### Insert Many

```javascript
var myobj = [
    { name: 'John', address: 'Highway 71'},
    { name: 'Viola', address: 'Sideway 1633'}
];

db.collection("customers").insertMany(myobj, function(err, res) {
    if (err) throw err;
    console.log("Number of records inserted: " + res.insertedCount);
    db.close();
});
```

**참고**: `_id`가 Primary Key입니다. 명시하지 않으면 자동으로 입력됩니다.

### Select

#### Select One

```javascript
db.collection("customers").findOne({}, function(err, result) {
    if (err) throw err;
    console.log(result.name);
    db.close();
});
```

#### Select All

```javascript
db.collection("customers").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
});
```

### Filtering

```javascript
var query = { address: "Park Lane 38" };
// 또는 정규식 사용 (S로 시작)
var query = { address: /^S/ };

db.collection("customers").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
});
```

### Sort

```javascript
var mysort = { name: 1 };  // 1: 오름차순, -1: 내림차순

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

### Delete

#### Delete One

```javascript
var myquery = { address: 'Mountain 21' };

db.collection("customers").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
});
```

#### Delete Many

```javascript
var myquery = { address: /^O/ };

db.collection("customers").deleteMany(myquery, function(err, obj) {
    if (err) throw err;
    console.log(obj.result.n + " document(s) deleted");
    db.close();
});
```

### Update

#### 전체 필드 업데이트 (한 레코드)

```javascript
var myquery = { address: "Valley 345" };
var newvalues = { name: "Mickey", address: "Canyon 123" };

db.collection("customers").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 record updated");
    db.close();
});
```

#### 특정 필드만 업데이트

```javascript
var myquery = { address: "Valley 345" };
var newvalues = { $set: { address: "Canyon 123" } };

db.collection("customers").updateOne(myquery, newvalues, function(err, res) {});
```

#### 여러 레코드 업데이트

```javascript
var myquery = { address: /^S/ };
var newvalues = {$set: {name: "Minnie"} };

db.collection("customers").updateMany(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log(res.result.nModified + " record(s) updated");
    db.close();
});
```

### 테이블 삭제

```javascript
db.collection("customers").drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Table deleted");
    db.close();
});

// 또는
db.dropCollection("customers", function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Table deleted");
    db.close();
});
```

### Join (Lookup)

```javascript
// orders의 products_id와 같은 id가 products에 있을 경우,
// orderdetails 컬럼을 만들어서 거기에 객체를 추가
db.collection('orders').aggregate([
    { $lookup: {
        from: 'products',
        localField: 'products_id',
        foreignField: 'id',
        as: 'orderdetails'
    }}
], function(err, res) {
    if (err) throw err;
    console.log(res);
    db.close();
});

// 결과:
// { _id: 1, product_id: 154, status: 1, orderdetails: [
//     { _id: 154, name: 'Chocolate Heaven' } ]
// }
```

---

## MySQL

### 연결

```javascript
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "yourusername",
    password: "yourpassword"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    // 쿼리 실행
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Result: " + result);
    });
});
```

### 다중 Insert

```javascript
var sql = "INSERT INTO customers (name, address) VALUES ?";
var values = [
    ['John', 'Highway 71'],
    ['Viola', 'Sideway 1633']
];

con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
});
```

### Result 객체

#### 읽기 작업시

필드를 가지는 객체들의 배열

#### 쓰기 작업시

```javascript
{
    fieldCount: 0,
    affectedRows: 14,
    insertId: 0,
    serverStatus: 2,
    warningCount: 0,
    message: '\'Records:14  Duplicated: 0  Warnings: 0',
    protocol41: true,
    changedRows: 0
}
```

### 컬럼 정보 가져오기

```javascript
con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT name, address FROM customers", function (err, result, fields) {
        if (err) throw err;
        console.log(fields.name);  // 컬럼명 가져오기
    });
});
```

### SQL Injection 방지

```javascript
// escape 사용
var sql = 'SELECT * FROM customers WHERE address = ' + mysql.escape(adr);

// placeholder 사용
var sql = 'SELECT * FROM customers WHERE name = ? OR address = ?';
con.query(sql, [name, adr], function (err, result) {
    if (err) throw err;
    console.log(result);
});
```
