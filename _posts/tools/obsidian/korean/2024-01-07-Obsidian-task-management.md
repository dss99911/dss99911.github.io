---
layout: post
title: Obsidian으로 daily task 관리하기
date: 2024-01-07
categories: obsidian
tags: [obsidian, task-management, daily-notes, productivity, plugins]
description: obsidian에서 실제 task 관리하고 있는 방법 설명
locale: ko-KR
image: /assets/images/posts/thumbnails/2024-01-07-obsidian-task-management.png
---

## 목적
- 기존에 todoist앱으로 task 관리를 했었는데, obsidian으로 넘어오면서, task 관리도 obsidian으로 통합하여, task도 기록이 남을 수 있게 하고, task와 노트 사이의 연결이 가능하게 하기


## 필요 플러그인
- tasks
- templater
- daily notes (core plugin)

## 반복 작업

### daily 반복 작업
아래와 같이 when done을 추가하면, 반복 작업을 설정하면, 완료를 못하고 다음날에 완료하는 경우에 완료 날짜가 다음날로 설정됨.
- [ ] 반복 작업 🔁 every day when done ⏳ 2023-12-28

### year or month 반복 작업
- [ ] 매년 반복 🔁 every year ⏳ 2024-01-01
- [ ] 월별 반복 🔁 every month ⏳ 2024-02-01

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



