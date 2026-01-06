---
layout: post
title: "MongoDB 가이드 - 특징과 용어 정리"
date: 2025-12-28 12:06:00 +0900
categories: [backend, database]
tags: [mongodb, nosql, database, document-db]
description: "MongoDB의 주요 특징과 RDBMS와의 용어 비교, 설치 방법을 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-mongodb-guide.png
---

# MongoDB 소개

MongoDB는 문서 지향(Document-Oriented) NoSQL 데이터베이스로, 유연한 스키마와 뛰어난 확장성을 제공합니다.

---

# MongoDB의 주요 특징

## 1. Flexible Schema (유연한 스키마)

- 스키마 제약 없이 데이터 저장 가능
- 컬렉션 내 문서마다 다른 필드를 가질 수 있음
- 애플리케이션 요구사항 변화에 빠르게 대응 가능

## 2. Sharding (샤딩)

- 수평적 확장을 통한 부하 분산 가능
- 대용량 데이터와 높은 트래픽 처리에 적합
- 참고: MySQL도 샤딩을 지원하지만, MongoDB는 네이티브로 지원

## 3. 기타 특징

- **Replication**: 고가용성을 위한 복제 기능
- **Indexing**: 다양한 인덱스 유형 지원
- **Aggregation Framework**: 강력한 데이터 집계 기능
- **GridFS**: 대용량 파일 저장 지원

---

# RDBMS vs MongoDB 용어 비교

| RDBMS | MongoDB | 설명 |
|-------|---------|------|
| Database | Database | 데이터베이스 |
| Table | Collection | 테이블/컬렉션 |
| Row | Document | 레코드/문서 |
| Column | Field | 컬럼/필드 |
| Index | Index | 인덱스 |
| Primary Key | _id Field | 기본 키 |
| JOIN | Embedded Documents / $lookup | 관계 표현 |

## 예시

**RDBMS (SQL)**
```sql
SELECT * FROM users WHERE age > 25;
```

**MongoDB**
```javascript
db.users.find({ age: { $gt: 25 } });
```

---

# MongoDB 설치

## Amazon Linux에서 설치

MongoDB 공식 문서에서 Amazon Linux용 설치 가이드를 참고하세요:

1. MongoDB 저장소 설정
2. yum을 통한 패키지 설치
3. 서비스 시작 및 활성화

자세한 설치 방법은 [MongoDB 공식 설치 가이드](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-amazon/)를 참고하세요.

---

# MongoDB 선택 시 고려사항

## MongoDB가 적합한 경우

- 스키마가 자주 변경되는 애플리케이션
- 대용량 비정형 데이터 처리
- 수평적 확장이 필요한 서비스
- 빠른 개발 및 프로토타이핑

## RDBMS가 더 적합한 경우

- 복잡한 트랜잭션이 필요한 경우
- 데이터 간 관계가 복잡한 경우
- ACID 준수가 중요한 경우
- 정형화된 데이터 구조
