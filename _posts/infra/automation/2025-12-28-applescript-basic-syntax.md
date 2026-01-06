---
layout: post
title: "AppleScript 기본 문법 완벽 가이드"
date: 2025-12-28 12:00:00 +0900
categories: [infra, automation]
tags: [applescript, mac, automation, scripting, macos]
description: "AppleScript의 기본 문법을 알아봅니다. 변수, 연산자, 조건문, 함수, 배열, 문자열 처리 등 핵심 개념을 다룹니다."
image: /assets/images/posts/thumbnails/2025-12-28-applescript-basic-syntax.png
---

AppleScript는 macOS에서 애플리케이션을 자동화하고 제어할 수 있는 스크립팅 언어입니다. 이 글에서는 AppleScript의 기본 문법과 핵심 개념을 정리합니다.

## 시작하기

AppleScript Editor를 열고, `Window -> Library`에서 각 애플리케이션에서 사용 가능한 명령어들을 확인할 수 있습니다.

## 변수 (Variable)

AppleScript에서 변수는 `set` 키워드를 사용하여 선언합니다.

```applescript
set test to "aaa"
set myNumber to 42
set myList to {1, 2, 3}
```

## 연산자 (Operator)

### 논리 연산자

```applescript
not (expression)
```

`not` 연산자는 불리언 값을 반전시킵니다.

## 조건문 (If Statement)

```applescript
if not (exists (processes where name is "Terminal")) then
    -- Terminal이 실행되지 않았을 때 실행할 코드
else
    -- Terminal이 실행 중일 때 실행할 코드
end if
```

## 함수 (Function)

### 함수 선언

AppleScript에서는 `on` 키워드를 사용하여 함수(핸들러)를 정의합니다.

```applescript
-- 기본 함수 선언
on alfred_script(q)
    -- 함수 내용
end alfred_script

-- from 키워드 사용
on test from x
    set test to "test" & x
end test

-- to 키워드 사용
on test to x
    set test to "test" & x
end test
```

### 함수 호출

```applescript
alfred_script("test")
test from x
test to x
```

## 배열 (Array/List)

### 배열 선언

```applescript
set test to {1, 2, 3}
```

### 인덱스 접근

AppleScript는 다양한 방법으로 배열(리스트)의 요소에 접근할 수 있습니다.

```applescript
-- 인덱스 가져오기
tell application "Finder" to get the index of Finder window "Macintosh HD"

-- 인덱스로 값 가져오기
tell application "Finder" to get the name of Finder Window 1

-- 첫 번째 요소
tell application "Finder" to get the index of the first Finder window
tell application "Finder" to get the index of the 1st Finder window

-- 두 번째 요소
tell application "Finder" to get the index of the second Finder window
tell application "Finder" to get the index of the 2nd Finder window
```

### 상대적 위치

```applescript
-- 맨 앞 윈도우
tell application "Finder" to get the index of the front Finder window
--> returns: 1

-- 맨 뒤 윈도우
tell application "Finder" to get the index of the back Finder window
--> returns: 2

-- 마지막 윈도우
tell application "Finder" to get the index of the last Finder window
--> returns: 2

-- 마지막 윈도우 앞의 윈도우
tell application "Finder" to get the index of the Finder window before the last Finder window
--> returns: 1

-- 첫 번째 윈도우 다음 윈도우
tell application "Finder" to get the index of the Finder window after the front Finder window
--> returns: 2
```

### every 키워드

모든 요소에 대해 작업을 수행할 때 사용합니다.

```applescript
tell application "Finder" to set the sidebar width of every Finder window to 0
```

### 인덱스 참조 방법 요약

| 방식 | 예시 |
|------|------|
| 이름으로 | `Finder window "Documents"` |
| 숫자 인덱스로 | `Finder window 1` |
| 서술적 인덱스로 | `the first Finder window`, `the 23rd Finder window` |
| 상대적 위치로 | `the front Finder window`, `the middle Finder window` |
| 랜덤으로 | `some Finder window` |

### 인덱스 변경

```applescript
-- 마지막 윈도우를 맨 앞으로 이동 (기존 윈도우들은 뒤로 밀림)
tell application "Finder" to set the index of the last Finder window to 1
```

### 검색 (where 절)

```applescript
tell application "Finder"
    set isExists to exists (windows where name is "test")
end tell
```

## 문자열 (String)

### 문자열 합치기

```applescript
"aa" & str
```

`&` 연산자를 사용하여 문자열을 연결합니다.

## 기본 메서드

### 따옴표 추가

```applescript
set var to "test"
quoted form of var
-- 결과: 'test'
```

### 앱 활성화

```applescript
tell application "Terminal"
    activate
end tell
```

### 존재 여부 확인

```applescript
exists (obj)
```

### 불리언 반전

```applescript
not (boolean expression)
```

### 쉘 스크립트 실행

```applescript
do shell script "open -a Terminal"
```

## tell 블록과 문법

### 속성 가져오기

```applescript
tell application "Finder" to get the name of front Finder window
```

### tell 블록 변환

한 줄로 작성된 코드를 블록으로 변환할 수 있습니다.

```applescript
-- 한 줄 버전
tell application "Finder" to close every window

-- 블록 버전
tell application "Finder"
    close every window
end tell
```

### 중첩 tell

```applescript
tell application "Finder" to tell the front Finder window to get the bounds
```

`tell`은 객체 내부의 메서드나 속성을 호출하기 위해 사용됩니다.

## 결론

AppleScript의 기본 문법을 이해하면 macOS에서 다양한 자동화 작업을 수행할 수 있습니다. 다음 글에서는 Finder, Terminal 등 실제 애플리케이션을 제어하는 방법을 알아보겠습니다.
