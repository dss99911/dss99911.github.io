---
layout: post
title: "Node.js Formidable을 이용한 파일 업로드"
date: 2025-12-28
categories: [frontend, nodejs]
tags: [nodejs, file-upload, formidable]
---

Formidable 모듈을 사용하여 Node.js에서 파일 업로드를 처리하는 방법을 알아봅니다.

## 기본 사용법

```javascript
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();

        form.parse(req, function (err, fields, files) {
            var oldpath = files.filetoupload.path;
            var newpath = 'C:/Users/Your Name/' + files.filetoupload.name;

            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded and moved!');
                res.end();
            });
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }
}).listen(8080);
```

## 주요 포인트

1. `formidable.IncomingForm()`으로 폼 파서 생성
2. `form.parse()`로 요청 파싱
3. `files.filetoupload.path`: 임시 파일 경로
4. `files.filetoupload.name`: 원본 파일명
5. `fs.rename()`으로 원하는 위치로 파일 이동
