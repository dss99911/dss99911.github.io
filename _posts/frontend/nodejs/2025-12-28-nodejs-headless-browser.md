---
layout: post
title: "Node.js 헤드리스 브라우저 - Puppeteer와 Chrome Launcher"
date: 2025-12-28
categories: [frontend, nodejs]
tags: [nodejs, puppeteer, headless, chrome, crawling, scrapping]
---

Node.js에서 헤드리스 브라우저를 사용한 웹 크롤링/스크래핑 방법을 알아봅니다.

## 헤드리스 브라우저 종류

- Puppeteer
- PhantomJS
- 기타 라이브러리들

참고 링크:
- [Headless browser options](https://stackoverflow.com/questions/814757/headless-internet-browser/814929#814929)
- [Headless browser with JavaScript support](https://stackoverflow.com/questions/11634747/headless-browser-with-full-javascript-support-for-java)

## Chrome Launcher

헤드리스 Chrome을 실행하는 라이브러리입니다. 컨트롤은 DevTools Protocol로 합니다.

- [NPM: chrome-launcher](https://www.npmjs.com/package/chrome-launcher)

### Chrome 실행

```javascript
const chromeLauncher = require('chrome-launcher');

chromeLauncher.launch({
    startingUrl: 'https://google.com'
}).then(chrome => {
    console.log(`Chrome debugging port running on ${chrome.port}`);
});
```

### 헤드리스 Chrome 실행

```javascript
const chromeLauncher = require('chrome-launcher');

chromeLauncher.launch({
    startingUrl: 'https://google.com',
    chromeFlags: ['--headless', '--disable-gpu']
}).then(chrome => {
    console.log(`Chrome debugging port running on ${chrome.port}`);
});
```

## Puppeteer

Puppeteer는 헤드리스 Chrome/Chromium을 DevTools Protocol을 통해 제어합니다.

- [Headless Chrome 설명](https://developers.google.com/web/updates/2017/04/headless-chrome)

### 설치

```bash
npm i --save puppeteer
```

### 기본 사용법

```javascript
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({path: 'example.png'});
    await browser.close();
})();
```

### 브라우저 창과 함께 실행

```javascript
const browser = await puppeteer.launch({headless: false});
```

### 다른 버전의 Chrome 사용

```javascript
const browser = await puppeteer.launch({executablePath: '/path/to/Chrome'});
```

### 모든 리소스 로드 대기

```javascript
await page.goto(url, {"waitUntil": "networkidle0"});
```

### DOM 조작

#### Document 핸들

```javascript
const aHandle = await page.evaluateHandle('document');
```

#### querySelector

```javascript
page.$(selector)
```

#### querySelectorAll

```javascript
page.$$(selector, e => {})
```

#### querySelectorAll forEach

```javascript
const divsCounts = await page.$$eval('div', divs => divs.length);
```

#### 요소 값 추출

```javascript
const searchValue = await page.$eval('#search', el => el.value);
const preloadHref = await page.$eval('link[rel=preload]', el => el.href);
const html = await page.$eval('.main-container', e => e.outerHTML);
```

**참고**: 단순한 값이 아니면 await를 해도 promise가 리턴됩니다.

### 스크린샷

```javascript
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({path: 'example.png'});
    await browser.close();
})();
```

### PDF 생성

```javascript
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://news.ycombinator.com', {waitUntil: 'networkidle2'});
    await page.pdf({path: 'hn.pdf', format: 'A4'});
    await browser.close();
})();
```
