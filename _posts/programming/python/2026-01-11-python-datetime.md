---
layout: post
title: "Python 날짜와 시간 처리 완벽 가이드"
date: 2026-01-11
categories: [programming, python]
tags: [python, datetime, time, date, calendar]
description: "Python에서 날짜와 시간을 다루는 방법을 상세히 설명합니다. time, datetime, calendar 모듈 사용법과 실전 예제를 포함합니다."
image: /assets/images/posts/python-datetime.png
---

Python에서 날짜와 시간을 다루는 것은 매우 흔한 작업입니다. 이 글에서는 `time`, `datetime`, `calendar` 모듈을 활용한 날짜/시간 처리 방법을 상세히 알아봅니다.

## time 모듈

### 현재 시간 가져오기

```python
import time

# Unix 타임스탬프 (1970년 1월 1일 이후 경과 초)
ticks = time.time()
print(f"타임스탬프: {ticks}")  # 예: 1736582400.123456

# 현재 로컬 시간
localtime = time.localtime(time.time())
print(localtime)
# time.struct_time(tm_year=2026, tm_mon=1, tm_mday=11, ...)
```

### 포맷팅된 시간 출력

```python
import time

# 읽기 쉬운 형식
formatted_time = time.asctime(time.localtime(time.time()))
print(f"현재 시간: {formatted_time}")
# 예: Sat Jan 11 15:30:45 2026

# 간단한 형식
print(time.ctime())
# 예: Sat Jan 11 15:30:45 2026
```

### time.sleep() - 실행 지연

```python
import time

print("작업 시작")
time.sleep(2)  # 2초 대기
print("2초 후 실행")

# 밀리초 단위 대기
time.sleep(0.5)  # 500ms 대기
```

### strftime() - 시간 포맷팅

```python
import time

now = time.localtime()
formatted = time.strftime("%Y-%m-%d %H:%M:%S", now)
print(formatted)  # 예: 2026-01-11 15:30:45

# 다양한 포맷
print(time.strftime("%Y년 %m월 %d일", now))  # 2026년 01월 11일
print(time.strftime("%A, %B %d", now))        # Saturday, January 11
```

### strptime() - 문자열을 시간으로 파싱

```python
import time

date_string = "2026-01-11 15:30:45"
parsed = time.strptime(date_string, "%Y-%m-%d %H:%M:%S")
print(parsed.tm_year)   # 2026
print(parsed.tm_mon)    # 1
print(parsed.tm_mday)   # 11
```

### 주요 포맷 지시자

| 지시자 | 의미 | 예시 |
|--------|------|------|
| %Y | 4자리 연도 | 2026 |
| %y | 2자리 연도 | 26 |
| %m | 월 (01-12) | 01 |
| %d | 일 (01-31) | 11 |
| %H | 시 (24시간) | 15 |
| %I | 시 (12시간) | 03 |
| %M | 분 | 30 |
| %S | 초 | 45 |
| %p | AM/PM | PM |
| %A | 요일 전체 | Saturday |
| %a | 요일 축약 | Sat |
| %B | 월 전체 | January |
| %b | 월 축약 | Jan |
| %j | 연중 일수 | 011 |
| %w | 요일 (0=일) | 6 |

---

## datetime 모듈

`datetime` 모듈은 더 객체지향적이고 사용하기 편리한 API를 제공합니다.

### 현재 날짜와 시간

```python
from datetime import datetime, date, time, timedelta

# 현재 날짜/시간
now = datetime.now()
print(now)  # 2026-01-11 15:30:45.123456

# 현재 날짜만
today = date.today()
print(today)  # 2026-01-11

# 개별 값 접근
print(f"년: {now.year}")
print(f"월: {now.month}")
print(f"일: {now.day}")
print(f"시: {now.hour}")
print(f"분: {now.minute}")
print(f"초: {now.second}")
print(f"마이크로초: {now.microsecond}")
```

### datetime 객체 생성

```python
from datetime import datetime

# 특정 날짜/시간 생성
dt = datetime(2026, 1, 11, 15, 30, 45)
print(dt)  # 2026-01-11 15:30:45

# 날짜만
d = date(2026, 1, 11)
print(d)  # 2026-01-11

# 시간만
t = time(15, 30, 45)
print(t)  # 15:30:45
```

### 날짜 연산 (timedelta)

```python
from datetime import datetime, timedelta

now = datetime.now()

# 시간 더하기
future = now + timedelta(days=7)
print(f"일주일 후: {future}")

# 다양한 단위
one_hour_later = now + timedelta(hours=1)
thirty_min_ago = now - timedelta(minutes=30)
two_weeks = timedelta(weeks=2)

# 복합 연산
complex_delta = timedelta(days=1, hours=12, minutes=30)
result = now + complex_delta
```

### 두 날짜 간의 차이

```python
from datetime import datetime

date1 = datetime(2026, 1, 11)
date2 = datetime(2026, 3, 15)

diff = date2 - date1
print(f"일수 차이: {diff.days}")      # 63
print(f"초 차이: {diff.total_seconds()}")  # 5443200.0
```

### 경과 시간 포맷팅

```python
from datetime import timedelta

# 초를 읽기 쉬운 형식으로
seconds = 3666
formatted = str(timedelta(seconds=seconds))
print(formatted)  # 1:01:06

# 더 복잡한 예
delta = timedelta(days=2, hours=5, minutes=30)
print(delta)  # 2 days, 5:30:00
```

