---
layout: post
title: 새해를 맞이하여 Obsidian으로 인생 OKR 작성 및 측정하기
date: 2024-01-08
categories: obsidian
tags: [obsidian, okr, goal-setting, productivity, planning]
description: obsidian으로 OKR 작성하고, 측정하는 방법
locale: ko-KR
image: /assets/images/posts/thumbnails/2024-01-08-okr-obsidian.png
---

## 목적
- 이번 분기의 목표 및 계획 세우기
- 매주/매 분기 달성률 측정할 수 있게하여, 부족한 부분을 쉽게 파악할 수 있게 하여, 회고를 통하여 지속적으로 개선 할 수 있게 하기

## 할일
1. OKR 작성
2. 각 Objective나 task별 노트 생성하고, OKR 페이지에 연결
3. 각 노트에 task 생성
4. OKR페이지에서 매주, 분기별 task달성률을 확인할 수 있게 하고, 각 object, task별 우선순위에 맞춰 점수를 설정하고, 매주, 분기별 score가 자동으로 측정될 수 있게 하기



## 필요 기능
- 매주, 매월, 분기별 task 달성률율을 score로 확인 기능
- 각 task에 okr 태그 및 score 태그 추가


## 노트 구성
- 아래와 같이 okr페이지 및, 각 objective별 노트를 만든다
- key result에 각 objective별 score와 하위 objective의 score를 설정하고, 각 task별 score를 설정한다
- 반복 task의 경우, 한 분기에 몇번을 달성해야할지 [count::91] 와 같이 설정하고, `score * 실제 달성 횟수 / 목표 달성 횟수` 로 점수를 매긴다
- 반복 task는 task명으로 자동으로 group을 형성해서 하나의 task로 인식 한다면, 단일 task도 하나의 group내의 여러 하위 task로 인식하고 싶다면, [group:: groupName] 과 같이 설정하면 된다. 이 경우, 하위 task는 해당 group의 score를 균일하게 나눠가지게 된다.
### OKR 페이지 예시

### Objective
1. 건강
2. 커리어
### Key Results (주요 성과지표)
1. 건강 [score:: 60]
	2. [[운동]] [score:: 30]
	3. 식습관 [score:: 30]
2. 커리어  [score:: 40]
	1. [[AI 활용]] [score:: 20]
	2. ML 공부 [score:: 20]


## 운동 페이지
- [ ] 아침 운동   #okr [period:: 2024 1q] [score:: 20] [count::91] [objective::exercise] 🔁 every day when done ⏳ 2024-01-08
- [x] 아침 운동   #okr [period:: 2024 1q] [score:: 20] [count::91] [objective::exercise] 🔁 every day when done ⏳ 2024-01-08 ✅ 2024-01-09
- [x] 아침 운동   #okr [period:: 2024 1q] [score:: 20] [count::91] [objective::exercise] 🔁 every day when done ⏳ 2024-01-08 ✅ 2024-01-08
- [x] 아침 운동   #okr [period:: 2024 1q] [score:: 20] [count::91] [objective::exercise] 🔁 every day when done ⏳ 2024-01-03 ✅ 2024-01-03
- [x] 아침 운동   #okr [period:: 2024 1q] [score:: 20] [count::91] [objective::exercise] 🔁 every day when done ⏳ 2024-01-02 ✅ 2024-01-02
- [x] 아침 운동   #okr [period:: 2024 1q] [score:: 20] [count::91] [objective::exercise] 🔁 every day when done ⏳ 2024-01-01 ✅ 2024-01-07
- [ ] 팔굽혀펴기 #okr [period:: 2024 1q] [score:: 5] [count::60] [objective::exercise] 🔁 every day when done ⏳ 2024-01-01
- [ ] 다리 운동 #okr [period:: 2024 1q] [score:: 5] [count::60] [objective::exercise] 🔁 every day when done ⏳ 2024-01-08
- [x] 다리 운동 #okr [period:: 2024 1q] [score:: 5] [count::60] [objective::exercise] 🔁 every day when done ⏳ 2024-01-08 ✅ 2024-01-07
- [x] 다리 운동 #okr [period:: 2024 1q] [score:: 5] [count::60] [objective::exercise] 🔁 every day when done ⏳ 2024-01-08 ✅ 2024-01-07
- [x] 다리 운동 #okr [period:: 2024 1q] [score:: 5] [count::60] [objective::exercise] 🔁 every day when done ⏳ 2024-01-08 ✅ 2024-01-07
- [x] 다리 운동 #okr [period:: 2024 1q] [score:: 5] [count::60] [objective::exercise] 🔁 every day when done ⏳ 2024-01-08 ✅ 2024-01-07
- [x] 다리 운동 #okr [period:: 2024 1q] [score:: 5] [count::60] [objective::exercise] 🔁 every day when done ⏳ 2024-01-08 ✅ 2024-01-07
- [x] 다리 운동 #okr [period:: 2024 1q] [score:: 5] [count::60] [objective::exercise] 🔁 every day when done ⏳ 2024-01-08 ✅ 2024-01-07
- [x] 다리 운동 #okr [period:: 2024 1q] [score:: 5] [count::60] [objective::exercise] 🔁 every day when done ⏳ 2024-01-08 ✅ 2024-01-07
- [x] 다리 운동 #okr [period:: 2024 1q] [score:: 5] [count::60] [objective::exercise] 🔁 every day when done ⏳ 2024-01-08 ✅ 2024-01-07
- [x] 다리 운동 #okr [period:: 2024 1q] [score:: 5] [count::60] [objective::exercise] 🔁 every day when done ⏳ 2024-01-01 ✅ 2024-01-07

