---
layout: post
title: "PhantomJS 고급 기능 - 캐시, 쿠키, 파일, 스크립트 주입, 디버깅"
date: 2025-12-28 15:12:00 +0900
categories: [infra, automation]
tags: [phantomjs, web-automation, headless-browser, javascript]
description: "PhantomJS의 고급 기능인 캐시 관리, 쿠키 처리, 파일 시스템, 외부 스크립트 주입, 디버깅 방법을 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-phantomjs-advanced.png
---

PhantomJS의 고급 기능들을 다룹니다. 캐시 관리, 쿠키 처리, 파일 시스템 접근, 외부 스크립트 주입, 디버깅 방법을 알아봅니다.

> **Deprecated 알림**: PhantomJS는 2018년 이후 더 이상 활발히 개발되지 않습니다. 레거시 시스템 유지보수나 참조 목적으로 이 정보를 제공합니다.

## 캐시 (Cache)

디스크 캐시를 활성화하면 이미지 등의 리소스를 재다운로드하지 않습니다.

### 캐시 활성화

```bash
# 캐시 크기 단위: kilobyte
phantomjs --disk-cache=true --max-disk-cache-size=4000 script.js
```

### 캐시 동작 확인

캐시가 활성화되면 서버에서 `304 Not Modified` 응답을 받습니다.

```
# 첫 번째 요청 (캐시 없음)
GET /images/image1.jpg 200 4ms - 264.64kb
GET /images/image2.jpg 200 8ms - 615.21kb

# 두 번째 요청 (캐시 사용)
GET /images/image1.jpg 304 3ms
GET /images/image2.jpg 304 3ms
```

### 캐시 저장 위치

macOS의 경우:
```
~/Library/Caches/Ofi Labs/PhantomJS/data7
```

## 쿠키 (Cookie)

### 쿠키 추가

```javascript
var page = require('webpage').create();

page.open('http://localhost/test.html', function(status) {
  if (status === 'success') {
    phantom.addCookie({
      name: 'cookie1',
      value: '1',
      domain: 'localhost'
    });
    phantom.addCookie({
      name: 'cookie2',
      value: '2',
      domain: 'localhost'
    });
    phantom.addCookie({
      name: 'cookie3',
      value: '3',
      domain: 'localhost'
    });

    console.log('Added 3 cookies');
    console.log('Total cookies: ' + phantom.cookies.length);
  } else {
    console.error('Cannot open file');
    phantom.exit(1);
  }
});
```

### 쿠키 파일 지정

쿠키를 파일로 저장하고 세션 간에 유지합니다.

```bash
phantomjs --cookies-file=cookie-jar.txt script.js
```

더 많은 쿠키 관련 메서드는 [PhantomJS Methods](https://www.tutorialspoint.com/phantomjs/phantomjs_methods.htm)를 참고하세요.

## 파일 시스템 (File System)

PhantomJS는 `fs` 모듈을 통해 파일 시스템에 접근할 수 있습니다.

### 주요 메서드

- `fs.exists(path)` - 파일/디렉토리 존재 여부
- `fs.isWritable(path)` - 쓰기 가능 여부
- `fs.makeDirectory(path)` - 디렉토리 생성
- `fs.write(path, content, mode)` - 파일 쓰기
- `fs.open(path, mode)` - 파일 열기
- `fs.changeWorkingDirectory(path)` - 작업 디렉토리 변경

### 파일 쓰기

```javascript
var fs        = require('fs'),
    targetDir = 'foo-log';

if (!fs.exists(targetDir)) {
  console.log('Creating directory ' + targetDir);
  fs.makeDirectory(targetDir);
}

if (!fs.isWritable(targetDir)) {
  console.error(targetDir + ' is not writable!');
  phantom.exit(1);
}

console.log('Writing file...');
var currentTime = new Date().getTime();
fs.write(targetDir + fs.separator + currentTime + '.txt',
  'Current time is ' + currentTime, 'w');

phantom.exit();
```

### 파일 읽기

```javascript
phantom.onError = function(message, trace) {
  console.error('[Something went wrong!] - ' + message);
  phantom.exit(1);
};

var fs    = require('fs'),
    _name = 'readme.txt',
    path  = require('system').args[0].split(fs.separator),
    file;

// 스크립트가 있는 디렉토리로 이동
path = path.slice(0, path.length - 1).join(fs.separator);
fs.changeWorkingDirectory(path);

file = fs.open(_name, 'r');

console.log('[Reading ' + _name + '...]');
while (!file.atEnd()) {
  console.log(file.readLine());
}

console.log('[Closing ' + _name + '.]');
file.close();
```

## 스크립트 주입 (Include & Inject)

외부 JavaScript 파일을 로드하는 두 가지 방법이 있습니다.

### injectJs - 로컬 스크립트

`<script src>` 태그와 유사하게 로컬 스크립트를 주입합니다. 모듈의 경우 `require` 메서드를 사용하세요.

```javascript
console.log('Initial libraryPath: ' + phantom.libraryPath);

// 라이브러리 경로 변경
phantom.libraryPath = phantom.libraryPath.replace(/chapter02$/, 'lib');

console.log('Updated libraryPath: ' + phantom.libraryPath);

var isInjected = phantom.injectJs('hemingway.js');

if (isInjected) {
  console.log('Script was successfully injected.');
  // hemingway.js에 정의된 함수 사용
  console.log('Give me some Fibonacci numbers! ' +
    fibonacci(Math.round(Math.random() * 10) + 1));
  phantom.exit();
} else {
  console.log('Failed to inject script.');
  phantom.exit(1);
}
```

### includeJs - 원격 스크립트

CDN 등에서 원격 스크립트를 로드합니다.

```javascript
var webPage = require('webpage');
var page = webPage.create();

page.open('http://www.example.com', function(status) {
  if (status === "success") {
    // 원격에서 jQuery 로드
    page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function() {
      // 로컬 스크립트 주입
      if (page.injectJs('do.js')) {
        return returnTitle();
      }
    });

    console.log(title);
    phantom.exit();
  }
});

// do.js 내용
window.returnTitle = function() {
  return document.title;
};
```

## 디버깅 (Debug)

Safari를 사용한 원격 디버깅이 가능합니다.

### 디버거 실행

```bash
phantomjs --remote-debugger-port=9000 --remote-debugger-autorun=true script.js
```

- `--remote-debugger-autorun=true`: 스크립트 자동 실행
- `--remote-debugger-autorun=false`: 수동 실행 (디버거 연결 후)

### 디버거 접속

브라우저에서 접속:
```
http://localhost:9000
```

**주의**: Chrome 콘솔은 호환되지 않습니다. Safari를 사용하세요.

### 스크립트 재실행

디버거 콘솔에서:
```javascript
__run()
```

## 관련 포스트

- [PhantomJS 기초](/automation/2025/12/28/phantomjs-basics.html) - 설치, 설정, 인자 처리
- [PhantomJS 웹페이지 조작](/automation/2025/12/28/phantomjs-webpage.html) - 페이지 열기, POST 요청, JavaScript 실행
