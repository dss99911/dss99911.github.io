---
layout: post
title: "ChatGPT로 Google Apps Script 앱 만들기 - 실전 가이드"
date: 2024-01-27
categories: [knowledge, ai]
description: "ChatGPT만으로 400줄 이상의 Google Apps Script 앱을 개발한 경험담. 점심 그룹 자동화 앱 개발 과정과 효과적인 프롬프트 엔지니어링 기법을 공유합니다."
tags: [ChatGPT, Google Apps Script, Automation, Slack, Google Calendar, Prompt Engineering]
image: /assets/images/posts/thumbnails/chatgpt-apps-script.png
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
	// add manager.user to the group that contains least members.
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
	// - move id 'last.priority' to end of the employeeList		
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

## 코드

```
// Utility function to check if a file exists and create it if it doesn't
function getFileById(id) {
  try {
    return DriveApp.getFileById(id);
  } catch (e) {
    return null;
  }
}

// Function to get or create a spreadsheet
function getOrCreateSpreadsheet(spreadsheetId) {
  let file = getFileById(spreadsheetId);
  let spreadsheet;
  
  if (!file) {
    // Create new spreadsheet if it doesn't exist
    spreadsheet = SpreadsheetApp.create('lunch_member');
    let descriptionSheet = spreadsheet.insertSheet('description');
    let employeesSheet = spreadsheet.insertSheet('employees');
    let historySheet = spreadsheet.insertSheet('history');
    
    // Add headers to 'employees' sheet
    employeesSheet.appendRow(['name', 'id', 'host_possible']);
    
    // Add headers to 'history' sheet
    historySheet.appendRow(['date', 'location', 'group_list_json']);
  } else {
    // Open existing spreadsheet
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  }

  return spreadsheet;
}

function getBusinessTrips(calendarId, spreadsheet) {
  let calendar = CalendarApp.getCalendarById(calendarId);
  let employeesSheet = spreadsheet.getSheetByName('employees');
  let employees = employeesSheet.getDataRange().getValues().slice(1); // Skipping header row
  let now = new Date();
  let startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  let endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  let events = calendar.getEvents(startOfMonth, endOfMonth);
  let trips = [];

  events.forEach(event => {
    let eventTitle = event.getTitle();
    let employeeName = extractNameFromTitle(eventTitle);
    let closestEmployee = findClosestMatch(employeeName, employees);

    let trip = {
      id: closestEmployee ? closestEmployee[1] : null, // Assuming ID is in the second column
      start_date: formatDateWithinMonth(event.getStartTime(), startOfMonth, endOfMonth),
      end_date: formatDateWithinMonth(event.getEndTime(), startOfMonth, endOfMonth)
    };
    trips.push(trip);
  });

  return trips;
}

// Helper function to extract name from event title
function extractNameFromTitle(title) {
  let namePart = title.match(/\](.*?)'s/);
  return namePart ? namePart[1].trim() : title;
}

// Helper function to format the date within the month's bounds
function formatDateWithinMonth(date, startOfMonth, endOfMonth) {
  if (date < startOfMonth) return Utilities.formatDate(startOfMonth, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  if (date > endOfMonth) return Utilities.formatDate(endOfMonth, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}


// Helper function to calculate Levenshtein distance
function levenshteinDistance(a, b) {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = new Array(bn + 1);

  for (let i = 0; i <= bn; ++i) {
    matrix[i] = new Array(an + 1);
    matrix[i][0] = i;
  }

  for (let j = 0; j <= an; ++j) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      const substitutionCost = (a[j - 1] === b[i - 1]) ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + substitutionCost);
    }
  }

  return matrix[bn][an];
}

// Function to find the closest match
function findClosestMatch(name, employees) {
  let lowestDistance = Infinity;
  let closestEmployee = null;

  for (let i = 0; i < employees.length; i++) {
    let employeeName = employees[i][0]; // Assuming name is in the first column
    let distance = levenshteinDistance(name, employeeName);
    if (distance < lowestDistance) {
      lowestDistance = distance;
      closestEmployee = employees[i];
    }
  }

  return closestEmployee;
}

function findIndiaGroups(calendarId, spreadsheet) {
  let trips = getBusinessTrips(calendarId, spreadsheet);

  // Sort trips by duration, longest first
  trips.sort((a, b) => {
    let durationA = new Date(a.end_date) - new Date(a.start_date);
    let durationB = new Date(b.end_date) - new Date(b.start_date);
    return durationB - durationA;
  });

  let groups = [];

  // Function to check if trips overlap by more than 4 days
  function isOverlapping(trip1, trip2) {
    let start1 = new Date(trip1.start_date), end1 = new Date(trip1.end_date);
    let start2 = new Date(trip2.start_date), end2 = new Date(trip2.end_date);
    let overlapStart = Math.max(start1.getTime(), start2.getTime());
    let overlapEnd = Math.min(end1.getTime(), end2.getTime());
    return (overlapEnd - overlapStart) >= (4 * 24 * 60 * 60 * 1000); // 4 days in milliseconds
  }

  // Function to split a group into two fair groups
  function splitGroup(group) {
    let midPoint = Math.ceil(group.length / 2);
    return [group.slice(0, midPoint), group.slice(midPoint)];
  }

  // Creating and organizing groups
  trips.forEach(trip => {
    let added = false;
    for (let group of groups) {
      if (group.some(memberId => isOverlapping(trips.find(t => t.id === memberId), trip))) {
        group.push(trip.id);
        added = true;
        if (group.length > 5) {
          let newGroups = splitGroup(group);
          groups.splice(groups.indexOf(group), 1, ...newGroups);
        }
        break;
      }
    }
    if (!added) {
      groups.push([trip.id]);
    }
  });

  // Filter groups with more than one member
  groups = groups.filter(group => group.length > 1);

  // Add 'manager.user' to the group with the least members
  let groupWithLeastMembers = groups.reduce((res, group) => (group.length < res.length ? group : res), groups[0]);
  groupWithLeastMembers.push('manager.user');

  return groups;
}



function getCommunicationMapping(spreadsheet) {
  let historySheet = spreadsheet.getSheetByName('history');
  let historyData = historySheet.getDataRange().getValues();
  let communicationMapping = {};

  // Iterate over each row in the 'history' sheet, skipping the header row
  for (let i = 1; i < historyData.length; i++) {
    let groupListJson = historyData[i][2]; // Assuming group list JSON is in the third column

    if (groupListJson) {
      let groupList = JSON.parse(groupListJson);

      // Iterate over each group in the group list
      groupList.forEach(group => {
        // Update communication counts for each pair of members in the group
        group.forEach((memberId, idx, arr) => {
          if (!communicationMapping[memberId]) {
            communicationMapping[memberId] = {};
          }

          arr.forEach(otherMemberId => {
            if (memberId !== otherMemberId) {
              if (!communicationMapping[memberId][otherMemberId]) {
                communicationMapping[memberId][otherMemberId] = 0;
              }
              communicationMapping[memberId][otherMemberId]++;
            }
          });
        });
      });
    }
  }

  return communicationMapping;
}


function findGroupForEmployee(employee, groupList, communicationMapping) {
  let minSize = Infinity;
  let maxSize = 0;

  // Find the minimum and maximum sizes among groups
  groupList.forEach(group => {
    let size = group.length;
    minSize = Math.min(minSize, size);
    maxSize = Math.max(maxSize, size);
  });

  let availableGroupList = groupList.filter(group => group.length < maxSize || group.length === minSize);
  let bestGroup = null;
  let lowestCommunicationCount = Infinity;

  // Find the group with the minimum communication count for the employee
  availableGroupList.forEach(group => {
    let communicationCount = group.reduce((count, memberId) => {
      let communicationWithMember = communicationMapping[employee] && communicationMapping[employee][memberId] || 0;
      return count + communicationWithMember;
    }, 0);

    if (communicationCount < lowestCommunicationCount) {
      lowestCommunicationCount = communicationCount;
      bestGroup = group;
    }
  });

  // If there are multiple groups with the same minimum communication count, choose one randomly
  let groupsWithLowestCount = availableGroupList.filter(group => {
    let groupCommunicationCount = group.reduce((count, memberId) => {
      let communicationWithMember = communicationMapping[employee] && communicationMapping[employee][memberId] || 0;
      return count + communicationWithMember;
    }, 0);
    return groupCommunicationCount === lowestCommunicationCount;
  });

  if (groupsWithLowestCount.length > 1) {
    bestGroup = groupsWithLowestCount[Math.floor(Math.random() * groupsWithLowestCount.length)];
  }

  return bestGroup;
}


function findKoreaGroups(spreadsheet, indiaGroups) {
  let communicationMapping = getCommunicationMapping(spreadsheet);
  let employeesSheet = spreadsheet.getSheetByName('employees');
  let employeesData = employeesSheet.getDataRange().getValues().slice(1); // Skipping header row
  let historySheet = spreadsheet.getSheetByName('history');
  let historyData = historySheet.getDataRange().getValues().slice(1); // Skipping header row

  // Create a list of all employees excluding those in India groups
  let indiaGroupMembers = indiaGroups.flat();
  let employeeList = employeesData
    .filter(row => !indiaGroupMembers.includes(row[1])) // Assuming ID is in the second column
    .map(row => ({ id: row[1], name: row[0], host_possible: row[2] === 'true' })); // Assuming host_possible is in the third column

  // Calculate host count for each employee
  let hostCount = {};
  historyData.forEach(row => {
    let groupList = JSON.parse(row[2] || '[]');
    groupList.forEach(group => {
      let hostId = group[0];
      if (hostId) {
        hostCount[hostId] = (hostCount[hostId] || 0) + 1;
      }
    });
  });

  // Determine the number of groups needed
  let groupCount = Math.floor(employeeList.length / 4);
  let groups = [];

  // Find hosts for the groups
  for (let i = 0; i < groupCount; i++) {
    let possibleHosts = employeeList.filter(e => e.host_possible && !groups.flat().includes(e.id));
    let host = possibleHosts.sort((a, b) => (hostCount[a.id] || 0) - (hostCount[b.id] || 0))[0];
    if (host) {
      groups.push([host.id]);
      employeeList = employeeList.filter(e => e.id !== host.id); // Remove host from employee list
    }
  }

  // Shuffle employeeList and move 'last.priority' to the end
  employeeList = shuffleArray(employeeList);
  let lastPriorityIndex = employeeList.findIndex(e => e.id === 'last.priority');
  if (lastPriorityIndex !== -1) {
    let lastPriority = employeeList.splice(lastPriorityIndex, 1)[0];
    employeeList.push(lastPriority);
  }

  // Distribute employees to groups
  employeeList.forEach(employee => {
    let group = findGroupForEmployee(employee.id, groups, communicationMapping);
    if (group) group.push(employee.id);
  });

  return groups;
}

// Helper function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

function sendSlackMessage(webhookUrl, indiaGroupList, koreaGroupList, spreadsheet) {
  let employeesSheet = spreadsheet.getSheetByName('employees');
  let employeesData = employeesSheet.getDataRange().getValues();
  let employeeMap = new Map(employeesData.map(row => [row[1], row[0]])); // Assuming ID is in the second column, Name in the first

  // Helper function to format group list into a message string
  function formatGroupList(groupList, location) {
    let formattedGroups = groupList.map((group, index) => {
      let memberNames = group.map((id, idx) => {
        if (idx < 2) {
          return `<@${id}>`; // Use '@' prefix for the first two members' IDs
        } else {
          return employeeMap.get(id) || id; // Use name for other members
        }
      }).join(', ');
      return `${index + 1}: ${memberNames}`;
    }).join('\n\t\t');

    return `[${location}]\n\t\t${formattedGroups}`;
  }

  // Get current date info
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let yearShort = year.toString().substr(-2);

  // Prepare message
  let message = `<!channel> [${yearShort}년 ${month}월 '함께하는 점심' 공지 :knife_fork_plate: ]\n` +
                `${year}년 ${month}월 '함께하는 점심' 조를 아래와 같이 공유드립니다.\n` +
                `:moneybag: 지원금액 : 인당 2만원!\n` +
                `첫번째 분은 호스트, 두번째 분은 보조 호스트입니다.\n` +
                formatGroupList(koreaGroupList, 'Korea') + '\n' +
                formatGroupList(indiaGroupList, 'India');

  // Post message to Slack
  let options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify({ 'text': message })
  };

  UrlFetchApp.fetch(webhookUrl, options);
  // console.log(message)
}

function saveGroupList(indiaGroupList, koreaGroupList, spreadsheet, webhookUrl) {
  let historySheet = spreadsheet.getSheetByName('history');
  let today = new Date();
  let formattedDate = Utilities.formatDate(today, Session.getScriptTimeZone(), 'yyyy-MM-dd');

  // Helper function to save a group list to the history sheet
  function saveGroupListToHistory(location, groupList) {
    let groupListJson = JSON.stringify(groupList);
    historySheet.appendRow([formattedDate, location, groupListJson]);
  }

  // Save India and Korea group lists
  saveGroupListToHistory('India', indiaGroupList);
  saveGroupListToHistory('Korea', koreaGroupList);

  // Call sendSlackMessage to notify
  sendSlackMessage(webhookUrl, indiaGroupList, koreaGroupList, spreadsheet);
}

function process() {
  // Define the spreadsheet ID, calendar ID, and webhook URL as needed
  let spreadsheetId = SPREADSHEET_ID;
  let indiaCalendarId = CALENDAR_ID; // ID for India calendar
  let koreaCalendarId = 'korea_calendar_id_here'; // ID for Korea calendar, assuming it's different
  let webhookUrl = SLACK_WEBHOOK_URL;

  // Get or create the spreadsheet
  let spreadsheet = getOrCreateSpreadsheet(spreadsheetId);

  // Find groups for India and Korea
  let indiaGroupList = findIndiaGroups(indiaCalendarId, spreadsheet);
  let koreaGroupList = findKoreaGroups(spreadsheet, indiaGroupList);

  // Save group lists and send Slack message
  saveGroupList(indiaGroupList, koreaGroupList, spreadsheet, webhookUrl);
}


function main() {
  ScriptApp.newTrigger('process')
    .timeBased()
    .onMonthDay(1)
    .atHour(9)
    .inTimezone('Asia/Seoul')
    .create();
}

```