---
layout: post
title: "JPA Entity 어노테이션 완벽 가이드 - 상속, Named Query, 기본 매핑"
date: 2025-12-28 15:00:00 +0900
categories: [backend, spring]
tags: [jpa, hibernate, orm, spring, annotation]
description: "JPA Entity 어노테이션을 활용한 객체-관계 매핑 방법을 알아봅니다. 상속 전략, Named Query, 기본 Entity 매핑까지 상세히 다룹니다."
image: /assets/images/posts/thumbnails/2025-12-28-jpa-entity-annotations.png
---

JPA(Java Persistence API)는 자바 객체와 데이터베이스 테이블 간의 매핑을 어노테이션으로 간편하게 정의할 수 있습니다. 이 글에서는 Entity 정의의 기본부터 상속 전략, Named Query까지 살펴보겠습니다.

## 기본 Entity 어노테이션

### @Entity와 @Table

가장 기본적인 Entity 정의입니다.

```java
@Entity
@Table(name = "emp500")
public class Employee {
    @Id
    private int id;
    private String firstName;
    private String lastName;
}
```

| 어노테이션 | 설명 | 기본값 |
|-----------|------|--------|
| `@Entity` | JPA Entity 클래스임을 선언 | - |
| `@Table` | 테이블 이름 지정 | 클래스 이름 |
| `@Column` | 컬럼 세부 설정 | 필드 이름 |
| `@Id` | Primary Key 지정 | - |
| `@GeneratedValue` | 자동 생성 전략 | - |

> `@Table`을 생략하면 클래스 이름이 테이블 이름으로 사용됩니다. `@Column`을 생략하면 필드 이름이 컬럼 이름으로 사용됩니다.

### GeneratedValue 전략

Primary Key 자동 생성 전략을 지정합니다.

```java
@Id
@GeneratedValue(strategy = GenerationType.AUTO)
@Column(name = "id")
private int id;
```

| 전략 | 설명 |
|-----|------|
| `AUTO` | JPA 구현체가 자동 선택 |
| `IDENTITY` | 데이터베이스 identity 컬럼 사용 (MySQL auto_increment) |
| `SEQUENCE` | 데이터베이스 시퀀스 사용 (Oracle, PostgreSQL) |
| `TABLE` | 별도 키 생성 테이블 사용 |

## 상속 매핑 전략

JPA는 객체 지향의 상속 구조를 데이터베이스에 매핑하는 세 가지 전략을 제공합니다.

### 1. Single Table (단일 테이블 전략)

모든 클래스를 하나의 테이블에 저장합니다. 가장 성능이 좋지만, 사용하지 않는 컬럼에 NULL이 많이 들어갑니다.

**부모 클래스:**

```java
@Entity
@Table(name = "employee101")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue(value = "employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    // getters, setters
}
```

**자식 클래스:**

```java
@Entity
@DiscriminatorValue("regularemployee")
public class RegularEmployee extends Employee {
    @Column(name = "salary")
    private float salary;

    @Column(name = "bonus")
    private int bonus;

    // getters, setters
}
```

**테이블 구조:**

| id | type | name | salary | bonus |
|----|------|------|--------|-------|
| 1 | employee | 홍길동 | NULL | NULL |
| 2 | regularemployee | 김철수 | 50000 | 1000 |

**장점:**
- 조인이 필요 없어 조회 성능이 우수
- 단순한 쿼리

**단점:**
- 자식 엔티티 컬럼은 모두 nullable이어야 함
- 테이블이 커질 수 있음

### 2. Table Per Class (테이블당 클래스 전략)

각 클래스가 자신만의 테이블을 가지며, 부모 클래스의 속성도 자식 테이블에 포함됩니다.

**부모 클래스:**

```java
@Entity
@Table(name = "employee102")
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    // getters, setters
}
```

**자식 클래스:**

```java
@Entity
@Table(name = "regularemployee102")
@AttributeOverrides({
    @AttributeOverride(name = "id", column = @Column(name = "id")),
    @AttributeOverride(name = "name", column = @Column(name = "name"))
})
public class RegularEmployee extends Employee {
    @Column(name = "salary")
    private float salary;

    @Column(name = "bonus")
    private int bonus;

    // getters, setters
}
```

**테이블 구조:**

