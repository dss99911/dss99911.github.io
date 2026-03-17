---
layout: post
title: "IFTTT로 간편하게 자동화하기"
date: 2025-03-30 10:29:00 +0900
categories: [infra, automation]
tags: [ifttt, automation, rss, email, productivity]
description: "IFTTT(If This Then That)를 활용한 간단한 자동화 방법을 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-ifttt-automation.png
redirect_from:
  - "/infra/automation/2025/12/28/ifttt-automation.html"
---

IFTTT(If This Then That)는 다양한 서비스들을 연결하여 자동화를 구현할 수 있는 플랫폼입니다. "만약 이것이 발생하면 저것을 실행한다"라는 단순한 규칙으로 수백 개의 앱과 서비스를 연동할 수 있습니다.

## IFTTT 기본 개념

IFTTT의 자동화 단위를 **Applet**이라고 합니다. 각 Applet은 다음과 같은 구조를 가집니다:

- **Trigger (If This)**: 자동화를 시작하는 조건. 특정 이벤트가 발생하면 작동합니다.
- **Action (Then That)**: Trigger가 발생했을 때 실행되는 동작입니다.
- **Service**: IFTTT에 연결된 앱이나 디바이스를 의미합니다. Gmail, Google Drive, Slack, 스마트홈 기기 등 700개 이상의 서비스가 지원됩니다.

### 시작하기

1. [IFTTT 웹사이트](https://ifttt.com) 또는 모바일 앱에서 계정 생성
2. 사용할 서비스를 연결 (Google, Twitter, 스마트홈 기기 등)
3. 기존 Applet을 검색하여 사용하거나 직접 새 Applet 생성

## RSS 피드를 이메일로 받기

IFTTT를 사용하면 관심 있는 블로그나 뉴스의 RSS 피드를 이메일로 받아볼 수 있습니다.

### 설정 방법

1. IFTTT 앱 또는 웹사이트에서 새 Applet 생성
2. **If This**: RSS Feed 선택 → "New feed item" 트리거 선택
3. **Then That**: Email 선택 → "Send me an email" 액션 선택
4. 원하는 RSS 피드 URL 입력

이 방법은 특정 기술 블로그의 신규 글, 뉴스 사이트의 업데이트, 또는 경쟁사 동향을 모니터링할 때 유용합니다. RSS 리더 앱을 따로 설치하지 않아도 이메일함에서 새 글을 바로 확인할 수 있습니다.

## 분실폰 찾기 기능

IFTTT로 분실한 폰을 찾는 기능을 설정할 수 있습니다.

### 설정 방법

특정 SMS 메시지를 받으면 벨소리를 최대로 올리는 자동화:

- **Trigger**: SMS 메시지 'lostphone' 수신
- **Action**: 기기 벨소리 볼륨 100%로 설정

이렇게 설정해두면 폰을 분실했을 때 다른 폰에서 'lostphone' 문자를 보내면 벨소리가 최대로 울립니다. 무음 모드에서도 강제로 벨소리가 올라가므로 소파 틈이나 가방 속에 있는 폰을 찾을 때 매우 유용합니다.

## 개발자를 위한 활용 예시

### 서버 모니터링

외부 모니터링 서비스(Uptime Robot 등)와 연동하여 서버 다운타임 발생 시 즉각 알림을 받을 수 있습니다:

- **Trigger**: Webhooks - 특정 URL에 요청 수신
- **Action**: Slack 메시지 전송 또는 전화 알림

### GitHub 활동 알림

팀 프로젝트에서 GitHub 이벤트를 추적할 수 있습니다:

- **Trigger**: GitHub - 새 이슈 생성
- **Action**: Google Sheets에 기록 또는 Slack 알림

### 자동 문서 백업

중요 파일이 변경되면 자동으로 백업합니다:

- **Trigger**: Google Drive - 특정 폴더에 새 파일 추가
- **Action**: Dropbox에 파일 복사

## IFTTT 활용 팁

| 시나리오 | Trigger | Action |
|----------|---------|--------|
| 블로그 새 글 알림 | RSS 피드 업데이트 | 이메일 또는 푸시 알림 |
| 분실폰 찾기 | 특정 SMS 수신 | 볼륨 최대 |
| 날씨 알림 | 특정 날씨 조건 | 푸시 알림 |
| 자동 백업 | 사진 촬영 | 클라우드 업로드 |
| 퇴근 알림 | GPS로 회사 떠남 감지 | 가족에게 메시지 전송 |
| 스마트홈 | 일출/일몰 시간 | 조명 자동 제어 |

## Webhooks 활용

개발자라면 IFTTT의 Webhooks 서비스가 특히 유용합니다. HTTP 요청으로 IFTTT Applet을 트리거하거나, IFTTT에서 특정 URL로 요청을 보낼 수 있습니다:

```bash
# IFTTT Applet 트리거하기
curl -X POST https://maker.ifttt.com/trigger/{event}/with/key/{your-key} \
  -H "Content-Type: application/json" \
  -d '{"value1":"서버 CPU 90% 초과","value2":"server-01"}'
```

Webhooks 키는 IFTTT 설정의 Webhooks 서비스 페이지에서 확인할 수 있습니다.

## 무료 vs 유료 플랜

IFTTT 무료 플랜에서는 최대 2개의 Applet을 직접 만들 수 있으며, 이미 만들어진 공유 Applet은 제한 없이 사용 가능합니다. Pro 플랜에서는 무제한 Applet 생성, 다중 액션, 조건부 로직 등의 고급 기능을 사용할 수 있습니다.

## 결론

IFTTT는 복잡한 코딩 없이도 다양한 자동화를 구현할 수 있는 강력한 도구입니다. 일상적인 작업들을 자동화하여 시간을 절약해 보세요. 더 복잡한 자동화가 필요하다면 Zapier나 n8n 같은 대안도 고려해 볼 수 있지만, 간단한 자동화에는 IFTTT의 직관적인 인터페이스가 가장 적합합니다.
