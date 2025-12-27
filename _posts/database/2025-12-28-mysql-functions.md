---
layout: post
title: "MySQL 함수 가이드 - 문자열, 날짜, CASE 구문"
date: 2025-12-28 12:05:00 +0900
categories: mysql
tags: [mysql, sql, functions, string, date, case]
description: "MySQL의 문자열 함수, 날짜 함수, CASE 구문, CSV 내보내기 방법을 알아봅니다."
---

# 문자열 함수

## POSITION - 문자열 위치 찾기

```sql
SELECT POSITION("ou" IN "w3resource");  -- 결과: 8
```

## LENGTH와 CHAR_LENGTH

| 함수 | 설명 |
|------|------|
| `LENGTH(str)` | 문자열의 바이트 길이 |
| `CHAR_LENGTH(str)` | 문자열의 문자 수 |

한글 등 멀티바이트 문자에서 차이가 발생합니다.

## SUBSTRING - 문자열 자르기

```sql
SUBSTRING(str, pos, len)  -- pos부터 len만큼
SUBSTRING(str, pos)       -- pos부터 끝까지
```

## CONCAT - 문자열 합치기

```sql
SELECT CONCAT("Hello", " ", "World");  -- 결과: Hello World
```

---

# 날짜 함수

## 날짜 범위 조회

특정 날짜 하루만 조회할 경우:

```sql
WHERE update_date BETWEEN '2016-11-25' AND '2016-11-26'
```

> **참고**: BETWEEN은 시작일 00:00:00부터 종료일 00:00:00까지 포함합니다. 하루 전체를 조회하려면 다음 날을 종료일로 설정합니다.

## DATE_FORMAT - 날짜 형식 지정

```sql
DATE_FORMAT(date, format)
```

### 형식 예시

| 형식 코드 | 출력 예시 |
|----------|----------|
| `'%b %d %Y %h:%i %p'` | Nov 04 2014 11:45 PM |
| `'%m-%d-%Y'` | 11-04-2014 |
| `'%d %b %y'` | 04 Nov 14 |
| `'%d %b %Y %T:%f'` | 04 Nov 2014 11:45:34:243 |

### 주요 형식 지정자

| 지정자 | 설명 |
|--------|------|
| `%Y` | 4자리 연도 |
| `%y` | 2자리 연도 |
| `%m` | 월 (01-12) |
| `%b` | 월 약어 (Jan-Dec) |
| `%d` | 일 (01-31) |
| `%H` | 시 (00-23) |
| `%h` | 시 (01-12) |
| `%i` | 분 (00-59) |
| `%s` | 초 (00-59) |
| `%p` | AM/PM |
| `%T` | 시:분:초 (24시간) |

---

# CASE 구문

조건별로 다른 값을 반환할 때 사용합니다.

## 기본 문법

```sql
SELECT
    OrderID,
    Quantity,
    CASE
        WHEN Quantity > 30 THEN "The quantity is greater than 30"
        WHEN Quantity = 30 THEN "The quantity is 30"
        ELSE "The quantity is under 30"
    END AS QuantityStatus
FROM OrderDetails;
```

## 활용 예시

```sql
SELECT
    name,
    CASE status
        WHEN 'A' THEN 'Active'
        WHEN 'I' THEN 'Inactive'
        WHEN 'P' THEN 'Pending'
        ELSE 'Unknown'
    END AS status_name
FROM users;
```

---

# CSV 내보내기

## 명령줄에서 CSV 생성

MySQL 쿼리 결과를 CSV 파일로 내보내는 방법:

```bash
mysql -h hostname -u username -p --batch -e "SELECT * FROM database.messages" | \
sed 's/"/""/g;s/^/"/g;s/$/"/g;s/[[:cntrl:]]/","/g' > messages.csv
```

### 옵션 설명
- `--batch`: 탭으로 구분된 출력 생성
- `-e "query"`: 실행할 쿼리
- `sed` 명령: 탭을 쉼표로 변환하고 필드를 따옴표로 감싸기

## INTO OUTFILE 사용 (서버에서)

```sql
SELECT *
INTO OUTFILE '/tmp/result.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
FROM table_name;
```

> **주의**: INTO OUTFILE은 MySQL 서버가 실행되는 서버의 파일 시스템에 저장됩니다.
