---
layout: post
title: "Node.js 파일 시스템 (fs 모듈)"
date: 2025-12-28
categories: nodejs
tags: [nodejs, filesystem, fs]
---

Node.js의 파일 시스템 모듈(fs)을 사용한 파일 읽기, 쓰기, 삭제 등의 작업을 알아봅니다.

## fs 모듈 가져오기

```javascript
var fs = require('fs');
```

## 파일 읽기

```javascript
fs.readFile('demofile1.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
});
```

### HTTP 서버와 함께 사용

```javascript
http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;

    fs.readFile(filename, function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
}).listen(8080);
```

## 파일 쓰기

### 파일 끝에 추가
```javascript
fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
    if (err) throw err;
    console.log('Saved!');
});
```

### 파일 덮어쓰기
```javascript
fs.writeFile('mynewfile3.txt', 'Hello content!', function (err) {
    if (err) throw err;
    console.log('Saved!');
});
```

## 파일 삭제

```javascript
fs.unlink('mynewfile2.txt', function (err) {
    if (err) throw err;
    console.log('File deleted!');
});
```

## 파일 이름 변경

```javascript
fs.rename('mynewfile1.txt', 'myrenamedfile.txt', function (err) {
    if (err) throw err;
    console.log('File Renamed!');
});
```

## 파일 열기

```javascript
fs.open('mynewfile2.txt', 'w', function (err, file) {
    if (err) throw err;
    console.log('Saved!');
});
```
