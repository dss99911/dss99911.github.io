---
layout: post
title: "Hibernate JPA XML 설정 가이드 - 설정 파일과 매핑"
date: 2025-12-28 12:10:00 +0900
categories: database
tags: [hibernate, jpa, xml, configuration, mapping, java, orm]
description: "Hibernate의 XML 기반 설정 파일 구성, 컬렉션 매핑, 객체 관계 매핑을 알아봅니다."
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
