---
layout: post
title: "JavaFX WebView로 웹 콘텐츠 표시하기"
date: 2025-12-28 12:09:00 +0900
categories: java
tags: [java, javafx, webview, javascript]
description: "JavaFX WebView를 사용하여 웹 페이지를 로드하고, JavaScript와 상호작용하는 방법을 알아봅니다."
---

# JavaFX WebView로 웹 콘텐츠 표시하기

JavaFX의 WebView 컴포넌트를 사용하면 Java 애플리케이션 내에서 웹 콘텐츠를 표시하고 JavaScript와 상호작용할 수 있습니다.

## 기본 사용법

### WebView와 WebEngine 생성

```java
// WebView 생성
WebView browser = new WebView();

// WebEngine 가져오기
WebEngine webEngine = browser.getEngine();
```

## 콘텐츠 로드 방법

### 1. Remote URL 로드

```java
webEngine.load("http://eclipse.com");
```

### 2. HTML 문자열 로드

```java
String html = "<html><h1>Hello</h1><h2>Hello</h2></html>";

// 방법 1
webEngine.loadContent(html);

// 방법 2 - MIME 타입 지정
webEngine.loadContent(html, "text/html");
```

### 3. 로컬 파일 로드

```java
File file = new File("C:/test/a.html");
URL url = file.toURI().toURL();

// file:/C:/test/a.html
webEngine.load(url.toString());
```

## JavaScript 실행

### 단순 실행

```java
webEngine.executeScript("history.back()");
```

### JSObject를 통한 실행

```java
// JavaScript 객체 가져오기
JSObject history = (JSObject) webEngine.executeScript("history");

// 파라미터 없이 메서드 호출
history.call("back");
```

### DOM 조작

```java
Element p = (Element) webEngine.executeScript("document.getElementById('para')");

p.setAttribute("style", "font-weight: bold");
```

## Java와 JavaScript 양방향 통신

### JavaScript에서 Java 호출

Java 객체를 JavaScript의 window 객체에 노출시킬 수 있습니다.

```java
public class Bridge {

    public void showTime() {
        System.out.println("Show Time");
        label.setText("Now is: " + df.format(new Date()));
    }
}

// window 객체 가져오기
JSObject jsobj = (JSObject) webEngine.executeScript("window");

// Java 객체를 window의 멤버로 설정
jsobj.setMember("myJavaMember", new Bridge());
```

JavaScript에서 호출:

```javascript
// HTML 또는 JavaScript에서
myJavaMember.showTime();
```

## 전체 예제

```java
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.VBox;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import netscape.javascript.JSObject;

public class WebViewExample extends Application {

    @Override
    public void start(Stage primaryStage) {
        WebView browser = new WebView();
        WebEngine webEngine = browser.getEngine();

        // 웹 페이지 로드
        webEngine.load("https://example.com");

        // 페이지 로드 완료 후 JavaScript 실행
        webEngine.getLoadWorker().stateProperty().addListener(
            (observable, oldValue, newValue) -> {
                if (newValue == Worker.State.SUCCEEDED) {
                    // JavaScript와 Java 브릿지 설정
                    JSObject window = (JSObject) webEngine.executeScript("window");
                    window.setMember("javaBridge", new JavaBridge());
                }
            }
        );

        VBox root = new VBox(browser);
        Scene scene = new Scene(root, 800, 600);
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public class JavaBridge {
        public void log(String message) {
            System.out.println("JS: " + message);
        }
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

## 주의사항

- WebView는 JavaFX 스레드에서만 조작해야 합니다.
- JavaScript 브릿지 객체는 강한 참조를 유지해야 GC에 의해 수거되지 않습니다.
- 보안상 신뢰할 수 없는 콘텐츠 로드 시 주의가 필요합니다.

## 참고

WebView는 내부적으로 WebKit 엔진을 사용합니다. 따라서 최신 웹 표준 일부는 지원되지 않을 수 있습니다.
