---
layout: post
title: "Node.js 기초 - 실행, 인자, 로그, 이벤트, 종료"
date: 2025-12-28
categories: [frontend, nodejs]
tags: [nodejs, javascript, basics]
image: /assets/images/posts/thumbnails/2025-12-28-nodejs-basics.png
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
