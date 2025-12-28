---
layout: post
title: "Hibernate JPA 어노테이션 가이드 - Entity, 상속, Named Query"
date: 2025-12-28 12:08:00 +0900
categories: [backend, database]
tags: [hibernate, jpa, java, orm, annotations, entity]
description: "Hibernate JPA의 핵심 어노테이션과 상속 전략, Named Query 사용법을 알아봅니다."
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
