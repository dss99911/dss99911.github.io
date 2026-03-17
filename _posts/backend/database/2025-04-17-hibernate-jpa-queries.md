---
layout: post
title: "Hibernate JPA 쿼리 가이드 - HQL과 Criteria API"
date: 2025-04-17 12:53:00 +0900
categories: [backend, database]
tags: [hibernate, jpa, hql, criteria, java, orm, query]
description: "Hibernate의 객체 지향 쿼리 언어 HQL과 Criteria API 사용법을 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-hibernate-jpa-queries.png
redirect_from:
  - "/backend/database/2025/12/28/hibernate-jpa-queries.html"
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

---

# Native SQL 쿼리

HQL로 표현하기 어려운 데이터베이스 특화 쿼리가 필요할 때 Native SQL을 사용합니다.

```java
// Native SQL 쿼리 실행
SQLQuery query = session.createSQLQuery("SELECT * FROM emp WHERE department = :dept");
query.setParameter("dept", "Engineering");
query.addEntity(Emp.class);
List<Emp> employees = query.list();
```

Native SQL은 데이터베이스 고유 함수나 힌트를 사용해야 할 때 유용하지만, 데이터베이스 이식성이 떨어지므로 꼭 필요한 경우에만 사용하는 것이 좋습니다.

---

# N+1 문제와 해결 방법

N+1 문제는 Hibernate에서 가장 흔하게 발생하는 성능 이슈입니다. 부모 엔티티를 조회한 후 연관된 자식 엔티티를 개별적으로 조회하면서 불필요한 쿼리가 대량 발생합니다.

## 문제 예시

```java
// 1번의 쿼리로 부서 목록 조회
List<Department> departments = session.createQuery("FROM Department").list();

// 각 부서의 직원 접근 시 N번의 추가 쿼리 발생
for (Department dept : departments) {
    System.out.println(dept.getEmployees().size());  // 각 부서마다 SELECT 쿼리 실행
}
```

## 해결 방법 1: Fetch Join

```java
// 한 번의 쿼리로 부서와 직원을 함께 로딩
List<Department> departments = session.createQuery(
    "FROM Department d JOIN FETCH d.employees"
).list();
```

## 해결 방법 2: Batch Size

엔티티 클래스 또는 XML에서 `@BatchSize`를 설정하면 IN 절을 사용하여 여러 컬렉션을 한 번에 로딩합니다:

```java
@Entity
public class Department {
    @OneToMany(mappedBy = "department")
    @BatchSize(size = 10)
    private List<Employee> employees;
}
```

## 해결 방법 3: EntityGraph

JPA 2.1부터 도입된 EntityGraph를 사용하면 쿼리별로 로딩 전략을 제어할 수 있습니다:

```java
@NamedEntityGraph(
    name = "Department.withEmployees",
    attributeNodes = @NamedAttributeNode("employees")
)
@Entity
public class Department {
    // ...
}
```

---

# HQL vs Criteria API 선택 가이드

| 상황 | 추천 | 이유 |
|------|------|------|
| 고정된 쿼리 | HQL | 가독성이 좋고 SQL과 유사하여 직관적 |
| 동적 조건 | Criteria API | 조건을 프로그래밍 방식으로 추가/제거 가능 |
| 검색 필터 UI | Criteria API | 사용자 입력에 따라 조건이 변경되는 경우에 적합 |
| 집계 쿼리 | HQL | 복잡한 GROUP BY, HAVING 등의 표현이 자연스러움 |
| 타입 안전성 필요 | Criteria API (JPA 2.0+) | 컴파일 시점 검증 가능 |

실무에서는 단순한 조회는 HQL(또는 JPQL)을 사용하고, 동적으로 조건이 변하는 복잡한 검색 기능에는 Criteria API를 사용하는 것이 일반적입니다. Spring Data JPA를 사용한다면 Querydsl을 함께 활용하면 타입 안전한 동적 쿼리를 더 편리하게 작성할 수 있습니다.

---

# 자주 발생하는 실수

1. **LazyInitializationException**: 세션이 닫힌 후 Lazy 로딩된 컬렉션에 접근하면 발생합니다. `JOIN FETCH`를 사용하거나 Open Session in View 패턴을 적용하세요.

2. **Dirty Checking 미인지**: Hibernate는 트랜잭션 내에서 영속 상태 엔티티의 변경을 자동으로 감지하여 UPDATE 쿼리를 실행합니다. 명시적으로 `update()`를 호출할 필요가 없습니다.

3. **flush 타이밍**: `session.flush()`는 영속성 컨텍스트의 변경 사항을 데이터베이스에 즉시 반영합니다. 기본적으로 트랜잭션 커밋 시 자동으로 flush되지만, 쿼리 실행 전 데이터 일관성이 필요하면 수동 flush가 필요할 수 있습니다.
