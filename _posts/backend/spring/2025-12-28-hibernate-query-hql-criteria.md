---
layout: post
title: "Hibernate 쿼리 완벽 가이드 - HQL과 Criteria API"
date: 2025-12-28 15:01:00 +0900
categories: [backend, spring]
tags: [jpa, hibernate, hql, criteria, orm, spring]
description: "Hibernate의 쿼리 방식인 HQL(Hibernate Query Language)과 Criteria API를 알아봅니다. 객체 지향 쿼리 작성부터 동적 쿼리까지 상세히 다룹니다."
---

Hibernate는 SQL을 직접 작성하지 않고도 데이터베이스를 조회할 수 있는 여러 방법을 제공합니다. 이 글에서는 HQL(Hibernate Query Language)과 Criteria API(HCQL)를 통한 쿼리 작성 방법을 살펴보겠습니다.

## HQL (Hibernate Query Language)

HQL은 SQL과 유사하지만, 테이블이 아닌 **Entity 객체**를 대상으로 쿼리합니다. 데이터베이스에 독립적이며 객체 지향적인 쿼리 작성이 가능합니다.

### 기본 조회 (Select)

```java
// 기본 조회
Query query = session.createQuery("from Emp");
List<Emp> list = query.list();

// 페이징 처리
Query query = session.createQuery("from Emp");
query.setFirstResult(5);   // 시작 위치 (0부터 시작)
query.setMaxResults(10);   // 조회할 개수
List<Emp> list = query.list();  // 6번째부터 10개 조회
```

> HQL에서는 테이블명이 아닌 **클래스명**을 사용합니다. `SELECT * FROM emp` 대신 `from Emp`로 작성합니다.

### 조건 조회 (Where)

```java
// 파라미터 바인딩 (Named Parameter)
Query query = session.createQuery("from Emp where salary > :minSalary");
query.setParameter("minSalary", 50000);
List<Emp> results = query.list();

// 여러 조건
Query query = session.createQuery(
    "from Emp e where e.department = :dept and e.salary > :salary"
);
query.setParameter("dept", "Engineering");
query.setParameter("salary", 40000);
```

### 수정 (Update)

HQL의 UPDATE는 벌크 연산으로, 영속성 컨텍스트를 거치지 않고 직접 데이터베이스를 수정합니다.

```java
Transaction tx = session.beginTransaction();

Query query = session.createQuery("update User set name = :name where id = :id");
query.setParameter("name", "김철수");
query.setParameter("id", 111);

int affectedRows = query.executeUpdate();
System.out.println("수정된 행 수: " + affectedRows);

tx.commit();
```

> 벌크 연산 후에는 영속성 컨텍스트를 초기화(`session.clear()`)하는 것이 좋습니다. 그렇지 않으면 캐시된 데이터와 실제 데이터베이스 값이 불일치할 수 있습니다.

### 삭제 (Delete)

```java
Transaction tx = session.beginTransaction();

Query query = session.createQuery("delete from Emp where id = :empId");
query.setParameter("empId", 100);
query.executeUpdate();

tx.commit();
```

> HQL에서는 테이블명이 아닌 클래스명(Emp)을 사용합니다.

### 집계 함수 (Aggregate Functions)

```java
// SUM
Query query = session.createQuery("select sum(salary) from Emp");
List<Long> list = query.list();
Long totalSalary = list.get(0);

// COUNT
Query query = session.createQuery("select count(*) from Emp where department = :dept");
query.setParameter("dept", "Engineering");
Long count = (Long) query.uniqueResult();

// 여러 집계 함수
Query query = session.createQuery(
    "select min(salary), max(salary), avg(salary) from Emp"
);
Object[] result = (Object[]) query.uniqueResult();
```

### 그룹화와 정렬

```java
// GROUP BY
Query query = session.createQuery(
    "select department, avg(salary) from Emp group by department"
);
List<Object[]> results = query.list();

// ORDER BY
Query query = session.createQuery(
    "from Emp order by salary desc, name asc"
);

// GROUP BY + HAVING
Query query = session.createQuery(
    "select department, count(*) from Emp " +
    "group by department having count(*) > 5"
);
```

### 조인 (Join)

```java
// Inner Join
Query query = session.createQuery(
    "select e.name, d.name from Emp e join e.department d"
);

// Left Join
Query query = session.createQuery(
    "from Emp e left join fetch e.address"
);

// Fetch Join - 연관 엔티티를 함께 조회 (N+1 문제 해결)
Query query = session.createQuery(
    "from Emp e join fetch e.orders"
);
```

## Criteria API (HCQL)

Criteria API는 프로그래밍 방식으로 쿼리를 작성합니다. 동적 쿼리에 특히 유용합니다.

### 기본 사용법

```java
// 전체 조회
Criteria criteria = session.createCriteria(Emp.class);
List<Emp> employees = criteria.list();
```

### 조건 추가 (Restrictions)

```java
Criteria criteria = session.createCriteria(Emp.class);

// 단일 조건
criteria.add(Restrictions.eq("name", "홍길동"));

// 여러 조건 (AND)
criteria.add(Restrictions.gt("salary", 40000));
criteria.add(Restrictions.eq("department", "Engineering"));

// OR 조건
criteria.add(Restrictions.or(
    Restrictions.eq("department", "Engineering"),
    Restrictions.eq("department", "Sales")
));

List<Emp> results = criteria.list();
```

주요 Restriction 메서드:

