---
layout: post
title: "Redis 완벽 가이드 - 개념부터 CLI 명령어까지"
date: 2025-12-28 12:00:00 +0900
categories: database
tags: [redis, nosql, cache, in-memory, database]
description: "Redis의 기본 개념과 특징, 그리고 redis-cli를 통한 다양한 데이터 조작 명령어를 알아봅니다."
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

- [DB-Engines Ranking](https://db-engines.com/en/ranking) - 데이터베이스 엔진 인기 순위를 확인할 수 있습니다.
