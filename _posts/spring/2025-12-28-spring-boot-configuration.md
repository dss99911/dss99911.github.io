---
layout: post
title: "Spring Boot 기본 설정 가이드 - Configuration, DI, Profile, Devtools"
date: 2025-12-28 12:00:00 +0900
categories: spring
tags: [spring, spring-boot, configuration, dependency-injection, profile, devtools]
description: "Spring Boot의 핵심 설정 방법을 알아봅니다. Configuration Properties, 의존성 주입(DI), Profile 설정, 그리고 개발 생산성을 높이는 Devtools까지 다룹니다."
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

## 결론

Spring Boot의 설정 기능들을 잘 활용하면 환경별로 유연하게 대응할 수 있고, 개발 생산성도 높일 수 있습니다. 특히 `@ConfigurationProperties`를 사용한 타입 안전한 설정 관리와 Profile을 통한 환경 분리는 실무에서 필수적인 기능입니다.
