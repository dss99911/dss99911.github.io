---
layout: post
title: "MyBatis 가이드 - 시작하기와 TypeHandler"
date: 2025-01-05 09:33:00 +0900
categories: [backend, database]
tags: [mybatis, java, orm, sql-mapper, database]
description: "MyBatis의 기본 개념, 장단점, 그리고 TypeHandler를 활용한 커스텀 타입 처리 방법을 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-mybatis-guide.png
redirect_from:
  - "/backend/database/2025/12/28/mybatis-guide.html"
---

# MyBatis 소개

MyBatis는 SQL Mapper 프레임워크로, 개발자가 작성한 SQL을 자바 객체와 매핑해주는 역할을 합니다.

## 기본 개념

- 매퍼(Mapper)를 통해 데이터베이스에서 값을 조회
- SQL을 XML 파일에 별도로 관리
- 로직과 SQL 호출을 분리

---

# MyBatis 장단점

## 장점

### 1. 명시적이고 이해하기 쉬움
Spring Data JPA처럼 메서드명으로 쿼리를 유추하는 것이 아니라, SQL이 그대로 보이므로 직관적입니다.

### 2. 로직과 SQL의 분리
매퍼 XML을 리소스에 저장하여 비즈니스 로직과 데이터 접근 로직을 깔끔하게 분리할 수 있습니다.

### 3. 복잡한 쿼리 작성 용이
동적 SQL, 복잡한 조인, 서브쿼리 등을 자유롭게 작성할 수 있습니다.

## 단점

### 1. 매퍼 XML 문법 학습 필요
MyBatis 특유의 XML 문법(if, choose, foreach 등)을 익혀야 합니다.

### 2. 수동 작업 필요
CRUD마다 매퍼를 일일이 작성해야 하므로 반복 작업이 발생합니다.

---

# TypeHandler

TypeHandler는 Java 타입과 JDBC 타입 간의 변환을 커스터마이징할 때 사용합니다.

## 사용 예시: 암호화 TypeHandler

데이터를 저장할 때 암호화하고, 조회할 때 복호화하는 TypeHandler 예시입니다.

### 매퍼에서 사용

```xml
#{contact.contactName, typeHandler=io.tbal.user.common.mybatis.handler.EncryptionTypeHandler}
```

### TypeHandler 구현

```java
@Slf4j
public class EncryptionTypeHandler implements TypeHandler<String> {

    @Override
    public void setParameter(PreparedStatement ps, int i, String parameter, JdbcType jdbcType)
            throws SQLException {
        String encryptedString = null;
        try {
            encryptedString = AESCipher.getInstance().encrypt(parameter);
        } catch (Exception e) {
            log.error("Encryption failed : " + e.getMessage(), e);
        }
        ps.setString(i, encryptedString);
    }

    @Override
    public String getResult(ResultSet rs, String columnName) throws SQLException {
        String encryptedString = rs.getString(columnName);
        String decryptedString = null;
        try {
            decryptedString = AESCipher.getInstance().decrypt(encryptedString);
        } catch (Exception e) {
            log.error("Decryption failed : " + e.getMessage(), e);
        }
        return decryptedString;
    }

    @Override
    public String getResult(ResultSet rs, int columnIndex) throws SQLException {
        String encryptedString = rs.getString(columnIndex);
        String decryptedString = null;
        try {
            decryptedString = AESCipher.getInstance().decrypt(encryptedString);
        } catch (Exception e) {
            log.error("Decryption failed : " + e.getMessage(), e);
        }
        return decryptedString;
    }

    @Override
    public String getResult(CallableStatement cs, int columnIndex) throws SQLException {
        String encryptedString = cs.getString(columnIndex);
        String decryptedString = null;
        try {
            decryptedString = AESCipher.getInstance().decrypt(encryptedString);
        } catch (Exception e) {
            log.error("Decryption failed : " + e.getMessage(), e);
        }
        return decryptedString;
    }
}
```

## TypeHandler 활용 사례

| 용도 | 설명 |
|------|------|
| 암호화/복호화 | 민감한 데이터의 자동 암호화 처리 |
| Enum 변환 | Enum과 DB 값 간의 매핑 |
| JSON 변환 | JSON 문자열과 객체 간의 변환 |
| 날짜 형식 | 특수한 날짜 형식 처리 |

---

# 동적 SQL

MyBatis의 강력한 기능 중 하나는 동적 SQL입니다. XML 매퍼에서 조건에 따라 SQL을 동적으로 생성할 수 있습니다.

## if 태그

조건에 따라 SQL 조각을 포함시킵니다:

```xml
<select id="findUser" resultType="User">
    SELECT * FROM users
    WHERE status = 'ACTIVE'
    <if test="name != null">
        AND name LIKE #{name}
    </if>
    <if test="email != null">
        AND email = #{email}
    </if>
</select>
```

