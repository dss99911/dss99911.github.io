---
layout: post
title: "Spring Data JPA 완벽 가이드 - Entity, Repository, Cache"
date: 2025-12-28 12:02:00 +0900
categories: [backend, spring]
tags: [spring, jpa, hibernate, database, cache, repository]
description: "Spring Data JPA를 활용한 데이터베이스 연동 방법을 알아봅니다. Entity 정의, Repository 인터페이스, 캐싱 전략까지 상세히 다룹니다."
image: /assets/images/posts/thumbnails/2025-12-28-spring-data-jpa.png
---

Spring Data JPA는 데이터베이스 연동을 간편하게 해주는 프레임워크입니다. 이 글에서는 Entity 정의부터 다양한 Repository 인터페이스, 그리고 캐싱 전략까지 살펴보겠습니다.

## 데이터소스 설정

### application.properties 설정

```properties
# Data source
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/MyDB?autoReconnect=true&useUnicode=true&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=password

# JPA
spring.jpa.database-platform=org.hibernate.dialect.MySQL5Dialect
spring.jpa.hibernate.ddl-auto=update  # 테이블 자동 생성 및 업데이트

# SQL 로그 출력
spring.jpa.show-sql=true
```

> `ddl-auto=update`는 개발 환경에서만 사용하세요. 운영 환경에서는 `validate`나 `none`을 권장합니다.

## Entity 정의

### 기본 Entity

```kotlin
@Entity
data class Todo(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Int = 0,

    @get:NotBlank
    var todoDescription: String,

    @get:NotBlank
    var todoTargetDate: String,

    @get:NotBlank
    var status: String
) {
    constructor() : this(0, "", "", "")
}
```

### 주요 어노테이션

| 어노테이션 | 설명 |
|-----------|------|
| `@Entity` | JPA Entity 클래스임을 선언 |
| `@Id` | Primary Key 필드 지정 |
| `@GeneratedValue` | 자동 생성 전략 설정 |
| `@Column` | 컬럼 세부 설정 |
| `@NotBlank` | 유효성 검증 (null이 아니고 공백이 아님) |

### 테이블 이름 지정

클래스 이름과 다른 테이블 이름을 사용하려면:

```java
@Entity(name = "mccmnc")
public class MccMnc {
    // ...
}
```

### 복합 Primary Key

```java
@Entity
@IdClass(MccMncId.class)
public class MccMnc {
    @Id
    private String mcc;

    @Id
    private String mnc;
    // ...
}

// ID 클래스
public class MccMncId implements Serializable {
    private String mcc;
    private String mnc;
    // equals, hashCode 구현 필요
}
```

### Auto Increment 설정

```kotlin
@Id
@Column(name = "id", updatable = false, nullable = false)
@GeneratedValue(strategy = GenerationType.IDENTITY)
var id: Long = 0
```

### Timestamp 자동 관리

**생성 시간 자동 설정:**

```kotlin
@Temporal(TemporalType.TIMESTAMP)
@Column(
    updatable = false,
    insertable = false,
    columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    nullable = false
)
lateinit var createDate: Timestamp
```

**수정 시간 자동 업데이트:**

```kotlin
@Column(
    updatable = false,
    insertable = false,
    columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
    nullable = false
)
lateinit var updateDate: Timestamp
```

### Native Query 정의

```java
@NamedNativeQueries({
    @NamedNativeQuery(
        name = "HistoryStatistics.getCollectTable",
        query = "SELECT sequence_id, uid, DATE_FORMAT(registration_date,'%m-%d') as date, " +
                "COUNT(DISTINCT id) as count " +
                "FROM message_collect_user_history " +
                "WHERE registration_date BETWEEN ?1 AND ?2 " +
                "GROUP BY DATE_FORMAT(registration_date,'%Y-%m-%d'), uid",
        resultClass = HistoryStatistics.class
    )
})
@Entity
public class HistoryStatistics {
    // ...
}
```

## Repository 인터페이스

Spring Data JPA는 다양한 Repository 인터페이스를 제공합니다.

### Repository (기본)

가장 기본적인 인터페이스로, 필요한 메서드만 직접 정의합니다:

