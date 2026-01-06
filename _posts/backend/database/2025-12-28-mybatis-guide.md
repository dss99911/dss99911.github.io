---
layout: post
title: "MyBatis 가이드 - 시작하기와 TypeHandler"
date: 2025-12-28 12:07:00 +0900
categories: [backend, database]
tags: [mybatis, java, orm, sql-mapper, database]
description: "MyBatis의 기본 개념, 장단점, 그리고 TypeHandler를 활용한 커스텀 타입 처리 방법을 알아봅니다."
image: /assets/images/posts/thumbnails/2025-12-28-mybatis-guide.png
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

# MyBatis vs JPA 선택 가이드

| 상황 | 추천 |
|------|------|
| 복잡한 쿼리가 많은 경우 | MyBatis |
| 빠른 개발이 필요한 경우 | JPA |
| SQL 튜닝이 중요한 경우 | MyBatis |
| 단순 CRUD 중심 | JPA |
| 레거시 DB와 연동 | MyBatis |
