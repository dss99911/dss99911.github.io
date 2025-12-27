---
layout: post
title: "Mac 터미널 필수 명령어 모음"
date: 2025-12-28 12:40:00 +0900
categories: mac
tags: [mac, terminal, bash, shell, command-line, macos]
description: "Mac 터미널에서 자주 사용하는 필수 명령어들을 정리합니다. 네비게이션, 파일 검색, 환경변수 등을 다룹니다."
---

macOS 터미널을 효과적으로 활용하기 위한 필수 명령어들을 정리합니다.

## 네비게이션

### 디렉토리 이동

```bash
# 이전 디렉토리로 이동
cd -

# Tab으로 경로 자동완성
cd /Users/Tab
```

### 프롬프트 커스터마이징

```bash
# 시간과 현재 디렉토리 표시
export PS1="(\t) \W "

# 색상 추가
export PS1="\e[0;32m[\t | \W]\$ \e[m "
```

## 터미널 단축키

| 단축키 | 설명 |
|--------|------|
| `Ctrl + A` | 줄 맨 앞으로 이동 |
| `Ctrl + E` | 줄 맨 뒤로 이동 |
| `Ctrl + U` | 커서 앞부분 삭제 |
| `Ctrl + K` | 커서 뒷부분 삭제 |

## 파일 검색

### find 명령어

```bash
# 현재 디렉토리에서 파일 이름으로 검색
find . -name 'LoginActivity.smali'
```

## 명령어 실행

### 명령어 결과를 변수에 저장

```bash
# 백틱 사용
변수명=`명령어`

# $() 사용 (권장)
변수명=$(명령어)
```

### 여러 명령어 실행

```bash
# 세미콜론으로 연결
명령어1; 명령어2; 명령어3
```

### 파일 내용 보기

```bash
# n번째 줄부터 보기 (1은 처음부터)
tail +n filename

# 매뉴얼 보기
man command_name
```

## 텍스트 처리

### 파일 내용 일괄 수정

```bash
# 모든 .java 파일에서 문자열 치환
perl -pi -w -e 's/검색문자열/치환문자열/g;' *.java
```

## 환경변수

### 기본 환경변수

```bash
$USER   # 현재 사용자
$HOME   # 홈 디렉토리
```

### 환경변수 없이 프로그램 실행

`/usr/local/bin/` 디렉토리에 실행 파일을 넣으면 경로 지정 없이 실행할 수 있습니다.

## Java 관련

### Java 경로 확인

```bash
/usr/libexec/java_home
```

## Automator와 AppleScript

### Terminal에서 스크립트 실행

```applescript
on run {input, parameters}
    tell application "Terminal"
        activate
        do script "sh ~/script.sh"
    end tell
    return input
end run
```

### 텍스트 단어 수 세기

```applescript
on run {input, parameters}
    set theWordCount to count words of (input as string)
    display dialog (theWordCount & " words in the selected text." as string)
end run
```

## ADB 명령어 (Android 개발)

### 여러 디바이스에 앱 설치

```bash
# 모든 연결된 디바이스에 앱 언인스톨
adb devices | tail -n +2 | cut -sf 1 | xargs -I {} adb -s {} uninstall com.example.app

# 모든 디바이스에 APK 설치
adb devices | tail -n +2 | cut -sf 1 | xargs -I {} adb -s {} install -r app.apk

# 모든 디바이스에 파일 푸시
adb devices | tail -n +2 | cut -sf 1 | xargs -I {} adb -s {} push ./file.apk ./sdcard/file.apk
```

### ADB 타겟 디바이스 지정

| 옵션 | 설명 |
|------|------|
| `-d` | USB로 연결된 디바이스만 |
| `-e` | 에뮬레이터만 |
| `-s serial` | 특정 시리얼 번호 디바이스 |

```bash
# 특정 디바이스에서 셸 실행
adb -s 7f1c864e shell
```

## 함수 정의와 파라미터

### Bash 함수

```bash
testfunc2() {
    echo "$# parameters"
    echo Using '$*'
    for p in $*; do
        echo "[$p]"
    done
    echo Using '"$*"'
    for p in "$*"; do
        echo "[$p]"
    done
    echo Using '$@'
    for p in $@; do
        echo "[$p]"
    done
    echo Using '"$@"'
    for p in "$@"; do
        echo "[$p]"
    done
}
```

### 디바이스별 명령 실행 스크립트

```bash
adb devices | while read line; do
    if [ ! "$line" = "" ] && [ $(echo $line | awk '{print $2}') = "device" ]; then
        device=$(echo $line | awk '{print $1}')
        echo "$device $@ ..."
        adb -s $device $@
    fi
done
```

## Android 리버스 엔지니어링

### odex를 smali로 변환

```bash
baksmali -a <api_level> -x <odex_file> -d <framework_dir>
```

### smali를 dex로 변환

```bash
java -jar smali.jar framework -o classes.dex
```

### dex를 jar로 변환

```bash
dex2jar classes.dex
```

## ADB TCP/IP 설정 (Tasker)

```bash
su
setprop service.adb.tcp.port 5555
stop adbd
start adbd
```

## 결론

터미널 명령어를 잘 활용하면 Mac에서의 작업 효율을 크게 높일 수 있습니다. 자주 사용하는 명령어는 alias로 등록하거나 스크립트로 만들어 두면 더욱 편리합니다.
