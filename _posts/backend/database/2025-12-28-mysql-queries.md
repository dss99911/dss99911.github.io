---
layout: post
title: "MySQL 쿼리 완벽 가이드 - SELECT, INSERT, UPDATE, JOIN"
date: 2025-12-28 12:03:00 +0900
categories: [backend, database]
tags: [mysql, sql, query, select, insert, update, join]
description: "MySQL의 기본 CRUD 쿼리와 JOIN, 트랜잭션 관리 방법을 예제와 함께 알아봅니다."
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
