---
layout: post
title: "Jsoup으로 HTML 파싱하기 - 웹 스크래핑 가이드"
date: 2025-12-28 12:09:00 +0900
categories: tools
tags: [jsoup, java, html, web-scraping, parsing]
description: "Jsoup 라이브러리를 사용하여 HTML을 파싱하고 데이터를 추출하는 방법을 설명합니다."
---

Jsoup은 Java용 HTML 파싱 라이브러리입니다. jQuery와 유사한 CSS 선택자 문법을 지원하며, HTML에서 데이터를 추출하거나 수정하는 데 사용됩니다.

## 1. 의존성 추가

### Gradle

```groovy
implementation 'org.jsoup:jsoup:1.17.2'
```

참고: [Jsoup Download](https://jsoup.org/download)

## 2. HTML 입력

### 문자열에서 파싱

```java
String html = "<html><head><title>First parse</title></head>"
    + "<body><p>Parsed HTML into a doc.</p></body></html>";
Document doc = Jsoup.parse(html);
```

### Base URI와 함께 파싱

```java
Document doc = Jsoup.parse(html, "http://example.com/");
// 상대 URL을 절대 URL로 변환할 때 사용
```

### URL에서 가져오기 (GET)

```java
Document doc = Jsoup.connect("http://en.wikipedia.org/").get();
```

### POST 요청

```java
Document doc = Jsoup.connect("http://example.com")
    .data("query", "Java")
    .userAgent("Mozilla")
    .cookie("auth", "token")
    .timeout(3000)
    .post();
```

### JSON 가져오기

```java
String json = Jsoup.connect("https://api.example.com/data")
    .ignoreContentType(true)
    .execute()
    .body();
```

## 3. 데이터 추출

### DOM 메서드

```java
Element content = doc.getElementById("content");
Elements links = content.getElementsByTag("a");

for (Element link : links) {
    String linkHref = link.attr("href");
    String linkText = link.text();
}
```

### CSS 선택자

```java
// a 태그 중 href 속성이 있는 것
Elements links = doc.select("a[href]");

// src가 .png로 끝나는 img
Elements pngs = doc.select("img[src$=.png]");

// class가 masthead인 div
Element masthead = doc.select("div.masthead").first();

// h3.r 바로 다음의 a
Elements resultLinks = doc.select("h3.r > a");

// 복합 선택자
Elements newsHeadlines = doc.select("#mp-itn b a");
```

참고: [Jsoup Selector Syntax](https://jsoup.org/cookbook/extracting-data/selector-syntax)

### 데이터 추출 예제

```java
String html = "<p>An <a href='http://example.com/'><b>example</b></a> link.</p>";
Document doc = Jsoup.parse(html);
Element link = doc.select("a").first();

String text = doc.body().text();           // "An example link"
String linkHref = link.attr("href");       // "http://example.com/"
String linkText = link.text();             // "example"

String linkOuterH = link.outerHtml();      // "<a href="http://example.com"><b>example</b></a>"
String linkInnerH = link.html();           // "<b>example</b>"
```

### 절대 URL 가져오기

```java
Document doc = Jsoup.connect("http://jsoup.org").get();
Element link = doc.select("a").first();

String relHref = link.attr("href");        // "/"
String absHref = link.attr("abs:href");    // "http://jsoup.org/"

// 또는
String absUrl = link.absUrl("href");       // "http://jsoup.org/"
```

## 4. HTML 수정

### 속성 일괄 변경

```java
doc.select("div.comments a").attr("rel", "nofollow");
```

### HTML 내용 변경

```java
Element div = doc.select("div").first();    // <div></div>
div.html("<p>lorem ipsum</p>");             // <div><p>lorem ipsum</p></div>
div.prepend("<p>First</p>");
div.append("<p>Last</p>");
// 결과: <div><p>First</p><p>lorem ipsum</p><p>Last</p></div>
```

### 요소 감싸기

```java
Element span = doc.select("span").first();  // <span>One</span>
span.wrap("<li><a href='http://example.com/'></a></li>");
// 결과: <li><a href="http://example.com"><span>One</span></a></li>
```

### 텍스트 수정

```java
div.text("five > four");    // <div>five &gt; four</div>
div.prepend("First ");
div.append(" Last");
// 결과: <div>First five &gt; four Last</div>
```

## 5. 에러 처리

### 403 에러 해결

User-Agent 헤더 추가:

```java
return Jsoup.connect("http://example.com/search?q=test")
    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
    .get()
    .select(".result")
    .first()
    .text();
```

### HTTPS 인증서 에러

필요시 SSL 검증 우회 (개발 환경에서만 사용):

```java
Jsoup.connect(url)
    .sslSocketFactory(trustAllCerts())
    .get();
```

## 6. XSS 공격 방지

사용자 입력 HTML을 정제하여 XSS 공격을 방지합니다:

```java
String unsafe = "<p><a href='http://example.com/' onclick='stealCookies()'>Link</a></p>";
String safe = Jsoup.clean(unsafe, Whitelist.basic());
// 결과: <p><a href="http://example.com/" rel="nofollow">Link</a></p>
```

### 왜 필요한가?

피드백 입력, 질문 입력, ID/PW 입력 등 모든 입력창은 잠재적으로 스크립트 공격 가능성이 있습니다.

예: 사용자가 피드백에 스크립트를 작성하면, CMS에서 피드백을 확인할 때 스크립트가 실행되어 CMS의 정보가 유출될 수 있습니다.

### Whitelist 종류

- `Whitelist.none()`: 모든 태그 제거, 텍스트만 유지
- `Whitelist.simpleText()`: b, em, i, strong, u 태그만 허용
- `Whitelist.basic()`: 기본 포맷팅 태그 + 링크 허용
- `Whitelist.basicWithImages()`: basic + img 태그 허용
- `Whitelist.relaxed()`: 대부분의 안전한 태그 허용

## 참고 자료

- [Jsoup 공식 문서](https://jsoup.org/)
- [Jsoup Cookbook](https://jsoup.org/cookbook/input/parse-body-fragment)
- [예제 코드](https://jsoup.org/cookbook/extracting-data/example-list-links)
