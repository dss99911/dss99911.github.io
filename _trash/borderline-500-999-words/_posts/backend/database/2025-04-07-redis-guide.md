---
layout: post
title: "Redis 완벽 가이드 - 개념부터 CLI 명령어까지"
date: 2025-04-07 16:39:00 +0900
categories: [backend, database]
tags: [redis, nosql, cache, in-memory, database]
description: "Redis의 기본 개념과 특징, 그리고 redis-cli를 통한 다양한 데이터 조작 명령어를 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-redis-guide.png
redirect_from:
  - "/backend/database/2025/12/28/redis-guide.html"
---

# Redis 개요

Redis는 String, Hash, List, Set, Sorted Set, Bitmap, HyperLogLog 등 다양한 데이터 구조를 저장할 수 있어서 **Data Structure Server**라고도 불립니다.

## Redis의 주요 특징

- **In-Memory 데이터베이스**: 메모리에 데이터를 저장하여 빠른 읽기/쓰기 성능 제공
- **NoSQL 데이터베이스**: 스키마 없이 유연한 데이터 저장
- **캐싱 서버**: 자주 접근하는 데이터를 캐시하여 성능 향상
- **다양한 데이터 타입 지원**: 단순한 key-value 저장소 이상의 기능 제공

Redis는 데이터에 대한 읽기와 쓰기가 많은 서비스에서 특히 유용합니다.

## Redis 사용 시 주의사항

Redis는 강력한 도구이지만, 메모리 기반이므로 데이터 영속성, 메모리 관리 등에 주의가 필요합니다.

---

# Redis CLI 명령어

## 클라이언트 접속

```bash
redis-cli
```

## 데이터베이스 관리

### 데이터베이스 목록 조회

```bash
INFO keyspace
```

### 데이터베이스 선택

```bash
select 1    # db1 선택 (기본값은 db0)
```

## 키(Key) 관리

### 전체 키 조회

```bash
KEYS *
```

### 키의 타입 확인

```bash
type <key>
```

### 키의 만료 시간 확인

```bash
TTL <key>
```

## 값 조회

데이터 타입에 따라 다른 명령어를 사용합니다:

| 데이터 타입 | 명령어 |
|------------|--------|
| String | `GET <key>` |
| Hash | `HGETALL <key>` |
| List | `LRANGE <key> <start> <end>` |
| Set | `SMEMBERS <key>` |
| Sorted Set | `ZRANGEBYSCORE <key> <min> <max>` |

잘못된 타입의 명령어를 사용하면 다음과 같은 에러가 발생합니다:
```
(error) WRONGTYPE Operation against a key holding the wrong kind of value
```

## 값 쓰기

```bash
SET <key> <value>
```

## 데이터 삭제

### 선택된 데이터베이스의 모든 키 삭제

```bash
FLUSHDB
```

### 전체 데이터베이스의 모든 키 삭제

```bash
FLUSHALL
```

> **주의**: `FLUSHALL`과 `FLUSHDB`는 데이터를 복구할 수 없으니 신중하게 사용하세요.

---

# 참고 자료

---

# Hash 데이터 조작

Hash는 필드-값 쌍으로 구성된 데이터 타입으로, 객체를 저장하기에 적합합니다.

```bash
# Hash 필드 설정
HSET user:1001 name "홍길동" age 30 email "hong@example.com"

# 단일 필드 조회
HGET user:1001 name

# 전체 필드 조회
HGETALL user:1001

# 특정 필드만 조회
HMGET user:1001 name email

# 필드 존재 여부 확인
HEXISTS user:1001 name

# 필드 삭제
HDEL user:1001 email

# 숫자 필드 증가
HINCRBY user:1001 age 1
```

---

# List 데이터 조작

List는 순서가 있는 문자열 컬렉션으로, 큐(Queue)나 스택(Stack)으로 활용할 수 있습니다.

```bash
# 왼쪽에 삽입 (스택처럼 사용)
LPUSH mylist "first" "second" "third"

# 오른쪽에 삽입 (큐처럼 사용)
RPUSH mylist "last"

# 범위 조회 (0부터 시작, -1은 마지막)
LRANGE mylist 0 -1

# 왼쪽에서 꺼내기 (Pop)
LPOP mylist

# 오른쪽에서 꺼내기
RPOP mylist

# 리스트 길이
LLEN mylist
```

---

# Set과 Sorted Set

```bash
# Set: 중복 없는 컬렉션
SADD myset "apple" "banana" "cherry"
SMEMBERS myset
SISMEMBER myset "apple"    # 멤버 존재 확인

# 집합 연산
SINTER set1 set2           # 교집합
SUNION set1 set2           # 합집합
SDIFF set1 set2            # 차집합

# Sorted Set: 점수(score) 기반 정렬
ZADD leaderboard 100 "player1" 200 "player2" 150 "player3"
ZRANGE leaderboard 0 -1 WITHSCORES     # 점수 오름차순
ZREVRANGE leaderboard 0 2 WITHSCORES   # 상위 3명
ZRANK leaderboard "player2"            # 순위 조회
```

Sorted Set은 리더보드, 실시간 랭킹 시스템 등에 매우 적합합니다.

---

# 만료 시간 (TTL) 설정

Redis에서 키의 만료 시간을 설정하여 자동으로 삭제되도록 할 수 있습니다:

```bash
# 키 설정과 동시에 만료 시간 지정 (초 단위)
SET session:abc123 "user_data" EX 3600

# 기존 키에 만료 시간 설정
EXPIRE mykey 300            # 300초 후 만료

# 밀리초 단위 만료
PEXPIRE mykey 300000

# 만료 시간 확인
TTL mykey                   # 남은 초
PTTL mykey                  # 남은 밀리초

# 만료 시간 제거 (영구 보관)
PERSIST mykey
```

---

# Redis 영속성 (Persistence)

Redis는 인메모리 DB이지만 두 가지 영속성 방식을 제공합니다.

## RDB (Redis Database)

- 특정 시점의 스냅샷을 디스크에 저장
- `save 900 1`과 같이 설정 (900초 동안 1개 이상 변경 시 저장)
- 장점: 백업 용이, 빠른 복구
- 단점: 마지막 스냅샷 이후 데이터 유실 가능

## AOF (Append Only File)

- 모든 쓰기 명령을 로그 파일에 기록
- `appendonly yes`로 활성화
- 장점: 데이터 유실 최소화
- 단점: 파일 크기가 커질 수 있음, RDB보다 느린 복구

실무에서는 RDB와 AOF를 함께 사용하는 것이 권장됩니다. RDB로 빠른 복구를 보장하면서 AOF로 최근 데이터 유실을 방지하는 전략입니다.

---

# 실무 활용 패턴

| 패턴 | 설명 | 데이터 타입 |
|------|------|-------------|
| 세션 관리 | 웹 세션 데이터 저장 | Hash + TTL |
| 캐시 | DB 조회 결과 캐싱 | String + TTL |
| 실시간 랭킹 | 게임 점수 순위 | Sorted Set |
| 메시지 큐 | 비동기 작업 처리 | List (LPUSH/RPOP) |
| 좋아요 관리 | 중복 방지가 필요한 카운터 | Set |
| Rate Limiting | API 요청 제한 | String + INCR + TTL |

---

# 참고 자료

- [DB-Engines Ranking](https://db-engines.com/en/ranking) - 데이터베이스 엔진 인기 순위를 확인할 수 있습니다.
