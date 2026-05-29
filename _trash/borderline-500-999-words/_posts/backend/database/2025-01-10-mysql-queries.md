---
layout: post
title: "MySQL 쿼리 완벽 가이드 - SELECT, INSERT, UPDATE, JOIN"
date: 2025-01-10 19:12:00 +0900
categories: [backend, database]
tags: [mysql, sql, query, select, insert, update, join]
description: "MySQL의 기본 CRUD 쿼리와 JOIN, 트랜잭션 관리 방법을 예제와 함께 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-mysql-queries.png
redirect_from:
  - "/backend/database/2025/12/28/mysql-queries.html"
---

# SELECT 문

## 기본 조회와 페이지네이션

```sql
-- OFFSET과 LIMIT 사용 (3번째부터 5개 조회)
SELECT * FROM customers LIMIT 5 OFFSET 2;

-- 간단한 형식 (3번째부터 5개 조회)
SELECT * FROM customers LIMIT 2, 5;
```

> **참고**: `LIMIT offset, count` 형식에서 offset은 0부터 시작합니다.

---

# INSERT 문

## 단일 레코드 삽입

```sql
INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37');
```

## 다중 레코드 삽입

```sql
INSERT INTO tbl_name (a, b, c) VALUES
    (1, 2, 3),
    (4, 5, 6),
    (7, 8, 9);
```

## 테이블 간 데이터 복사

특정 필드와 조건을 설정하여 다른 테이블에서 복사할 수 있습니다:

```sql
INSERT INTO table2 (st_id, uid, changed, status, assign_status)
SELECT st_id, from_uid, NOW(), 'Pending', 'Assigned'
FROM table1;
```

---

# UPDATE 문

## 기본 UPDATE

```sql
UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;
```

## JOIN을 이용한 UPDATE

다른 테이블과 조인하여 업데이트할 수 있습니다:

```sql
UPDATE message_collect c
INNER JOIN message_review r ON c.id = r.id
SET c.review_id = c.id;
```

---

# JOIN

## JOIN 유형

| JOIN 타입 | 설명 |
|-----------|------|
| INNER JOIN | 두 테이블에 모두 존재하는 데이터 |
| LEFT JOIN | 왼쪽 테이블 기준, 오른쪽이 없어도 포함 |
| RIGHT JOIN | 오른쪽 테이블 기준, 왼쪽이 없어도 포함 |
| LEFT OUTER JOIN | LEFT JOIN과 동일 |

## LEFT JOIN 예제

테이블 A에는 있지만 테이블 B에는 없는 데이터 찾기:

```sql
SELECT P.id, sequence, priority
FROM message_pattern P
LEFT JOIN message_review R ON P.id = R.id
WHERE R.id IS NULL;
```

## 참고 자료

