---
layout: post
title: "PhantomJS 기초 - 설치, 설정, 인자 처리"
date: 2025-08-19 21:36:00 +0900
categories: [infra, automation]
tags: [phantomjs, web-automation, headless-browser, javascript]
description: "PhantomJS의 설치부터 기본 설정, 명령줄 인자 처리, 종료 코드까지 기초적인 사용법을 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-phantomjs-basics.png
redirect_from:
  - "/infra/automation/2025/12/28/phantomjs-basics.html"
---

PhantomJS는 헤드리스 WebKit 브라우저로, 웹 페이지 자동화, 스크래핑, 테스트 등에 활용됩니다. 헤드리스(headless)란 GUI 없이 백그라운드에서 브라우저를 실행하는 것을 의미합니다. 이 글에서는 PhantomJS의 설치부터 기본 설정까지 다룹니다.

> **Deprecated 알림**: PhantomJS는 2018년 이후 더 이상 활발히 개발되지 않습니다. 새 프로젝트에는 Puppeteer나 Playwright 같은 현대적인 대안을 권장하지만, 레거시 시스템 유지보수나 참조 목적으로는 여전히 유용한 정보입니다.

## PhantomJS의 주요 활용 분야

PhantomJS가 활발하게 사용되던 시절에는 다음과 같은 용도로 널리 활용되었습니다:

- **웹 스크래핑**: JavaScript로 동적 렌더링되는 페이지의 데이터 수집
- **자동화 테스트**: UI 테스트를 GUI 없이 CI/CD 파이프라인에서 실행
- **스크린샷 캡처**: 웹 페이지를 이미지(PNG, JPEG)나 PDF로 렌더링
- **네트워크 모니터링**: HTTP 요청/응답을 가로채어 성능 분석
- **서버 사이드 렌더링(SSR)**: SPA를 검색 엔진용으로 사전 렌더링

## 설치 (Install)

### Homebrew로 설치 (macOS)

```bash
brew update && brew install phantomjs
```

### 직접 다운로드

[PhantomJS 다운로드](http://phantomjs.org/download)에서 다운로드 후 `/usr/local/bin`에 추가합니다.

### 설치 확인

```bash
phantomjs --version
```

버전이 정상적으로 출력되면 설치가 완료된 것입니다.

## 설정 (Configuration)

### 명령줄 옵션

PhantomJS는 다양한 명령줄 옵션을 지원합니다.

```bash
phantomjs --cookies-file=jar-of-cookies.txt script.js
```

주요 명령줄 옵션:

| 옵션 | 설명 |
|------|------|
| `--cookies-file` | 쿠키를 저장할 파일 경로 |
| `--ignore-ssl-errors` | SSL 인증서 오류 무시 |
| `--proxy` | 프록시 서버 설정 |
| `--load-images` | 이미지 로딩 여부 (false로 속도 향상) |
| `--disk-cache` | 디스크 캐시 사용 여부 |
| `--web-security` | 웹 보안 설정 (CORS 등) |

### JSON 설정 파일

명령줄 인자 대신 JSON 파일로 설정할 수 있습니다. JSON 속성명은 명령줄 옵션과 대응됩니다.

```bash
phantomjs --config=config.json script.js
```

**config.json** 예시:
```json
{
  "cookiesFile": "cookie-jar.txt",
  "ignoreSslErrors": true,
  "loadImages": false,
  "diskCache": true,
  "webSecurityEnabled": false
}
```

- `cookiesFile`은 `--cookies-file` 옵션과 대응됩니다.
- 옵션이 많을 때는 JSON 설정 파일을 사용하는 것이 관리하기 편합니다.

## 기본 스크립트 작성

PhantomJS 스크립트는 일반 JavaScript 파일입니다. 간단한 예제로 시작해봅니다:

```javascript
// hello.js
console.log('Hello, PhantomJS!');
console.log('PhantomJS version: ' + phantom.version.major + '.' + phantom.version.minor);
phantom.exit();
```

실행:
```bash
phantomjs hello.js
```

**중요**: `phantom.exit()`을 호출하지 않으면 PhantomJS 프로세스가 종료되지 않고 계속 실행됩니다. 스크립트의 모든 실행 경로에서 반드시 `phantom.exit()`이 호출되도록 해야 합니다.

## 명령줄 인자 처리 (Arguments)

스크립트에서 명령줄 인자를 받아 처리할 수 있습니다.

```javascript
var system = require('system');
console.log('Number of arguments: ' + system.args.length);

if (system.args.length > 0) {
  console.log(JSON.stringify(system.args));
}
phantom.exit();
```

실행:
```bash
phantomjs script.js arg1 arg2 arg3
```

`system.args[0]`은 스크립트 파일명 자체이므로, 실제 인자는 `system.args[1]`부터 시작합니다. 이를 활용하면 URL이나 설정값을 동적으로 전달할 수 있습니다.

## 종료 코드 (Exit)

PhantomJS는 종료 코드를 통해 성공/실패를 알릴 수 있습니다.

- `0`: 성공
- `1` 이상: 실패

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

종료 코드는 쉘 스크립트나 CI/CD 파이프라인에서 PhantomJS 작업의 성공/실패를 판단하는 데 사용됩니다. 예를 들어, 스크래핑이 실패했을 때 종료 코드 1을 반환하면 후속 작업을 중단할 수 있습니다.

## 현대적 대안

PhantomJS 대신 사용할 수 있는 현대적 도구들입니다:

| 도구 | 엔진 | 특징 |
|------|------|------|
| **Puppeteer** | Chromium | Google 개발, Chrome DevTools Protocol 사용 |
| **Playwright** | Chromium/Firefox/WebKit | Microsoft 개발, 멀티 브라우저 지원 |
| **Selenium** | 다양한 브라우저 | 가장 오래된 도구, 언어 바인딩 풍부 |

Puppeteer와 Playwright는 PhantomJS의 모든 기능을 지원하면서 더 최신의 브라우저 엔진을 사용하므로, 실제 사용자 환경과 동일한 결과를 얻을 수 있습니다.

## 다음 단계

PhantomJS의 기본 설정을 익혔다면, 다음 포스트에서 웹페이지 조작 방법을 알아보세요.

- [PhantomJS 웹페이지 조작](/automation/2025/12/28/phantomjs-webpage.html) - 웹페이지 열기, POST 요청, JavaScript 실행
- [PhantomJS 고급 기능](/automation/2025/12/28/phantomjs-advanced.html) - 캐시, 쿠키, 파일 처리, 디버깅
