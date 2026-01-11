---
layout: post
title: "ADB Commands Complete Guide - Android Debug Bridge"
date: 2026-01-11
categories: [mobile, android]
tags: [adb, android, debugging, shell, development-tools]
image: /assets/images/posts/thumbnails/2026-01-11-adb-commands-complete-guide.png
---

Android 개발에서 필수적인 ADB(Android Debug Bridge) 명령어를 상세히 알아봅니다. 디버깅, 앱 관리, 시스템 정보 확인 등 다양한 ADB 활용법을 다룹니다.

## ADB란?

ADB(Android Debug Bridge)는 Android 기기와 통신할 수 있게 해주는 다목적 명령줄 도구입니다. 앱 설치, 디버깅, 시스템 정보 확인 등 다양한 작업을 수행할 수 있습니다.

## 기본 명령어

### 디바이스 연결 및 관리

```bash
# 연결된 디바이스 목록 확인
adb devices

# ADB 서버 재시작 (디바이스 인식 문제 시)
adb kill-server
adb start-server

# 여러 디바이스 중 선택
adb -d logcat        # USB 연결된 디바이스
adb -e logcat        # 에뮬레이터
adb -s <serial> logcat  # 특정 디바이스 (시리얼 번호로 지정)
```

### 쉘 접근

```bash
# 디바이스 쉘 접근
adb shell

# 특정 디바이스 쉘
adb -d shell
```

### WiFi 디버깅

USB 없이 WiFi로 디버깅하는 방법:

```bash
# 디바이스에서 실행 (root 필요)
su
setprop service.adb.tcp.port 5555
stop adbd
start adbd

# PC에서 연결
adb connect <device-ip>:5555
```

## 앱 관리 (PM 명령어)

### 패키지 목록 및 정보

```bash
# 모든 패키지 목록
adb shell pm list packages

# 패키지 파일 경로와 함께
adb shell pm list packages -f

# 특정 앱 패키지 찾기
adb shell pm list packages -f | grep <keyword>

# 시스템 앱만 표시
adb shell pm list packages -s

# 서드파티 앱만 표시
adb shell pm list packages -3

# 비활성화된 앱만
adb shell pm list packages -d

# 활성화된 앱만
adb shell pm list packages -e
```

### APK 설치 및 관리

```bash
# APK 설치
adb install test.apk

# 재설치 (데이터 유지)
adb install -r test.apk

# SD카드에 설치
adb install -s test.apk

# 앱 제거
adb uninstall com.example.app

# 앱 제거 (데이터는 유지)
adb uninstall -k com.example.app

# 앱 데이터 삭제
adb shell pm clear com.example.app
```

### 앱 활성화/비활성화

```bash
# 앱 비활성화
adb shell pm disable com.example.app

# 앱 활성화
adb shell pm enable com.example.app

# 사용자별 비활성화
adb shell pm disable-user com.example.app
```

### 설치 경로 설정

```bash
# 기본 설치 경로 확인
adb shell pm get-install-location

# 설치 경로 변경
# 0: 자동 (시스템 결정)
# 1: 내부 저장소
# 2: 외부 저장소 (SD카드)
adb shell pm set-install-location 2
```

### APK 추출

```bash
# 앱 경로 확인
adb shell pm path com.example.app

# APK 파일 추출
adb pull /data/app/com.example.app-1/base.apk ./
```

## 액티비티 관리 (AM 명령어)

### 액티비티 실행

```bash
# 액티비티 실행
adb shell am start -a android.intent.action.MAIN -n com.example.app/.MainActivity

# 다양한 앱 실행 예시
# 설정 앱
adb shell am start -n com.android.settings/.Settings

# 카메라
adb shell am start -a android.media.action.IMAGE_CAPTURE

# 갤러리
adb shell am start -a android.intent.action.GET_CONTENT -t image/jpeg

# 브라우저로 URL 열기
adb shell am start -a android.intent.action.VIEW http://www.google.com

# 마켓 앱 페이지 열기
adb shell am start "market://details?id=com.example.app"
```

### 서비스 실행

```bash
# 서비스 시작
adb shell am startservice -n com.example.app/.MyService
```

### 브로드캐스트 전송

```bash
# 브로드캐스트 전송
adb shell am broadcast -a android.intent.action.BOOT_COMPLETED

# 커스텀 브로드캐스트
adb shell am broadcast -a com.example.MY_ACTION
```

### 전화 및 메시지

