---
layout: post
title: "MongoDB 가이드 - 특징과 용어 정리"
date: 2025-02-24 14:05:00 +0900
categories: [backend, database]
tags: [mongodb, nosql, database, document-db]
description: "MongoDB의 주요 특징과 RDBMS와의 용어 비교, 설치 방법을 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-mongodb-guide.png
redirect_from:
  - "/backend/database/2025/12/28/mongodb-guide.html"
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

---

# MongoDB 기본 CRUD 명령어

MongoDB의 셸(mongosh)에서 사용하는 기본 명령어를 살펴봅니다.

## 데이터베이스 및 컬렉션 관리

```javascript
// 현재 데이터베이스 확인
db

// 데이터베이스 목록
show dbs

// 데이터베이스 선택 (없으면 자동 생성)
use myDatabase

// 컬렉션 목록
show collections

// 컬렉션 생성
db.createCollection("users")

// 컬렉션 삭제
db.users.drop()
```

## INSERT (삽입)

```javascript
// 단일 문서 삽입
db.users.insertOne({
    name: "홍길동",
    age: 30,
    email: "hong@example.com",
    hobbies: ["reading", "coding"]
})

// 다중 문서 삽입
db.users.insertMany([
    { name: "김철수", age: 25, email: "kim@example.com" },
    { name: "이영희", age: 28, email: "lee@example.com" }
])
```

## FIND (조회)

```javascript
// 전체 조회
db.users.find()

// 조건 조회
db.users.find({ age: { $gt: 25 } })

// 특정 필드만 조회 (projection)
db.users.find({ age: { $gt: 25 } }, { name: 1, email: 1, _id: 0 })

// 정렬과 제한
db.users.find().sort({ age: -1 }).limit(10)

// 단일 문서 조회
db.users.findOne({ name: "홍길동" })
```

### 주요 비교 연산자

| 연산자 | 설명 | 예시 |
|--------|------|------|
| `$eq` | 같음 | `{ age: { $eq: 25 } }` |
| `$ne` | 같지 않음 | `{ status: { $ne: "inactive" } }` |
| `$gt` / `$gte` | 초과 / 이상 | `{ age: { $gte: 18 } }` |
| `$lt` / `$lte` | 미만 / 이하 | `{ price: { $lt: 1000 } }` |
| `$in` | 포함 | `{ status: { $in: ["active", "pending"] } }` |
| `$regex` | 정규식 매칭 | `{ name: { $regex: /^김/ } }` |

## UPDATE (수정)

```javascript
// 단일 문서 수정
db.users.updateOne(
    { name: "홍길동" },
    { $set: { age: 31, email: "new@example.com" } }
)

// 다중 문서 수정
db.users.updateMany(
    { age: { $lt: 25 } },
    { $set: { status: "junior" } }
)

// 필드 증가
db.users.updateOne(
    { name: "홍길동" },
    { $inc: { loginCount: 1 } }
)
```

## DELETE (삭제)

```javascript
// 단일 문서 삭제
db.users.deleteOne({ name: "홍길동" })

// 다중 문서 삭제
db.users.deleteMany({ status: "inactive" })
```

---

# 인덱스 관리

MongoDB에서 쿼리 성능을 최적화하려면 적절한 인덱스 설정이 필수입니다.

```javascript
// 인덱스 생성
db.users.createIndex({ email: 1 })          // 오름차순
db.users.createIndex({ age: -1 })           // 내림차순
db.users.createIndex({ name: 1, age: -1 })  // 복합 인덱스

// 유니크 인덱스
db.users.createIndex({ email: 1 }, { unique: true })

// 인덱스 목록 확인
db.users.getIndexes()

// 인덱스 삭제
db.users.dropIndex("email_1")
```

---

# Aggregation Framework

MongoDB의 Aggregation Pipeline은 데이터를 단계적으로 변환하고 집계하는 강력한 도구입니다:

```javascript
db.orders.aggregate([
    { $match: { status: "completed" } },
    { $group: {
        _id: "$customerId",
        totalAmount: { $sum: "$amount" },
        orderCount: { $sum: 1 }
    }},
    { $sort: { totalAmount: -1 } },
    { $limit: 10 }
])
```

주요 파이프라인 스테이지:

| 스테이지 | 설명 |
|----------|------|
| `$match` | 조건 필터링 (WHERE) |
| `$group` | 그룹화 및 집계 (GROUP BY) |
| `$sort` | 정렬 (ORDER BY) |
| `$project` | 필드 선택 및 변환 (SELECT) |
| `$lookup` | 다른 컬렉션과 조인 (JOIN) |
| `$unwind` | 배열 필드를 개별 문서로 분리 |

Aggregation Pipeline은 SQL의 GROUP BY, JOIN 등의 기능을 MongoDB에서 구현할 때 핵심적으로 사용되는 기능이므로, MongoDB를 사용한다면 반드시 익혀야 합니다.

---

# 데이터 모델링 패턴

