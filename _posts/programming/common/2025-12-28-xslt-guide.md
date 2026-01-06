---
layout: post
title: "XSLT 완벽 가이드 - XML 변환의 기초부터 실전까지"
date: 2025-12-28 15:30:00 +0900
categories: [programming, common]
tags: [xml, xslt, web, javascript]
description: "XSLT의 기본 개념, 주요 요소, JavaScript에서의 활용법까지 XML 문서 변환을 위한 종합 가이드"
image: /assets/images/posts/thumbnails/2025-12-28-xslt-guide.png
---

XSLT(XSL Transformations)는 XML 문서를 다른 형식(HTML, 텍스트, 다른 XML 등)으로 변환하기 위한 언어입니다. XSL 스타일시트라는 템플릿을 통해 XML 데이터를 원하는 형태로 변환할 수 있습니다.

## XSLT 기본 개념

### XSLT란?

- **XSLT** = XSL Transformations
- **XSL** = eXtensible Stylesheet Language
- XML 문서를 변환하기 위한 선언적 언어
- XPath를 사용하여 XML 문서 내 노드를 탐색

### XSLT의 주요 용도

1. **XML to HTML** - 웹 페이지 표시용 변환
2. **XML to XML** - 다른 XML 스키마로 변환
3. **XML to Text** - 일반 텍스트나 CSV 등으로 변환
4. **XML to PDF** - XSL-FO를 통한 PDF 생성

## XSLT 기본 구조

### 스타일시트 선언

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <!-- 변환 규칙들 -->

</xsl:stylesheet>
```

### 기본 템플릿 구조

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/">
        <html>
            <body>
                <h1>제목</h1>
                <xsl:apply-templates/>
            </body>
        </html>
    </xsl:template>

</xsl:stylesheet>
```

## 주요 XSLT 요소

### xsl:template

특정 노드에 대한 변환 규칙을 정의합니다.

```xml
<xsl:template match="book">
    <div class="book">
        <xsl:apply-templates/>
    </div>
</xsl:template>
```

### xsl:apply-templates

현재 노드의 자식 노드들에 대해 템플릿을 적용합니다.

```xml
<xsl:apply-templates/>                    <!-- 모든 자식 노드 -->
<xsl:apply-templates select="title"/>     <!-- title 노드만 -->
```

### xsl:value-of

노드의 값을 출력합니다.

```xml
<xsl:value-of select="title"/>           <!-- title 요소의 텍스트 값 -->
<xsl:value-of select="@category"/>       <!-- category 속성의 값 -->
```

### xsl:for-each

노드 집합을 반복 처리합니다.

```xml
<xsl:for-each select="bookstore/book">
    <tr>
        <td><xsl:value-of select="title"/></td>
        <td><xsl:value-of select="price"/></td>
    </tr>
</xsl:for-each>
```

### xsl:if

조건부 처리를 수행합니다.

```xml
<xsl:if test="price &gt; 30">
    <span class="expensive">고가</span>
</xsl:if>
```

### xsl:choose

다중 조건 분기를 처리합니다.

```xml
<xsl:choose>
    <xsl:when test="price &lt; 20">저가</xsl:when>
    <xsl:when test="price &lt; 50">중가</xsl:when>
    <xsl:otherwise>고가</xsl:otherwise>
</xsl:choose>
```

### xsl:sort

정렬을 수행합니다.

```xml
<xsl:for-each select="bookstore/book">
    <xsl:sort select="price" data-type="number" order="ascending"/>
    <!-- 내용 -->
</xsl:for-each>
```

## XML과 XSLT 연결하기

### XML 파일에서 스타일시트 참조

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="books.xsl"?>
<bookstore>
    <!-- XML 내용 -->
</bookstore>
```

## JavaScript에서 XSLT 사용하기

### 브라우저 호환성 고려

XSLT를 지원하지 않는 브라우저도 있을 수 있으므로, JavaScript를 통해 클라이언트 측에서 변환을 수행하는 것이 안전합니다.

### 기본 변환 코드

```javascript
function loadXMLDoc(filename) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", filename, false);
    xhttp.send();
    return xhttp.responseXML;
}

