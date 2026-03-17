---
layout: post
title: "이마트 쉬는날 확인하기"
date: 2025-05-05 12:24:00 +0900
categories: [knowledge, miscellanea]
tags: [emart, holiday, checker, utility, 이마트, 휴무일]
image: /assets/images/posts/thumbnails/emart-holiday.png
description: "이마트 휴무일을 쉽게 확인할 수 있는 도구입니다. 오늘 쉬는날인지 바로 확인하고, 원하는 날짜를 선택하여 휴무일 여부를 파악할 수 있습니다."
redirect_from:
  - "/knowledge/miscellanea/2025/12/28/emart-holiday-checker.html"
---

# 이마트 쉬는날 확인하기

이마트는 매월 **2번째, 4번째 일요일**에 휴무입니다.
이 페이지에서 오늘이 이마트 휴무일인지 바로 확인하거나, 원하는 날짜를 선택하여 휴무일 여부를 확인할 수 있습니다.

---

## 🗓️ 오늘 확인하기

<div id="today-check" style="padding: 20px; border-radius: 8px; margin: 20px 0; background-color: #f8f9fa; border: 2px solid #dee2e6;">
  <h3 style="margin-top: 0; color: #495057;">오늘 날짜</h3>
  <p id="today-date" style="font-size: 1.2em; font-weight: bold; color: #212529;"></p>
  <div id="today-result" style="font-size: 1.5em; font-weight: bold; margin-top: 15px; padding: 15px; border-radius: 5px;"></div>
</div>

---

## 📅 날짜 선택하여 확인하기

<div style="padding: 20px; border-radius: 8px; margin: 20px 0; background-color: #f8f9fa; border: 2px solid #dee2e6;">
  <h3 style="margin-top: 0; color: #495057;">날짜 선택</h3>
  <input type="date" id="date-picker" style="padding: 10px; font-size: 1.1em; border: 1px solid #ced4da; border-radius: 4px; width: 100%; max-width: 300px;">
  <button onclick="checkSelectedDate()" style="margin-top: 15px; padding: 10px 20px; font-size: 1.1em; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">확인하기</button>
  <div id="selected-result" style="font-size: 1.3em; font-weight: bold; margin-top: 20px; padding: 15px; border-radius: 5px;"></div>
</div>

---

## 📋 이마트 휴무일 규칙

- **매월 2번째 일요일** 휴무
- **매월 4번째 일요일** 휴무
- 일부 지점은 예외가 있을 수 있으니, 방문 전 해당 지점에 확인하시기 바랍니다.

---

## 💡 사용 방법

1. **오늘 확인**: 페이지를 열면 자동으로 오늘이 휴무일인지 표시됩니다.
2. **특정 날짜 확인**: 날짜 선택기에서 원하는 날짜를 선택하고 "확인하기" 버튼을 클릭하세요.
3. **결과**: 선택한 날짜가 휴무일이면 빨간색, 영업일이면 초록색으로 표시됩니다.

---

## 이마트 휴무일 관련 자주 묻는 질문

### 모든 이마트 지점이 같은 날 쉬나요?

대부분의 이마트 지점은 매월 2번째, 4번째 일요일에 휴무합니다. 하지만 **일부 지점은 예외**가 있을 수 있습니다. 특히 트레이더스(Traders)나 노브랜드 전문점 등은 별도의 휴무일을 운영하는 경우가 있으므로, 방문 전 해당 지점에 직접 확인하는 것이 가장 정확합니다.

이마트 공식 앱이나 홈페이지에서 지점별 휴무일을 조회할 수 있습니다.

### 이마트 영업시간은 어떻게 되나요?

이마트의 일반적인 영업시간은 **오전 10시부터 오후 11시**까지입니다. 다만 지점에 따라 영업시간이 다를 수 있으며, 명절이나 특별한 행사 기간에는 영업시간이 변경될 수 있습니다.

| 구분 | 시간 |
|------|------|
| **평일** | 10:00 ~ 23:00 |
| **주말** | 10:00 ~ 23:00 |
| **명절 당일** | 대부분 휴무 |

### 이마트 외 다른 대형마트 휴무일은?

다른 대형마트도 유사한 의무 휴업제를 따르고 있습니다:

| 마트 | 휴무일 |
|------|--------|
| **이마트** | 매월 2, 4번째 일요일 |
| **홈플러스** | 매월 2, 4번째 일요일 (지점마다 다를 수 있음) |
| **롯데마트** | 매월 2, 4번째 일요일 (지점마다 다를 수 있음) |
| **코스트코** | 의무 휴업 해당 없음 (별도 휴무일 운영) |