## AI 활용 페이지
- [x] chatgpt pluging 제대로 활용하기 #okr [period:: 2024 1q] [score:: 10] [objective::career] ✅ 2024-01-07
- [x] 영어 공부 gpt 만들기 #okr [period:: 2024 1q] [group:: chatgpt GPTs 활용][period:: 2024 1q] [score:: 10] [objective::career] ✅ 2024-01-07
- [ ] programmer gpt 만들기 #okr [period:: 2024 1q] [group:: chatgpt GPTs 활용][period:: 2024 1q] [score:: 10] [objective::career]

## Score 통계 내기

```dataviewjs
const period = '2024 1q'
const startDateString = '2024-01-01';
const endDateString = '2024-04-01';
const periodStartDate = new Date(`${startDateString}T00:00:00.000`);
const periodEndDate = new Date(`${endDateString}T00:00:00.000`);
const today = new Date();
console.log(periodStartDate)

function daysDiff(start, end) {
	const timeDifference = end - start;
	const daysDifference = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
	return daysDifference;
}

const totalDays = daysDiff(periodStartDate, periodEndDate);
let passedDays = daysDiff(periodStartDate, today);
dv.paragraph(`Period: ${startDateString} ~ ${endDateString}`)
dv.paragraph(`Days Progress: ${passedDays}/${totalDays}(${(passedDays/ totalDays * 100).toFixed(2)}%)`)


dv.paragraph("### Task Progress")
function formatScore(score) {
	if (score % 1 !== 0) {
		const formattedNumber = score.toFixed(2);
		return formattedNumber.replace(/\.?0+$/, '');
    } else {
	   return score.toString(); // 정수인 경우 그대로 반환
	}
}

function taskCompletedCount(rows) {
	return rows.where(r => r.completed).length
}

function taskTotalCount(rows) {
	return rows[0].count ? rows[0].count : rows.length
}

function taskScore(rows) {
	return rows[0].score * taskCompletedCount(rows) / taskTotalCount(rows)
}

function taskScoreInfo(rows) {
	return formatScore(taskScore(rows)) + "/" + formatScore(rows[0].score)
}

function taskCountInfo(rows) {
	return taskCompletedCount(rows) + "/" + taskTotalCount(rows)
}

function taskGroupName(task) {
	return task.group ? task.group : task.text.split('#okr')[0]
}


let tasks = dv.pages().file.tasks;
let okrTasks = tasks.where(t => t.tags.includes('#okr'))
	.where(t => t.period == period)
let groups = okrTasks.groupBy(t => [t.objective, taskGroupName(t)])
let tableRows = groups.map(t => [t.key[0], t.key[1], taskCountInfo(t.rows), taskScoreInfo(t.rows)])

dv.table(['objective', 'task', 'count', 'score'], tableRows);

let totalScore = groups.map(t => taskScore(t.rows)).array().reduce((acc, currentValue) => acc + currentValue, 0);

dv.paragraph("Total Score: " + formatScore(totalScore))


dv.paragraph("Weekly Progress")

function isStartDay(date) {
	return date.getDay() == 1
}

function countWeeks(start, end) {
	let weeks = 0;
	// 주의 시작을 월요일로 설정
	// 시작 날짜가 월요일이 아닌 경우, 해당 주를 별도로 계산
	start = new Date(start)
	if (!isStartDay(start)) {
	    const daysUntilNextMonday = (8 - start.getDay()) % 7;
	    start.setDate(start.getDate() + daysUntilNextMonday);
		weeks++;
	}

  // 주의 시작 날짜부터 종료 날짜까지 주를 세기

	while (start < end) {
	    weeks++;
	    start.setDate(start.getDate() + 7);
	}

	return weeks;
}

let weekCount = countWeeks(periodStartDate, periodEndDate);

function createNumberList(N) {
	// [0, 1, 2, 3, ...]
	const numberList = [];
	for (let i = 0; i < N; i++) {
	    numberList.push(i);
	}
	return numberList;
}

let weekNumbers = createNumberList(weekCount)
let weekLabels = weekNumbers.map(t => (t + 1) + 'w')

function weekCompleteCount(week, rows, startDate) {
	let weekStart;
	let weekEnd;
	const daysUntilNextMonday = 8 - startDate.getDay();
	if (week == 0) {
		weekStart = new Date(startDate);
		weekEnd = new Date(weekStart);
		weekEnd.setDate(weekEnd.getDate() + daysUntilNextMonday);
	} else {
		weekStart = new Date(startDate)
		weekStart.setDate(weekStart.getDate() + daysUntilNextMonday + (week - 1) * 7)
		weekEnd = new Date(weekStart)
		weekEnd.setDate(weekEnd.getDate() + 7)
	}
	//console.log(`${rows[0].completion} ${weekStart} ${weekEnd}`)
	return rows.where(r => r.completion ? (r.completion >= weekStart && r.completion < weekEnd) : false).length
}

let weeksRows = groups.map(t => [t.key[0], t.key[1]].concat( weekNumbers.map(n => weekCompleteCount(n, t.rows, periodStartDate))))
dv.table(['objective', 'task'].concat(weekLabels), weeksRows)
```