JOIN의 시각적 이해를 위해 [Visual Representation of SQL Joins](https://www.codeproject.com/articles/33052/visual-representation-of-sql-joins)를 참고하세요.

---

# 트랜잭션 관리

## MySQL Workbench에서 롤백하기

```sql
-- autocommit 비활성화 (세션 동안만 유지)
SET autocommit = 0;

-- 작업 수행 후 커밋
COMMIT;

-- 또는 롤백
ROLLBACK;
```

## 테이블 잠금

```sql
-- 테이블 잠금
LOCK TABLES tbl_name [AS alias] lock_type;

-- lock_type:
-- READ [LOCAL]
-- [LOW_PRIORITY] WRITE

-- 잠금 해제
UNLOCK TABLES;
```

## 변수 사용

쿼리에서 변수를 사용할 수 있습니다:

```sql
SET @checkId = "0001458638425331026bb7b466a50001";

SELECT * FROM table_name WHERE id = @checkId;
```

---

# LIKE 연산자와 이스케이프 문자

MySQL에서 인식하는 이스케이프 시퀀스:

| 시퀀스 | 설명 |
|--------|------|
| `\0` | ASCII NUL (0x00) |
| `\'` | 작은따옴표 |
| `\"` | 큰따옴표 |
| `\b` | 백스페이스 |
| `\n` | 줄바꿈 |
| `\r` | 캐리지 리턴 |
| `\t` | 탭 |
| `\\` | 백슬래시 |
| `\%` | 퍼센트 기호 (LIKE에서 와일드카드가 아닌 문자로) |
| `\_` | 언더스코어 (LIKE에서 와일드카드가 아닌 문자로) |

백슬래시를 검색하려면 `\\\\`를 사용해야 합니다.

### LIKE 패턴 매칭 예제

```sql
-- 'Kim'으로 시작하는 이름 검색
SELECT * FROM customers WHERE name LIKE 'Kim%';

-- 이메일이 gmail.com으로 끝나는 사용자
SELECT * FROM customers WHERE email LIKE '%@gmail.com';

-- 이름에 'park'가 포함된 경우 (대소문자 구분 없음)
SELECT * FROM customers WHERE name LIKE '%park%';

-- 정확히 5글자인 이름
SELECT * FROM customers WHERE name LIKE '_____';

-- 실제 퍼센트 기호를 포함하는 값 검색
SELECT * FROM products WHERE description LIKE '%\%%';
```

---

# UPSERT (INSERT ON DUPLICATE KEY UPDATE)

데이터가 이미 존재하면 업데이트하고, 없으면 삽입하는 패턴입니다:

```sql
INSERT INTO daily_stats (date, page_views, unique_visitors)
VALUES ('2025-01-10', 1500, 800)
ON DUPLICATE KEY UPDATE
    page_views = VALUES(page_views),
    unique_visitors = VALUES(unique_visitors);
```

이 패턴은 배치 처리나 데이터 동기화 작업에서 매우 자주 사용됩니다. Primary Key 또는 Unique Key가 중복되면 UPDATE가 실행됩니다.

---

# REPLACE INTO

INSERT ON DUPLICATE KEY UPDATE와 유사하지만, 기존 행을 삭제하고 새로 삽입합니다:

```sql
REPLACE INTO customers (id, name, address)
VALUES (1, 'New Company', 'New Address');
```

> **주의**: REPLACE는 DELETE + INSERT로 동작하므로 AUTO_INCREMENT 값이 변경될 수 있고, 외래 키 참조가 있는 경우 CASCADE DELETE가 발생할 수 있습니다.

---

# 서브쿼리 활용

## WHERE 절의 서브쿼리

```sql
-- 평균 주문 금액보다 큰 주문 조회
SELECT * FROM orders
WHERE amount > (SELECT AVG(amount) FROM orders);

-- 주문 이력이 있는 고객만 조회
SELECT * FROM customers
WHERE id IN (SELECT DISTINCT customer_id FROM orders);
```

## FROM 절의 서브쿼리 (인라인 뷰)

```sql
-- 카테고리별 최고가 상품 조회
SELECT p.*
FROM products p
INNER JOIN (
    SELECT category_id, MAX(price) AS max_price
    FROM products
    GROUP BY category_id
) t ON p.category_id = t.category_id AND p.price = t.max_price;
```

## EXISTS 서브쿼리

IN 대신 EXISTS를 사용하면 대량 데이터에서 성능이 더 좋을 수 있습니다:

```sql
SELECT * FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.id
);
```

---

# DELETE 문

## 기본 DELETE

```sql
DELETE FROM customers WHERE id = 100;
```

## JOIN을 이용한 DELETE

다른 테이블과 조인하여 조건에 맞는 레코드를 삭제합니다:

```sql
DELETE c FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.customer_id IS NULL;
```

## LIMIT을 이용한 DELETE

대량 삭제 시 서버 부하를 줄이기 위해 나눠서 삭제합니다:

```sql
DELETE FROM log_table
WHERE created_at < '2024-01-01'
LIMIT 10000;
```

---

# 쿼리 성능 확인 (EXPLAIN)

쿼리 실행 계획을 확인하여 성능을 분석할 수 있습니다:

```sql
EXPLAIN SELECT * FROM customers
WHERE name = 'Company Inc';
```

EXPLAIN 결과에서 주요 확인 항목:

| 항목 | 설명 |
|------|------|
| `type` | 접근 방식 (ALL, index, range, ref, const 등) |
| `key` | 사용된 인덱스 |
| `rows` | 예상 스캔 행 수 |
| `Extra` | 추가 정보 (Using where, Using index 등) |

`type`이 `ALL`이면 풀 테이블 스캔이므로 인덱스 추가를 고려해야 합니다.
