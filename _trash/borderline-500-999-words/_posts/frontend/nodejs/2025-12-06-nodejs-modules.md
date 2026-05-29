---
layout: post
title: "Node.js 모듈 시스템과 require"
date: 2025-12-28
categories: [frontend, nodejs]
tags: [nodejs, modules, require]
image: /assets/images/posts/thumbnails/2025-12-28-nodejs-modules.png
redirect_from:
  - "/frontend/nodejs/2025/12/28/nodejs-modules.html"
---

Node.js의 모듈 시스템과 require 사용법에 대해 알아봅니다. 모듈 시스템은 코드를 기능 단위로 분리하여 재사용성과 유지보수성을 높이는 Node.js의 핵심 기능입니다.

## require vs script src

브라우저에서 `<script src>`로 파일을 로드하면 해당 파일의 모든 전역 변수와 함수가 공유됩니다. 반면 Node.js의 `require`는:
- `exports`로 내보낸 것만 참조 가능
- 각 모듈은 자체 스코프를 가져 변수 충돌 방지
- 모듈은 처음 로드 시 캐싱되어 이후 require 호출 시 재사용

## 모듈 내보내기 (exports)

모듈 파일 (myfirstmodule.js):
```javascript
exports.myDateTime = function () {
    return Date();
};
```

### exports vs module.exports

여러 개의 함수나 값을 내보낼 때는 `exports`를 사용합니다:

```javascript
// utils.js
exports.add = function(a, b) { return a + b; };
exports.subtract = function(a, b) { return a - b; };
exports.PI = 3.14159;
```

단일 값(클래스, 함수 등)을 내보낼 때는 `module.exports`를 사용합니다:

```javascript
// logger.js
function Logger(name) {
    this.name = name;
}

Logger.prototype.log = function(message) {
    console.log('[' + this.name + '] ' + message);
};

module.exports = Logger;
```

```javascript
// 사용할 때
var Logger = require('./logger');
var logger = new Logger('App');
logger.log('시작합니다');  // [App] 시작합니다
```

**주의사항**: `exports`는 `module.exports`의 참조(shortcut)입니다. `exports`에 직접 새 객체를 할당하면(`exports = ...`) 참조가 끊어지므로, 단일 값을 내보낼 때는 반드시 `module.exports`를 사용해야 합니다.

## 모듈 가져오기 (require)

```javascript
var dt = require('./myfirstmodule');
dt.myDateTime();
```

**주의**: require를 호출하면 반환되는 객체는 해당 모듈의 exports 객체입니다.

### require 경로 규칙

```javascript
require('./myfirstmodule')    // 현재 디렉토리의 파일 (.js 확장자 생략 가능)
require('../utils/helper')    // 상대 경로
require('/home/user/module')  // 절대 경로
require('express')            // node_modules에서 검색
```

경로가 `./`나 `../`로 시작하지 않으면 Node.js는 `node_modules` 폴더에서 패키지를 검색합니다. 현재 디렉토리부터 시작하여 루트까지 상위 디렉토리의 `node_modules`를 순차적으로 탐색합니다.

## ES Modules (import/export)

Node.js 12+부터는 ES 모듈 문법도 지원합니다. `package.json`에 `"type": "module"`을 설정하거나 `.mjs` 확장자를 사용합니다:

```javascript
// math.mjs (또는 package.json에 "type": "module" 설정)
export function add(a, b) { return a + b; }
export default function multiply(a, b) { return a * b; }

// app.mjs
import multiply, { add } from './math.mjs';
console.log(add(1, 2));       // 3
console.log(multiply(3, 4));  // 12
```

새 프로젝트에서는 ES Modules 사용이 권장되지만, 기존 npm 패키지 대부분이 CommonJS(`require`) 방식이므로 두 방식 모두 이해해야 합니다.

## 유용한 모듈들

### body-parser
JSON, Raw, Text, URL 인코딩된 폼 데이터를 처리하는 미들웨어

```javascript
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());                         // JSON 파싱
app.use(bodyParser.urlencoded({ extended: true }));  // 폼 데이터 파싱

app.post('/api/users', function(req, res) {
    console.log(req.body);  // POST 데이터 접근
    res.json({ status: 'ok' });
});
```

참고로 Express 4.16+부터는 `express.json()`과 `express.urlencoded()`가 내장되어 별도 설치 없이 사용 가능합니다.

### cookie-parser
Cookie 헤더를 파싱하여 req.cookies에 쿠키 이름으로 접근 가능

```javascript
var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser());

app.get('/', function(req, res) {
    console.log("Cookies: ", req.cookies);
});

app.listen(8081);
```

### multer
multipart/form-data를 처리하는 미들웨어로, 파일 업로드에 주로 사용됩니다:

```javascript
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('photo'), function(req, res) {
    console.log(req.file);   // 업로드된 파일 정보
    console.log(req.body);   // 텍스트 필드 데이터
    res.send('File uploaded!');
});
```

## 내장 모듈 정리

Node.js에는 별도 설치 없이 사용할 수 있는 유용한 내장 모듈이 있습니다:

| 모듈 | 설명 |
|------|------|
| `fs` | 파일 시스템 작업 |
| `http` | HTTP 서버 및 클라이언트 |
| `path` | 파일 경로 처리 |
| `os` | 운영 체제 정보 |
| `crypto` | 암호화 기능 |
| `events` | 이벤트 기반 프로그래밍 |
| `stream` | 스트림 데이터 처리 |
| `url` | URL 파싱 |
