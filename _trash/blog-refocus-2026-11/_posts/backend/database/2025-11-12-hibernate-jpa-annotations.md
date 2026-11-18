---
layout: post
title: "Hibernate JPA 어노테이션 가이드 - Entity, 상속, Named Query"
date: 2025-11-12 17:48:00 +0900
categories: [backend, database]
tags: [hibernate, jpa, java, orm, annotations, entity]
description: "Hibernate JPA의 핵심 어노테이션과 상속 전략, Named Query 사용법을 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-hibernate-jpa-annotations.png
redirect_from:
  - "/backend/database/2025/12/28/hibernate-jpa-annotations.html"
---

# Persistence 클래스 어노테이션

## 기본 어노테이션

### @Entity

클래스를 JPA 엔티티로 지정합니다.

### @Table

매핑할 테이블을 지정합니다. 생략하면 클래스명이 테이블명이 됩니다.

### @Column

매핑할 컬럼을 지정합니다. 생략하면 필드명이 컬럼명이 됩니다.

### @Id

기본 키(Primary Key)를 지정합니다.

### @GeneratedValue

기본 키의 자동 생성 전략을 지정합니다.

## 예시

```java
@Entity
@Table(name = "emp500")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(name = "first_name")
    private String firstName;

    private String lastName;  // 컬럼명은 lastName

    // getters and setters
}
```

---

# 상속 전략 (Inheritance)

JPA는 세 가지 상속 전략을 제공합니다.

## 1. Single Table (단일 테이블)

모든 클래스를 하나의 테이블에 저장합니다.

### 부모 클래스

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
}
```

### 자식 클래스

```java
@Entity
@DiscriminatorValue("regularemployee")
public class RegularEmployee extends Employee {
    @Column(name = "salary")
    private float salary;

    @Column(name = "bonus")
    private int bonus;
}
```

**특징:**
- 가장 빠른 쿼리 성능
- NULL 컬럼이 많아질 수 있음
- 구분자(discriminator) 컬럼으로 타입 구분

## 2. Table Per Class (클래스별 테이블)

각 클래스마다 별도의 테이블을 생성하며, 자식 테이블에 부모 컬럼이 포함됩니다.

### 부모 클래스

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
}
```

### 자식 클래스

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
}
```

**특징:**
- 각 테이블이 독립적
- 부모 타입으로 조회 시 UNION 필요
- 데이터 중복이 발생할 수 있음

## 3. Joined (조인 전략)

부모와 자식이 별도 테이블에 저장되고, 조인으로 연결됩니다.

### 부모 클래스

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
}
```

### 자식 클래스

```java
@Entity
@Table(name = "regularemployee103")
@PrimaryKeyJoinColumn(name = "ID")
public class RegularEmployee extends Employee {
    @Column(name = "salary")
    private float salary;

    @Column(name = "bonus")
    private int bonus;
}
```

**특징:**
- 정규화된 구조
- 조인으로 인한 성능 오버헤드
- 데이터 중복 없음

## 상속 전략 비교

| 전략 | 테이블 수 | 조회 성능 | 정규화 |
|------|----------|----------|--------|
| SINGLE_TABLE | 1개 | 빠름 | 낮음 |
| TABLE_PER_CLASS | 클래스 수 | 보통 | 보통 |
| JOINED | 클래스 수 | 느림 | 높음 |

---

# Named Query

자주 사용하는 쿼리에 이름을 부여하여 재사용합니다.

## 정의

```java
@Entity
@NamedQueries({
    @NamedQuery(
        name = "findEmployeeByName",
        query = "FROM Employee e WHERE e.name = :name"
    )
})
public class Employee {
    // ...
}
```

## 사용

```java
Query query = session.getNamedQuery("findEmployeeByName");
query.setParameter("name", "John");
List<Employee> employees = query.list();
```

## 장점

- 컴파일 시점에 쿼리 문법 검증
- 쿼리 재사용성 향상
- 유지보수 용이

