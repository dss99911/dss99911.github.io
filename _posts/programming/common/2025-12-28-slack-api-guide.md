---
layout: post
title: "Slack API 완벽 가이드: 봇 개발부터 메시지 포맷팅까지"
date: 2025-12-28 15:20:00 +0900
categories: [programming, common]
tags: [slack, api, webhook, bot, integration, automation]
description: "Slack API를 활용하여 봇을 만들고, Webhook으로 메시지를 전송하고, 사용자 입력을 처리하는 방법을 상세히 정리했습니다."
---

Slack은 팀 협업 도구로 널리 사용되며, API를 통해 다양한 자동화와 통합이 가능합니다. 이 글에서는 Slack API의 핵심 기능들을 정리합니다.

## 목차
1. [Message Formatting](#message-formatting)
2. [사용자 입력 처리](#사용자-입력-처리)
3. [Incoming Webhook](#incoming-webhook)
4. [동적 차트 생성](#동적-차트-생성)
5. [앱 관리 및 설정](#앱-관리-및-설정)
6. [유용한 도구](#유용한-도구)

---

## Message Formatting

Slack 메시지는 특별한 마크업 문법을 사용합니다. 일반 Markdown과 유사하지만 몇 가지 차이점이 있습니다.

### 공식 문서

- [Slack Message Formatting Guide](https://api.slack.com/docs/message-formatting)

### 기본 텍스트 포맷팅

| 포맷 | 문법 | 결과 |
|------|------|------|
| 굵게 | `*텍스트*` | **텍스트** |
| 기울임 | `_텍스트_` | _텍스트_ |
| 취소선 | `~텍스트~` | ~~텍스트~~ |
| 코드 | `` `텍스트` `` | `텍스트` |
| 코드 블록 | ` ```코드``` ` | 코드 블록 |

### 링크 추가

Slack에서 링크를 추가할 때는 `<URL|표시텍스트>` 형식을 사용합니다:

```json
{
  "text": "자세한 내용은 <http://www.example.com|여기>를 클릭하세요"
}
```

링크 텍스트 없이 URL만 표시할 경우:

```json
{
  "text": "웹사이트 방문: <http://www.example.com>"
}
```

### 인용 블록 (Quote)

`>` 기호를 사용하여 인용 블록을 만들 수 있습니다:

```
> 이것은 인용된 텍스트입니다.
> 여러 줄도 가능합니다.
```

JIRA 티켓 등을 참조할 때 유용합니다:

```
> [PROJ-100] 버그 수정 완료
```

### 멘션 (Mention)

- 사용자 멘션: `<@U1234567890>` (사용자 ID 사용)
- 채널 멘션: `<#C1234567890>` (채널 ID 사용)
- 전체 멘션: `<!channel>`, `<!here>`, `<!everyone>`

### 이모지 사용

콜론으로 감싸서 이모지를 사용합니다:

```
:thumbsup: :fire: :rocket:
```

---

## 사용자 입력 처리

Slack에서 사용자로부터 입력을 받는 세 가지 주요 방법이 있습니다.

### 1. 버튼 (Buttons)

몇 가지 선택지 중 하나를 선택하게 할 때 사용합니다.

```json
{
  "type": "actions",
  "elements": [
    {
      "type": "button",
      "text": {
        "type": "plain_text",
        "text": "승인"
      },
      "style": "primary",
      "action_id": "approve_action"
    },
    {
      "type": "button",
      "text": {
        "type": "plain_text",
        "text": "거절"
      },
      "style": "danger",
      "action_id": "reject_action"
    }
  ]
}
```

**사용 사례:**
- 승인/거절 워크플로우
- 알림에 대한 액션 처리
- 간단한 선택 (예/아니오)

### 2. 메뉴 (Select Menus)

여러 아이템 중 하나 또는 여러 개를 선택할 때 사용합니다.

```json
{
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text": "담당자를 선택하세요:"
  },
  "accessory": {
    "type": "static_select",
    "placeholder": {
      "type": "plain_text",
      "text": "선택..."
    },
    "options": [
      {
        "text": {"type": "plain_text", "text": "옵션 1"},
        "value": "option-1"
      },
      {
        "text": {"type": "plain_text", "text": "옵션 2"},
        "value": "option-2"
      }
    ]
  }
}
```

**메뉴 유형:**
- `static_select`: 정적 옵션 목록
- `users_select`: 워크스페이스 사용자 선택
- `conversations_select`: 채널/DM 선택
- `channels_select`: 채널만 선택
- `multi_static_select`: 다중 선택

### 3. 모달 (Modals/Popups)

복잡한 폼이나 다양한 입력을 받을 때 사용합니다.

```json
{
  "type": "modal",
  "title": {
    "type": "plain_text",
    "text": "버그 리포트"
  },
  "submit": {
    "type": "plain_text",
    "text": "제출"
  },
  "blocks": [
    {
      "type": "input",
      "element": {
        "type": "plain_text_input"
      },
      "label": {
        "type": "plain_text",
        "text": "버그 제목"
      }
    },
    {
      "type": "input",
      "element": {
        "type": "plain_text_input",
        "multiline": true
      },
      "label": {
        "type": "plain_text",
        "text": "상세 설명"
      }
    }
  ]
}
```

**모달 사용 사례:**
- 버그 리포트 폼
- 휴가 신청서
- 설문조사
- 설정 변경

---

## Incoming Webhook

외부 서비스에서 Slack으로 메시지를 보내는 가장 간단한 방법입니다.

### 설정 방법

1. Slack 앱 설정에서 Incoming Webhook 활성화
2. 메시지를 보낼 채널 선택
3. 생성된 Webhook URL 복사

### 기본 사용법

```bash
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Hello, World!"}' \
  https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXX
```

### Python 예제

```python
import requests

webhook_url = "https://hooks.slack.com/services/..."

payload = {
    "text": "서버 배포가 완료되었습니다!",
    "attachments": [
        {
            "color": "#36a64f",
            "title": "배포 정보",
            "fields": [
                {"title": "환경", "value": "Production", "short": True},
                {"title": "버전", "value": "v1.2.3", "short": True}
            ]
        }
    ]
}

response = requests.post(webhook_url, json=payload)
```

### 활용 사례

- CI/CD 파이프라인 알림
- 모니터링 시스템 경고
- 정기 리포트 발송
- 외부 서비스 이벤트 알림

---

## 동적 차트 생성

Slack Bot에서 차트를 생성하여 응답으로 보낼 수 있습니다.

### 참고 자료

- [How to make your Slack bot create dynamic charts in response](https://tutorials.botsfloor.com/how-to-make-your-slack-bot-create-dynamic-charts-as-response-e67c96ef22fd)

### 차트 생성 방법

1. **Chart.js + Puppeteer**: 차트를 HTML로 렌더링 후 이미지로 캡처
2. **QuickChart.io**: URL 기반 차트 생성 API 사용
3. **Plotly**: Python 기반 차트 생성

### QuickChart.io 예제

```python
import urllib.parse

chart_config = {
    "type": "bar",
    "data": {
        "labels": ["1월", "2월", "3월"],
        "datasets": [{
            "label": "매출",
            "data": [100, 150, 200]
        }]
    }
}

chart_url = f"https://quickchart.io/chart?c={urllib.parse.quote(str(chart_config))}"

# Slack 메시지에 이미지로 첨부
payload = {
    "blocks": [
        {
            "type": "image",
            "image_url": chart_url,
            "alt_text": "월별 매출 차트"
        }
    ]
}
```

---

## 앱 관리 및 설정

### 앱 관리 페이지

워크스페이스의 앱 목록 확인 및 관리:

```
https://[워크스페이스].slack.com/apps/manage
```

### Slack App 생성

1. [Slack API 사이트](https://api.slack.com/apps) 접속
2. "Create New App" 클릭
3. 앱 이름과 워크스페이스 선택
4. 필요한 기능 활성화 (Bot, Webhooks, Events 등)

### 권한 (OAuth Scopes)

봇이 수행할 작업에 따라 적절한 권한이 필요합니다:

| 권한 | 설명 |
|------|------|
| `chat:write` | 메시지 전송 |
| `channels:read` | 채널 목록 조회 |
| `users:read` | 사용자 정보 조회 |
| `files:write` | 파일 업로드 |
| `reactions:write` | 이모지 반응 추가 |

---

## 유용한 도구

### Polly

Slack에서 설문조사를 쉽게 만들 수 있는 앱입니다.

**주요 기능:**
- 빠른 투표 생성
- 익명 투표 지원
- 결과 실시간 확인
- 일정 투표

### Block Kit Builder

Slack 메시지의 레이아웃을 시각적으로 디자인할 수 있는 도구입니다.

- [Block Kit Builder](https://app.slack.com/block-kit-builder)

### Slack API Tester

API 호출을 테스트할 수 있는 도구입니다.

- [API Tester](https://api.slack.com/methods)

---

## 마무리

Slack API는 단순한 메시지 전송부터 복잡한 워크플로우 자동화까지 다양한 기능을 제공합니다. 팀의 생산성을 높이기 위해 적절한 기능을 선택하여 활용해보세요.

### 추가 학습 자료

- [Slack API 공식 문서](https://api.slack.com/)
- [Slack Block Kit](https://api.slack.com/block-kit)
- [Slack Events API](https://api.slack.com/events-api)
- [Slack Bolt Framework](https://slack.dev/bolt-python/tutorial/getting-started)
