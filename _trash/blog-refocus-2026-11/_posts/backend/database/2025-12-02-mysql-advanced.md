---
layout: post
title: "MySQL 고급 기능 - GROUP BY, Window Function, Stored Procedure"
date: 2025-12-02 09:35:00 +0900
categories: [backend, database]
tags: [mysql, sql, group-by, window-function, stored-procedure, advanced]
description: "MySQL의 고급 기능인 GROUP BY, Window Function, Stored Procedure와 반복문 사용법을 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-mysql-advanced.png
redirect_from:
  - "/backend/database/2025/12/28/mysql-advanced.html"
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

---

# CTE (Common Table Expression)

MySQL 8.0부터 지원되는 CTE는 복잡한 쿼리를 읽기 쉽게 분리하는 기능입니다.

## 기본 CTE

```sql
WITH high_salary_employees AS (
    SELECT department_id, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department_id
    HAVING AVG(salary) > 70000
)
SELECT d.name, h.avg_salary
FROM departments d
INNER JOIN high_salary_employees h ON d.id = h.department_id;
```

## 재귀 CTE

계층 구조 데이터(조직도, 카테고리 트리 등)를 조회할 때 유용합니다:

```sql
WITH RECURSIVE org_tree AS (
    -- 기본 케이스 (최상위 관리자)
    SELECT id, name, manager_id, 0 AS level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- 재귀 케이스
    SELECT e.id, e.name, e.manager_id, t.level + 1
    FROM employees e
    INNER JOIN org_tree t ON e.manager_id = t.id
)
SELECT * FROM org_tree ORDER BY level, name;
```

---

# 조건부 집계

집계 함수와 CASE 문을 결합하면 조건별 통계를 하나의 쿼리로 처리할 수 있습니다:

```sql
SELECT
    department_id,
    COUNT(*) AS total_employees,
    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_count,
    SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactive_count,
    AVG(CASE WHEN gender = 'M' THEN salary END) AS avg_male_salary,
    AVG(CASE WHEN gender = 'F' THEN salary END) AS avg_female_salary
FROM employees
GROUP BY department_id;
```

이 패턴은 피벗 테이블과 유사한 결과를 만들어내며, 리포트 작성 시 매우 자주 사용됩니다.

---

# 실행 계획 분석 (EXPLAIN)

쿼리 성능을 최적화하려면 실행 계획을 분석하는 것이 필수입니다.

```sql
EXPLAIN SELECT e.name, d.name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE e.salary > 50000;
```

## EXPLAIN 결과 주요 항목

| 항목 | 의미 | 최적 |
|------|------|------|
| type | 접근 방식 | const > eq_ref > ref > range > index > ALL |
| key | 사용된 인덱스 | NULL이면 인덱스 미사용 |
| rows | 예상 스캔 행 수 | 작을수록 좋음 |
| Extra | 추가 정보 | Using index (커버링 인덱스) |

`type`이 `ALL`(풀 테이블 스캔)인 경우 반드시 인덱스 추가를 검토해야 합니다. 대용량 테이블에서 풀 스캔은 심각한 성능 저하를 유발합니다.

---

# 대용량 데이터 처리 팁

## 대량 INSERT 최적화

```sql
-- 트랜잭션으로 묶어서 처리 (성능 향상)
START TRANSACTION;
INSERT INTO logs (message, created_at) VALUES ('log1', NOW());
INSERT INTO logs (message, created_at) VALUES ('log2', NOW());
-- ... 수천 건
COMMIT;

-- LOAD DATA INFILE (가장 빠름)
LOAD DATA INFILE '/path/to/data.csv'
INTO TABLE logs
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n';
```

## 대량 DELETE 최적화

수백만 건 이상을 한 번에 삭제하면 테이블 락이 오래 유지되어 서비스에 영향을 줍니다. 배치로 나눠서 삭제하는 것이 안전합니다:

```sql
-- 배치 삭제 패턴
DELETE FROM old_logs
WHERE created_at < '2024-01-01'
LIMIT 10000;
-- 영향받은 행이 0이 될 때까지 반복
```

## 파티셔닝

대용량 테이블은 파티셔닝을 통해 성능을 개선할 수 있습니다:

```sql
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT,
    order_date DATE,
    amount DECIMAL(10,2),
    PRIMARY KEY (id, order_date)
) PARTITION BY RANGE (YEAR(order_date)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);
```

파티셔닝을 적용하면 특정 기간의 데이터를 조회할 때 해당 파티션만 스캔하므로 쿼리 성능이 크게 향상됩니다.
