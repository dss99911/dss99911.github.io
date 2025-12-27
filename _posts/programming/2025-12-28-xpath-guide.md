---
layout: post
title: "XPath 완벽 가이드 - XML 문서 탐색의 모든 것"
date: 2025-12-28 15:30:00 +0900
categories: programming
tags: [xml, xpath, web, javascript]
description: "XPath의 기본 개념부터 노드 선택, 연산자, JavaScript에서의 활용까지 XML 문서 탐색을 위한 종합 가이드"
---

XPath(XML Path Language)는 XML 문서 내에서 특정 요소나 속성을 찾아 탐색하기 위한 쿼리 언어입니다. HTML/XML 파싱, 웹 스크래핑, XSLT 변환 등 다양한 분야에서 필수적으로 사용됩니다.

## XPath 기본 개념

XPath는 XML 문서의 노드를 탐색하기 위한 언어로, 파일 시스템의 경로와 유사한 문법을 사용합니다.

### 핵심 특징
- XML 문서의 트리 구조를 탐색
- 배열 인덱스는 **1부터 시작** (0이 아님)
- 다양한 조건과 필터를 통한 정밀한 노드 선택 가능

## 노드 선택 기본 문법

### 경로 표현식

| 표현식 | 설명 | 예시 |
|--------|------|------|
| `nodename` | 해당 노드명을 가진 모든 노드 선택 | `book` |
| `/` | 루트 노드부터 시작 (절대 경로) | `/bookstore/book` |
| `//` | 현재 노드의 모든 하위(descendant) 노드에서 검색 | `//book` |
| `.` | 현재 노드 | `.` |
| `..` | 부모 노드 | `../title` |
| `@` | 속성(attribute) 선택 | `@lang` |

### 와일드카드

| 표현식 | 설명 | 예시 |
|--------|------|------|
| `*` | 모든 요소 노드 | `/bookstore/*` (북스토어의 모든 자식 노드) |
| `@*` | 모든 속성 | `//title[@*]` (속성이 하나라도 있는 모든 title 노드) |
| `//` | 모든 노드 | `//*` |

### 경로 표현식 예시

```xpath
bookstore//book      <!-- bookstore 내부 어디에든 있는 모든 book 노드 -->
/bookstore/*         <!-- bookstore의 모든 직접 자식 노드 -->
//*                  <!-- 문서 내 모든 노드 -->
//title[@*]          <!-- 속성이 하나 이상 있는 모든 title 노드 -->
```

## Predicates (조건절)

대괄호 `[]`를 사용하여 노드 선택에 조건을 추가할 수 있습니다.

### 위치 기반 선택

```xpath
/bookstore/book[1]           <!-- 첫 번째 book 노드 -->
/bookstore/book[last()]      <!-- 마지막 book 노드 -->
/bookstore/book[last()-1]    <!-- 마지막에서 두 번째 book 노드 -->
/bookstore/book[position()<3]  <!-- 처음 2개의 book 노드 -->
```

### 속성 기반 선택

```xpath
//title[@lang]               <!-- lang 속성이 있는 모든 title 노드 -->
//title[@lang='en']          <!-- lang 속성값이 'en'인 title 노드 -->
```

### 값 기반 선택

```xpath
/bookstore/book[price>35.00]        <!-- price가 35.00보다 큰 book 노드 -->
/bookstore/book[price>35.00]/title  <!-- 위 조건의 book 내 title 노드 -->
```

## 여러 경로 선택 (Union)

파이프 연산자 `|`를 사용하여 여러 경로를 동시에 선택할 수 있습니다.

```xpath
//book/title | //book/price  <!-- 모든 book의 title과 price 노드 -->
//book | //cd                <!-- 모든 book과 cd 노드 -->
```

## XPath 연산자

### 비교 연산자

| 연산자 | 설명 | 예시 |
|--------|------|------|
| `=` | 같음 | `price=9.80` |
| `!=` | 같지 않음 | `price!=9.80` |
| `<` | 작음 | `price<9.80` |
| `<=` | 작거나 같음 | `price<=9.80` |
| `>` | 큼 | `price>9.80` |
| `>=` | 크거나 같음 | `price>=9.80` |

### 논리 연산자

| 연산자 | 설명 | 예시 |
|--------|------|------|
| `or` | 논리 OR | `price=9.80 or price=9.70` |
| `and` | 논리 AND | `price>9.00 and price<9.90` |

### 산술 연산자

