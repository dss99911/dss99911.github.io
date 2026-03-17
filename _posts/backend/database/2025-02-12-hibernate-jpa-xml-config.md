---
layout: post
title: "Hibernate JPA XML 설정 가이드 - 설정 파일과 매핑"
date: 2025-02-12 16:28:00 +0900
categories: [backend, database]
tags: [hibernate, jpa, xml, configuration, mapping, java, orm]
description: "Hibernate의 XML 기반 설정 파일 구성, 컬렉션 매핑, 객체 관계 매핑을 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-hibernate-jpa-xml-config.png
redirect_from:
  - "/backend/database/2025/12/28/hibernate-jpa-xml-config.html"
---

# Hibernate 설정 파일 (hibernate.cfg.xml)

Hibernate의 핵심 설정 파일입니다.

## 기본 구조

```xml
<?xml version='1.0' encoding='UTF-8'?>
<!DOCTYPE hibernate-configuration PUBLIC
    "-//Hibernate/Hibernate Configuration DTD 3.0//EN"
    "http://hibernate.sourceforge.net/hibernate-configuration-3.0.dtd">

<hibernate-configuration>
    <session-factory>
        <!-- 자동 DDL 생성 -->
        <property name="hbm2ddl.auto">update</property>

        <!-- 데이터베이스 Dialect -->
        <property name="dialect">org.hibernate.dialect.Oracle9Dialect</property>

        <!-- 데이터베이스 연결 정보 -->
        <property name="connection.url">jdbc:oracle:thin:@localhost:1521:xe</property>
        <property name="connection.driver_class">oracle.jdbc.driver.OracleDriver</property>

        <!-- 매핑 파일 -->
        <mapping resource="question.hbm.xml"/>

        <!-- 또는 어노테이션 클래스 매핑 -->
        <mapping class="com.javatpoint.Employee"/>
    </session-factory>
</hibernate-configuration>
```

## 주요 설정 옵션

### hbm2ddl.auto

| 값 | 설명 |
|---|------|
| `create` | 시작 시 테이블 삭제 후 재생성 |
| `create-drop` | 시작 시 생성, 종료 시 삭제 |
| `update` | 변경사항만 반영 (운영에서 주의) |
| `validate` | 스키마 검증만 수행 |
| `none` | 아무 동작 안 함 |

---

# 컬렉션 매핑 (Collection Mapping)

## Key 속성 설정

```xml
<key
    column="columnname"
    on-delete="noaction|cascade"
    not-null="true|false"
    property-ref="propertyName"
    update="true|false"
    unique="true|false"
/>
```

## 컬렉션 타입

| 타입 | 설명 |
|------|------|
| `<list>` | 순서가 있는 컬렉션, 인덱스 포함 |
| `<bag>` | 순서 없음, 중복 허용 |
| `<set>` | 순서 없음, 중복 불허 |
| `<map>` | 키-값 쌍으로 저장 |

## 문자열 리스트 매핑

```xml
<class name="com.javatpoint.Question" table="q100">
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

## 객체 리스트 매핑 (One-to-Many)

```xml
<class name="com.javatpoint.Question" table="q100">
    <id name="id">
        <generator class="increment"/>
    </id>
    <property name="qname"/>

    <list name="answers">
        <key column="qid" not-null="true"/>
        <index column="type"/>
        <one-to-many class="com.javatpoint.Answer"/>
    </list>
</class>
```

## 컴포넌트 매핑 (Component Mapping)

별도 테이블 없이 컬럼으로 포함시키는 방식입니다.

```xml
<class name="com.javatpoint.Employee" table="emp177">
    <id name="id">
        <generator class="increment"/>
    </id>
    <property name="name"/>

    <component name="address" class="com.javatpoint.Address">
        <property name="city"/>
        <property name="country"/>
        <property name="pincode"/>
    </component>
</class>
```

---

# 객체 관계 매핑 (Object Reference)

## Many-to-One

여러 Employee가 하나의 Address를 참조합니다.

```xml
<class name="com.javatpoint.Employee" table="emp211">
    <id name="employeeId">
        <generator class="increment"/>
    </id>
    <property name="name"/>
    <property name="email"/>

    <many-to-one name="address" unique="true" cascade="all"/>
</class>
```

## One-to-One

Employee와 Address가 1:1 관계입니다.

```xml
<class name="com.javatpoint.Employee" table="emp212">
    <id name="employeeId">
        <generator class="increment"/>
    </id>
    <property name="name"/>
    <property name="email"/>

    <one-to-one name="address" cascade="all"/>
</class>
```

## Cascade 옵션

| 값 | 설명 |
|---|------|
| `none` | 연관 객체 무시 |
| `save-update` | 저장/수정 시 함께 처리 |
| `delete` | 삭제 시 함께 삭제 |
| `all` | 모든 작업 전파 |
| `all-delete-orphan` | all + 고아 객체 삭제 |

---

# Lazy Loading

연관된 컬렉션을 필요할 때만 로딩합니다.

```xml
<list name="answers" lazy="true">
    <key column="qid"/>
    <index column="type"/>
    <one-to-many class="com.javatpoint.Answer"/>