---

# 관계 매핑 어노테이션

JPA에서 엔티티 간의 관계를 매핑하는 핵심 어노테이션들입니다.

## @OneToMany / @ManyToOne

가장 흔한 관계 매핑으로, 부서와 직원 관계를 예로 들 수 있습니다:

```java
@Entity
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Employee> employees = new ArrayList<>();
}

@Entity
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
}
```

`mappedBy` 속성은 관계의 주인이 아닌 쪽에 설정합니다. 외래 키를 가지고 있는 `Employee` 엔티티가 관계의 주인이 됩니다.

## @OneToOne

```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    private UserProfile profile;
}
```

## @ManyToMany

```java
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
}
```

> ManyToMany 관계는 중간 테이블에 추가 컬럼이 필요해지는 경우가 많으므로, 처음부터 중간 엔티티를 만들어 OneToMany - ManyToOne 관계로 풀어내는 것이 확장성 면에서 유리합니다.

---

# Fetch 전략

## FetchType.LAZY vs FetchType.EAGER

| 속성 | LAZY | EAGER |
|------|------|-------|
| 로딩 시점 | 실제 접근 시 | 부모 엔티티 로딩 시 |
| 기본값 (ToMany) | LAZY | - |
| 기본값 (ToOne) | - | EAGER |
| 성능 | 필요할 때만 로딩 | 불필요한 쿼리 발생 가능 |

실무에서는 모든 연관관계를 `FetchType.LAZY`로 설정하고, 필요한 경우에만 `JOIN FETCH`나 `@EntityGraph`로 즉시 로딩하는 것이 권장됩니다.

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "department_id")
private Department department;
```

---

# 유용한 추가 어노테이션

## @Enumerated

Enum 타입을 DB에 저장하는 방법을 지정합니다:

```java
@Enumerated(EnumType.STRING)  // 문자열로 저장 (권장)
private Status status;

@Enumerated(EnumType.ORDINAL) // 순서 번호로 저장 (비권장)
private Priority priority;
```

`EnumType.ORDINAL`은 Enum 순서가 변경되면 기존 데이터와 매핑이 깨지므로, 반드시 `EnumType.STRING`을 사용해야 합니다.

## @Temporal

날짜/시간 타입을 지정합니다 (Java 8 이전):

```java
@Temporal(TemporalType.TIMESTAMP)
private Date createdAt;

@Temporal(TemporalType.DATE)
private Date birthDate;
```

Java 8 이상에서는 `LocalDate`, `LocalDateTime`을 사용하면 `@Temporal` 어노테이션이 필요 없습니다.

## @Transient

DB에 매핑하지 않을 필드를 지정합니다:

```java
@Transient
private String tempData;  // DB에 저장되지 않음
```

## @Lob

대용량 데이터를 저장할 때 사용합니다:

```java
@Lob
private String content;  // CLOB

@Lob
private byte[] image;    // BLOB
```

---

# 실무 Best Practices

1. **기본 키 생성 전략**: `GenerationType.IDENTITY`(MySQL)나 `GenerationType.SEQUENCE`(Oracle, PostgreSQL)를 DB에 맞게 선택합니다. `GenerationType.AUTO`는 DB 벤더에 따라 예측 불가능한 동작을 할 수 있습니다.

2. **양방향 관계 관리**: 양방향 관계에서는 편의 메서드를 만들어 양쪽 연관관계를 동시에 설정합니다.

3. **equals/hashCode**: 엔티티의 동등성 비교를 위해 비즈니스 키(예: email)를 기반으로 `equals()`와 `hashCode()`를 구현합니다. `@Id` 필드만으로 구현하면 영속화 전에는 null이 되어 문제가 발생할 수 있습니다.

4. **불변 엔티티 설계**: 가능한 경우 setter를 제거하고 생성자나 빌더 패턴으로 엔티티를 생성합니다.