employee102 테이블:
| id | name |
|----|------|
| 1 | 홍길동 |

regularemployee102 테이블:
| id | name | salary | bonus |
|----|------|--------|-------|
| 2 | 김철수 | 50000 | 1000 |

**장점:**
- 서브타입을 구분해서 처리할 때 효과적
- not null 제약 조건 사용 가능

**단점:**
- 부모 타입으로 조회 시 UNION 필요 (성능 저하)
- 자식 테이블 통합 쿼리가 어려움

### 3. Joined (조인 전략)

부모 클래스와 자식 클래스가 각각 테이블을 가지며, 조인을 통해 조회합니다. 가장 정규화된 방식입니다.

**부모 클래스:**

```java
@Entity
@Table(name = "employee103")
@Inheritance(strategy = InheritanceType.JOINED)
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    // getters, setters
}
```

**자식 클래스:**

```java
@Entity
@Table(name = "regularemployee103")
@PrimaryKeyJoinColumn(name = "ID")
public class RegularEmployee extends Employee {
    @Column(name = "salary")
    private float salary;

    @Column(name = "bonus")
    private int bonus;

    // getters, setters
}
```

**테이블 구조:**

employee103 테이블:
| id | name |
|----|------|
| 1 | 홍길동 |
| 2 | 김철수 |

regularemployee103 테이블:
| ID | salary | bonus |
|----|--------|-------|
| 2 | 50000 | 1000 |

**장점:**
- 테이블 정규화
- 외래 키 참조 무결성 보장
- 저장공간 효율적

**단점:**
- 조회 시 조인 필요 (성능 저하 가능)
- 데이터 저장 시 INSERT 쿼리 2번 실행

### 상속 전략 선택 가이드

| 상황 | 추천 전략 |
|-----|----------|
| 단순한 상속 구조, 성능 중요 | SINGLE_TABLE |
| 각 클래스 독립적 사용, 데이터 무결성 중요 | JOINED |
| 자식 클래스 독립적 조회가 많은 경우 | TABLE_PER_CLASS |

## Named Query

Named Query는 미리 정의된 쿼리에 이름을 부여하여 재사용할 수 있게 합니다. 애플리케이션 로딩 시점에 쿼리 문법을 검증하므로 안전합니다.

### JPQL Named Query

```java
@Entity
@NamedQueries({
    @NamedQuery(
        name = "findEmployeeByName",
        query = "from Employee e where e.name = :name"
    ),
    @NamedQuery(
        name = "findAllEmployees",
        query = "select e from Employee e order by e.name"
    )
})
public class Employee {
    // ...
}
```

**사용 방법:**

```java
// EntityManager 사용
TypedQuery<Employee> query = em.createNamedQuery("findEmployeeByName", Employee.class);
query.setParameter("name", "홍길동");
List<Employee> results = query.getResultList();
```

### Spring Data JPA에서 사용

```java
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Named Query를 자동으로 찾아서 실행
    List<Employee> findEmployeeByName(@Param("name") String name);
}
```

Spring Data JPA는 `{Entity명}.{메서드명}` 형식의 Named Query를 자동으로 찾습니다.

### Native Named Query

JPQL 대신 네이티브 SQL을 사용해야 할 때:

```java
@Entity
@NamedNativeQueries({
    @NamedNativeQuery(
        name = "Employee.findByDepartment",
        query = "SELECT * FROM employee WHERE department_id = ?1",
        resultClass = Employee.class
    )
})
public class Employee {
    // ...
}
```

## 결론

JPA 어노테이션을 활용하면 객체와 데이터베이스 간의 매핑을 선언적으로 정의할 수 있습니다.

- **상속 전략 선택**: 데이터 구조와 성능 요구사항에 따라 적절한 전략을 선택하세요
- **Named Query 활용**: 자주 사용하는 쿼리는 Named Query로 정의하여 컴파일 시점 검증과 재사용성을 높이세요
- **기본 매핑 이해**: `@Entity`, `@Table`, `@Column` 등 기본 어노테이션의 기본값을 이해하면 코드를 간결하게 유지할 수 있습니다

다음 글에서는 HQL(Hibernate Query Language)과 Criteria API를 활용한 동적 쿼리 작성 방법을 살펴보겠습니다.
