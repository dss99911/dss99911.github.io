---
layout: post
title: "Hibernate XML 설정 가이드 - 매핑, 캐시, 트랜잭션"
date: 2025-12-28 15:02:00 +0900
categories: spring
tags: [jpa, hibernate, xml, orm, spring, cache, transaction]
description: "Hibernate XML 설정 방법을 알아봅니다. 기본 설정부터 컬렉션 매핑, 객체 참조, 캐시, 트랜잭션 관리까지 상세히 다룹니다."
---

Hibernate는 어노테이션 기반 설정 외에도 XML을 통한 설정을 지원합니다. 레거시 프로젝트나 설정을 코드와 분리하고 싶을 때 유용합니다. 이 글에서는 XML 기반 Hibernate 설정 방법을 알아보겠습니다.

## 기본 설정 (hibernate.cfg.xml)

Hibernate의 핵심 설정 파일입니다. 데이터베이스 연결 정보와 매핑 파일을 지정합니다.

```xml
<?xml version='1.0' encoding='UTF-8'?>
<!DOCTYPE hibernate-configuration PUBLIC
    "-//Hibernate/Hibernate Configuration DTD 3.0//EN"
    "http://hibernate.sourceforge.net/hibernate-configuration-3.0.dtd">

<hibernate-configuration>
    <session-factory>
        <!-- 데이터베이스 연결 설정 -->
        <property name="connection.driver_class">oracle.jdbc.driver.OracleDriver</property>
        <property name="connection.url">jdbc:oracle:thin:@localhost:1521:xe</property>
        <property name="connection.username">system</property>
        <property name="connection.password">oracle</property>

        <!-- Hibernate 설정 -->
        <property name="dialect">org.hibernate.dialect.Oracle9Dialect</property>
        <property name="hbm2ddl.auto">update</property>
        <property name="show_sql">true</property>
        <property name="format_sql">true</property>

        <!-- 매핑 파일 -->
        <mapping resource="question.hbm.xml"/>

        <!-- 또는 어노테이션 기반 Entity 클래스 -->
        <mapping class="com.example.Employee"/>
    </session-factory>
</hibernate-configuration>
```

### 주요 프로퍼티 설명

| 프로퍼티 | 설명 |
|---------|------|
| `hbm2ddl.auto` | 테이블 자동 생성 전략 |
| `dialect` | 데이터베이스별 SQL 방언 |
| `show_sql` | 실행되는 SQL 콘솔 출력 |
| `format_sql` | SQL 포맷팅 |

### hbm2ddl.auto 옵션

| 옵션 | 설명 | 사용 환경 |
|-----|------|----------|
| `create` | 기존 테이블 삭제 후 새로 생성 | 테스트 |
| `create-drop` | 세션 종료 시 테이블 삭제 | 테스트 |
| `update` | 변경사항만 반영 | 개발 |
| `validate` | 매핑 검증만 수행 | 운영 |
| `none` | 아무것도 하지 않음 | 운영 |

> 운영 환경에서는 `validate` 또는 `none`을 사용하세요. `update`도 위험할 수 있습니다.

## 컬렉션 매핑

Hibernate는 `<list>`, `<set>`, `<bag>`, `<map>` 등의 컬렉션 매핑을 지원합니다.

### 기본 타입 컬렉션 (List of String)

```xml
<class name="com.example.Question" table="q100">
    <id name="id">
        <generator class="increment"/>
    </id>
    <property name="qname"/>

    <list name="answers" table="ans100">
        <key column="qid"/>
        <index column="type"/>
        <element column="answer" type="string"/>
    </list>
</class>
```

### 객체 컬렉션 (List of Entity)

```xml
<class name="com.example.Question" table="q100">
    <id name="id">
        <generator class="increment"/>
    </id>
    <property name="qname"/>

    <list name="answers">
        <key column="qid" not-null="true"/>
        <index column="type"/>
        <one-to-many class="com.example.Answer"/>
    </list>
</class>
```

### 컬렉션 타입 비교

