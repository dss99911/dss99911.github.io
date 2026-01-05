---
layout: post
title: "만 나이 계산기 - 한국 나이 변환"
date: 2025-12-28
categories: [tools, common]
description: "생년월일을 입력하면 만 나이와 한국 나이를 계산해주는 온라인 계산기입니다. 특정 기준일 기준으로도 계산 가능합니다."
tags: [Calculator, Age, Korean Age, 만나이, 나이계산기]
image: /assets/images/posts/thumbnails/korean-age-calculator.png
---

## 만 나이 계산기

생년월일을 입력하면 **만 나이**와 **한국 나이**를 계산합니다.

<div id="age-calculator" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <div style="margin-bottom: 15px;">
    <label for="birthdate" style="display: block; margin-bottom: 5px; font-weight: bold;">생년월일:</label>
    <input type="date" id="birthdate" style="padding: 8px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
  </div>

  <div style="margin-bottom: 15px;">
    <label for="basedate" style="display: block; margin-bottom: 5px; font-weight: bold;">기준일 (선택):</label>
    <input type="date" id="basedate" style="padding: 8px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
    <button onclick="setToday()" style="padding: 8px 12px; margin-left: 5px; cursor: pointer;">오늘</button>
  </div>

  <button onclick="calculateAge()" style="background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">계산하기</button>

  <div id="result" style="margin-top: 20px; padding: 15px; background: white; border-radius: 4px; display: none;">
    <h3 style="margin-top: 0;">계산 결과</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>만 나이</strong></td>
        <td id="intl-age" style="padding: 10px; border-bottom: 1px solid #eee; font-size: 18px; color: #007bff;"></td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>한국 나이 (연 나이)</strong></td>
        <td id="korean-age" style="padding: 10px; border-bottom: 1px solid #eee; font-size: 18px; color: #28a745;"></td>
      </tr>
      <tr>
        <td style="padding: 10px;"><strong>다음 생일까지</strong></td>
        <td id="next-birthday" style="padding: 10px; font-size: 14px; color: #666;"></td>
      </tr>
    </table>
  </div>
</div>

<script>
function setToday() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  document.getElementById('basedate').value = `${yyyy}-${mm}-${dd}`;
}

// 페이지 로드 시 오늘 날짜 설정
document.addEventListener('DOMContentLoaded', setToday);

function calculateAge() {
  const birthdateInput = document.getElementById('birthdate').value;
  const basedateInput = document.getElementById('basedate').value;

  if (!birthdateInput) {
    alert('생년월일을 입력해주세요.');
    return;
  }

  const birthdate = new Date(birthdateInput);
  const basedate = basedateInput ? new Date(basedateInput) : new Date();

  // 만 나이 계산
  let intlAge = basedate.getFullYear() - birthdate.getFullYear();
  const monthDiff = basedate.getMonth() - birthdate.getMonth();
  const dayDiff = basedate.getDate() - birthdate.getDate();

  // 생일이 아직 안 지났으면 1살 빼기
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    intlAge--;
  }

  // 한국 나이 (연 나이) 계산 - 2023년부터 만 나이 사용이지만, 연 나이도 표시
  const koreanAge = basedate.getFullYear() - birthdate.getFullYear() + 1;

  // 다음 생일까지 남은 일수 계산
  let nextBirthday = new Date(basedate.getFullYear(), birthdate.getMonth(), birthdate.getDate());
  if (nextBirthday <= basedate) {
    nextBirthday = new Date(basedate.getFullYear() + 1, birthdate.getMonth(), birthdate.getDate());
  }
  const daysUntilBirthday = Math.ceil((nextBirthday - basedate) / (1000 * 60 * 60 * 24));

  // 결과 표시
  document.getElementById('intl-age').textContent = `${intlAge}세`;
  document.getElementById('korean-age').textContent = `${koreanAge}세`;
  document.getElementById('next-birthday').textContent = `${daysUntilBirthday}일 남음 (${nextBirthday.getFullYear()}년 ${nextBirthday.getMonth() + 1}월 ${nextBirthday.getDate()}일)`;
  document.getElementById('result').style.display = 'block';
}
</script>

---

## 만 나이 vs 한국 나이

| 구분 | 계산 방법 | 예시 (2000년 6월 15일생, 오늘 2025년 12월 28일) |
|------|----------|----------------------------------------------|
| **만 나이** | 생일 지남 여부 반영 | 25세 |
| **한국 나이 (연 나이)** | 현재 연도 - 출생 연도 + 1 | 26세 |

### 2023년 만 나이 통일법

2023년 6월 28일부터 대한민국에서는 법적으로 **만 나이**를 사용합니다.
- 행정, 사법 등 공식 문서에서 만 나이 사용
- 일상에서는 여전히 한국 나이(연 나이) 사용도 병행

---

## 활용 예시

1. **입사 지원**: 공고에 명시된 나이 제한 확인
2. **군 입대**: 병역 관련 나이 계산
3. **연금/보험**: 가입 조건 확인
4. **교육**: 학교 입학 나이 확인
