---
layout: post
title: Obsidian으로 daily task 관리하기
date: 2024-01-07
categories: obsidian
tags: [obsidian, task-management, daily-notes, productivity, plugins]
description: obsidian에서 실제 task 관리하고 있는 방법 설명
locale: ko-KR
image: /assets/images/posts/thumbnails/2024-01-07-obsidian-task-management.png
redirect_from:
  - /obsidian/korean/2024/01/07/Obsidian-task-management.html
---

## 목적
- 기존에 todoist앱으로 task 관리를 했었는데, obsidian으로 넘어오면서, task 관리도 obsidian으로 통합하여, task도 기록이 남을 수 있게 하고, task와 노트 사이의 연결이 가능하게 하기

## 왜 Obsidian으로 Task 관리를 하는가?

전용 Task 관리 앱(Todoist, TickTick 등)은 사용하기 편리하지만, 몇 가지 한계가 있습니다:

1. **노트와 Task의 분리**: Task의 맥락을 이해하려면 별도의 노트를 찾아야 합니다.
2. **기록의 분산**: 완료된 Task의 히스토리가 노트와 별도로 관리됩니다.
3. **데이터 소유권**: 대부분의 Task 앱은 데이터를 자체 서버에 저장합니다.

Obsidian으로 Task를 관리하면:
- Task와 관련 노트를 **링크**로 연결할 수 있습니다.
- 모든 Task 이력이 **마크다운 파일**로 남아 영구 보존됩니다.
- Daily Note와 결합하여 **하루 단위의 작업 흐름**을 자연스럽게 관리할 수 있습니다.
- 데이터가 로컬 파일에 저장되어 **완전한 소유권**을 갖습니다.

## 필요 플러그인
- **tasks**: 핵심 플러그인. task의 반복, 일정, 완료 상태 등을 관리
- **templater**: daily note 템플릿에서 동적으로 날짜를 계산
- **daily notes** (core plugin): 매일 새로운 daily note를 자동 생성

### 플러그인 설치 방법
1. Obsidian Settings → Community Plugins → Browse
2. 각 플러그인 이름을 검색하여 설치
3. 설치 후 활성화

## 반복 작업

Tasks 플러그인은 다양한 반복 패턴을 지원합니다.

### daily 반복 작업
아래와 같이 when done을 추가하면, 반복 작업을 설정하면, 완료를 못하고 다음날에 완료하는 경우에 완료 날짜가 다음날로 설정됨.
- [ ] 반복 작업 🔁 every day when done ⏳ 2023-12-28

### year or month 반복 작업
- [ ] 매년 반복 🔁 every year ⏳ 2024-01-01
- [ ] 월별 반복 🔁 every month ⏳ 2024-02-01

### 반복 옵션의 차이

| 옵션 | 설명 | 예시 |
|------|------|------|
| `every day` | 원래 예정일 기준으로 다음 날 생성 | 월요일에 완료 안 해도 화요일이 다음 예정일 |
| `every day when done` | 완료한 날짜 기준으로 다음 날 생성 | 수요일에 완료하면 목요일이 다음 예정일 |
| `every weekday` | 주중만 반복 (월~금) | 주말 제외 |
| `every week on Monday` | 특정 요일에 반복 | 매주 월요일 |

`when done` 옵션은 매일 해야 하지만 놓치면 밀려도 괜찮은 작업(예: 운동, 일기)에 적합합니다. `when done` 없이 사용하면 고정된 일정(예: 주간 회의, 월간 리포트)에 적합합니다.

## Tasks 플러그인 주요 설정

Tasks 플러그인에서 설정해야 할 핵심 옵션들:

1. **`Use filename as Scheduled date for undated tasks`**: 이 옵션을 켜면 daily note에 작성한 task가 자동으로 해당 날짜에 scheduled됩니다.
2. **Global filter**: 특정 태그가 있는 task만 처리하도록 필터링할 수 있습니다.
3. **Task format**: task의 날짜, 반복 등의 이모지 포맷을 설정합니다.

## Daily note Template

- 아래와 같은 데일리 노트 탬플릿을 만든다.
- Templater 플러그인과 Daily notes core plugin사용
	- Templater없이 dataviewjs로 할 수도 있지만, 이 경우, android에서 초기화시에 좀더 시간이 오래걸려서, templater로 daily note생성시에 today를 설정하여, today를 인식위해서 초기화시에 추가 처리를 안하도록 함
- tasks pluging 세팅에서 `Use filename as Scheduled date for undated tasks` 을 켠다
- 각 heading에 task를 추가하면, 해당 날짜에 scheduled된 task가 만들어짐
- tasks 플러그인이 원하는 방향으로 작동하지 않는 경우도 있어서, 수정해서 사용 하고 있음
	- 다음날에 전날 task완료 여부 체크할 때, 다음날에 완료된 것으로 처리되고, daily task가 다다음날로 추가되는 문제 등



<%*
let today = tp.date.now("YYYY-MM-DD",  0, tp.file.title, "YYYY-MM-DD")
%>
### Scheduled
```tasks
happens on or before <% today %>
(not done) OR (done after <% today %>)
group by heading
sort by description
```

### Done
```tasks
done on <% today %>
```
---
### Notes


---

### Work

### Study

### Tasks



## 템플릿 구조 설명

### Scheduled 섹션
- `happens on or before <% today %>`: 오늘 이전에 예정된 task + 오늘 예정된 task를 모두 표시
- `(not done) OR (done after <% today %>)`: 미완료 task와 오늘 이후에 완료된 task를 표시
- `group by heading`: task가 속한 heading별로 그룹화
- 이를 통해 밀린 task도 자동으로 표시됩니다

### Done 섹션
- 오늘 완료한 task를 자동으로 보여줍니다
- 하루의 성과를 한눈에 확인할 수 있습니다

### Work / Study / Tasks 섹션
- 직접 task를 작성하는 영역입니다
- heading 아래에 task를 추가하면 자동으로 해당 daily note의 날짜로 scheduled됩니다

## 활용 팁

### 1. task에 노트 링크 추가
task에 관련 노트를 링크하면 맥락을 바로 파악할 수 있습니다:
```
- [ ] [[프로젝트A]] 기획서 검토 ⏳ 2024-01-15
```

### 2. 우선순위 설정
이모지로 우선순위를 표시할 수 있습니다:
```
- [ ] 긴급한 작업 ⏫
- [ ] 보통 작업 🔼
- [ ] 나중에 해도 되는 작업 🔽
```

### 3. 완료되지 않은 task 추적
아래와 같은 tasks 쿼리를 별도 노트에 작성하면 전체 미완료 task를 한눈에 볼 수 있습니다:
```tasks
not done
sort by due
group by folder
```