| 타입 | 순서 보장 | 중복 허용 | 특징 |
|-----|----------|----------|------|
| `<list>` | O | O | 인덱스 컬럼 필요 |
| `<set>` | X | X | 유일한 요소만 |
| `<bag>` | X | O | 인덱스 없이 순서 무관 |
| `<map>` | X | X | 키-값 쌍 저장 |

### Key 태그 속성

```xml
<key
    column="컬럼명"
    on-delete="noaction|cascade"
    not-null="true|false"
    property-ref="속성명"
    update="true|false"
    unique="true|false"
/>
```

### Component Mapping

별도 테이블 없이 객체를 컬럼으로 포함합니다.

```xml
<class name="com.example.Employee" table="emp177">
    <id name="id">
        <generator class="increment"/>
    </id>
    <property name="name"/>

    <component name="address" class="com.example.Address">
        <property name="city"/>
        <property name="country"/>
        <property name="pincode"/>
    </component>
</class>
```

**결과 테이블 구조:**

| id | name | city | country | pincode |
|----|------|------|---------|---------|
| 1 | 홍길동 | Seoul | Korea | 12345 |

Component는 별도 테이블이 아닌 부모 테이블의 컬럼으로 저장됩니다.

## 객체 참조 매핑

### Many-to-One

여러 Employee가 하나의 Address를 참조합니다.

```xml
<class name="com.example.Employee" table="emp211">
    <id name="employeeId">
        <generator class="increment"/>
    </id>
    <property name="name"/>
    <property name="email"/>

    <many-to-one name="address" unique="true" cascade="all"/>
</class>
```

### One-to-One

Employee와 Address가 1:1 관계입니다.

```xml
<class name="com.example.Employee" table="emp212">
    <id name="employeeId">
        <generator class="increment"/>
    </id>
    <property name="name"/>
    <property name="email"/>

    <one-to-one name="address" cascade="all"/>
</class>
```

### Cascade 옵션

| 옵션 | 설명 |
|-----|------|
| `none` | 기본값, 연관 객체에 영향 없음 |
| `save-update` | 저장/수정 시 연관 객체도 함께 |
| `delete` | 삭제 시 연관 객체도 삭제 |
| `all` | 모든 작업 전파 |
| `all-delete-orphan` | all + 부모에서 제거된 자식 삭제 |

## Lazy Loading

연관된 객체를 실제로 사용할 때까지 로딩을 지연합니다.

```xml
<list name="answers" lazy="true">
    <key column="qid"/>
    <index column="type"/>
    <one-to-many class="com.example.Answer"/>
</list>
```

### Lazy Loading 옵션

| 옵션 | 설명 |
|-----|------|
| `true` | 지연 로딩 (기본값, Hibernate 3.0+) |
| `false` | 즉시 로딩 |
| `extra` | 컬렉션 크기 조회 시 COUNT 쿼리만 실행 |

> Lazy Loading은 성능 최적화에 중요합니다. 하지만 세션이 닫힌 후 접근하면 `LazyInitializationException`이 발생합니다.

## 캐시 (Cache)

Hibernate는 두 가지 레벨의 캐시를 제공합니다.

### First Level Cache (1차 캐시)

- **범위**: Session 객체 단위
- **기본값**: 항상 활성화
- **특징**: 같은 세션 내에서 동일 엔티티 재조회 시 DB 접근 없음

```java
Session session = sessionFactory.openSession();
// 첫 번째 조회 - DB에서 가져옴
Employee emp1 = session.get(Employee.class, 1);
// 두 번째 조회 - 1차 캐시에서 가져옴 (DB 접근 없음)
Employee emp2 = session.get(Employee.class, 1);
session.close();
```

### Second Level Cache (2차 캐시)

- **범위**: SessionFactory 단위 (전체 애플리케이션)
- **기본값**: 비활성화
- **특징**: 여러 세션에서 공유, 별도 캐시 구현체 필요

**설정 방법:**