function transformXML() {
    var xml = loadXMLDoc("books.xml");
    var xsl = loadXMLDoc("books.xsl");

    // 표준 브라우저 (Chrome, Firefox, Safari 등)
    if (window.XSLTProcessor) {
        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsl);

        var resultDocument = xsltProcessor.transformToFragment(xml, document);
        document.getElementById("result").appendChild(resultDocument);
    }
    // Internet Explorer (레거시)
    else if (window.ActiveXObject || "ActiveXObject" in window) {
        var result = xml.transformNode(xsl);
        document.getElementById("result").innerHTML = result;
    }
}
```

### 비동기 방식 (권장)

```javascript
async function transformXMLAsync() {
    try {
        // XML과 XSL 파일 로드
        const [xmlResponse, xslResponse] = await Promise.all([
            fetch('books.xml'),
            fetch('books.xsl')
        ]);

        const xmlText = await xmlResponse.text();
        const xslText = await xslResponse.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "application/xml");
        const xsl = parser.parseFromString(xslText, "application/xml");

        // XSLT 변환 수행
        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsl);

        const resultDocument = xsltProcessor.transformToFragment(xml, document);
        document.getElementById("result").appendChild(resultDocument);

    } catch (error) {
        console.error("변환 오류:", error);
    }
}
```

### 파라미터 전달

```javascript
var xsltProcessor = new XSLTProcessor();
xsltProcessor.importStylesheet(xsl);

// 파라미터 설정
xsltProcessor.setParameter(null, "paramName", "paramValue");

var resultDocument = xsltProcessor.transformToFragment(xml, document);
```

## 실전 예제

### 예시 XML (books.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
    <book category="cooking">
        <title lang="en">Italian Cooking</title>
        <author>Giada De Laurentiis</author>
        <year>2005</year>
        <price>30.00</price>
    </book>
    <book category="programming">
        <title lang="en">Learning XML</title>
        <author>Erik T. Ray</author>
        <year>2003</year>
        <price>39.95</price>
    </book>
</bookstore>
```

### 예시 XSLT (books.xsl)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/">
        <html>
            <head>
                <title>서점 도서 목록</title>
                <style>
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #4CAF50; color: white; }
                    tr:nth-child(even) { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>서점 도서 목록</h1>
                <table>
                    <tr>
                        <th>제목</th>
                        <th>저자</th>
                        <th>카테고리</th>
                        <th>가격</th>
                    </tr>
                    <xsl:for-each select="bookstore/book">
                        <xsl:sort select="price" data-type="number"/>
                        <tr>
                            <td><xsl:value-of select="title"/></td>
                            <td><xsl:value-of select="author"/></td>
                            <td><xsl:value-of select="@category"/></td>
                            <td>
                                $<xsl:value-of select="price"/>
                                <xsl:if test="price &gt; 35">
                                    <span style="color: red;"> (고가)</span>
                                </xsl:if>
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>

</xsl:stylesheet>
```

### HTML 페이지 (index.html)

```html
<!DOCTYPE html>
<html>
<head>
    <title>XSLT 변환 예제</title>
</head>
<body>
    <div id="result"></div>

    <script>
        // 페이지 로드 시 변환 실행
        window.onload = function() {
            transformXMLAsync();
        };

        async function transformXMLAsync() {
            try {
                const [xmlResponse, xslResponse] = await Promise.all([
                    fetch('books.xml'),
                    fetch('books.xsl')
                ]);

                const xmlText = await xmlResponse.text();
                const xslText = await xslResponse.text();

                const parser = new DOMParser();
                const xml = parser.parseFromString(xmlText, "application/xml");
                const xsl = parser.parseFromString(xslText, "application/xml");

                const xsltProcessor = new XSLTProcessor();
                xsltProcessor.importStylesheet(xsl);

                const resultDocument = xsltProcessor.transformToFragment(xml, document);
                document.getElementById("result").appendChild(resultDocument);

            } catch (error) {
                console.error("변환 오류:", error);
                document.getElementById("result").innerHTML =
                    "<p>변환 중 오류가 발생했습니다.</p>";
            }
        }
    </script>
</body>
</html>
```

## XSLT 1.0 vs 2.0 vs 3.0

| 버전 | 주요 특징 |
|------|----------|
| 1.0 | 브라우저에서 기본 지원, 가장 널리 사용 |
| 2.0 | 그룹화, 정규표현식, 날짜/시간 함수 추가 |
| 3.0 | 스트리밍, JSON 지원, 고차 함수 추가 |

> 브라우저 내장 XSLT 프로세서는 대부분 1.0만 지원합니다. 2.0 이상이 필요한 경우 Saxon-JS 같은 외부 라이브러리를 사용해야 합니다.

## 참고 자료

- [W3Schools XSLT Tutorial](https://www.w3schools.com/xml/xsl_intro.asp)
- [W3Schools XSLT Client](https://www.w3schools.com/xml/xsl_client.asp)
- [MDN - XSLTProcessor](https://developer.mozilla.org/en-US/docs/Web/API/XSLTProcessor)
- [Saxon-JS (XSLT 3.0)](https://www.saxonica.com/saxon-js/index.xml)
