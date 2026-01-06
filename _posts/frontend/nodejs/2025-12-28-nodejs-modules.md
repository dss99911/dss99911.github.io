---
layout: post
title: "Node.js 모듈 시스템과 require"
date: 2025-12-28
categories: [frontend, nodejs]
tags: [nodejs, modules, require]
image: /assets/images/posts/thumbnails/2025-12-28-nodejs-modules.png
---

Node.js의 모듈 시스템과 require 사용법에 대해 알아봅니다.

## require vs script src

`require`는 `<script src>`와 다르게:
- `exports`로 내보낸 것만 참조 가능
- 모듈 로딩에 사용

## 모듈 내보내기 (exports)

모듈 파일 (myfirstmodule.js):
```javascript
exports.myDateTime = function () {
    return Date();
};
```

## 모듈 가져오기 (require)

```javascript
var dt = require('./myfirstmodule');
dt.myDateTime();
```

**주의**: require를 호출하면 반환되는 객체는 해당 모듈의 exports 객체입니다.

## 유용한 모듈들

### body-parser
JSON, Raw, Text, URL 인코딩된 폼 데이터를 처리하는 미들웨어

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
multipart/form-data를 처리하는 미들웨어
