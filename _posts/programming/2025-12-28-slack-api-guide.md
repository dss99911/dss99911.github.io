---
layout: post
title: "Slack API 활용 가이드"
date: 2025-12-28
categories: programming
tags: [slack, api, webhook, bot, integration]
---

Slack API를 활용하여 봇을 만들고 메시지를 전송하는 방법을 정리했습니다.

## Message Formatting

### 기본 포맷팅

Slack 메시지 포맷팅 공식 문서: [https://api.slack.com/docs/message-formatting](https://api.slack.com/docs/message-formatting)

### 링크 추가

```json
{"text": "So does this one: <http://www.foo.com|apple>"}
```

### 인용 블록 (라인 추가)

`>` 기호를 사용하여 인용 블록을 만들 수 있습니다:

```
> [MMP-100]
```

## 사용자 입력 받기

Slack에서 사용자 입력을 받는 방법은 세 가지가 있습니다:

1. **버튼**: 몇 가지 조건 중 선택할 수 있습니다
2. **메뉴**: 여러 아이템 중 선택할 수 있습니다
3. **팝업 (Modal)**: 다양한 입력을 받을 수 있습니다

## Slack Bot으로 동적 차트 만들기

Slack Bot에서 동적 차트를 응답으로 생성하는 방법에 대한 튜토리얼:
[How to make your Slack bot create dynamic charts in response](https://tutorials.botsfloor.com/how-to-make-your-slack-bot-create-dynamic-charts-as-response-e67c96ef22fd)

## 앱 관리

Slack 앱 관리 페이지: `https://[workspace].slack.com/apps/manage`

---

## 관련 도구

- **Polly**: Slack에서 설문조사를 만들 수 있는 앱
- **Incoming Webhook**: 외부 서비스에서 Slack으로 메시지를 보내는 가장 간단한 방법
