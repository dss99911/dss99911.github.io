---
layout: post
title: "Node.js Formidable을 이용한 파일 업로드"
date: 2025-01-14
categories: [frontend, nodejs]
tags: [nodejs, file-upload, formidable]
image: /assets/images/posts/thumbnails/2025-12-28-nodejs-formidable.png
redirect_from:
  - "/frontend/nodejs/2025/12/28/nodejs-formidable.html"
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

---

## Formidable 설치

npm을 통해 설치합니다:

```bash
npm install formidable
```

---

## 고급 옵션 설정

Formidable은 다양한 옵션을 제공하여 파일 업로드 동작을 세밀하게 제어할 수 있습니다:

```javascript
var form = new formidable.IncomingForm();

// 업로드 디렉토리 지정
form.uploadDir = '/tmp/uploads';

// 원본 파일명 유지 (기본값은 임시 이름)
form.keepExtensions = true;

// 최대 파일 크기 제한 (바이트 단위, 기본값 200MB)
form.maxFileSize = 10 * 1024 * 1024;  // 10MB

// 최대 필드 수
form.maxFields = 1000;

// 최대 필드 크기 (바이트)
form.maxFieldsSize = 20 * 1024 * 1024;  // 20MB

// 다중 파일 업로드 허용
form.multiples = true;
```

---

## 다중 파일 업로드 처리

여러 파일을 한 번에 업로드할 때의 처리 방법입니다:

```javascript
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');

http.createServer(function (req, res) {
    if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
        var form = new formidable.IncomingForm();
        form.multiples = true;
        form.uploadDir = path.join(__dirname, '/uploads');
        form.keepExtensions = true;

        form.parse(req, function (err, fields, files) {
            if (err) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('Upload error: ' + err.message);
                return;
            }

            // multiples가 true이면 files.upload이 배열일 수 있음
            var uploadedFiles = Array.isArray(files.upload)
                ? files.upload
                : [files.upload];

            uploadedFiles.forEach(function(file) {
                console.log('Uploaded: ' + file.name + ' (' + file.size + ' bytes)');
            });

            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(uploadedFiles.length + ' file(s) uploaded successfully');
        });
    } else {
        // 다중 파일 업로드 폼
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="/upload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="upload" multiple><br><br>');
        res.write('<input type="submit" value="Upload Files">');
        res.write('</form>');
        res.end();
    }
}).listen(8080);
```

---

## 이벤트 기반 처리

Formidable은 이벤트 기반 API도 제공합니다. 대용량 파일 업로드 시 진행 상황을 추적할 때 유용합니다:

```javascript
var form = new formidable.IncomingForm();

// 업로드 진행률 추적
form.on('progress', function(bytesReceived, bytesExpected) {
    var percent = (bytesReceived / bytesExpected * 100).toFixed(2);
    console.log('Upload progress: ' + percent + '%');
});

// 각 파일 수신 시작
form.on('fileBegin', function(name, file) {
    console.log('Starting upload: ' + file.name);
});

// 각 파일 수신 완료
form.on('file', function(name, file) {
    console.log('Received: ' + file.name + ' -> ' + file.path);
});

// 일반 폼 필드 수신
form.on('field', function(name, value) {
    console.log('Field: ' + name + ' = ' + value);
});

// 전체 파싱 완료
form.on('end', function() {
    console.log('All files uploaded successfully');
});

// 에러 처리
form.on('error', function(err) {
    console.error('Upload error: ' + err.message);
});

form.parse(req);
```

---

## Express와 함께 사용하기

Express 프레임워크에서 Formidable을 사용하는 패턴입니다:

```javascript
var express = require('express');
var formidable = require('formidable');
var path = require('path');
var app = express();

app.post('/api/upload', function(req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, 'uploads');
    form.keepExtensions = true;
    form.maxFileSize = 5 * 1024 * 1024; // 5MB

    form.parse(req, function(err, fields, files) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        res.json({
            message: 'Upload successful',
            fields: fields,
            file: {
                name: files.filetoupload.name,
                size: files.filetoupload.size,
                type: files.filetoupload.type
            }
        });
    });
});

app.listen(3000);
```

---

## 파일 업로드 시 주의사항

| 항목 | 설명 |
|------|------|
| 파일 크기 제한 | `maxFileSize` 옵션으로 반드시 제한 설정 |
| 파일 타입 검증 | `file.type`을 확인하여 허용된 MIME 타입만 처리 |
| 파일명 처리 | 원본 파일명에 특수문자가 포함될 수 있으므로 sanitize 필요 |
| 임시 파일 정리 | 사용 후 임시 디렉토리의 파일 정리 필요 |
| 보안 | 업로드된 파일을 웹 서버의 public 디렉토리 외부에 저장 |

파일 타입을 검증하는 예시:

```javascript
form.on('fileBegin', function(name, file) {
    var allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        form.emit('error', new Error('File type not allowed: ' + file.type));
    }
});
```

실무에서는 보안을 위해 업로드된 파일의 확장자뿐 아니라 실제 파일 내용(매직 바이트)도 검증하는 것이 좋습니다.
