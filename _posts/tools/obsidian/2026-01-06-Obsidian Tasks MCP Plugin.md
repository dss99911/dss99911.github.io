---
layout: post
title: "AI로 Obsidian 할 일 관리하기 - Tasks MCP Plugin 사용법"
date: 2026-01-06 21:00:00 +0900
categories: [tools, obsidian]
description: "Claude, ChatGPT 등 AI 어시스턴트가 Obsidian Tasks 플러그인과 직접 연동하여 할 일을 추가, 수정, 완료할 수 있게 해주는 Tasks MCP Plugin 사용법을 알아봅니다."
tags: [Obsidian, MCP, AI, Tasks, Claude, Productivity]
---

# AI로 Obsidian 할 일 관리하기 - Tasks MCP Plugin

## MCP란?

**MCP (Model Context Protocol)**는 AI 어시스턴트가 외부 도구와 데이터에 접근할 수 있게 해주는 프로토콜입니다. Anthropic에서 개발했으며, Claude Desktop, Claude Code 등에서 사용됩니다.

MCP를 통해 AI는:
- 파일 시스템 접근
- 데이터베이스 쿼리
- API 호출
- **Obsidian 같은 앱과 연동**

등을 수행할 수 있습니다.

## Tasks MCP Plugin이란?

[Tasks MCP Plugin](https://github.com/dss99911/obsidian-tasks-mcp)은 Obsidian의 [Tasks 플러그인](https://publish.obsidian.md/tasks/Introduction) API를 MCP 서버로 노출시켜, AI 어시스턴트가 할 일을 직접 관리할 수 있게 해줍니다.

### 주요 기능

| 기능 | 설명 |
|------|------|
| `add_task` | 새 할 일 추가 (Daily Note 또는 지정 파일) |
| `query_tasks` | Tasks 쿼리 문법으로 할 일 검색 |
| `update_task` | 할 일 수정 (설명, 날짜, 우선순위 등) |
| `toggle_task` | 완료/미완료 토글 |
| `remove_task` | 할 일 삭제 |
| `list_tasks` | 전체 할 일 목록 조회 |

## 설치 방법

### 1. Obsidian Tasks 플러그인 설치

먼저 Obsidian Community Plugins에서 **Tasks** 플러그인을 설치합니다.

### 2. Tasks MCP Plugin 설치

Community Plugins에서 **Tasks MCP Server**를 검색하여 설치합니다.

> 아직 Community Plugins에 등록 대기 중이라면, [GitHub Release](https://github.com/dss99911/obsidian-tasks-mcp/releases)에서 `main.js`, `manifest.json`을 다운로드하여 `.obsidian/plugins/tasks-mcp/` 폴더에 넣으면 됩니다.

### 3. MCP 클라이언트 설정

Claude Desktop 또는 다른 MCP 클라이언트의 설정 파일에 다음을 추가합니다:

```json
{
  "mcpServers": {
    "obsidian-tasks": {
      "url": "http://localhost:3789/mcp"
    }
  }
}
```

## 활용 사례

### 1. 자연어로 할 일 추가하기

**대화 예시:**
```
사용자: "내일까지 보고서 작성해야 해. 우선순위 높음으로 추가해줘"

AI: add_task 호출 →
    - [ ] 보고서 작성 ⏫ 📅 2026-01-07
```

AI가 자연어를 파싱하여 적절한 날짜, 우선순위와 함께 할 일을 추가합니다.

### 2. 오늘 할 일 확인하기

**대화 예시:**
```
사용자: "오늘 해야 할 일이 뭐야?"

AI: query_tasks 호출 (query: "not done\ndue today")
    → 오늘 마감인 미완료 태스크 목록 반환
```

### 3. 특정 프로젝트 할 일 관리

**대화 예시:**
```
사용자: "#project-x 관련 남은 일 보여줘"

AI: query_tasks 호출 (query: "not done\ntag includes #project-x")
    → 해당 태그의 미완료 태스크 반환
```

### 4. 반복 작업 설정

**대화 예시:**
```
사용자: "매주 월요일마다 주간 회의 준비하는 태스크 만들어줘"

AI: add_task 호출 →
    - [ ] 주간 회의 준비 🔁 every week on Monday
```

### 5. 완료 처리

**대화 예시:**
```
사용자: "보고서 작성 완료했어"

AI: toggle_task 호출 →
    - [x] 보고서 작성 ⏫ 📅 2026-01-07 ✅ 2026-01-06
```

Tasks 플러그인 API를 통해 완료 날짜가 자동으로 추가됩니다.

### 6. 기한 변경

**대화 예시:**
```
사용자: "보고서 마감일 다음 주로 미뤄줘"

AI: update_task 호출 (dueDate: "2026-01-13")
    → 마감일 업데이트
```

### 7. 과거 완료 태스크 분석

**대화 예시:**
```
사용자: "이번 주에 완료한 일 정리해줘"

AI: query_tasks 호출 (query: "done")
    → 완료된 태스크 분석 및 요약
```

## Tasks 쿼리 문법

`query_tasks`에서 사용할 수 있는 필터:

```
# 상태
not done          # 미완료
done              # 완료
in progress       # 진행 중

# 날짜
due today         # 오늘 마감
due before today  # 기한 지남 (overdue)
due 2026-01-15    # 특정 날짜 마감
has due date      # 마감일 있음
no due date       # 마감일 없음

# 태그
tag includes #work
tag does not include #personal

# 경로
path includes Projects
path does not include Archive

# 우선순위
priority is high
priority is medium

# 반복
is recurring
is not recurring

# 조합 (AND/OR/NOT)
not done AND due before today
tag includes #work OR tag includes #urgent
```

## 설정 옵션

플러그인 설정에서 다음을 변경할 수 있습니다:

| 설정 | 기본값 | 설명 |
|------|--------|------|
| Server port | 3789 | MCP 서버 포트 |
| Auto-start server | true | Obsidian 시작 시 자동 실행 |

## 실제 워크플로우 예시

### 아침 루틴
```
사용자: "오늘 할 일 정리해줘"

AI:
📋 오늘 할 일 (2026-01-06):

높은 우선순위:
- [ ] 보고서 작성 ⏫ 📅 2026-01-06

일반:
- [ ] 이메일 확인 📅 2026-01-06
- [ ] 미팅 준비 📅 2026-01-06

⚠️ 기한 지난 작업:
- [ ] 코드 리뷰 📅 2026-01-05
```

### 저녁 정리
```
사용자: "오늘 한 일 정리하고, 못한 건 내일로 미뤄줘"

AI:
✅ 완료된 작업:
- [x] 보고서 작성 ✅ 2026-01-06
- [x] 이메일 확인 ✅ 2026-01-06

📅 내일로 이동:
- [ ] 미팅 준비 📅 2026-01-07 (변경됨)
- [ ] 코드 리뷰 📅 2026-01-07 (변경됨)
```

## 문제 해결

### 서버가 시작되지 않는 경우
1. Tasks 플러그인이 설치되어 있는지 확인
2. 다른 앱이 3789 포트를 사용 중인지 확인
3. 설정에서 포트 번호 변경

### AI가 태스크를 찾지 못하는 경우
1. Tasks 플러그인 형식으로 작성되었는지 확인 (`- [ ]` 형식)
2. 파일이 마크다운 파일(`.md`)인지 확인

## 마무리

Tasks MCP Plugin을 사용하면 AI 어시스턴트가 단순한 대화 상대를 넘어 실제로 할 일을 관리해주는 비서 역할을 할 수 있습니다. 자연어로 말하면 AI가 알아서 적절한 형식으로 변환하여 Obsidian에 저장해주니, 생산성이 크게 향상됩니다.

## 관련 링크

- [Tasks MCP Plugin GitHub](https://github.com/dss99911/obsidian-tasks-mcp)
- [Obsidian Tasks Plugin](https://publish.obsidian.md/tasks/Introduction)
- [MCP Protocol](https://modelcontextprotocol.io/)
