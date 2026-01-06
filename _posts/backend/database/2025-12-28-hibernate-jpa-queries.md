---
layout: post
title: "Hibernate JPA 쿼리 가이드 - HQL과 Criteria API"
date: 2025-12-28 12:09:00 +0900
categories: [backend, database]
tags: [hibernate, jpa, hql, criteria, java, orm, query]
description: "Hibernate의 객체 지향 쿼리 언어 HQL과 Criteria API 사용법을 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-hibernate-jpa-queries.png
---

# HQL (Hibernate Query Language)

HQL은 Hibernate의 객체 지향 쿼리 언어입니다. SQL과 유사하지만 테이블 대신 엔티티 클래스를 대상으로 합니다.

## SELECT 쿼리

### 기본 조회

```java
Query query = session.createQuery("FROM Emp");
List<Emp> list = query.list();
```

### 페이징 처리

```java
Query query = session.createQuery("FROM Emp");
query.setFirstResult(5);   // 시작 위치 (0부터)
query.setMaxResult(10);    // 조회 개수
List<Emp> list = query.list();  // 6번째부터 10개 조회
```

## UPDATE 쿼리

```java
Transaction tx = session.beginTransaction();

Query q = session.createQuery("UPDATE User SET name = :n WHERE id = :i");
q.setParameter("n", "Udit Kumar");
q.setParameter("i", 111);

int status = q.executeUpdate();
System.out.println("Updated rows: " + status);

tx.commit();
```

## DELETE 쿼리

```java
// 클래스명(Emp)을 사용, 테이블명이 아님
Query query = session.createQuery("DELETE FROM Emp WHERE id = 100");
int deletedCount = query.executeUpdate();
```

## 집계 함수

```java
Query q = session.createQuery("SELECT SUM(salary) FROM Emp");
List<Integer> list = q.list();
System.out.println("Total salary: " + list.get(0));
```

### 지원하는 집계 함수

| 함수 | 설명 |
|------|------|
| `COUNT()` | 행 수 |
| `SUM()` | 합계 |
| `AVG()` | 평균 |
| `MIN()` | 최소값 |
| `MAX()` | 최대값 |

---

# HCQL (Hibernate Criteria Query Language)

Criteria API는 프로그래밍 방식으로 쿼리를 구성합니다.

## 주요 특징

- WHERE, ORDER BY, LIMIT, OFFSET 절을 메서드 체인으로 표현
- 타입 안전성 (type-safe)
- 동적 쿼리 구성에 유리

## 기본 사용법

```java
// Criteria 생성
Criteria criteria = session.createCriteria(Employee.class);

// 조건 추가
criteria.add(Restrictions.eq("department", "IT"));
criteria.add(Restrictions.gt("salary", 50000));

// 정렬
criteria.addOrder(Order.asc("name"));

// 페이징
criteria.setFirstResult(0);
criteria.setMaxResults(10);

// 실행
List<Employee> employees = criteria.list();
```

## Restrictions 클래스

| 메서드 | 설명 | SQL 예시 |
|--------|------|----------|
| `eq(property, value)` | 같음 | `property = value` |
| `ne(property, value)` | 같지 않음 | `property != value` |
| `gt(property, value)` | 초과 | `property > value` |
| `ge(property, value)` | 이상 | `property >= value` |
| `lt(property, value)` | 미만 | `property < value` |
| `le(property, value)` | 이하 | `property <= value` |
| `like(property, value)` | 패턴 매칭 | `property LIKE value` |
| `between(property, lo, hi)` | 범위 | `property BETWEEN lo AND hi` |
| `isNull(property)` | NULL 체크 | `property IS NULL` |
| `in(property, values)` | 포함 | `property IN (values)` |

---

# 트랜잭션 관리

```java
Session session = null;
Transaction tx = null;

try {
    session = sessionFactory.openSession();
    tx = session.beginTransaction();

    // 데이터 조작 수행
    // ...

    tx.commit();

} catch (Exception ex) {
    ex.printStackTrace();
    if (tx != null) {
        tx.rollback();
    }
} finally {
    if (session != null) {
        session.close();
    }
}
```

## 트랜잭션 관리 모범 사례

1. **try-catch-finally 사용**: 예외 발생 시 롤백 보장
2. **세션 닫기**: finally에서 세션 리소스 해제
3. **트랜잭션 경계 명확화**: 비즈니스 로직 단위로 트랜잭션 관리
4. **Spring과 통합**: `@Transactional` 어노테이션 활용 권장