### datetime 포맷팅

```python
from datetime import datetime

now = datetime.now()

# strftime() 사용
formatted = now.strftime("%Y-%m-%d %H:%M:%S")
print(formatted)  # 2026-01-11 15:30:45

# ISO 형식
print(now.isoformat())  # 2026-01-11T15:30:45.123456

# 사용자 정의 형식
print(now.strftime("%Y년 %m월 %d일 %H시 %M분"))
# 2026년 01월 11일 15시 30분
```

### 문자열을 datetime으로 파싱

```python
from datetime import datetime

# strptime() 사용
date_string = "2026-01-11 15:30:45"
dt = datetime.strptime(date_string, "%Y-%m-%d %H:%M:%S")
print(dt)  # 2026-01-11 15:30:45

# 다양한 형식
dt2 = datetime.strptime("11/01/2026", "%d/%m/%Y")
dt3 = datetime.strptime("Jan 11, 2026", "%b %d, %Y")
```

---

## calendar 모듈

### 월별 달력 출력

```python
import calendar

# 2026년 1월 달력 출력
cal = calendar.month(2026, 1)
print(cal)
```

출력:
```
    January 2026
Mo Tu We Th Fr Sa Su
          1  2  3  4
 5  6  7  8  9 10 11
12 13 14 15 16 17 18
19 20 21 22 23 24 25
26 27 28 29 30 31
```

### 연간 달력

```python
import calendar

# 2026년 전체 달력
year_cal = calendar.calendar(2026)
print(year_cal)
```

### 유용한 함수들

```python
import calendar

# 윤년 확인
print(calendar.isleap(2024))  # True
print(calendar.isleap(2026))  # False

# 두 연도 사이 윤년 수
print(calendar.leapdays(2020, 2030))  # 3

# 해당 월의 첫째 날 요일과 일수
weekday, num_days = calendar.monthrange(2026, 1)
print(f"1월 첫째 날: {weekday} (0=월요일)")
print(f"1월 일수: {num_days}")

# 해당 월의 모든 주 목록
weeks = calendar.monthcalendar(2026, 1)
for week in weeks:
    print(week)
```

---

## 실전 예제

### 나이 계산기

```python
from datetime import datetime

def calculate_age(birth_date_str):
    birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d")
    today = datetime.now()
    age = today.year - birth_date.year

    # 생일이 아직 안 지났으면 1 빼기
    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1

    return age

age = calculate_age("1990-05-15")
print(f"나이: {age}세")
```

### 다음 생일까지 남은 일수

```python
from datetime import datetime, date

def days_until_birthday(birth_date_str):
    birth = datetime.strptime(birth_date_str, "%Y-%m-%d")
    today = date.today()

    # 올해 생일
    next_birthday = date(today.year, birth.month, birth.day)

    # 올해 생일이 지났으면 내년 생일
    if next_birthday < today:
        next_birthday = date(today.year + 1, birth.month, birth.day)

    delta = next_birthday - today
    return delta.days

days = days_until_birthday("1990-05-15")
print(f"다음 생일까지 {days}일 남음")
```

### 작업 시간 측정

```python
import time
from datetime import datetime

# 방법 1: time.time() 사용
start = time.time()
# ... 작업 수행 ...
time.sleep(1.5)  # 예시
end = time.time()
print(f"소요 시간: {end - start:.2f}초")

# 방법 2: datetime 사용
start = datetime.now()
# ... 작업 수행 ...
time.sleep(1.5)  # 예시
end = datetime.now()
duration = end - start
print(f"소요 시간: {duration.total_seconds():.2f}초")
```

### D-Day 계산기

```python
from datetime import datetime

def calculate_dday(target_date_str, event_name="D-Day"):
    target = datetime.strptime(target_date_str, "%Y-%m-%d")
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

    diff = target - today

    if diff.days > 0:
        return f"{event_name}까지 {diff.days}일 남음"
    elif diff.days < 0:
        return f"{event_name}로부터 {-diff.days}일 지남"
    else:
        return f"오늘이 {event_name}입니다!"

print(calculate_dday("2026-12-31", "새해"))
```

---

## time 모듈 함수 요약

| 함수 | 설명 |
|------|------|
| `time.time()` | Unix 타임스탬프 반환 |
| `time.localtime([secs])` | 로컬 시간 struct_time 반환 |
| `time.gmtime([secs])` | UTC 시간 struct_time 반환 |
| `time.mktime(tuple)` | struct_time을 타임스탬프로 변환 |
| `time.asctime([tuple])` | 읽기 쉬운 시간 문자열 반환 |
| `time.ctime([secs])` | 타임스탬프를 문자열로 변환 |
| `time.strftime(format[, tuple])` | 시간을 형식화된 문자열로 |
| `time.strptime(string, format)` | 문자열을 struct_time으로 파싱 |
| `time.sleep(secs)` | 지정된 초만큼 대기 |
| `time.clock()` | CPU 시간 반환 (Python 3.3+ 사용 중단) |
| `time.perf_counter()` | 고정밀 성능 카운터 |

---

## 참고 자료

- [Python time 모듈 공식 문서](https://docs.python.org/3/library/time.html)
- [Python datetime 모듈 공식 문서](https://docs.python.org/3/library/datetime.html)
- [Python calendar 모듈 공식 문서](https://docs.python.org/3/library/calendar.html)
