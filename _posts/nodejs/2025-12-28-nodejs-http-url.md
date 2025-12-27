---
layout: post
title: "Node.js HTTP 서버와 URL 모듈"
date: 2025-12-28
categories: nodejs
tags: [nodejs, http, url, server]
---

Node.js의 HTTP 서버 생성과 URL 파싱에 대해 알아봅니다.

## HTTP 모듈

### 기본 HTTP 서버

```javascript
var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("The date and time are currently: " + dt.myDateTime());
    res.end('Hello World!');
}).listen(8080);
```

### Request 객체

```javascript
req.url  // 도메인 이름 이후의 URL 부분
```

## URL 모듈

URL을 파싱하여 각 부분을 추출할 수 있습니다.

```javascript
var url = require('url');

var adr = 'http://localhost:8080/default.htm?year=2017&month=february';
var q = url.parse(adr, true);

console.log(q.host);      // 'localhost:8080'
console.log(q.pathname);  // '/default.htm'
console.log(q.search);    // '?year=2017&month=february'

var qdata = q.query;      // { year: 2017, month: 'february' }
console.log(qdata.month); // 'february'
```