| 연산자 | 설명 | 예시 |
|--------|------|------|
| `+` | 덧셈 | `6 + 4` |
| `-` | 뺄셈 | `6 - 4` |
| `*` | 곱셈 | `6 * 4` |
| `div` | 나눗셈 | `8 div 4` |
| `mod` | 나머지 | `5 mod 2` |

### 노드 연산자

| 연산자 | 설명 | 예시 |
|--------|------|------|
| `\|` | 두 노드 집합의 합집합 | `//book \| //cd` |

## Axis (축) 표현식

축을 사용하면 현재 노드를 기준으로 다양한 방향의 노드를 선택할 수 있습니다.

| 축 표현식 | 설명 |
|-----------|------|
| `child::book` | 현재 노드의 자식 중 book 노드 |
| `attribute::lang` | 현재 노드의 lang 속성 |
| `child::*` | 현재 노드의 모든 자식 요소 |
| `attribute::*` | 현재 노드의 모든 속성 |
| `child::text()` | 현재 노드의 모든 텍스트 자식 노드 |
| `child::node()` | 현재 노드의 모든 자식 노드 |
| `descendant::book` | 현재 노드의 모든 book 자손 노드 |
| `ancestor::book` | 현재 노드의 모든 book 조상 노드 |
| `ancestor-or-self::book` | book 조상 노드와 현재 노드(book인 경우) |
| `child::*/child::price` | 현재 노드의 손자 중 price 노드 |

## JavaScript에서 XPath 사용하기

### Ajax를 통한 XML 로드 및 XPath 적용

```javascript
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        showResult(xhttp.responseXML);
    }
};

xhttp.open("GET", "books.xml", true);
xhttp.send();

function showResult(xml) {
    var txt = "";
    var path = "/bookstore/book/title";

    // 표준 브라우저 (Chrome, Firefox, Safari 등)
    if (xml.evaluate) {
        var nodes = xml.evaluate(
            path,
            xml,
            null,
            XPathResult.ANY_TYPE,
            null
        );
        var result = nodes.iterateNext();

        while (result) {
            txt += result.childNodes[0].nodeValue + "<br>";
            result = nodes.iterateNext();
        }
    }
    // Internet Explorer 지원 (레거시)
    else if (window.ActiveXObject || xhttp.responseType == "msxml-document") {
        xml.setProperty("SelectionLanguage", "XPath");
        var nodes = xml.selectNodes(path);

        for (var i = 0; i < nodes.length; i++) {
            txt += nodes[i].childNodes[0].nodeValue + "<br>";
        }
    }

    document.getElementById("demo").innerHTML = txt;
}
```

### XPathResult 타입

`document.evaluate()` 메서드에서 사용할 수 있는 결과 타입:

| 타입 | 설명 |
|------|------|
| `ANY_TYPE` | 자동으로 적절한 타입 반환 |
| `NUMBER_TYPE` | 숫자 값 반환 |
| `STRING_TYPE` | 문자열 값 반환 |
| `BOOLEAN_TYPE` | 불리언 값 반환 |
| `ORDERED_NODE_ITERATOR_TYPE` | 순서대로 노드 반복 |
| `UNORDERED_NODE_ITERATOR_TYPE` | 순서 무관 노드 반복 |
| `ORDERED_NODE_SNAPSHOT_TYPE` | 순서대로 노드 스냅샷 |
| `UNORDERED_NODE_SNAPSHOT_TYPE` | 순서 무관 노드 스냅샷 |
| `FIRST_ORDERED_NODE_TYPE` | 첫 번째 노드만 반환 |

## 실전 예제

### 예시 XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
    <book category="cooking">
        <title lang="en">Italian Cooking</title>
        <author>Giada De Laurentiis</author>
        <price>30.00</price>
    </book>
    <book category="programming">
        <title lang="en">Learning XML</title>
        <author>Erik T. Ray</author>
        <price>39.95</price>
    </book>
</bookstore>
```

### XPath 쿼리 예제

```xpath
<!-- 모든 책 제목 -->
//book/title

<!-- programming 카테고리의 책 -->
//book[@category='programming']

<!-- 가격이 35 이상인 책의 제목 -->
//book[price>=35]/title

<!-- 영어로 된 모든 제목 -->
//title[@lang='en']

<!-- 첫 번째 책의 저자 -->
/bookstore/book[1]/author
```

## 참고 자료

- [W3Schools XPath Tutorial](https://www.w3schools.com/xml/xpath_intro.asp)
- [W3Schools XPath Operators](https://www.w3schools.com/xml/xpath_operators.asp)
- [MDN - Document.evaluate()](https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate)
