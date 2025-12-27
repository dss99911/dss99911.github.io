---
layout: post
title: "PhantomJS 완벽 가이드 - 헤드리스 브라우저 자동화"
date: 2025-12-28 12:20:00 +0900
categories: automation
tags: [phantomjs, javascript, web-scraping, automation, headless-browser]
description: "PhantomJS를 사용한 웹 자동화 방법을 알아봅니다. 설치부터 웹페이지 제어, 디버깅까지 전체 과정을 다룹니다."
---

PhantomJS는 헤드리스 WebKit 브라우저로, 웹 페이지 자동화, 스크래핑, 테스트 등에 활용됩니다. 이 글에서는 PhantomJS의 설치부터 실전 활용까지 정리합니다.

> **참고**: PhantomJS는 더 이상 활발히 개발되지 않으며, Puppeteer나 Playwright 같은 현대적인 대안을 고려해 보세요.

## 설치 (Install)

### Homebrew로 설치

```bash
brew update && brew install phantomjs
```

### 직접 다운로드

[PhantomJS 다운로드](http://phantomjs.org/download)에서 다운로드 후 `/usr/local/bin`에 추가합니다.

## 설정 (Configuration)

### 명령줄 옵션

```bash
phantomjs --cookies-file=jar-of-cookies.txt script.js
```

### JSON 설정 파일

명령줄 인자 대신 JSON 파일로 설정할 수 있습니다.

```bash
phantomjs --config=config.json script.js
```

**config.json**:
```json
{
  "cookiesFile": "cookie-jar.txt",
  "ignoreSslErrors": true
}
```

`cookiesFile`은 `--cookies-file` 옵션과 동일합니다.

## 웹페이지 열기 (Webpage)

### 기본 사용법

```javascript
var webpage = require('webpage').create();

webpage.open('http://example.com/', function(status) {
  switch (status) {
    case 'success':
      console.log('webpage opened successfully');
      phantom.exit(0);
      break;
    case 'fail':
      console.error('webpage did not open successfully');
      phantom.exit(1);
      break;
    default:
      console.error('webpage opened with unknown status: ' + status);
      phantom.exit(1);
  }
});
```

### POST 요청

```javascript
var webpage  = require('webpage').create(),
    url      = 'http://localhost:3000/post-demo',
    postData = JSON.stringify({
      "foo": "bar",
      "now": new Date().getTime()
    });

webpage.customHeaders = { "Content-Type": "application/json" };

webpage.onInitialized = function() {
  webpage.customHeaders = {}; // 첫 번째 URL에만 헤더 적용
};

webpage.open(url, 'POST', postData, function(status) {
  if (status === 'fail') {
    console.error('Something went wrong posting to ' + url);
    phantom.exit(1);
  }

  console.log('Successful post to ' + url);
  phantom.exit(0);
});
```

## 이벤트 콜백 (Event Callbacks)

리소스 수신 이벤트 등을 처리할 수 있습니다.

```javascript
wpage.onResourceReceived = function(res) {
  if (res.stage === 'end') {
    count++;
    console.log(count);
  }
};
```

더 많은 이벤트는 [PhantomJS Webpage Events](https://www.tutorialspoint.com/phantomjs/phantomjs_webpage_module_events_callbacks.htm)를 참고하세요.

## JavaScript 실행 (Evaluate)

### evaluateJavaScript

```javascript
var wpage = require('webpage').create();
wpage.open('http://localhost/test.html', function(status) {
  var script1 = "function(){ var a = document.title; return a;}";
  var value = wpage.evaluateJavaScript(script1);
  console.log(value);
  phantom.exit();
});
```

### evaluate (인자 전달)

```javascript
var titles = webpage.evaluate(function(selector) {
  var titles  = [],
      forEach = Array.prototype.forEach,
      nodes   = document.querySelectorAll(selector);

  forEach.call(nodes, function(el) {
    titles.push(el.innerText);
  });
  return titles;
}, '.post h2');
```

## 에러 처리 (Error Handling)

### 전역 에러 핸들러

```javascript
phantom.onError = function(message, trace) {
  console.error('[PHANTOMJS ERROR] ' + message);
  trace.forEach(function(t) {
    console.error('  >> [' + t.line + '] ' +
      (t.function ? '[' + t.function + '] ' : '') +
      t.file || t.sourceURL);
  });
  phantom.exit(1);
};
```

### 연결 실패 처리

```javascript
webpage.open('http://example.com/', function(status) {
  if (status === 'fail') {
    console.error('Failed to open requested page.');
    phantom.exit(1);
  }
});
```

## 디버깅 (Debug)

Safari를 사용한 원격 디버깅이 가능합니다.

```bash
phantomjs --remote-debugger-port=9000 --remote-debugger-autorun=true script.js
```

**주의**: Chrome 콘솔은 작동하지 않으므로 Safari를 사용하세요.

### 디버거 접속

브라우저에서 접속:
```
localhost:9000
```

### 스크립트 재실행

```javascript
__run()
```

`--debugger-autorun=false`로 설정하면 스크립트가 자동 실행되지 않습니다.

## 캐시 (Cache)

이미지 등의 리소스 캐싱을 활성화할 수 있습니다.

```bash
# 캐시 크기 단위: kilobyte
phantomjs --disk-cache=true --max-disk-cache-size=4000 script.js
```

캐시가 활성화되면 서버에서 `304 Not Modified` 응답을 받습니다.

### 캐시 위치

```
~/Library/Caches/Ofi Labs/PhantomJS/data7
```

## 인자 처리 (Arguments)

```javascript
var system = require('system');
console.log(system.args.length);

if (system.args.length > 0) {
  console.log(JSON.stringify(system.args));
}
phantom.exit();
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

    console.log('Total cookies: ' + phantom.cookies.length);
  } else {
    console.error('Cannot open file');
    phantom.exit(1);
  }
});
```

### 쿠키 파일 지정

```bash
phantomjs --cookies-file=cookie-jar.txt script.js
```

## 종료 코드 (Exit)

- `0`: 성공
- `1`: 실패

```javascript
console.log('Running the PhantomJS exit demo...');

if (Math.floor(Math.random() * 10) % 2 === 0) {
  console.log('Exiting cleanly from PhantomJS!');
  phantom.exit();
} else {
  console.log('Exiting with an error status.');
  phantom.exit(1);
}
```

종료 코드 확인:
```bash
echo $?
```

## 파일 시스템 (File System)

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
var fs    = require('fs'),
    _name = 'readme.txt',
    path  = require('system').args[0].split(fs.separator),
    file;

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

### injectJs

`<script src>` 태그와 동일하게 작동합니다.

```javascript
console.log('Initial libraryPath: ' + phantom.libraryPath);

phantom.libraryPath = phantom.libraryPath.replace(/chapter02$/, 'lib');

var isInjected = phantom.injectJs('hemingway.js');

if (isInjected) {
  console.log('Script was successfully injected.');
  console.log('Give me some Fibonacci numbers! ' +
    fibonacci(Math.round(Math.random() * 10) + 1));
  phantom.exit();
} else {
  console.log('Failed to inject script.');
  phantom.exit(1);
}
```

### includeJs와 injectJs 조합

```javascript
var webPage = require('webpage');
var page = webPage.create();

page.open('http://www.example.com', function(status) {
  if (status === "success") {
    page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function() {
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

## 결론

PhantomJS는 헤드리스 브라우저 자동화의 강력한 도구입니다. 웹 스크래핑, 자동화 테스트, 스크린샷 생성 등 다양한 용도로 활용할 수 있습니다. 다만 현재는 Puppeteer, Playwright 등의 현대적인 도구들이 더 활발히 개발되고 있으므로, 새 프로젝트에서는 이러한 대안도 고려해 보시기 바랍니다.
