---
layout: post
title: "Spring Boot 기본 설정 가이드 - Configuration, DI, Profile, Devtools"
date: 2025-02-27 19:19:00 +0900
categories: [backend, spring]
tags: [spring, spring-boot, configuration, dependency-injection, profile, devtools]
description: "Spring Boot의 핵심 설정 방법을 알아봅니다. Configuration Properties, 의존성 주입(DI), Profile 설정, 그리고 개발 생산성을 높이는 Devtools까지 다룹니다."
image: /assets/images/posts/thumbnails/2025-12-28-spring-boot-configuration.png
redirect_from:
  - "/backend/spring/2025/12/28/spring-boot-configuration.html"
---

Spring Boot 애플리케이션을 개발할 때 가장 기본이 되는 설정 방법들을 정리했습니다. Configuration Properties부터 의존성 주입, Profile 관리, 그리고 개발 생산성을 높이는 Devtools까지 살펴보겠습니다.

## Configuration Properties

Spring Boot에서는 `@ConfigurationProperties` 어노테이션을 사용하여 타입 안전한 설정 관리가 가능합니다.

### 기본 사용법

```java
@ConfigurationProperties("basic")
class BasicConfiguration {
    boolean value;
}
```

`application.properties` 파일에 다음과 같이 설정합니다:

```properties
basic.value=true
```

설정 클래스를 사용하려면 `@Autowired`로 주입받습니다:

```java
@Autowired
BasicConfiguration configuration;
```

### 고급 Configuration 클래스

리스트나 복잡한 구조의 설정도 가능합니다:

```kotlin
@Configuration
@EnableConfigurationProperties
@ConfigurationProperties("aa")
class Config {
    lateinit var email: String
    var jiraProjects: List<String> = ArrayList<String>()
}
```

`application.properties`:
```properties
aa.email=example@example.com
email[0]=first@example.com
email[1]=second@example.com
```

`application.yml`에서 리스트 설정:
```yaml
jiraProjects:
  - PROJECT1
  - PROJECT2
  - PROJECT3
```

## Dependency Injection (의존성 주입)

Spring의 핵심 기능 중 하나인 의존성 주입은 `@Service`, `@Component`, `@Repository`, `@Controller` 등의 어노테이션을 통해 빈을 등록하고 사용합니다.

### 빈 등록

```java
@Service
class LoginService {}

// 또는

@Component
class LoginService {}
```

### 빈 주입

```java
@Autowired
LoginService loginService;
```

### Component Scan

