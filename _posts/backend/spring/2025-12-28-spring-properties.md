---
layout: post
title: "Spring Boot Properties 설정 완벽 가이드"
date: 2025-12-28 12:03:00 +0900
categories: [backend, spring]
tags: [spring, spring-boot, properties, configuration, yaml, profile, gradle, maven]
description: "Spring Boot의 application.properties와 application.yml 설정 방법을 상세히 알아봅니다. 서버, 데이터베이스, 로깅 설정부터 @Value 주입까지 다룹니다."
---

Spring Boot 애플리케이션의 설정은 주로 `application.properties` 또는 `application.yml` 파일을 통해 관리됩니다. 이 글에서는 다양한 설정 옵션과 활용 방법을 정리합니다.

## 서버 설정

### 포트 변경

```properties
server.port=80
```

```yaml
server:
  port: 80
```

### 기타 서버 설정

```properties
# 컨텍스트 경로 설정
server.servlet.context-path=/api

# 세션 타임아웃 (분)
server.servlet.session.timeout=30m

# 압축 활성화
server.compression.enabled=true
```

## 데이터베이스 설정

### MySQL 데이터소스 설정

```properties
# Data source
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/MyDB?autoReconnect=true&useUnicode=true&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=yourpassword

# JPA
spring.jpa.database-platform=org.hibernate.dialect.MySQL5Dialect
spring.jpa.hibernate.ddl-auto=update
```

### DDL Auto 옵션

| 옵션 | 설명 |
|-----|------|
| `none` | DDL 실행 안 함 (운영 권장) |
| `validate` | 엔티티와 테이블 일치 여부만 검증 |
| `update` | 변경된 스키마만 업데이트 |
| `create` | 시작 시 테이블 생성 |
| `create-drop` | 종료 시 테이블 삭제 |

### 커넥션 풀 설정

```properties
# HikariCP (Spring Boot 2.x 기본)
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.connection-timeout=30000
```

## 로깅 설정

### 기본 로깅 레벨 설정

```properties
logging.level.org.springframework=info
logging.level.org.hibernate=info
logging.level.org.hibernate.sql=info
logging.level.com.myapp=debug
```

### Web 디버그 로그

Spring Web 관련 상세 로그를 보려면:

```properties
logging.level.org.springframework.web=DEBUG
```

### 로그 파일 설정

```properties
# 로그 파일 경로
logging.file.path=/var/log/myapp

# 또는 로그 파일 이름 직접 지정
logging.file.name=/var/log/myapp/application.log

# 로그 파일 최대 크기
logging.logback.rollingpolicy.max-file-size=10MB

# 로그 파일 보관 기간 (일)
logging.logback.rollingpolicy.max-history=30
```

## Property 값 주입

### @Value 어노테이션

```java
@Value("${app.server.host}")
private String applicationHost;
```

### Property 간 참조

설정 파일 내에서 다른 property 값을 참조할 수 있습니다:

```properties
propertyA=value
propertyB=${propertyA}/extra  # 결과: value/extra
```

## @ConfigurationProperties 활용

구조화된 설정을 타입 안전하게 관리할 수 있습니다.

### 설정 클래스 정의

```kotlin
@Configuration
@EnableConfigurationProperties
@ConfigurationProperties("app")
class AppConfig {
    lateinit var email: String
    var projects: List<String> = ArrayList()
}
```

### Properties 파일

```properties
app.email=admin@example.com
app.projects[0]=PROJECT1
app.projects[1]=PROJECT2
```

### YAML 파일

```yaml
app:
  email: admin@example.com
  projects:
    - PROJECT1
    - PROJECT2
    - PROJECT3
```

### 사용 예시

```java
@Autowired
private AppConfig appConfig;

public void printConfig() {
    System.out.println(appConfig.getEmail());
    appConfig.getProjects().forEach(System.out::println);
}
```

## Profile별 설정

### 파일 분리

```
application.properties          # 공통 설정
application-dev.properties      # 개발 환경
application-prod.properties     # 운영 환경
```

### YAML에서 Profile 분리

```yaml
# 공통 설정
spring:
  application:
    name: myapp

---
spring:
  config:
    activate:
      on-profile: dev
  datasource:
    url: jdbc:mysql://localhost:3306/devdb

---
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: jdbc:mysql://prodserver:3306/proddb
```

### Profile 활성화

```properties
# application.properties에서
spring.profiles.active=dev

# 또는 실행 시
java -jar myapp.jar --spring.profiles.active=prod
```

### Java 실행 시 Profile 지정

`-D` 옵션은 `-jar` 앞에 위치해야 합니다:

```bash
java -Dspring.profiles.active=localhost -jar myapp-1.0.0.jar
```

### Gradle에서 Profile 지정

IntelliJ에서 Run Configuration을 편집하여 active profile을 설정하거나, 빌드 시 지정할 수 있습니다:

```bash
./gradlew clean bootJar -b app/build.gradle -Pprofile=dev
```

### Maven에서 Profile 지정

```bash
mvn clean package --activate-profiles development -Dmaven.test.skip=true
```

**pom.xml Profile 설정:**

```xml
<profiles>
    <profile>
        <id>localhost</id>
        <activation>
            <activeByDefault>true</activeByDefault>
        </activation>
        <properties>
            <env>localhost</env>
        </properties>
    </profile>
    <profile>
        <id>development</id>
        <properties>
            <env>development</env>
        </properties>
    </profile>
    <profile>
        <id>stage</id>
        <properties>
            <env>stage</env>
        </properties>
    </profile>
    <profile>
        <id>production</id>
        <properties>
            <env>production</env>
        </properties>
    </profile>
</profiles>
```

Profile 값 참조는 `${env}`로 합니다:

```xml
<build>
    <finalName>myapp</finalName>
    <resources>
        <resource>
            <directory>src/main/resources</directory>
        </resource>
        <resource>
            <directory>src/main/resources.${env}</directory>
        </resource>
    </resources>
</build>
```

### Multiple Active Profiles

여러 프로파일을 동시에 활성화할 수 있습니다:

```properties
spring.profiles.active=slack,facebook
```

이를 활용하면 특정 서비스만 활성화할 수 있습니다:

```java
@Component
@Profile("facebook")
public class FacebookBot extends Bot {
    // Facebook 연동 기능
}

@Component
@Profile("slack")
public class SlackBot extends Bot {
    // Slack 연동 기능
}
```

## 외부 설정 우선순위

Spring Boot는 다음 순서로 설정을 로드합니다 (아래로 갈수록 우선순위 높음):

1. 기본값 (SpringApplication에서 설정)
2. `@PropertySource` 어노테이션
3. `application.properties` / `application.yml`
4. Profile별 설정 파일
5. 명령줄 인수
6. 환경 변수
7. Java 시스템 속성 (`-D` 옵션)

## 유용한 설정 예시

### 개발 편의 설정

```properties
# 에러 상세 정보 표시
server.error.include-message=always
server.error.include-stacktrace=on_param

# JSON 이쁘게 출력
spring.jackson.serialization.indent-output=true

# SQL 파라미터 로깅
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

### 운영 환경 설정

```properties
# 에러 상세 정보 숨김
server.error.include-message=never
server.error.include-stacktrace=never

# Actuator 보안
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=when-authorized
```

## 결론

Spring Boot의 Properties 설정은 매우 유연하고 강력합니다. 환경에 맞는 설정을 Profile로 분리하고, `@ConfigurationProperties`를 활용하여 타입 안전하게 관리하세요. 설정 우선순위를 이해하면 더욱 효과적으로 설정을 관리할 수 있습니다.
