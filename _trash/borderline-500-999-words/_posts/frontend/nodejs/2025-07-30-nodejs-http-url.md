---
layout: post
title: "Node.js HTTP 서버와 URL 모듈"
date: 2025-12-28
categories: [frontend, nodejs]
tags: [nodejs, http, url, server]
image: /assets/images/posts/thumbnails/2025-12-28-nodejs-http-url.png
redirect_from:
  - "/frontend/nodejs/2025/12/28/nodejs-http-url.html"
---

Node.js의 HTTP 서버 생성과 URL 파싱에 대해 알아봅니다. Node.js는 내장 HTTP 모듈을 통해 별도의 웹 서버 소프트웨어 없이도 HTTP 서버를 직접 만들 수 있으며, URL 모듈을 함께 활용하면 클라이언트의 요청을 효과적으로 처리할 수 있습니다.

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

`http.createServer()`는 콜백 함수를 인자로 받으며, 클라이언트의 요청이 올 때마다 이 함수가 실행됩니다. `listen(8080)`으로 8080 포트에서 연결을 대기합니다.

### Request 객체

```javascript
req.url     // 도메인 이름 이후의 URL 부분
req.method  // HTTP 메서드 (GET, POST 등)
req.headers // 요청 헤더 객체
```

`req` 객체에는 클라이언트 요청에 대한 다양한 정보가 담겨 있습니다. `req.url`은 가장 많이 사용되는 속성으로, 요청 경로에 따라 다른 응답을 제공하는 라우팅의 기본이 됩니다.

### Response 객체

```javascript
res.writeHead(200, {'Content-Type': 'text/html'});  // 상태 코드와 헤더 설정
res.write('내용');  // 응답 본문 작성 (여러 번 호출 가능)
res.end();          // 응답 종료
```

`res.writeHead()`로 HTTP 상태 코드와 응답 헤더를 설정합니다. `res.write()`는 여러 번 호출하여 응답 본문을 분할 전송할 수 있으며, 반드시 `res.end()`로 응답을 종료해야 합니다.

### 라우팅 기본 구현

```javascript
var http = require('http');

http.createServer(function (req, res) {
    if (req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<h1>홈페이지</h1>');
    } else if (req.url === '/about') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<h1>소개 페이지</h1>');
    } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('<h1>404 Not Found</h1>');
    }
}).listen(8080);
```

이처럼 `req.url`을 분기하여 간단한 라우팅을 구현할 수 있습니다. 실제 프로젝트에서는 Express.js 같은 프레임워크를 사용하여 보다 체계적으로 라우팅을 관리합니다.

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

`url.parse()`의 두 번째 인자를 `true`로 설정하면 쿼리 스트링이 자동으로 객체로 파싱됩니다.

### WHATWG URL API (권장)

`url.parse()`는 레거시 API로, 최신 Node.js에서는 WHATWG URL API를 사용하는 것이 권장됩니다:

```javascript
const myURL = new URL('http://localhost:8080/default.htm?year=2017&month=february');

console.log(myURL.hostname);    // 'localhost'
console.log(myURL.port);        // '8080'
console.log(myURL.pathname);    // '/default.htm'
console.log(myURL.searchParams.get('year'));   // '2017'
console.log(myURL.searchParams.get('month'));  // 'february'
```

`URL` 클래스는 전역으로 사용 가능하며 `require` 없이 바로 사용할 수 있습니다. `searchParams`는 `URLSearchParams` 인스턴스로 쿼리 파라미터를 편리하게 다룰 수 있는 메서드(`get`, `set`, `has`, `forEach` 등)를 제공합니다.

## HTTP 서버와 URL 모듈 결합

실전에서는 HTTP 서버와 URL 모듈을 함께 사용하여 쿼리 파라미터 기반의 동적 응답을 구현합니다:

```javascript
var http = require('http');

http.createServer(function (req, res) {
    var myURL = new URL(req.url, 'http://localhost:8080');
    var name = myURL.searchParams.get('name') || 'World';

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end('<h1>Hello, ' + name + '!</h1>');
}).listen(8080);

// http://localhost:8080/?name=Node 접속 시 "Hello, Node!" 출력
```

## JSON 응답 보내기

REST API를 만들 때는 JSON 형식으로 응답하는 경우가 많습니다:

```javascript
http.createServer(function (req, res) {
    var data = { message: 'Hello', timestamp: Date.now() };

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
}).listen(8080);
```

`Content-Type`을 `application/json`으로 설정하고, `JSON.stringify()`로 객체를 문자열로 변환하여 응답합니다.

## 주의사항

- 내장 HTTP 모듈은 저수준 API이므로, 실제 프로덕션에서는 **Express.js**나 **Koa** 같은 프레임워크 사용을 권장합니다
- `res.end()`를 호출하지 않으면 클라이언트가 응답을 계속 기다리게 되므로 반드시 호출해야 합니다
- `Content-Type` 헤더를 올바르게 설정해야 브라우저가 응답을 정확히 해석할 수 있습니다
- 한글을 포함한 응답을 보낼 때는 `charset=utf-8`을 명시하는 것이 좋습니다