| 메서드 | 설명 | SQL 동등 |
|--------|------|----------|
| `eq(property, value)` | 같음 | `=` |
| `ne(property, value)` | 같지 않음 | `<>` |
| `gt(property, value)` | 초과 | `>` |
| `ge(property, value)` | 이상 | `>=` |
| `lt(property, value)` | 미만 | `<` |
| `le(property, value)` | 이하 | `<=` |
| `like(property, value)` | 패턴 매칭 | `LIKE` |
| `between(property, lo, hi)` | 범위 | `BETWEEN` |
| `isNull(property)` | NULL 체크 | `IS NULL` |
| `isNotNull(property)` | NOT NULL 체크 | `IS NOT NULL` |
| `in(property, collection)` | IN 조건 | `IN` |

### 정렬 (Order)

```java
Criteria criteria = session.createCriteria(Emp.class);
criteria.addOrder(Order.desc("salary"));
criteria.addOrder(Order.asc("name"));
List<Emp> results = criteria.list();
```

### 페이징 (Pagination)

```java
Criteria criteria = session.createCriteria(Emp.class);
criteria.setFirstResult(0);   // 시작 위치
criteria.setMaxResults(10);   // 조회 개수
List<Emp> results = criteria.list();
```

### 프로젝션 (Projection)

특정 필드만 조회할 때 사용합니다.

```java
Criteria criteria = session.createCriteria(Emp.class);
criteria.setProjection(Projections.projectionList()
    .add(Projections.property("name"))
    .add(Projections.property("salary"))
);
List<Object[]> results = criteria.list();
```

### 집계 함수

```java
Criteria criteria = session.createCriteria(Emp.class);

// 단일 집계
criteria.setProjection(Projections.rowCount());
Long count = (Long) criteria.uniqueResult();

// 그룹별 집계
criteria.setProjection(Projections.projectionList()
    .add(Projections.groupProperty("department"))
    .add(Projections.avg("salary"))
);
List<Object[]> results = criteria.list();
```

## JPA 2.0 Criteria API

JPA 2.0부터는 표준 Criteria API가 도입되었습니다. Hibernate Criteria보다 타입 안전합니다.

```java
CriteriaBuilder cb = entityManager.getCriteriaBuilder();
CriteriaQuery<Emp> query = cb.createQuery(Emp.class);
Root<Emp> emp = query.from(Emp.class);

// 조건 추가
query.select(emp)
     .where(
         cb.and(
             cb.equal(emp.get("department"), "Engineering"),
             cb.gt(emp.get("salary"), 40000)
         )
     )
     .orderBy(cb.desc(emp.get("salary")));

List<Emp> results = entityManager.createQuery(query).getResultList();
```

## HQL vs Criteria API 비교

| 특징 | HQL | Criteria API |
|-----|-----|--------------|
| 문법 | SQL과 유사한 문자열 | 프로그래밍 방식 |
| 동적 쿼리 | 문자열 조합 필요 | 메서드 체이닝으로 편리 |
| 타입 안전성 | 런타임 오류 | 컴파일 타임 검증 가능 |
| 가독성 | 익숙한 SQL 스타일 | 복잡한 쿼리는 코드가 길어짐 |
| 사용 시점 | 정적 쿼리, 간단한 쿼리 | 동적 쿼리, 조건이 많은 쿼리 |

### 선택 가이드

- **HQL 추천**: 쿼리가 정적이고 변경이 적은 경우, SQL에 익숙한 팀
- **Criteria API 추천**: 검색 조건이 동적으로 변하는 경우, 타입 안전성이 중요한 경우

## Spring Data JPA에서의 활용

Spring Data JPA에서는 메서드 이름으로 쿼리를 생성하거나 `@Query` 어노테이션을 사용합니다.

```java
public interface EmpRepository extends JpaRepository<Emp, Long> {

    // 메서드 이름으로 쿼리 생성
    List<Emp> findByDepartmentAndSalaryGreaterThan(String department, int salary);

    // JPQL 직접 작성
    @Query("select e from Emp e where e.department = :dept order by e.salary desc")
    List<Emp> findByDepartmentOrderBySalary(@Param("dept") String department);

    // Native Query
    @Query(value = "SELECT * FROM emp WHERE salary > ?1", nativeQuery = true)
    List<Emp> findHighSalaryEmployees(int minSalary);
}
```

동적 쿼리가 필요한 경우 **Specification**을 활용합니다:

```java
public interface EmpRepository extends JpaRepository<Emp, Long>,
                                       JpaSpecificationExecutor<Emp> {
}

// Specification 정의
public class EmpSpecifications {
    public static Specification<Emp> hasDepartment(String department) {
        return (root, query, cb) -> cb.equal(root.get("department"), department);
    }

    public static Specification<Emp> salaryGreaterThan(int salary) {
        return (root, query, cb) -> cb.gt(root.get("salary"), salary);
    }
}

// 사용
List<Emp> results = empRepository.findAll(
    Specification.where(hasDepartment("Engineering"))
                 .and(salaryGreaterThan(40000))
);
```

## 결론

Hibernate의 쿼리 방식을 정리하면:

- **HQL**: SQL과 유사한 문법으로 객체 중심 쿼리 작성
- **Criteria API**: 프로그래밍 방식으로 동적 쿼리에 적합
- **Spring Data JPA**: 메서드 이름이나 @Query로 간편하게 쿼리 정의

상황에 맞는 쿼리 방식을 선택하여 유지보수하기 쉬운 코드를 작성하세요. 복잡한 동적 쿼리는 Criteria API나 QueryDSL을 활용하는 것이 좋습니다.