```java
public interface CountryRepository extends Repository<Country, Integer> {

    // 메서드 이름으로 쿼리 생성
    public Country findByName(String countryName);

    // 직접 쿼리 작성
    @Query("SELECT c FROM Country c WHERE c.name = ?1")
    public Country findByNameQueryPositionalParam(String countryName);
}
```

### CrudRepository

기본 CRUD 메서드를 제공합니다:

```java
public interface UserRepository extends CrudRepository<UserRecord, String> {
    // save, findById, findAll, delete 등 기본 제공
}
```

### JpaRepository

페이징과 정렬 기능이 추가된 인터페이스입니다:

```java
public interface HistoryStatisticsDao extends JpaRepository<HistoryStatistics, String> {
    List<HistoryStatistics> getCollectTable(String startDate, String endDate);
}
```

**Kotlin 예시:**

```kotlin
@Repository
interface TodoRepository : JpaRepository<Todo, Int>
```

### QueryDslPredicateExecutor

동적 쿼리를 위한 Predicate를 사용할 수 있습니다:

```xml
<dependency>
    <groupId>com.mysema.querydsl</groupId>
    <artifactId>querydsl-jpa</artifactId>
    <version>3.4.3</version>
</dependency>
```

```java
public interface MccMncDao extends CrudRepository<MccMnc, MccMncId>,
                                   QueryDslPredicateExecutor<MccMnc> {
}
```

### QueryDslRepositorySupport

복잡한 쿼리를 위한 지원 클래스입니다:

```java
@Repository
public class MccMncSupportDao extends QueryDslRepositorySupport {

    public MccMncSupportDao() {
        super(MccMnc.class);
    }

    public List<Tuple> getMccMncGroupByOperatorIdCircleId() {
        QMccMnc qMccMnc = QMccMnc.mccMnc;

        return from(qMccMnc)
            .where(qMccMnc.support.eq(true))
            .groupBy(qMccMnc.operatorId, qMccMnc.circleId)
            .orderBy(qMccMnc.operatorId.asc(), qMccMnc.circleId.asc())
            .list(qMccMnc.mcc, qMccMnc.mnc, qMccMnc.operatorId,
                  qMccMnc.circleId, qMccMnc.operatorName, qMccMnc.circleName);
    }
}

// Tuple 사용
Tuple t;
int mcc = t.get(QMccMnc.mcc);
```

## 캐싱 (Cache)

반복적인 데이터베이스 조회를 줄이기 위해 캐싱을 활용할 수 있습니다.

### 캐싱 활성화

```kotlin
@SpringBootApplication
@EnableCaching
class MyApplication
```

### Repository에 캐싱 적용

```kotlin
interface DictionaryDao : JpaRepository<Dictionary, Int> {

    @Cacheable("dictionary")
    override fun findAll(): MutableList<Dictionary>

    @CacheEvict(value = "dictionary", allEntries = true)
    override fun <S : Dictionary?> save(entity: S): S

    @CacheEvict(value = "dictionary", allEntries = true)
    override fun <S : Dictionary?> saveAll(entities: MutableIterable<S>): MutableList<S>
}
```

### 캐시 어노테이션 설명

| 어노테이션 | 설명 |
|-----------|------|
| `@Cacheable` | 결과를 캐시에 저장, 이후 호출 시 캐시에서 반환 |
| `@CacheEvict` | 캐시에서 항목 제거 |
| `@CachePut` | 항상 메서드 실행 후 결과를 캐시에 저장 |

### 캐시 구현체 선택

기본적으로 `ConcurrentHashMap` 기반의 간단한 캐시를 사용하지만, 운영 환경에서는 다음을 고려하세요:

- **Redis**: 분산 캐시가 필요한 경우
- **Ehcache**: 로컬 캐시로 충분한 경우
- **Caffeine**: 고성능 로컬 캐시

```properties
# Redis 캐시 사용 예시
spring.cache.type=redis
spring.redis.host=localhost
spring.redis.port=6379
```

## 결론

Spring Data JPA는 데이터베이스 작업을 크게 단순화합니다. Entity 설계 시 적절한 어노테이션을 활용하고, 상황에 맞는 Repository 인터페이스를 선택하세요. 캐싱을 적용하면 성능을 더욱 향상시킬 수 있습니다. 다만, 캐시 무효화 전략을 잘 수립하여 데이터 정합성 문제가 발생하지 않도록 주의해야 합니다.