`@SpringBootApplication` 어노테이션에는 `@ComponentScan`이 포함되어 있어 자동으로 컴포넌트를 스캔합니다:

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = {
    @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
    @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class)
})
public @interface SpringBootApplication {
```

특정 패키지만 스캔하고 싶은 경우:

```kotlin
@SpringBootApplication
@ComponentScan("com.example.web.home")
class WebApplication
```

## Profile

Spring Profile을 사용하면 환경별로 다른 설정을 적용할 수 있습니다. 개발(dev), 스테이징(stage), 운영(prod) 환경에 맞는 설정을 분리하여 관리할 수 있습니다.

### 빈에 Profile 적용

```java
@Profile("prod")
@Bean
public String dummy() {
    return "production";
}
```

공통 설정은 `application.properties`에, 환경별 설정은 `application-{profile}.properties`에 작성합니다.

### YAML에서 Profile 설정

YAML 파일에서는 `---`로 구분하여 여러 프로파일을 정의할 수 있습니다:

```yaml
spring:
  profiles: dev
server:
  port: 8080
---
spring:
  profiles: prod
server:
  port: 80
```

### Profile 실행 방법

**Gradle 프로젝트:**

IntelliJ에서 Edit Configurations로 active profile 설정하거나, JAR 실행 시:

```bash
java -Dspring.profiles.active=localhost -jar myapp-1.0.0.jar
```

> 주의: `-D` 옵션은 반드시 `-jar` 앞에 위치해야 합니다.

**빌드 시 프로파일 지정:**

```bash
clean bootJar -b app/build.gradle -Pprofile=dev
```

**Maven 프로젝트:**

```bash
mvn clean package --activate-profiles development -Dmaven.test.skip=true
```

### 다중 Profile 활성화

여러 프로파일을 동시에 활성화할 수 있습니다:

```properties
spring.profiles.active=slack,facebook
```

서비스별로 프로파일 적용:

```java
@Component
@Profile("facebook")
public class FacebookBot extends Bot {}

@Component
@Profile("slack")
public class SlackBot extends Bot {}
```

## Spring Boot Devtools

Devtools는 개발 생산성을 크게 향상시켜주는 도구입니다.

### 주요 기능

- 코드 변경 후 컴파일만 하면 실행 중인 애플리케이션에 자동 반영
- 빠른 애플리케이션 재시작
- 라이브 리로드 지원

### 사용 시 주의사항

- Gradle이나 Maven `pom.xml` 파일이 변경된 경우에는 애플리케이션을 재시작해야 합니다.
- 프로덕션 환경에서는 자동으로 비활성화됩니다.

### 의존성 추가

**Gradle:**
```groovy
developmentOnly 'org.springframework.boot:spring-boot-devtools'
```

**Maven:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

## Property 참조

설정 파일 내에서 다른 프로퍼티를 참조할 수 있습니다:

```properties
propertyA=value
propertyB=${propertyA} # propertyA의 값을 사용
```

## 외부 설정 파일 우선순위

Spring Boot는 다양한 위치에서 설정을 읽으며, 다음 순서로 우선순위가 적용됩니다 (아래로 갈수록 높음):

1. `application.properties` (클래스패스)
2. `application-{profile}.properties` (클래스패스)
3. `application.properties` (JAR 파일 외부)
4. `application-{profile}.properties` (JAR 파일 외부)
5. 환경 변수
6. 커맨드 라인 인자

이 우선순위를 활용하면 JAR에 기본 설정을 포함하면서도 배포 환경에서 외부 설정 파일로 유연하게 오버라이드할 수 있습니다.

## @Value 어노테이션

간단한 설정값을 주입받을 때는 `@Value` 어노테이션을 사용할 수 있습니다:

```java
@Value("${server.port:8080}")
private int serverPort;

@Value("${app.name}")
private String appName;

@Value("${app.features.enabled:false}")
private boolean featureEnabled;
```

콜론(`:`) 뒤에 기본값을 지정할 수 있어 설정이 누락되었을 때 안전하게 동작합니다. 다만 설정값이 많아지면 `@ConfigurationProperties`가 더 관리하기 편리합니다.

## Conditional Bean 등록

특정 조건에서만 빈을 등록하도록 제어할 수 있습니다:

```java
@Bean
@ConditionalOnProperty(name = "cache.enabled", havingValue = "true")
public CacheManager cacheManager() {
    return new ConcurrentMapCacheManager();
}

@Bean
@ConditionalOnMissingBean(DataSource.class)
public DataSource defaultDataSource() {
    // 기본 DataSource 생성
}
```

주요 Conditional 어노테이션:

| 어노테이션 | 조건 |
|-----------|------|
| `@ConditionalOnProperty` | 특정 프로퍼티 값에 따라 |
| `@ConditionalOnMissingBean` | 해당 빈이 없을 때만 |
| `@ConditionalOnClass` | 특정 클래스가 클래스패스에 있을 때 |
| `@ConditionalOnProfile` | 특정 프로파일이 활성화되었을 때 |

## 환경 변수를 이용한 설정

Spring Boot는 환경 변수를 자동으로 프로퍼티로 변환합니다. 이를 통해 Docker 컨테이너나 클라우드 환경에서 설정을 유연하게 관리할 수 있습니다.

### 환경 변수 바인딩 규칙

Spring Boot는 환경 변수를 프로퍼티 이름으로 변환할 때 Relaxed Binding을 적용합니다:

```bash
# 환경 변수 → 프로퍼티 매핑
SPRING_DATASOURCE_URL → spring.datasource.url
SERVER_PORT → server.port
MY_APP_FEATURE_ENABLED → my.app.feature-enabled
```

### Docker에서의 활용

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/myapp.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/mydb
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=secret
    ports:
      - "8080:8080"
```

---

## 설정 암호화 (Jasypt)

민감한 설정값(비밀번호, API 키 등)을 평문으로 설정 파일에 저장하는 것은 보안 위험이 있습니다. Jasypt 라이브러리를 사용하면 설정값을 암호화할 수 있습니다.

### 의존성 추가

```groovy
implementation 'com.github.ulisesbocchio:jasypt-spring-boot-starter:3.0.5'
```

### 암호화된 설정 사용

```properties
# ENC()로 감싸면 자동으로 복호화됩니다
spring.datasource.password=ENC(암호화된문자열)
jasypt.encryptor.password=${JASYPT_PASSWORD}  # 환경 변수에서 복호화 키 가져오기
```

---

## 설정 파일 분리 전략

대규모 프로젝트에서는 설정 파일을 목적별로 분리하는 것이 관리에 용이합니다.

### 기능별 분리

```
application.yml              # 공통 설정
application-db.yml            # 데이터베이스 설정
application-cache.yml         # 캐시 설정
application-security.yml      # 보안 설정
application-prod.yml          # 프로덕션 환경
application-dev.yml           # 개발 환경
```

### spring.config.import (Spring Boot 2.4+)

```yaml
# application.yml
spring:
  config:
    import:
      - application-db.yml
      - application-cache.yml
```

### Profile Group (Spring Boot 2.4+)

여러 프로파일을 그룹으로 묶어 한 번에 활성화할 수 있습니다:

```yaml
spring:
  profiles:
    group:
      prod: db-prod, cache-prod, security-prod
      dev: db-dev, cache-dev, security-dev
```

`-Dspring.profiles.active=prod`만 지정하면 `db-prod`, `cache-prod`, `security-prod`가 모두 활성화됩니다.

---

## 자주 발생하는 설정 문제와 해결

### 1. 프로퍼티 바인딩 실패

`@ConfigurationProperties` 사용 시 타입 불일치로 바인딩이 실패하는 경우:

```java
// 문제: String을 boolean으로 바인딩
// application.properties에 feature.enabled=yes (boolean이 아님)

// 해결: Spring Boot는 yes/no, on/off, 1/0을 boolean으로 자동 변환합니다
feature.enabled=yes  // true로 변환됨
```

### 2. Profile이 적용되지 않는 경우

```bash
# 확인 방법: 시작 시 로그에서 Active profiles 확인
# The following profiles are active: dev

# 환경 변수와 커맨드 라인에서 동시에 지정하면 커맨드 라인이 우선
java -Dspring.profiles.active=prod -jar app.jar
```

### 3. 설정 파일 인코딩 문제

한글이 포함된 properties 파일은 인코딩 문제가 발생할 수 있습니다. YAML 파일은 기본적으로 UTF-8이므로 한글 사용이 자유롭습니다.

```properties
# properties 파일에서 한글 사용 (유니코드 이스케이프 필요)
app.message=\uD55C\uAD6D\uC5B4

# YAML에서는 직접 사용 가능
app:
  message: 한국어
```

---

## 결론

Spring Boot의 설정 기능들을 잘 활용하면 환경별로 유연하게 대응할 수 있고, 개발 생산성도 높일 수 있습니다. 특히 `@ConfigurationProperties`를 사용한 타입 안전한 설정 관리와 Profile을 통한 환경 분리는 실무에서 필수적인 기능입니다. 설정의 우선순위를 이해하고, Conditional Bean 등록을 적절히 활용하면 복잡한 환경에서도 깔끔한 설정 구조를 유지할 수 있습니다.
