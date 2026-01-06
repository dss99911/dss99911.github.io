---
layout: post
title: "PhantomJS 웹페이지 조작 - 페이지 열기, POST 요청, JavaScript 실행"
date: 2025-12-28 15:11:00 +0900
categories: [infra, automation]
tags: [phantomjs, web-automation, headless-browser, javascript]
description: "PhantomJS로 웹페이지를 열고, POST 요청을 보내고, JavaScript를 실행하는 방법을 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-phantomjs-webpage.png
---

PhantomJS의 핵심 기능은 웹페이지를 프로그래밍적으로 조작하는 것입니다. 이 글에서는 웹페이지 열기, HTTP 요청, JavaScript 실행 방법을 다룹니다.

> **Deprecated 알림**: PhantomJS는 2018년 이후 더 이상 활발히 개발되지 않습니다. 레거시 시스템 참조 목적으로 이 정보를 제공합니다.

## 웹페이지 열기 (Webpage)

### 기본 사용법

`webpage` 모듈을 사용해 URL을 열고 결과를 처리합니다.

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

POST 요청을 보낼 때는 `customHeaders`로 헤더를 설정하고, `open` 메서드에 메서드와 데이터를 전달합니다.

```javascript
var webpage  = require('webpage').create(),
    url      = 'http://localhost:3000/post-demo',
    postData = JSON.stringify({
      "foo": "bar",
      "now": new Date().getTime()
    });

webpage.customHeaders = { "Content-Type": "application/json" };

// 첫 번째 URL에만 헤더 적용 (리다이렉트 시 헤더 제거)
webpage.onInitialized = function() {
  webpage.customHeaders = {};
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

웹페이지에서 발생하는 다양한 이벤트를 처리할 수 있습니다.

### 리소스 수신 이벤트

```javascript
var count = 0;
wpage.onResourceReceived = function(res) {
  if (res.stage === 'end') {
    count++;
    console.log('Resource #' + count + ' received');
  }
};
```

더 많은 이벤트는 [PhantomJS Webpage Events](https://www.tutorialspoint.com/phantomjs/phantomjs_webpage_module_events_callbacks.htm)를 참고하세요.

## JavaScript 실행 (Evaluate)

웹페이지 컨텍스트에서 JavaScript를 실행하고 결과를 받을 수 있습니다.

### evaluateJavaScript

문자열로 된 JavaScript 함수를 실행합니다.

```javascript
var wpage = require('webpage').create();
wpage.open('http://localhost/test.html', function(status) {
  var script = "function(){ var a = document.title; return a;}";
  var value = wpage.evaluateJavaScript(script);
  console.log(value);
  phantom.exit();
});
```

### evaluate (인자 전달)

`evaluate` 메서드는 함수와 인자를 직접 전달할 수 있습니다.

```javascript
var titles = webpage.evaluate(function(selector) {
  var titles  = [],
      forEach = Array.prototype.forEach,
      nodes   = document.querySelectorAll(selector);

  forEach.call(nodes, function(el) {
    titles.push(el.innerText);
  });
  return titles;
}, '.post h2');  // 두 번째 인자가 함수의 selector 파라미터로 전달됨

console.log(titles);
```

**주의사항:**
- `evaluate` 내부의 코드는 웹페이지 컨텍스트에서 실행됩니다.
- PhantomJS 변수에 직접 접근할 수 없으며, 인자를 통해 데이터를 전달해야 합니다.
- 반환값은 JSON 직렬화 가능해야 합니다.

## 에러 처리 (Error Handling)

### 연결 실패 처리

`open` 콜백에서 status를 확인합니다.

```javascript
webpage.open('http://example.com/', function(status) {
  if (status === 'fail') {
    console.error('Failed to open requested page.');
    phantom.exit(1);
  }
  // 성공 처리
});
```

### 전역 에러 핸들러

예기치 않은 에러를 처리합니다.

```javascript
phantom.onError = function(message, trace) {
  console.error('[PHANTOMJS ERROR] ' + message);
  trace.forEach(function(t) {
    console.error('  >> [' + t.line + '] ' +
      (t.function ? '[' + t.function + '] ' : '') +
      (t.file || t.sourceURL));
  });
  phantom.exit(1);
};
```

## 관련 포스트

- [PhantomJS 기초](/automation/2025/12/28/phantomjs-basics.html) - 설치, 설정, 인자 처리
- [PhantomJS 고급 기능](/automation/2025/12/28/phantomjs-advanced.html) - 캐시, 쿠키, 파일 처리, 디버깅
