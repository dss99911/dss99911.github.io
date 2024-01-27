---
layout: post
title: "ChatGPT로 간단한 앱 만들기"
date: 2024-01-27
categories: ai
---


## 사용한 서비스
- Google Apps Script
- Google Calendar
- Google Sheet
- Slack webhook


## 앱 설명
- 자주 소통하지 않는 직원들끼리의 친목도모를 위해서 매달 랜덤으로 4명씩 그룹을 지어서, 점심을 먹는데, 거기에 사용되는 직원 자동 그룹핑.
- 인도 출장 가능 직원들도 있어서, 출장 일정을 google calendar에서 가져와서, 인도 출장인 경우, 인도 출장자끼리 점심을 먹는다.
- 자주 소통하지 않는 직원들끼리의 친목도모가 핵심이라서, 점심을 먹은 횟수가 적은 직원들끼리 그룹이 형성되도록 google sheet에 히스토리를 저장한다
- Slack으로 생성된 그룹을 매달 1일에 자동으로 전달한다.


## 후기
1. 사람의 코드 수정 작업 없이 chatGPT만으로 앱을 만드는 것이 목표였고, 요구사항을 많이 수정하긴 했지만, 코드부분은 100% chatGPT만으로 만들었다.
2. 처음에는 요구사항을 자세하게 설명해도, 의도를 제대로 파악하지 못한다는 느낌을 받았는데, 개발자가 코딩시작하기에 앞서, 모듈과 함수 설계 후, 각 함수마다 코맨트로 개발할 내용을 적는 것처럼 하면, chatGPT도 쉽게 의도를 이해하고 제대로 코드를 만들어주지 않을까 해서 해봤는데, 잘 작동했다.
3. 데이터 구조는 구체적으로 정의해주는게 좋은 것 같고, 일반적인 기능은 대충 설명해도 알아듣고, 좀 특이한 기능은 구체적으로 설명해줘야 이해를 했다.

4. 코드가 짧으면, 한번에 전체 코드를 작성해주지만, 길어지면, 일부만 구현해준다.
   (첫 버전은 200줄 코드였는데, 한번에 작성해줬고, 두번째 버전은 400줄 코드였는데, 일부막 작성해줬다)
   처음에 전체 요구사항을 알려주고, 각 함수에 대해서 다시 구현 요청하면, 함수 하나 하나씩 잘 만들어준다.
5. 처음 만들어 보는 거라, 코드 하나하나 의도대로 만들었는지 체크 했는데,
   설명이 부실해서 그런 경우 외에, 로직상 문제 있는 경우는 없었다.
   다음에 앱 개발할 때는, 코드 일일이 확인한다고 시간 쓰기 보다는, 일단 실행시켜 보고 작동 안하는 부분만 픽스하는게 시간을 더 절약할 수 있을 것 같다.
6. 코드가 의도된대로 작성되었는지 코드 읽어보지 않고 파악하려면, test코드를 작성해야 한다. TDD가 test할 수 있는 형태로 함수를 만들고, test코드와 코드를 만드는 것인데, calendar, google sheet에 의존성 있는 함수의 경우, TDD를 고려하지 않고, 코드를 생성하면, 테스트하기가 쉽지 않다. 그런데, chatGPT한데, `can you make the function that able to do TDD?` 라고 TDD고려해서 코드 생성해달라니까. 하위 함수들을 알아서 잘 분리해서 코드와 테스트코드도 만들어 준다. chatgpt가 만들어 준 테스트 코드만 보면, 의도대로 코드를 만들었는지 대충 파악 가능할 거라, 테스트 코드 돌려보고, 전체 돌려보고 하면, 앱은 코딩 없이, 코드 리뷰 없이, 테스트 데이터가 의도와 일치하는지 정도만 보면 개발 가능할 것 같다.


## 프롬프트

