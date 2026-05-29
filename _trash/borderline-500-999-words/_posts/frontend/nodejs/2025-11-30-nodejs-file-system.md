---
layout: post
title: "Node.js 파일 시스템 (fs 모듈)"
date: 2025-12-28
categories: [frontend, nodejs]
tags: [nodejs, filesystem, fs]
image: /assets/images/posts/thumbnails/2025-12-28-nodejs-file-system.png
redirect_from:
  - "/frontend/nodejs/2025/12/28/nodejs-file-system.html"
---

Node.js의 파일 시스템 모듈(fs)을 사용한 파일 읽기, 쓰기, 삭제 등의 작업을 알아봅니다. fs 모듈은 Node.js에 내장된 핵심 모듈로, 서버 사이드에서 파일과 디렉토리를 다루는 모든 작업을 지원합니다.

## fs 모듈 가져오기

```javascript
var fs = require('fs');
```

fs 모듈의 모든 메서드는 **비동기(Asynchronous)**와 **동기(Synchronous)** 두 가지 버전을 제공합니다. 비동기 메서드는 콜백을 받으며, 동기 메서드는 이름 끝에 `Sync`가 붙습니다.

## 파일 읽기

```javascript
fs.readFile('demofile1.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
});
```

`readFile()`은 파일 전체를 메모리에 읽어옵니다. 두 번째 인자로 인코딩을 지정할 수 있으며, 생략하면 Buffer 객체가 반환됩니다:

```javascript
// 텍스트 파일을 문자열로 읽기
fs.readFile('data.txt', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);  // 문자열로 출력
});

// 동기 방식으로 읽기
var data = fs.readFileSync('data.txt', 'utf8');
console.log(data);
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

파일이 존재하지 않으면 새로 생성합니다. 기존 파일이 있으면 내용 끝에 이어서 추가합니다.

### 파일 덮어쓰기
```javascript
fs.writeFile('mynewfile3.txt', 'Hello content!', function (err) {
    if (err) throw err;
    console.log('Saved!');
});
```

기존 파일이 있으면 내용을 완전히 덮어씁니다. 파일이 없으면 새로 생성합니다.

### JSON 파일 다루기

설정 파일이나 데이터 저장에 자주 사용되는 패턴입니다:

```javascript
// JSON 파일 쓰기
var config = { host: 'localhost', port: 3000 };
fs.writeFile('config.json', JSON.stringify(config, null, 2), function(err) {
    if (err) throw err;
    console.log('Config saved!');
});

// JSON 파일 읽기
fs.readFile('config.json', 'utf8', function(err, data) {
    if (err) throw err;
    var config = JSON.parse(data);
    console.log(config.host);  // 'localhost'
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

파일 이동에도 사용할 수 있습니다. 대상 경로를 다른 디렉토리로 지정하면 됩니다.

## 파일 열기

```javascript
fs.open('mynewfile2.txt', 'w', function (err, file) {
    if (err) throw err;
    console.log('Saved!');
});
```

두 번째 인자는 파일 열기 모드(flag)입니다:

| Flag | 설명 |
|------|------|
| `r` | 읽기 모드 (파일이 없으면 에러) |
| `w` | 쓰기 모드 (파일이 없으면 생성, 있으면 덮어쓰기) |
| `a` | 추가 모드 (파일이 없으면 생성) |
| `r+` | 읽기/쓰기 모드 |

## 디렉토리 작업

```javascript
// 디렉토리 생성
fs.mkdir('newdir', function(err) {
    if (err) throw err;
    console.log('Directory created!');
});

// 디렉토리 내 파일 목록
fs.readdir('./', function(err, files) {
    if (err) throw err;
    files.forEach(function(file) {
        console.log(file);
    });
});

// 디렉토리 삭제 (비어있을 때만)
fs.rmdir('newdir', function(err) {
    if (err) throw err;
    console.log('Directory removed!');
});
```

## 파일 정보 확인

```javascript
fs.stat('myfile.txt', function(err, stats) {
    if (err) throw err;
    console.log('Is file:', stats.isFile());
    console.log('Is directory:', stats.isDirectory());
    console.log('File size:', stats.size, 'bytes');
    console.log('Last modified:', stats.mtime);
});
```

## 파일 존재 여부 확인

```javascript
// 권장 방식: fs.access 사용
fs.access('myfile.txt', fs.constants.F_OK, function(err) {
    if (err) {
        console.log('File does not exist');
    } else {
        console.log('File exists');
    }
});
```

`fs.exists()`는 deprecated 되었으므로, `fs.access()`를 사용하는 것이 권장됩니다.

## Promise 기반 사용 (권장)

Node.js 10+부터는 `fs.promises` API를 사용하여 async/await 패턴으로 깔끔하게 작성할 수 있습니다:

```javascript
const fs = require('fs').promises;

async function processFile() {
    try {
        const data = await fs.readFile('input.txt', 'utf8');
        await fs.writeFile('output.txt', data.toUpperCase());
        console.log('File processed!');
    } catch (err) {
        console.error('Error:', err);
    }
}

processFile();
```

콜백 지옥을 피하고 에러 처리도 깔끔하게 할 수 있어 현대적인 Node.js 프로젝트에서 권장되는 방식입니다.
