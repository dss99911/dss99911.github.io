---
layout: post
title: "Express.js 프레임워크 완전 가이드"
date: 2025-12-28
categories: nodejs
tags: [nodejs, express, routing, web-framework]
---

Express.js는 Node.js의 웹 프레임워크로, URL 경로별로 처리를 분리(Routing)할 수 있습니다.

## 기본 라우팅

```javascript
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/abc', function (req, res) {
    res.send('Hello World');
});

app.get('/index.htm', function (req, res) {
    res.sendFile(__dirname + "/" + "index.htm");
});

// GET 파라미터 처리
app.get('/process_get', function (req, res) {
    response = {
        first_name: req.query.first_name,
        last_name: req.query.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
});

// post, delete 등도 사용 가능

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
```

## GET 파라미터 가져오기

URL: `http://localhost:3000/?query=aa`

```javascript
router.get('/', function(req, res, next) {
    req.query['query'];
});
```

## 정적 파일 제공

```javascript
app.use(express.static('public'));
// public/images/logo.png => localhost:8080/images/logo.png
```

## POST 처리

```javascript
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/result', urlencodedParser, function (req, res) {
    console.log(req.body);  // form 내부 변수들이 body로 들어옴
});
```

## 파일 업로드

```javascript
var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}));

app.get('/index.htm', function (req, res) {
    res.sendFile(__dirname + "/" + "index.htm");
});

app.post('/file_upload', function (req, res) {
    console.log(req.files.file.name);
    console.log(req.files.file.path);
    console.log(req.files.file.type);

    var file = __dirname + "/" + req.files.file.name;

    fs.readFile(req.files.file.path, function (err, data) {
        fs.writeFile(file, data, function (err) {
            if(err) {
                console.log(err);
            } else {
                response = {
                    message: 'File uploaded successfully',
                    filename: req.files.file.name
                };
            }
            console.log(response);
            res.end(JSON.stringify(response));
        });
    });
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
```

## 라우터 분리

### 메인 파일

```javascript
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use('/', index);      // 라우터와 URL 주소를 매핑
app.use('/users', users);
```

### routes/index.js

```javascript
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
```

## 템플릿 엔진

Express와 함께 사용할 수 있는 템플릿 엔진:
- [Pug](https://pugjs.org/api/getting-started.html)
- [Mustache](https://www.npmjs.com/package/mustache)
- [EJS](https://www.npmjs.com/package/ejs)
- [Jade](https://www.npmjs.com/package/jade) (Express generator 기본값)

### EJS 설정

```javascript
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
```