코스트코는 대규모 점포법의 의무 휴업 대상이 아닌 경우가 있어 일요일에도 영업하는 지점이 있습니다. 하지만 이 역시 지역 조례에 따라 달라질 수 있습니다.

### 왜 대형마트가 일요일에 쉬나요?

대형마트 의무 휴업제는 **유통산업발전법**에 근거합니다. 대형마트와 기업형 슈퍼마켓(SSM)은 매월 2일을 의무적으로 쉬어야 합니다. 이 제도는 전통시장과 중소 상인을 보호하기 위해 2012년에 도입되었습니다.

지방자치단체가 휴업일을 지정하며, 대부분의 지자체가 2번째와 4번째 일요일을 휴업일로 지정하고 있습니다. 일부 지역에서는 다른 요일을 지정하거나 1번째, 3번째 일요일로 운영하는 경우도 있습니다.

### 이마트 휴무일에 장보기 대안

이마트 휴무일에 장을 봐야 한다면 다음 대안을 고려해 보세요:

- **온라인 주문**: 쿠팡, 마켓컬리, SSG닷컴 등 당일 또는 새벽 배송 서비스를 이용할 수 있습니다.
- **편의점**: 간단한 식료품은 근처 편의점에서 구입할 수 있습니다.
- **전통시장**: 대형마트 휴무일에는 전통시장이 정상 영업합니다. 오히려 이 날 전통시장을 방문하면 제도의 취지에도 맞습니다.
- **다른 대형마트 확인**: 지역에 따라 이마트와 홈플러스의 휴무일이 다른 경우가 있습니다.

---

<script>
// 이마트 휴무일 확인 함수 (매월 2번째, 4번째 일요일)
function isEmartHoliday(date) {
  const day = date.getDay();

  // 일요일이 아니면 영업일
  if (day !== 0) {
    return false;
  }

  // 해당 월의 몇 번째 일요일인지 계산
  const dateNum = date.getDate();
  const sundayCount = Math.ceil(dateNum / 7);

  // 2번째 또는 4번째 일요일이면 휴무
  return sundayCount === 2 || sundayCount === 4;
}

// 날짜를 한국어 형식으로 포맷팅
function formatDateKorean(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayName = dayNames[date.getDay()];

  return `${year}년 ${month}월 ${day}일 (${dayName})`;
}

// 결과 표시 함수
function displayResult(elementId, date, isHoliday) {
  const resultElement = document.getElementById(elementId);
  const dateStr = formatDateKorean(date);

  if (isHoliday) {
    resultElement.innerHTML = `<span style="color: #dc3545;">🔴 휴무일입니다</span>`;
    resultElement.style.backgroundColor = '#f8d7da';
    resultElement.style.borderLeft = '5px solid #dc3545';
  } else {
    resultElement.innerHTML = `<span style="color: #28a745;">🟢 영업일입니다</span>`;
    resultElement.style.backgroundColor = '#d4edda';
    resultElement.style.borderLeft = '5px solid #28a745';
  }
}

// 오늘 날짜 확인
function checkToday() {
  const today = new Date();
  const todayDateElement = document.getElementById('today-date');
  todayDateElement.textContent = formatDateKorean(today);

  const isHoliday = isEmartHoliday(today);
  displayResult('today-result', today, isHoliday);
}

// 선택한 날짜 확인
function checkSelectedDate() {
  const datePicker = document.getElementById('date-picker');
  const selectedDate = new Date(datePicker.value + 'T00:00:00');

  if (!datePicker.value) {
    alert('날짜를 선택해주세요.');
    return;
  }

  const isHoliday = isEmartHoliday(selectedDate);
  displayResult('selected-result', selectedDate, isHoliday);
}

// 페이지 로드 시 오늘 날짜 자동 확인
window.addEventListener('DOMContentLoaded', function() {
  checkToday();

  // 날짜 선택기 초기값 설정 (오늘)
  const today = new Date();
  const dateString = today.toISOString().split('T')[0];
  document.getElementById('date-picker').value = dateString;
});
</script>

<style>
#today-check, #date-picker {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

button:hover {
  background-color: #0056b3 !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,123,255,0.3);
}

button:active {
  transform: translateY(0);
}

input[type="date"]:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}
</style>
