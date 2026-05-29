---
layout: post
title: "MySQL 함수 가이드 - 문자열, 날짜, CASE 구문"
date: 2025-12-10 16:28:00 +0900
categories: [backend, database]
tags: [mysql, sql, functions, string, date, case]
description: "MySQL의 문자열 함수, 날짜 함수, CASE 구문, CSV 내보내기 방법을 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-mysql-functions.png
redirect_from:
  - "/backend/database/2025/12/28/mysql-functions.html"
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

---

# 숫자 함수

## ROUND, CEIL, FLOOR

```sql
SELECT ROUND(3.567, 2);   -- 3.57 (반올림)
SELECT CEIL(3.1);          -- 4 (올림)
SELECT FLOOR(3.9);         -- 3 (내림)
SELECT TRUNCATE(3.567, 1); -- 3.5 (절삭)
```

## ABS, MOD

```sql
SELECT ABS(-15);           -- 15 (절대값)
SELECT MOD(10, 3);         -- 1 (나머지)
```

---

# 문자열 변환 및 조작

## REPLACE - 문자열 치환

```sql
SELECT REPLACE('Hello World', 'World', 'MySQL');  -- Hello MySQL

-- 실제 활용: 데이터 일괄 치환
UPDATE products
SET description = REPLACE(description, 'old_domain.com', 'new_domain.com');
```

## TRIM - 공백 제거

```sql
SELECT TRIM('  Hello  ');           -- 'Hello'
SELECT LTRIM('  Hello');            -- 'Hello'
SELECT RTRIM('Hello  ');            -- 'Hello'
SELECT TRIM(BOTH ',' FROM ',,Hello,,');  -- 'Hello'
```

## UPPER, LOWER - 대소문자 변환

```sql
SELECT UPPER('hello');    -- 'HELLO'
SELECT LOWER('HELLO');    -- 'hello'
```

## LPAD, RPAD - 패딩

```sql
SELECT LPAD('42', 5, '0');   -- '00042' (왼쪽 0 채우기)
SELECT RPAD('Hi', 10, '.');  -- 'Hi........'
```

---

# 날짜 계산 함수

## DATE_ADD, DATE_SUB

```sql
-- 날짜 더하기
SELECT DATE_ADD('2025-01-01', INTERVAL 30 DAY);     -- 2025-01-31
SELECT DATE_ADD('2025-01-01', INTERVAL 2 MONTH);     -- 2025-03-01
SELECT DATE_ADD('2025-01-01', INTERVAL 1 YEAR);      -- 2026-01-01

-- 날짜 빼기
SELECT DATE_SUB(NOW(), INTERVAL 7 DAY);              -- 7일 전
SELECT DATE_SUB(NOW(), INTERVAL 3 HOUR);              -- 3시간 전
```

## DATEDIFF, TIMESTAMPDIFF

```sql
-- 날짜 차이 (일 단위)
SELECT DATEDIFF('2025-12-31', '2025-01-01');  -- 364

-- 시간 단위 차이
SELECT TIMESTAMPDIFF(HOUR, '2025-01-01 00:00:00', '2025-01-02 12:00:00');  -- 36
SELECT TIMESTAMPDIFF(MONTH, '2025-01-15', '2025-06-15');  -- 5
```

## NOW, CURDATE, CURTIME

```sql
SELECT NOW();      -- 2025-12-10 16:30:45 (현재 날짜와 시간)
SELECT CURDATE();  -- 2025-12-10 (현재 날짜)
SELECT CURTIME();  -- 16:30:45 (현재 시간)
```

## 날짜 부분 추출

```sql
SELECT YEAR('2025-12-10');    -- 2025
SELECT MONTH('2025-12-10');   -- 12
SELECT DAY('2025-12-10');     -- 10
SELECT DAYOFWEEK('2025-12-10');  -- 4 (1=일요일, 4=수요일)
SELECT HOUR(NOW());           -- 현재 시간의 시
```

---

# 조건 함수

## IF

```sql
SELECT IF(score >= 60, 'Pass', 'Fail') AS result FROM students;
```

## IFNULL / COALESCE

NULL 값을 대체할 때 사용합니다:

```sql
-- NULL이면 대체값 반환
SELECT IFNULL(phone, 'N/A') FROM customers;

-- 여러 값 중 첫 번째 NULL이 아닌 값 반환
SELECT COALESCE(phone, mobile, email, 'No Contact') FROM customers;
```

## NULLIF

두 값이 같으면 NULL, 다르면 첫 번째 값을 반환합니다. 0으로 나누기 오류를 방지할 때 유용합니다:

```sql
-- 0으로 나누기 방지
SELECT total / NULLIF(count, 0) AS average FROM stats;
```

---

# 형변환 (CAST / CONVERT)

```sql
-- 문자열을 숫자로
SELECT CAST('123' AS UNSIGNED);
SELECT CAST('2025-12-10' AS DATE);

-- 숫자를 문자열로
SELECT CAST(123 AS CHAR);

-- CONVERT 사용
SELECT CONVERT('123', UNSIGNED);
```

실무에서는 문자열과 숫자 비교 시 묵시적 형변환이 인덱스를 무효화할 수 있으므로, 타입이 다른 컬럼을 비교할 때는 명시적으로 CAST를 사용하는 것이 안전합니다.