</list>
```

## 설정

- **기본값**: `true` (Hibernate 3.0 이상)
- **false**: 부모 로딩 시 함께 로딩 (Eager Loading)
- **extra**: 컬렉션 메타데이터만 로딩

---

# 캐시 (Cache)

## First Level Cache (1차 캐시)

- **범위**: Session 객체
- **기본값**: 항상 활성화
- 같은 세션 내에서 동일 객체 재조회 시 캐시 사용

## Second Level Cache (2차 캐시)

- **범위**: SessionFactory (전체 애플리케이션)
- **기본값**: 비활성화
- 설정 필요: EhCache, Infinispan 등 캐시 프로바이더 사용

### 2차 캐시 활성화

```xml
<property name="cache.use_second_level_cache">true</property>
<property name="cache.region.factory_class">
    org.hibernate.cache.ehcache.EhCacheRegionFactory
</property>
```

---

# Struts와 Hibernate 통합

Struts는 MVC 프레임워크로, Hibernate와 함께 사용하여 웹 애플리케이션을 구축할 수 있습니다.

## 흐름

1. **입력 JSP**: 사용자 입력, Action 지정
2. **struts.xml**: Action과 클래스 매핑, 결과 JSP 지정
3. **Action 클래스**: `execute()` 메서드에서 로직 처리
4. **결과 JSP**: 처리 결과 표시
5. **web.xml**: Struts 설정

> 현재는 Spring MVC나 Spring Boot가 더 많이 사용됩니다.

---

# XML 설정 vs 어노테이션 설정

Hibernate는 XML 기반 설정과 어노테이션 기반 설정을 모두 지원합니다. 프로젝트 상황에 따라 적절한 방식을 선택해야 합니다.

## XML 설정이 적합한 경우

- **레거시 프로젝트**: 기존에 XML로 구성된 프로젝트를 유지보수할 때
- **엔티티 클래스 수정 불가**: 외부 라이브러리의 클래스를 매핑해야 할 때
- **매핑 변경 빈도가 높을 때**: 코드 재컴파일 없이 XML만 변경하면 되므로 유연함
- **복잡한 매핑 시각화**: XML 파일에서 전체 매핑 구조를 한눈에 파악 가능

## 어노테이션 설정이 적합한 경우

- **신규 프로젝트**: Spring Boot와 함께 사용하면 설정이 간결
- **코드와 매핑 정보 일치**: 엔티티 클래스에 매핑 정보가 함께 있어 관리 편리
- **JPA 표준 준수**: `javax.persistence` 어노테이션은 JPA 표준이므로 ORM 전환 용이

## 실무 팁

현재 대부분의 신규 프로젝트에서는 어노테이션 기반 설정을 사용합니다. 하지만 XML 설정 방식을 이해해두면 레거시 프로젝트를 유지보수할 때 큰 도움이 됩니다.

특히 `hibernate.cfg.xml`의 `hbm2ddl.auto` 설정은 반드시 환경별로 다르게 적용해야 합니다:

- **개발 환경**: `update` 또는 `create-drop`으로 빠른 개발
- **테스트 환경**: `create-drop`으로 깨끗한 테스트 환경 보장
- **운영 환경**: `validate` 또는 `none`으로 안전하게 운영 (절대 `create`나 `update` 사용 금지)

운영 환경에서 `update`를 사용하면 의도치 않은 스키마 변경이 발생할 수 있고, `create`는 기존 데이터를 모두 삭제하므로 치명적인 문제를 야기할 수 있습니다. 운영 DB의 스키마 변경은 반드시 DBA나 마이그레이션 도구(Flyway, Liquibase 등)를 통해 관리해야 합니다.

---

# 자주 발생하는 문제와 해결법

| 문제 | 원인 | 해결 |
|------|------|------|
| LazyInitializationException | 세션 종료 후 Lazy 컬렉션 접근 | Open Session in View 패턴 또는 Fetch Join 사용 |
| N+1 문제 | 컬렉션 로딩 시 개별 쿼리 실행 | `fetch="join"` 또는 `batch-size` 설정 |
| Detached entity 오류 | 분리된 엔티티 재사용 | `merge()` 또는 새 세션에서 로딩 |
| Dialect 오류 | DB 버전과 Dialect 불일치 | DB 버전에 맞는 Dialect 클래스 사용 |

N+1 문제를 XML 설정에서 해결하려면 `batch-size`를 설정합니다:

```xml
<list name="answers" batch-size="10">
    <key column="qid"/>
    <index column="type"/>
    <one-to-many class="com.javatpoint.Answer"/>
</list>
```

이렇게 설정하면 컬렉션 로딩 시 개별 쿼리 대신 IN 절을 사용하여 한 번에 여러 컬렉션을 로딩합니다.
