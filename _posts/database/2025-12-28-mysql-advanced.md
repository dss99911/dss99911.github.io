---
layout: post
title: "MySQL 고급 기능 - GROUP BY, Window Function, Stored Procedure"
date: 2025-12-28 12:04:00 +0900
categories: mysql
tags: [mysql, sql, group-by, window-function, stored-procedure, advanced]
description: "MySQL의 고급 기능인 GROUP BY, Window Function, Stored Procedure와 반복문 사용법을 알아봅니다."
---

# GROUP BY

## GROUP BY 기본 개념

GROUP BY로 그룹화할 때 특정 행을 뽑고 싶다면, 단순히 컬럼을 출력하면 각 컬럼별로 다른 행의 값이 나올 수 있습니다.

동일한 레코드의 값을 정확히 뽑으려면:
1. 조인을 사용하거나
2. **Window Function**을 사용합니다.

## GROUP BY 관련 설정

### sql_mode 확인 및 설정

```sql
-- 현재 설정 확인
SELECT @@sql_mode;

-- 전역 설정 변경
SET GLOBAL sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

-- 세션 설정 변경
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
```

이 설정에서 `ONLY_FULL_GROUP_BY`를 제외하면 GROUP BY 관련 제약이 완화됩니다.

---

# GROUP_CONCAT 함수

같은 그룹의 여러 행 값을 하나의 문자열로 합칠 때 사용합니다.

## 기본 사용법

```sql
SELECT k.id, GROUP_CONCAT(d.value)
FROM keywords AS k
INNER JOIN data AS d ON k.id = d.id
GROUP BY k.id;
```

## 정렬 및 구분자 지정

```sql
SELECT k.id, GROUP_CONCAT(d.value ORDER BY d.name SEPARATOR ' ')
FROM keywords AS k
INNER JOIN data AS d ON k.id = d.id
GROUP BY k.id;
```

---

# Window Function (OVER 절)

Window Function은 행 그룹에 대해 계산을 수행하면서도 개별 행을 유지합니다.

## 누적 합계

```sql
SELECT
    farmer,
    crop_year,
    kilos_produced,
    SUM(kilos_produced) OVER(
        PARTITION BY orange_variety
        ORDER BY crop_year
    ) AS cumulative_previous_years
FROM orange_production
WHERE farmer = 'Pierre';
```

## 그룹별 순번 매기기 (ROW_NUMBER)

```sql
SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY code) AS row_num
FROM company;
```

## 그룹별 카운트

```sql
SELECT
    *,
    COUNT(*) OVER (PARTITION BY company_id) AS company_count
FROM employees;
```

### 주요 Window Function

| 함수 | 설명 |
|------|------|
| `ROW_NUMBER()` | 각 행에 순번 부여 |
| `RANK()` | 동일 값에 같은 순위, 다음 순위 건너뜀 |
| `DENSE_RANK()` | 동일 값에 같은 순위, 다음 순위 연속 |
| `SUM()`, `AVG()`, `COUNT()` | 집계 함수의 윈도우 버전 |
| `LAG()`, `LEAD()` | 이전/다음 행 값 참조 |

---

# Stored Procedure

## 기본 구조

```sql
DELIMITER //
CREATE PROCEDURE GetOfficeByCountry(IN countryName VARCHAR(255))
BEGIN
    SELECT *
    FROM offices
    WHERE country = countryName;
END //
DELIMITER ;
```

## 변수 선언 및 사용

```sql
-- 변수 선언
DECLARE variable_name dataType(size) DEFAULT default_value;

-- 값 할당
SET variable_name = value;

-- 예시
DECLARE total_sale INT DEFAULT 0;
DECLARE x, y INT DEFAULT 0;
SET total_count = 10;
```

## SELECT 결과를 변수에 저장

```sql
DECLARE total_products INT DEFAULT 0;

SELECT COUNT(*) INTO total_products
FROM products;
```

## 파라미터 종류

| 타입 | 설명 |
|------|------|
| IN | 입력 파라미터 (기본값) |
| OUT | 출력 파라미터 |
| INOUT | 입출력 파라미터 |

### OUT 파라미터 예제

```sql
-- 프로시저 호출
CALL CountOrderByStatus('Shipped', @total);

-- 결과 확인
SELECT @total;
```

### INOUT 파라미터 예제

```sql
DELIMITER $$
CREATE PROCEDURE set_counter(INOUT count INT(4), IN inc INT(4))
BEGIN
    SET count = count + inc;
END$$
DELIMITER ;
```

---

# WHILE 반복문

저장 프로시저 내에서 반복 처리가 필요할 때 사용합니다.

```sql
SET @myArrayOfValue = '2,5,2,23,6,';

WHILE (LOCATE(',', @myArrayOfValue) > 0)
DO
    SET @value = ELT(1, @myArrayOfValue);
    SET @myArrayOfValue = SUBSTRING(@myArrayOfValue, LOCATE(',', @myArrayOfValue) + 1);

    INSERT INTO EXAMPLE VALUES(@value, 'hello');
END WHILE;
```

---

# MySQL 버전별 이슈

## MySQL 5.6 이하 TIMESTAMP 제약

MySQL 5.6 이하에서는 하나의 테이블에 `CURRENT_TIMESTAMP`를 사용하는 TIMESTAMP 컬럼이 2개 이상 있으면 오류가 발생합니다:

```
Incorrect table definition; there can be only one TIMESTAMP column with CURRENT_TIMESTAMP in DEFAULT or ON UPDATE clause
```

MySQL 5.6.5 이상에서는 이 제약이 해제되었습니다.