MongoDB에서의 데이터 모델링은 RDBMS와 근본적으로 다릅니다. 정규화 대신 **비정규화**와 **임베딩**을 적극 활용합니다.

## Embedded Document 패턴

관련 데이터를 하나의 문서 안에 중첩시키는 방식입니다. 1:1 또는 1:N 관계에서 자주 사용됩니다.

```javascript
// 사용자와 주소를 하나의 문서에 저장
db.users.insertOne({
    name: "홍길동",
    email: "hong@example.com",
    addresses: [
        {
            type: "home",
            street: "강남대로 123",
            city: "서울",
            zipcode: "06000"
        },
        {
            type: "work",
            street: "테헤란로 456",
            city: "서울",
            zipcode: "06100"
        }
    ]
})
```

이 방식의 장점은 한 번의 쿼리로 사용자와 주소를 모두 가져올 수 있다는 점입니다. JOIN이 필요 없으므로 성능이 뛰어납니다.

## Reference 패턴

문서 간 참조를 사용하는 방식입니다. N:M 관계나 자주 변경되는 데이터에 적합합니다.

```javascript
// 주문 문서에서 사용자를 참조
db.orders.insertOne({
    orderNumber: "ORD-2025-001",
    userId: ObjectId("507f1f77bcf86cd799439011"),  // users 컬렉션 참조
    items: [
        { productId: ObjectId("..."), quantity: 2, price: 15000 },
        { productId: ObjectId("..."), quantity: 1, price: 30000 }
    ],
    totalAmount: 60000,
    status: "completed"
})

// $lookup으로 JOIN 수행
db.orders.aggregate([
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
        }
    },
    { $unwind: "$user" }
])
```

## 어떤 패턴을 선택할까?

| 기준 | Embedded | Reference |
|------|----------|-----------|
| 함께 조회되는 빈도 | 항상 함께 | 가끔 또는 별도로 |
| 데이터 변경 빈도 | 드물게 변경 | 자주 변경 |
| 데이터 크기 | 16MB 이하 | 큰 데이터 |
| 관계 유형 | 1:1, 1:Few | 1:Many, N:M |

MongoDB 문서의 최대 크기는 **16MB**입니다. 임베딩된 배열이 무한히 증가할 수 있는 경우에는 Reference 패턴을 사용하는 것이 안전합니다.

---

# 성능 최적화

## 쿼리 성능 분석 (explain)

쿼리 실행 계획을 분석하여 성능을 최적화할 수 있습니다:

```javascript
// 쿼리 실행 계획 확인
db.users.find({ age: { $gt: 25 } }).explain("executionStats")
```

확인해야 할 주요 지표:

| 지표 | 설명 | 이상적인 값 |
|------|------|------------|
| `totalDocsExamined` | 스캔한 문서 수 | 반환된 문서 수와 비슷 |
| `executionTimeMillis` | 실행 시간 | 가능한 낮게 |
| `stage` | 실행 단계 | IXSCAN (인덱스 사용) |

`COLLSCAN`(컬렉션 풀 스캔)이 나타나면 인덱스가 제대로 사용되지 않고 있다는 의미입니다. 해당 쿼리에 적합한 인덱스를 생성해야 합니다.

## 인덱스 전략

### 복합 인덱스 순서

복합 인덱스를 생성할 때는 **ESR(Equality, Sort, Range)** 규칙을 따르세요:

1. **Equality**: 정확히 일치하는 조건의 필드를 먼저
2. **Sort**: 정렬에 사용되는 필드를 그 다음
3. **Range**: 범위 조건의 필드를 마지막으로

```javascript
// 쿼리: status가 "active"이고, age가 25 이상인 사용자를 name 순으로 정렬
db.users.find({ status: "active", age: { $gte: 25 } }).sort({ name: 1 })

// ESR 규칙에 따른 인덱스
db.users.createIndex({ status: 1, name: 1, age: 1 })
```

### TTL 인덱스

일정 시간이 지난 문서를 자동으로 삭제하는 인덱스입니다. 세션 데이터나 로그 데이터에 유용합니다:

```javascript
// 30일 후 자동 삭제
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 })
```

---

# MongoDB Atlas (클라우드)

직접 MongoDB를 운영하는 것이 부담스럽다면 MongoDB Atlas를 고려해 보세요. Atlas는 MongoDB의 공식 클라우드 서비스로, AWS, GCP, Azure에서 운영되는 관리형 MongoDB를 제공합니다.

### Atlas의 장점

- 자동 백업 및 복구
- 자동 스케일링
- 모니터링 및 알림
- 보안 설정 (암호화, 접근 제어)
- 무료 티어 제공 (512MB 스토리지)

### 접속 방법

```javascript
// MongoDB Atlas 접속 문자열
const uri = "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myDatabase";

// Node.js에서 접속
const { MongoClient } = require('mongodb');
const client = new MongoClient(uri);
await client.connect();
```

MongoDB Atlas 무료 티어는 학습 및 개인 프로젝트에 충분하며, 프로덕션 환경으로의 확장도 용이합니다.