```
I want to make google apps script code.

I provide the functions with the comment. please implement all.


function getOrCreateSpreadsheet(spreadsheetId) {
	// check the file exists on `spreadSheetId` defined by user. if it doesn't exist, create the spresdsheet file named 'lunch_member.xlsx' on google drive. and create the sheet and header below		
	// 		- 'description' sheet is empty sheet.
	// 		- 'employees' sheet consists of name, id, host_possible with header	
	// 		- 'history' sheet consists of date, location and group_list_json with header	
	// return spredsheet	
}

function getBusinessTrips(calendarId, spreadsheet) {
	// read google calendar of calendarId defined by user  and return the list of trip dictionary
	// trip dictionary ex) {'id': 'user1', 'start_date': '2023-01-01', 'end_date': '2023-02-01'}

	// the period is this month only. so, if the start_date, end_date is out of this month, set start or end of this month.
	// find the employee name from the event title. compare the name on 'employees' sheet and the event title(use the text between "]" and "'s" if they exist). and choose the most similar name on 'employees' sheet by levenshteinDistance. and use id of the name.
	// don't use header on shpreadsheet
}

function findIndiaGroups(calendarId, spreadsheet) {
	// getBusinessTrips
	// make minimum groups.
	// sort the employees by long trip descending
	// create first group.
	// insert employees' id one by one into the group in case the employee's trip period is overlapped more than 4 days.
	// if the employee is not overlapped on all the groups, create new group and insert into the group
	// if the employee count of a group is more than 5, split to fair two group.
	// filter groups containing more than 1 employee only
	// add jace.shin to the group that contains least members.
	// group contains id only.
}


function getCommunicationMapping(spreadsheet) {
	// - load all the rows of group_list from the group_list_json of the sheet 'history', and make communicationMapping variable meaning map<id, map<id, count>>.		
	//		- it shows employees communicate each other how many times.		
 	//		- loop the each group on group_list and update the communicationMapping
 	//		- a group contains id of employees
}

function findGroupForEmployee(employee, groupList, communicationMapping) {
	// - find the minSize and maxSize among groups	
	//	- find the availableGroupList with the condition (group's size < maxSize) or (group's size = min_size)
	//	- find the communicationCount of the group for the employee in availableGroupList	
	//		- communicationCount is the sum of the count that the employee communicate each employee in the group.
	//		- if there is no history of the communication. count is 0	
	//	- return the group that communicationCount is minimum. if there are multiple groups. choose a group randomly.
}

function findKoreaGroups(spreadsheet, indiaGroups) {
	// - getCommunicationMapping
	// - get employeeList excluding the employees on indiaGroups.
	// - get hostCount of each employee on the history. host is the first employee on the group of the group_list on the 'history' sheet. ignore header on the sheet
	// - find the groupCount (4 employees to 1 group. floor(N / 4))		
	// - find the host of the number of group_count in employeeList with the condition below		
	// 		- minimum hostCount
	//		- host_possible = 'true' on 'employees' sheet	
	// - initilize groupList. each group type is list, and contains employees` id. at the first time, each group contains each host.
	// - shuffle employeeList excluding host
	// - move id 'noel.baek' to end of the employeeList		
	// - iterate the employeeList to process findGroupForEmployee, and insert the employee to the group
}


function sendSlackMessage(webhookUrl, indiaGroupList, koreaGroupList, spreadsheet) {
	// - send single message for all group_list of locations		
	// - the message shows groupList with the text format below. add '@' prefix on first 2 employees's id. use employee's name for others		
	// - get name by id from 'employees' google sheet		
	// - <!channel> [{yy}년 {MM}월 '함께하는 점심' 공지 :knife_fork_plate: ]		
	// {yyyy}년 {MM}월 '함께하는 점심' 조를 아래와 같이 공유드립니다.		
	// :moneybag: 지원금액 : 인당 2만원!		
	// 첫번째 분은 호스트, 두번째 분은 보조 호스트입니다.		
	// [Korea]		
	//		{group index}: <@{id}>, <@{id}>, {name}, {name}	
	// [India]
	//		{group index}: <@{id}>, <@{id}>, {name}, {name}	
}


function saveGroupList(indiaGroupList, koreaGroupList, spreadsheet, webhookUrl) {
	// append the groupList json on the sheet 'history' with the date of today, location of 'India' or 'Korea'
	// call sendSlackMessage
}



function process {
	// getOrCreateSpreadsheet
	// findIndiaGroups
	// findKoreaGroups
	// saveGroupList
}

function main {
	// trigger process() on 9am KST 1st day of every month by google apps script schedule
}
```