---
layout: post
title: "서버에서 Anki 실행하기: Docker + AnkiConnect API 구축"
date: 2025-12-28 12:00:00 +0900
categories: [devops]
tags: [anki, docker, ankiconnect, api, automation]
image: /assets/images/posts/thumbnails/anki-docker-setup.png
description: "Docker를 사용해 서버에서 Anki를 headless로 실행하고, AnkiConnect API를 통해 단어 추가와 동기화를 자동화하는 방법을 알아봅니다."
---

Anki는 훌륭한 암기 도구이지만, 매번 앱을 열어서 단어를 추가하는 것은 번거롭습니다. 서버에서 Anki를 실행하고 API로 제어할 수 있다면, 다양한 자동화가 가능해집니다.

이 글에서는 Docker를 사용해 서버에서 Anki를 headless로 실행하고, AnkiConnect API를 통해 단어 추가 및 AnkiWeb 동기화를 구현하는 방법을 다룹니다.

## 왜 서버에서 Anki를 실행할까?

- **자동화**: 스크립트나 봇으로 단어를 자동 추가
- **24시간 운영**: 언제든 API 호출 가능
- **통합**: Slack 봇, AI 어시스턴트 등과 연동

## headless-anki Docker 이미지

[headless-anki](https://github.com/ThisIsntTheWay/headless-anki)는 Anki를 headless 모드로 실행하는 Docker 이미지입니다. Xvfb(가상 디스플레이)를 사용해 GUI 없이도 Anki를 실행할 수 있습니다.

### 보안 확인

Docker 이미지를 사용하기 전에 Dockerfile을 검토하는 것이 좋습니다. headless-anki는 다음과 같은 공식 소스만 사용합니다:

- Anki 공식 릴리즈
- AnkiConnect 공식 애드온
- 표준 Linux 패키지

## Docker 이미지 빌드

### 1. 레포지토리 클론

```bash
cd /opt
git clone https://github.com/ThisIsntTheWay/headless-anki.git
cd headless-anki
```

### 2. 이미지 빌드

```bash
docker build \
  --build-arg ANKI_VERSION=25.02.4 \
  --build-arg ANKICONNECT_VERSION=25.2.25.0 \
  --build-arg QT_VERSION=6 \
  -t headless-anki:latest .
```

빌드된 이미지는 약 1.7GB 정도입니다.

## 컨테이너 실행

```bash
docker run -d --name anki \
  -p 8765:8765 \
  -p 5900:5900 \
  -e ANKICONNECT_WILDCARD_ORIGIN=1 \
  -v anki-data:/data \
  --restart unless-stopped \
  headless-anki:latest
```

### 포트 설명

| 포트 | 용도 |
|------|------|
| 8765 | AnkiConnect API |
| 5900 | VNC (GUI 접근용) |

### 환경 변수

- `ANKICONNECT_WILDCARD_ORIGIN=1`: 모든 origin에서의 API 요청 허용

### 볼륨

- `anki-data:/data`: Anki 데이터 영속화

## VNC로 AnkiWeb 로그인

AnkiWeb 동기화를 사용하려면 최초 1회 로그인이 필요합니다.

### VNC 클라이언트 설치

macOS 기본 VNC 클라이언트는 호환성 문제가 있을 수 있습니다. TigerVNC Viewer를 추천합니다.

```bash
brew install --cask tigervnc-viewer
```

### 접속

```
vnc://서버IP:5900
```

VNC로 접속하면 Anki GUI가 표시됩니다. 메뉴에서 AnkiWeb 로그인을 진행합니다.

## AnkiConnect API 사용

### 단어 추가

```bash
curl -s http://localhost:8765 -d '{
  "action": "addNote",
  "version": 6,
  "params": {
    "note": {
      "deckName": "Default",
      "modelName": "Basic",
      "fields": {
        "Front": "apple",
        "Back": "사과"
      }
    }
  }
}'
```

### 이미지 첨부

```bash
# 이미지 다운로드
curl -sL -o /tmp/apple.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/200px-Red_Apple.jpg"

# Base64 인코딩
IMG=$(base64 -w0 /tmp/apple.jpg)

# 미디어 파일 저장
curl -s http://localhost:8765 -d '{
  "action": "storeMediaFile",
  "version": 6,
  "params": {
    "filename": "apple.jpg",
    "data": "'$IMG'"
  }
}'

# 이미지 포함 카드 추가
curl -s http://localhost:8765 -d '{
  "action": "addNote",
  "version": 6,
  "params": {
    "note": {
      "deckName": "Default",
      "modelName": "Basic",
      "fields": {
        "Front": "apple<br><img src=\"apple.jpg\">",
        "Back": "사과"
      }
    }
  }
}'
```

### 동기화

```bash
curl -s http://localhost:8765 -d '{
  "action": "sync",
  "version": 6
}'
```

### 덱 목록 조회

```bash
curl -s http://localhost:8765 -d '{
  "action": "deckNames",
  "version": 6
}'
```

## SSH를 통한 원격 API 호출

로컬에서 서버의 Anki API를 호출하는 방법입니다.

```bash
# 단어 추가
ssh user@server 'curl -s http://localhost:8765 -d "{\"action\":\"addNote\",\"version\":6,\"params\":{\"note\":{\"deckName\":\"Default\",\"modelName\":\"Basic\",\"fields\":{\"Front\":\"WORD\",\"Back\":\"뜻\"}}}}"'

# 동기화
ssh user@server 'curl -s http://localhost:8765 -d "{\"action\":\"sync\",\"version\":6}"'
```

## 활용 예시

### Claude Code Skill

Claude Code에서 Anki 스킬을 만들어 자연어로 단어를 추가할 수 있습니다.

```
"anki에 ephemeral 덧없는 추가해줘"
```

### Slack 봇 연동

Slack 메시지로 단어를 추가하는 봇을 구현할 수 있습니다.

### 웹 스크래핑 자동화

웹페이지에서 단어를 추출해 자동으로 Anki에 추가하는 스크립트를 만들 수 있습니다.

## 트러블슈팅

### VNC 연결 안됨

방화벽에서 5900 포트가 열려있는지 확인합니다.

```bash
# AWS Security Group 또는 iptables 설정 확인
sudo iptables -L -n | grep 5900
```

### API 응답 없음

컨테이너가 정상 실행 중인지 확인합니다.

```bash
docker ps
docker logs anki
```

### 동기화 실패

AnkiWeb 로그인이 만료되었을 수 있습니다. VNC로 접속해 다시 로그인합니다.

## 정리

Docker와 AnkiConnect를 활용하면 서버에서 Anki를 24시간 운영하고, API로 단어 추가 및 동기화를 자동화할 수 있습니다. 이를 통해 다양한 도구와 연동하여 더 효율적인 학습 환경을 구축할 수 있습니다.