```bash
# 전화 다이얼 (번호 입력만)
adb shell am start -a android.intent.action.DIAL tel:010-1234-5678

# 전화 걸기 (바로 통화)
adb shell am start -a android.intent.action.CALL tel:010-1234-5678

# SMS 보내기
adb shell am start -a android.intent.action.SENDTO -d sms:"010-1234-5678" \
  --es sms_body "테스트 메시지" --ez exit_on_sent true
```

## 시스템 정보 확인 (dumpsys)

### 기본 정보

```bash
# 전체 시스템 정보
adb shell dumpsys

# 메모리 정보
adb shell dumpsys meminfo

# CPU 정보
adb shell dumpsys cpuinfo

# 배터리 정보
adb shell dumpsys battery

# 전원 관리 정보
adb shell dumpsys power
```

### 액티비티 및 프로세스

```bash
# 액티비티 스택 확인
adb shell dumpsys activity

# 현재 실행 중인 액티비티만
adb shell dumpsys activity activities

# 간략한 액티비티 스택
adb shell dumpsys activity activities | grep -i run

# 프로세스 목록
adb shell ps

# UID 확인
adb shell dumpsys package com.example.app | grep userId=

# UID로 패키지 확인
adb shell dumpsys package | grep -A1 userId=10670
```

### 네트워크

```bash
# WiFi 정보
adb shell dumpsys wifi

# 네트워크 통계
adb shell dumpsys netstats
```

### 계정

```bash
# 등록된 계정 정보
adb shell dumpsys account
```

### 윈도우

```bash
# 윈도우 정보
adb shell dumpsys window
```

## 입력 명령어

### 텍스트 입력

```bash
# 텍스트 입력 (긴 URL이나 비밀번호 입력 시 유용)
adb shell input text "hello world"
```

### 키 이벤트

```bash
# 키 이벤트 전송
adb shell input keyevent 22  # DPAD_RIGHT
adb shell input keyevent 66  # ENTER
adb shell input keyevent 3   # HOME
adb shell input keyevent 4   # BACK
```

### 터치 이벤트

```bash
# 특정 좌표 탭
adb shell input tap 500 500

# 스와이프
adb shell input swipe 100 500 900 500
```

## 파일 전송

```bash
# PC에서 디바이스로 파일 전송
adb push local_file.txt /sdcard/

# 디바이스에서 PC로 파일 가져오기
adb pull /sdcard/file.txt ./
```

## 스크린샷 및 화면 녹화

```bash
# 스크린샷
adb shell screencap /sdcard/screenshot.png
adb pull /sdcard/screenshot.png ./

# 화면 녹화 (최대 3분)
adb shell screenrecord /sdcard/recording.mp4
adb pull /sdcard/recording.mp4 ./
```

## Monkey 테스트

랜덤 이벤트로 앱 스트레스 테스트:

```bash
# 1000개의 랜덤 이벤트 생성
adb shell monkey -p com.example.app -v 1000
```

## 로그 확인

```bash
# 로그캣 실행
adb logcat

# 특정 태그만 필터링
adb logcat -s MyTag

# 버퍼 클리어
adb logcat -c

# 파일로 저장
adb logcat > log.txt
```

## 문제 해결

### 디바이스 인식 안 될 때

1. USB 테더링 끄기
2. 케이블 다시 연결
3. ADB 서버 재시작:
```bash
adb kill-server
adb start-server
```

### Mac에서 디바이스 인식 문제

USB 드라이버 문제일 수 있습니다. 개발자 옵션에서 USB 디버깅을 다시 활성화하거나, 다른 USB 포트를 사용해 보세요.

## 유용한 팁

### APK 파일 경로 확인 및 추출

```bash
# 패키지 경로 찾기
adb shell pm list packages -f | grep <app_name>

# 결과 예시
# package:/system/app/Mms.apk=com.android.mms

# APK 추출
adb pull /system/app/Mms.apk ./
```

### GPS 좌표로 지도 열기

```bash
adb shell am start -a android.intent.action.VIEW geo:37.5665,126.9780
```

### 달력 앱 열기

```bash
adb shell am start -n com.android.calendar/com.android.calendar.LaunchActivity
```

## 마무리

ADB는 Android 개발자에게 필수적인 도구입니다. 이 명령어들을 숙지하면 앱 디버깅, 테스트, 시스템 분석 등 다양한 작업을 효율적으로 수행할 수 있습니다. 자주 사용하는 명령어는 별칭(alias)으로 등록해두면 더욱 편리하게 사용할 수 있습니다.

## 참고 자료

- [Android Developer - ADB](https://developer.android.com/studio/command-line/adb)
- [Android Debug Bridge (adb) 공식 문서](https://developer.android.com/tools/adb)
