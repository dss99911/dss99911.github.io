---
layout: post
title: "MySQL 기초 - 명령어, DDL, 테이블 관리"
date: 2025-12-09 13:30:00 +0900
categories: [backend, database]
tags: [mysql, sql, database, ddl, table]
description: "MySQL 접속 방법, DDL(Data Definition Language), 테이블 및 데이터베이스 관리의 기본 명령어를 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-mysql-basics.png
redirect_from:
  - "/backend/database/2025/12/28/mysql-basics.html"
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

---

# 사용자 관리

## 사용자 생성

```sql
CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';
CREATE USER 'newuser'@'%' IDENTIFIED BY 'password';  -- 모든 호스트에서 접속 허용
```

## 권한 부여

```sql
-- 특정 데이터베이스의 모든 권한 부여
GRANT ALL PRIVILEGES ON mydb.* TO 'newuser'@'localhost';

-- 특정 권한만 부여
GRANT SELECT, INSERT, UPDATE ON mydb.* TO 'newuser'@'localhost';

-- 권한 적용
FLUSH PRIVILEGES;
```

## 사용자 조회

```sql
SELECT user, host FROM mysql.user;
```

## 사용자 삭제

```sql
DROP USER 'newuser'@'localhost';
```

---

# 데이터 타입 상세

## 숫자 타입

| 타입 | 바이트 | 범위 (signed) | 용도 |
|------|--------|---------------|------|
| TINYINT | 1 | -128 ~ 127 | 상태값, 플래그 |
| SMALLINT | 2 | -32,768 ~ 32,767 | 작은 코드값 |
| MEDIUMINT | 3 | -8,388,608 ~ 8,388,607 | 중간 크기 |
| INT | 4 | 약 -21억 ~ 21억 | 일반 ID |
| BIGINT | 8 | 매우 큰 범위 | 큰 ID, 타임스탬프 |

## 문자열 타입

```sql
-- CHAR: 고정 길이 (최대 255)
name CHAR(10)       -- 항상 10바이트 사용

-- VARCHAR: 가변 길이 (최대 65,535)
email VARCHAR(255)  -- 실제 데이터 크기 + 1~2바이트

-- TEXT 계열
description TEXT           -- 최대 65,535바이트
content MEDIUMTEXT         -- 최대 16MB
full_content LONGTEXT      -- 최대 4GB
```

## 날짜/시간 타입

| 타입 | 형식 | 범위 |
|------|------|------|
| DATE | YYYY-MM-DD | 1000-01-01 ~ 9999-12-31 |
| TIME | HH:MM:SS | -838:59:59 ~ 838:59:59 |
| DATETIME | YYYY-MM-DD HH:MM:SS | 1000-01-01 ~ 9999-12-31 |
| TIMESTAMP | YYYY-MM-DD HH:MM:SS | 1970-01-01 ~ 2038-01-19 |

`TIMESTAMP`는 시간대(timezone) 변환을 자동으로 처리하므로 글로벌 서비스에서 유용합니다. `DATETIME`은 입력한 값 그대로 저장됩니다.

---

# ALTER TABLE 상세

테이블 구조 변경 시 자주 사용하는 ALTER TABLE 명령어들입니다.

## 컬럼 추가

```sql
ALTER TABLE customers ADD COLUMN email VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE customers ADD COLUMN phone VARCHAR(20) AFTER name;  -- name 컬럼 뒤에 추가
```

## 컬럼 수정

```sql
-- 컬럼 타입 변경
ALTER TABLE customers MODIFY COLUMN name VARCHAR(500);

-- 컬럼명과 타입 동시 변경
ALTER TABLE customers CHANGE COLUMN name full_name VARCHAR(500);
```

## 컬럼 삭제

```sql
ALTER TABLE customers DROP COLUMN phone;
```

## 테이블명 변경

```sql
RENAME TABLE old_name TO new_name;
```

---

# 외래 키 (Foreign Key)

## 외래 키 생성

```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

## ON DELETE / ON UPDATE 옵션

| 옵션 | 설명 |
|------|------|
| CASCADE | 부모 삭제/수정 시 자식도 함께 처리 |
| SET NULL | 부모 삭제/수정 시 자식의 FK를 NULL로 설정 |
| RESTRICT | 자식이 있으면 부모 삭제/수정 불가 (기본값) |
| NO ACTION | RESTRICT와 동일 |

## 외래 키 확인

```sql
-- 테이블의 외래 키 확인
SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'orders' AND CONSTRAINT_SCHEMA = 'mydb';
```

실무에서는 외래 키 제약조건이 성능에 영향을 줄 수 있으므로, 대용량 트래픽 서비스에서는 애플리케이션 레벨에서 참조 무결성을 관리하고 DB에는 외래 키를 설정하지 않는 경우도 많습니다.
