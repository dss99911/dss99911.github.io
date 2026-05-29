---
layout: post
title: "Node.js 기초 - 실행, 인자, 로그, 이벤트, 종료"
date: 2025-12-28
categories: [frontend, nodejs]
tags: [nodejs, javascript, basics]
image: /assets/images/posts/thumbnails/2025-12-28-nodejs-basics.png
redirect_from:
  - "/frontend/nodejs/2025/12/28/nodejs-basics.html"
---

Node.js의 기본적인 사용법에 대해 알아봅니다.

## 로컬 실행

```bash
node test.js
```

## 명령줄 인자 (Arguments)

```javascript
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
});
```

결과:
```
node chrome.js aa
0: /usr/local/bin/node
1: /path/to/chrome.js
2: aa
```

## 로그 출력

```javascript
console.log('This example is different!');
console.log("Example app listening at http://%s:%s", host, port);
```

## 이벤트 (Observer 패턴)

```javascript
var events = require('events');
var eventEmitter = new events.EventEmitter();

// 이벤트 핸들러 생성
var myEventHandler = function () {
    console.log('I hear a scream!');
}

// 이벤트에 핸들러 할당
eventEmitter.on('scream', myEventHandler);

// 'scream' 이벤트 발생
eventEmitter.emit('scream');
```

## 프로세스 종료

```javascript
process.exit([code])
```

---

## 모듈 시스템

Node.js는 모듈 시스템을 통해 코드를 분리하고 재사용합니다.

### CommonJS (require/module.exports)

```javascript
// math.js - 모듈 정의
function add(a, b) {
    return a + b;
}

function multiply(a, b) {
    return a * b;
}

module.exports = { add, multiply };

// app.js - 모듈 사용
var math = require('./math');
console.log(math.add(2, 3));       // 5
console.log(math.multiply(4, 5));  // 20
```

### 내장 모듈 사용

Node.js는 다양한 내장 모듈을 제공합니다:

```javascript
var fs = require('fs');       // 파일 시스템
var path = require('path');   // 경로 처리
var http = require('http');   // HTTP 서버/클라이언트
var os = require('os');       // 운영 체제 정보
var url = require('url');     // URL 파싱
```

---

## 파일 시스템 (fs 모듈)

### 파일 읽기

```javascript
var fs = require('fs');

// 비동기 읽기
fs.readFile('data.txt', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
});

// 동기 읽기
var data = fs.readFileSync('data.txt', 'utf8');
console.log(data);
```

### 파일 쓰기

```javascript
// 비동기 쓰기 (파일 생성 또는 덮어쓰기)
fs.writeFile('output.txt', 'Hello Node.js!', function(err) {
    if (err) throw err;
    console.log('File written successfully');
});

// 파일에 내용 추가
fs.appendFile('output.txt', '\nNew line', function(err) {
    if (err) throw err;
    console.log('Content appended');
});
```

### 디렉토리 작업

```javascript
// 디렉토리 생성
fs.mkdir('new_folder', { recursive: true }, function(err) {
    if (err) throw err;
});

// 디렉토리 내용 읽기
fs.readdir('./', function(err, files) {
    if (err) throw err;
    files.forEach(function(file) {
        console.log(file);
    });
});

// 파일/디렉토리 삭제
fs.unlink('file.txt', function(err) {
    if (err) throw err;
});
```

---

## HTTP 서버 생성

Node.js의 핵심 기능 중 하나는 HTTP 서버를 쉽게 생성할 수 있다는 점입니다:

```javascript
var http = require('http');

var server = http.createServer(function(req, res) {
    // 요청 URL에 따라 라우팅
    if (req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<h1>Home Page</h1>');
    } else if (req.url === '/api/data') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: 'Hello API' }));
    } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('<h1>404 Not Found</h1>');
    }
});

server.listen(3000, function() {
    console.log('Server running on port 3000');
});
```

---

## 환경 변수

```javascript
// 환경 변수 읽기
var port = process.env.PORT || 3000;
var nodeEnv = process.env.NODE_ENV || 'development';

console.log('Port:', port);
console.log('Environment:', nodeEnv);
```

실행 시 환경 변수 설정:

```bash
PORT=8080 NODE_ENV=production node app.js
```

---

## 비동기 처리 패턴

Node.js에서 비동기 처리는 핵심 개념입니다.

### 콜백 패턴

```javascript
function fetchData(callback) {
    setTimeout(function() {
        callback(null, 'Data loaded');
    }, 1000);
}

fetchData(function(err, data) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});
```

### Promise 패턴

```javascript
function fetchData() {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve('Data loaded');
        }, 1000);
    });
}

fetchData()
    .then(function(data) {
        console.log(data);
    })
    .catch(function(err) {
        console.error(err);
    });
```

### async/await 패턴

```javascript
async function loadData() {
    try {
        var data = await fetchData();
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

loadData();
```

---

## NPM (Node Package Manager)

### 프로젝트 초기화

```bash
npm init          # 대화형 초기화
npm init -y       # 기본값으로 초기화
```

### 패키지 설치

```bash
npm install express           # 프로덕션 의존성
npm install --save-dev jest   # 개발 의존성
npm install -g nodemon        # 글로벌 설치
```

### 자주 사용하는 명령어

| 명령어 | 설명 |
|--------|------|
| `npm install` | package.json의 모든 의존성 설치 |
| `npm start` | package.json의 start 스크립트 실행 |
| `npm test` | 테스트 스크립트 실행 |
| `npm run <script>` | 커스텀 스크립트 실행 |
| `npm list` | 설치된 패키지 목록 |
| `npm outdated` | 업데이트 가능한 패키지 확인 |

---

## 에러 처리

Node.js에서 에러 처리는 애플리케이션의 안정성을 위해 매우 중요합니다:

```javascript
// 처리되지 않은 예외 캐치 (마지막 방어선)
process.on('uncaughtException', function(err) {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
});

// 처리되지 않은 Promise rejection 캐치
process.on('unhandledRejection', function(reason, promise) {
    console.error('Unhandled Rejection:', reason);
});
```

`uncaughtException` 이벤트는 마지막 방어선으로만 사용하고, 가능한 한 try-catch나 Promise의 catch 핸들러로 에러를 처리하는 것이 좋습니다.
