---
layout: post
title: "이마트 쉬는날 확인하기"
date: 2025-12-28 12:00:00 +0900
categories: [knowledge, miscellanea]
tags: [emart, holiday, checker, utility, 이마트, 휴무일]
image: /assets/images/posts/thumbnails/emart-holiday.png
description: "이마트 휴무일을 쉽게 확인할 수 있는 도구입니다. 오늘 쉬는날인지 바로 확인하고, 원하는 날짜를 선택하여 휴무일 여부를 파악할 수 있습니다."
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
