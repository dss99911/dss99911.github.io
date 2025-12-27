---
layout: post
title: "MySQL 기초 - 명령어, DDL, 테이블 관리"
date: 2025-12-28 12:02:00 +0900
categories: mysql
tags: [mysql, sql, database, ddl, table]
description: "MySQL 접속 방법, DDL(Data Definition Language), 테이블 및 데이터베이스 관리의 기본 명령어를 알아봅니다."
---

# MySQL 접속 및 기본 명령어

## MySQL 접속

```bash
mysql -u root -p -h {server_ip} --port {port}
```

### 옵션 설명
- `-u`: 사용자명
- `-p`: 비밀번호 입력 (프롬프트에서 입력)
- `-h`: 호스트 IP
- `--port` 또는 `-P`: 포트 번호

## mysqldump

데이터베이스 백업을 위한 유틸리티입니다:
- `-h`: host ip
- `-P`: port

---

# DDL (Data Definition Language)

DDL은 데이터베이스 구조를 정의하는 언어입니다.

## 주요 명령어

| 명령어 | 설명 |
|--------|------|
| CREATE | 데이터베이스/테이블/인덱스 등 생성 |
| DROP | 데이터베이스/테이블/인덱스 등 삭제 |
| ALTER | 기존 구조 변경 |

---

# 데이터베이스 관리

## 데이터베이스 생성

```sql
CREATE DATABASE mydb;
```

## 데이터베이스 선택

```sql
connect db_name;
-- 또는
USE db_name;
```

---

# 테이블 관리

## 테이블 목록 조회

```sql
SHOW TABLES;
```

## 테이블 생성

```sql
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255)
);
```

## 테이블 구조 변경

```sql
ALTER TABLE customers ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY;
```

## 테이블 삭제

```sql
DROP TABLE IF EXISTS customers;
```

---

# 테이블 정보 확인

## 테이블 생성 구문 확인

```sql
SHOW CREATE TABLE message_collect;
```

## 테이블 컬럼 및 인덱스 정보

```sql
EXPLAIN message_collect;
-- 또는
DESCRIBE message_collect;
```

---

# 인덱스 관리

## 인덱스 생성

```sql
CREATE INDEX index_name ON table_name (column_name);
```

또는 ALTER TABLE 사용:

```sql
ALTER TABLE message_collect_raw ADD KEY message_collect_raw_key_id (id);
```

---

# Mac에서 MySQL 설정

## my.cnf 파일 위치 찾기

```bash
mysql --help | grep cnf
```

## group by 모드 설정

`my.cnf` 파일에 다음 내용을 추가합니다:

```ini
[mysqld]
sql-mode = STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
```

이 설정은 ONLY_FULL_GROUP_BY 모드를 제외하여 GROUP BY 관련 제약을 완화합니다.
