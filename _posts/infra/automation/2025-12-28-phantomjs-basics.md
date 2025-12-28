---
layout: post
title: "PhantomJS 기초 - 설치, 설정, 인자 처리"
date: 2025-12-28 15:10:00 +0900
categories: [infra, automation]
tags: [phantomjs, web-automation, headless-browser, javascript]
description: "PhantomJS의 설치부터 기본 설정, 명령줄 인자 처리, 종료 코드까지 기초적인 사용법을 알아봅니다."
---

PhantomJS는 헤드리스 WebKit 브라우저로, 웹 페이지 자동화, 스크래핑, 테스트 등에 활용됩니다. 이 글에서는 PhantomJS의 설치부터 기본 설정까지 다룹니다.

> **Deprecated 알림**: PhantomJS는 2018년 이후 더 이상 활발히 개발되지 않습니다. 새 프로젝트에는 Puppeteer나 Playwright 같은 현대적인 대안을 권장하지만, 레거시 시스템 유지보수나 참조 목적으로는 여전히 유용한 정보입니다.

## 설치 (Install)

### Homebrew로 설치 (macOS)

```bash
brew update && brew install phantomjs
```

### 직접 다운로드

[PhantomJS 다운로드](http://phantomjs.org/download)에서 다운로드 후 `/usr/local/bin`에 추가합니다.

## 설정 (Configuration)

### 명령줄 옵션

PhantomJS는 다양한 명령줄 옵션을 지원합니다.

```bash
phantomjs --cookies-file=jar-of-cookies.txt script.js
```

### JSON 설정 파일

명령줄 인자 대신 JSON 파일로 설정할 수 있습니다. JSON 속성명은 명령줄 옵션과 대응됩니다.

```bash
phantomjs --config=config.json script.js
```

**config.json** 예시:
```json
{
  "cookiesFile": "cookie-jar.txt",
  "ignoreSslErrors": true
}
```

- `cookiesFile`은 `--cookies-file` 옵션과 대응됩니다.

## 명령줄 인자 처리 (Arguments)

스크립트에서 명령줄 인자를 받아 처리할 수 있습니다.

```javascript
var system = require('system');
console.log(system.args.length);

if (system.args.length > 0) {
  console.log(JSON.stringify(system.args));
}
phantom.exit();
```

실행:
```bash
phantomjs script.js arg1 arg2 arg3
```

## 종료 코드 (Exit)

PhantomJS는 종료 코드를 통해 성공/실패를 알릴 수 있습니다.

- `0`: 성공
- `1`: 실패

```javascript
console.log('Running the PhantomJS exit demo...');

if (Math.floor(Math.random() * 10) % 2 === 0) {
  console.log('Exiting cleanly from PhantomJS!');
  phantom.exit();  // 종료 코드 0 (기본값)
} else {
  console.log('Exiting with an error status.');
  phantom.exit(1);  // 종료 코드 1
}
```

쉘에서 종료 코드 확인:
```bash
phantomjs script.js
echo $?
```

## 다음 단계

PhantomJS의 기본 설정을 익혔다면, 다음 포스트에서 웹페이지 조작 방법을 알아보세요.

- [PhantomJS 웹페이지 조작](/automation/2025/12/28/phantomjs-webpage.html) - 웹페이지 열기, POST 요청, JavaScript 실행
- [PhantomJS 고급 기능](/automation/2025/12/28/phantomjs-advanced.html) - 캐시, 쿠키, 파일 처리, 디버깅