## choose / when / otherwise

Java의 switch-case와 유사하게 여러 조건 중 하나를 선택합니다:

```xml
<select id="findUser" resultType="User">
    SELECT * FROM users
    WHERE 1=1
    <choose>
        <when test="name != null">
            AND name LIKE #{name}
        </when>
        <when test="email != null">
            AND email = #{email}
        </when>
        <otherwise>
            AND status = 'ACTIVE'
        </otherwise>
    </choose>
</select>
```

## foreach 태그

컬렉션을 순회하며 SQL을 생성합니다. IN 절을 만들 때 자주 사용됩니다:

```xml
<select id="findUsersByIds" resultType="User">
    SELECT * FROM users
    WHERE id IN
    <foreach item="id" collection="idList" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>
```

## where / set 태그

`<where>` 태그는 내부 조건이 있을 때만 WHERE 절을 생성하고, 불필요한 AND/OR를 자동으로 제거합니다:

```xml
<select id="findUser" resultType="User">
    SELECT * FROM users
    <where>
        <if test="name != null">
            AND name = #{name}
        </if>
        <if test="status != null">
            AND status = #{status}
        </if>
    </where>
</select>
```

`<set>` 태그는 UPDATE 문에서 마지막 쉼표를 자동으로 제거합니다:

```xml
<update id="updateUser">
    UPDATE users
    <set>
        <if test="name != null">name = #{name},</if>
        <if test="email != null">email = #{email},</if>
        <if test="status != null">status = #{status},</if>
    </set>
    WHERE id = #{id}
</update>
```

---

# ResultMap 활용

복잡한 매핑이 필요할 때 ResultMap을 사용합니다. 특히 컬럼명과 Java 필드명이 다르거나, 연관 객체를 매핑해야 할 때 유용합니다:

```xml
<resultMap id="userResultMap" type="User">
    <id property="id" column="user_id"/>
    <result property="userName" column="user_name"/>
    <result property="email" column="user_email"/>
    <association property="department" javaType="Department">
        <id property="id" column="dept_id"/>
        <result property="name" column="dept_name"/>
    </association>
</resultMap>

<select id="findUserWithDept" resultMap="userResultMap">
    SELECT u.user_id, u.user_name, u.user_email,
           d.dept_id, d.dept_name
    FROM users u
    LEFT JOIN departments d ON u.dept_id = d.dept_id
    WHERE u.user_id = #{id}
</select>
```

---

# Spring Boot와 MyBatis 연동

Spring Boot에서 MyBatis를 사용하려면 `mybatis-spring-boot-starter` 의존성을 추가합니다:

```gradle
implementation 'org.mybatis.spring.boot:mybatis-spring-boot-starter:3.0.3'
```

`application.yml`에서 매퍼 위치를 지정합니다:

```yaml
mybatis:
  mapper-locations: classpath:mapper/**/*.xml
  type-aliases-package: com.example.domain
  configuration:
    map-underscore-to-camel-case: true
```

`map-underscore-to-camel-case: true` 설정을 활성화하면 DB의 snake_case 컬럼명이 자동으로 Java의 camelCase 필드에 매핑되어 별도의 ResultMap 없이도 편리하게 사용할 수 있습니다.

---

# MyBatis vs JPA 선택 가이드

| 상황 | 추천 |
|------|------|
| 복잡한 쿼리가 많은 경우 | MyBatis |
| 빠른 개발이 필요한 경우 | JPA |
| SQL 튜닝이 중요한 경우 | MyBatis |
| 단순 CRUD 중심 | JPA |
| 레거시 DB와 연동 | MyBatis |

실무에서는 MyBatis와 JPA를 함께 사용하는 경우도 많습니다. 단순 CRUD는 JPA로 처리하고, 복잡한 조회 쿼리는 MyBatis로 작성하는 하이브리드 방식이 생산성과 성능을 모두 잡을 수 있는 좋은 전략입니다.

---

# 자주 발생하는 실수와 해결법

| 문제 | 원인 | 해결 |
|------|------|------|
| 파라미터 바인딩 오류 | `${}` 대신 `#{}` 미사용 | SQL Injection 방지를 위해 항상 `#{}` 사용 |
| NULL 파라미터 처리 실패 | jdbcType 미지정 | `#{value, jdbcType=VARCHAR}` 형태로 지정 |
| 컬렉션 매핑 오류 | resultMap 미설정 | association, collection 태그 활용 |
| 캐시 불일치 | 1차 캐시 미이해 | SqlSession 범위 내에서만 캐시 유효 |

`${}`는 문자열 치환으로 SQL Injection에 취약하므로, 사용자 입력값에는 반드시 `#{}`를 사용해야 합니다. `${}`는 테이블명이나 컬럼명처럼 파라미터 바인딩이 불가능한 곳에서만 제한적으로 사용합니다.
