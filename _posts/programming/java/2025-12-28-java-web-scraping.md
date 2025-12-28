---
layout: post
title: "Java 웹 스크래핑 라이브러리 비교 - Jsoup, Selenium, HtmlUnit"
date: 2025-12-28 12:10:00 +0900
categories: [programming, java]
tags: [java, web-scraping, jsoup, selenium, crawling]
description: "Java에서 웹 스크래핑을 위한 라이브러리들을 비교합니다. Jsoup, Selenium, HtmlUnit의 특징과 선택 기준을 알아봅니다."
---

# Java 웹 스크래핑 라이브러리 비교

Java에서 웹 크롤링/스크래핑을 위한 다양한 라이브러리를 살펴봅니다.

## 라이브러리 비교

### Jsoup

가볍고 빠른 HTML 파서입니다.

**특징:**
- WebKit 엔진 없음 (순수 HTML 파싱)
- 간단하고 사용하기 쉬움
- JavaScript 실행 불가

**사용 사례:**
- 정적 HTML 페이지 파싱
- 서버 사이드 렌더링 페이지
- HTML 구조 분석

```java
// Maven 의존성
// <dependency>
//     <groupId>org.jsoup</groupId>
//     <artifactId>jsoup</artifactId>
//     <version>1.15.3</version>
// </dependency>

Document doc = Jsoup.connect("https://example.com").get();
Elements links = doc.select("a[href]");
for (Element link : links) {
    System.out.println(link.attr("href"));
}
```

### Jaunt

경량 웹 스크래핑 라이브러리입니다.

**특징:**
- WebKit 엔진 없음
- HTTP 클라이언트와 HTML 파서 통합

### HtmlUnit

Headless 브라우저 시뮬레이터입니다.

**특징:**
- GUI 없이 브라우저 동작 시뮬레이션
- JavaScript 지원 (불완전)
- JavaScript 파싱 오류 발생 가능

**주의:** 일부 복잡한 JavaScript는 파싱 에러가 발생할 수 있습니다.

### Selenium

실제 브라우저를 자동화하는 도구입니다.

**특징:**
- Chrome, Firefox 등 실제 브라우저 사용
- 완벽한 JavaScript 지원
- UI 자동화 테스트 도구로도 사용
- IntelliJ에 Selenium UI Testing 플러그인 제공

**사용 사례:**
- JavaScript로 렌더링되는 SPA
- 로그인이 필요한 페이지
- 복잡한 상호작용이 필요한 경우

```java
// Selenium with Chrome
WebDriver driver = new ChromeDriver();
driver.get("https://example.com");

WebElement element = driver.findElement(By.id("myElement"));
element.click();

String pageSource = driver.getPageSource();
driver.quit();
```

## Headless 모드

브라우저 UI 없이 백그라운드에서 실행하는 모드입니다.

### Chrome Headless

```java
ChromeOptions options = new ChromeOptions();
options.addArguments("--headless");
WebDriver driver = new ChromeDriver(options);
```

**참고:** [Getting Started with Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome)

## 선택 가이드

| 조건 | 권장 라이브러리 |
|------|----------------|
| 정적 HTML만 파싱 | Jsoup |
| 간단한 JavaScript | HtmlUnit |
| 복잡한 JavaScript/SPA | Selenium |
| 속도가 중요 | Jsoup |
| 정확성이 중요 | Selenium |
| 테스트 자동화 | Selenium |

## 성능 비교

| 라이브러리 | 속도 | 메모리 | JavaScript |
|-----------|------|--------|------------|
| Jsoup | 빠름 | 적음 | X |
| HtmlUnit | 보통 | 보통 | 일부 |
| Selenium | 느림 | 많음 | O |

## 조합 사용

효율적인 스크래핑을 위해 라이브러리를 조합할 수 있습니다:

1. **Selenium + Jsoup**: Selenium으로 JavaScript 렌더링 후 Jsoup으로 파싱
2. **정적/동적 판단**: 먼저 Jsoup으로 시도하고, 실패 시 Selenium 사용

```java
// Selenium으로 렌더링된 HTML을 Jsoup으로 파싱
WebDriver driver = new ChromeDriver();
driver.get("https://spa-site.com");

// JavaScript 실행 대기
Thread.sleep(3000);

// 렌더링된 HTML을 Jsoup으로 파싱
String html = driver.getPageSource();
Document doc = Jsoup.parse(html);

Elements items = doc.select(".item");
driver.quit();
```

## 주의사항

- 웹사이트의 `robots.txt` 준수
- 서버에 과도한 부하를 주지 않도록 적절한 딜레이 추가
- 이용약관 확인
- User-Agent 설정 고려