```xml
<!-- hibernate.cfg.xml -->
<property name="hibernate.cache.use_second_level_cache">true</property>
<property name="hibernate.cache.region.factory_class">
    org.hibernate.cache.ehcache.EhCacheRegionFactory
</property>
```

**엔티티에 캐시 적용:**

```xml
<class name="com.example.Employee" table="emp">
    <cache usage="read-write"/>
    <!-- ... -->
</class>
```

### 캐시 전략

| 전략 | 설명 | 사용 시점 |
|-----|------|----------|
| `read-only` | 읽기 전용, 수정 불가 | 코드 테이블 등 변경 없는 데이터 |
| `read-write` | 읽기/쓰기 가능 | 일반적인 경우 |
| `nonstrict-read-write` | 약한 일관성 보장 | 동시 수정이 거의 없는 경우 |
| `transactional` | JTA 트랜잭션과 연동 | 분산 환경 |

## 트랜잭션 관리

데이터 일관성을 위해 트랜잭션을 적절히 관리해야 합니다.

### 기본 트랜잭션 패턴

```java
Session session = null;
Transaction tx = null;

try {
    session = sessionFactory.openSession();
    tx = session.beginTransaction();

    // 비즈니스 로직 수행
    Employee emp = new Employee();
    emp.setName("홍길동");
    session.save(emp);

    tx.commit();
} catch (Exception ex) {
    if (tx != null) {
        tx.rollback();
    }
    ex.printStackTrace();
} finally {
    if (session != null) {
        session.close();
    }
}
```

### Spring에서의 트랜잭션 관리

Spring을 사용하면 `@Transactional` 어노테이션으로 간편하게 관리할 수 있습니다.

```java
@Service
@Transactional
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public void createEmployee(Employee emp) {
        employeeRepository.save(emp);
        // 예외 발생 시 자동 롤백
    }

    @Transactional(readOnly = true)
    public Employee getEmployee(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }
}
```

### 트랜잭션 전파 옵션

| 옵션 | 설명 |
|-----|------|
| `REQUIRED` | 기존 트랜잭션 있으면 참여, 없으면 새로 생성 (기본값) |
| `REQUIRES_NEW` | 항상 새 트랜잭션 생성 |
| `SUPPORTS` | 트랜잭션 있으면 참여, 없으면 없이 실행 |
| `NOT_SUPPORTED` | 트랜잭션 없이 실행, 기존 있으면 보류 |
| `MANDATORY` | 반드시 기존 트랜잭션 필요 |
| `NEVER` | 트랜잭션 있으면 예외 발생 |
| `NESTED` | 중첩 트랜잭션 생성 |

## 어노테이션 vs XML 비교

| 특징 | 어노테이션 | XML |
|-----|----------|-----|
| 가독성 | 코드와 함께 있어 이해 쉬움 | 설정이 분리되어 코드 간결 |
| 수정 시 | 재컴파일 필요 | 재컴파일 불필요 |
| IDE 지원 | 자동완성, 검증 우수 | 상대적으로 약함 |
| 유지보수 | 일반적으로 선호됨 | 레거시 시스템에서 사용 |

> 현재는 어노테이션 기반 설정이 주류입니다. 새 프로젝트에서는 어노테이션을 사용하세요. XML은 레거시 시스템 유지보수나 설정을 코드와 분리해야 할 때 고려하세요.

## 결론

Hibernate XML 설정의 핵심을 정리하면:

- **hibernate.cfg.xml**: 데이터베이스 연결과 Hibernate 동작 설정
- **컬렉션 매핑**: list, set, bag, map으로 다양한 컬렉션 표현
- **객체 참조**: many-to-one, one-to-one으로 관계 정의
- **Lazy Loading**: 성능 최적화를 위한 지연 로딩
- **캐시**: 1차/2차 캐시로 DB 부하 감소
- **트랜잭션**: 데이터 일관성을 위한 트랜잭션 관리

XML 설정을 이해하면 레거시 프로젝트 유지보수에 도움이 되며, Hibernate의 동작 원리를 더 깊이 이해할 수 있습니다.
