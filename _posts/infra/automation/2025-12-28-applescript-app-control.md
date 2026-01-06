---
layout: post
title: "AppleScript로 Mac 애플리케이션 제어하기"
date: 2025-12-28 12:10:00 +0900
categories: [infra, automation]
tags: [applescript, mac, automation, finder, terminal, macos]
description: "AppleScript를 사용하여 Finder, Terminal 등 Mac 애플리케이션을 제어하는 방법을 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-applescript-app-control.png
---

AppleScript를 활용하면 macOS의 다양한 애플리케이션을 자동으로 제어할 수 있습니다. 이 글에서는 Finder, Terminal, System Events 등을 제어하는 방법을 정리합니다.

## 애플리케이션 메서드 확인하기

1. Script Editor에서 `Window -> Library`를 엽니다.
2. 제어하려는 앱(예: Terminal)을 선택합니다.
3. 사용 가능한 메서드들을 확인합니다.

## Finder 제어

### 기본 폴더명

```applescript
-- 시스템 디스크
startup disk

-- 홈 폴더
home
```

### 윈도우 속성

```applescript
-- 툴바 표시/숨기기
toolbar visible

-- 상태바 표시/숨기기
statusbar visible
```

### 윈도우 순서 변경

```applescript
-- 마지막 윈도우를 맨 앞으로
tell application "Finder" to set the index of the last Finder window to 1

-- 마지막 윈도우 선택
tell application "Finder" to select the last Finder window
```

### 현재 윈도우의 폴더 정보

```applescript
-- 현재 폴더 가져오기
tell application "Finder" to get the target of the front window

-- 폴더 변경하기
tell application "Finder" to set the target of the front Finder window to the startup disk
```

### 폴더의 윈도우 정보

```applescript
tell application "Finder" to get the bounds of the window of the desktop
```

### 폴더 열기/닫기

```applescript
-- 폴더 열기
tell application "Finder" to open folder "Applications" of startup disk

-- 폴더 닫기
tell application "Finder" to close folder "Applications" of startup disk
```

### POSIX 경로 가져오기

```applescript
tell application "Finder" to get quoted form of POSIX path of (folder of the front window as alias)
-- 결과: "'/Users/username/'"
```

`alias`를 `POSIX path`로 변환하면 Unix 스타일 경로를 얻을 수 있습니다.

### 모든 폴더의 뷰 변경

```applescript
tell application "Finder" to set the current view of the window of every folder of home to list view
```

### 앱 속성 설정하기

```applescript
tell application "Finder" to set the current view of the front Finder window to icon view
```

## POSIX Path 변환

Mac의 파일 경로와 Unix 스타일 경로 간 변환이 필요할 때 사용합니다.

```applescript
POSIX path of input
set p to POSIX path of input
```

참고: [File Paths in AppleScript](http://www.satimage.fr/software/en/smile/external_codes/file_paths.html)

## Terminal 제어

### 스크립트 실행

```applescript
tell application "Terminal"
    do script ("print test")
end tell
```

`do script` 명령어로 Terminal에서 명령을 실행할 수 있습니다.

## System Events

키보드 이벤트를 시뮬레이션할 때 사용합니다.

```applescript
-- Command + T 키 입력
tell application "System Events" to keystroke "t" using command down
```

## 다이얼로그 표시

```applescript
display dialog ("test")
```

## 스크립트 실행 및 인자 전달

### 커맨드라인에서 스크립트 실행

```bash
osascript '/Users/username/AppleScripts/testScript.app'
```

### 스크립트에서 값 반환

```applescript
return "test"
```

### 인자 전달

```bash
osascript '/Users/username/AppleScripts/testScript.app' test
```

### 인자 사용

```applescript
on run args
    do shell script "say " & args
end run
```

## 외부 스크립트 연결 (link)

### 스크립트 파일 로드

```applescript
set c to (load script file "NumberLib.scpt")
```

### 로드한 스크립트 실행

```applescript
run script (c)
```

### 메서드 호출

```applescript
tell c to test()

-- 또는 블록 형태로
tell c
    test()
end tell
```

## 화면 관련 팁

### 다른 모니터로 윈도우 이동

[AppleScript for specific monitor](https://apple.stackexchange.com/questions/168926/run-applescript-for-specific-monitor)

### 풀스크린 모드

[AppleScript to open application in full screen mode](https://stackoverflow.com/questions/36272353/applescript-to-open-an-application-in-full-screen-mode)

## 결론

AppleScript를 사용하면 Mac의 다양한 애플리케이션을 프로그래밍 방식으로 제어할 수 있습니다. Finder로 파일을 관리하고, Terminal에서 명령을 실행하고, System Events로 키보드 입력을 시뮬레이션하는 등 무한한 자동화 가능성이 열립니다.
