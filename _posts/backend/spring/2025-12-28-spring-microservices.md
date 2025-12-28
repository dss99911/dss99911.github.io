---
layout: post
title: "Spring Cloud 마이크로서비스 - Eureka와 Multi-Module 프로젝트"
date: 2025-12-28 12:08:00 +0900
categories: [backend, spring]
tags: [spring, microservices, eureka, multi-module, spring-cloud]
description: "Spring Cloud를 활용한 마이크로서비스 아키텍처의 기본을 알아봅니다. Eureka를 이용한 서비스 디스커버리와 Multi-Module 프로젝트 구성 방법을 다룹니다."
---

마이크로서비스 아키텍처는 대규모 애플리케이션을 작은 서비스 단위로 분리하여 독립적으로 개발, 배포, 확장할 수 있게 합니다. Spring Cloud는 이러한 마이크로서비스 구축을 위한 다양한 도구를 제공합니다.

## Spring Cloud Eureka

Eureka는 Netflix OSS의 서비스 디스커버리 솔루션으로, 마이크로서비스들의 위치를 관리합니다.

### 서비스 디스커버리란?

마이크로서비스 환경에서는 각 서비스의 인스턴스가 동적으로 생성되고 삭제됩니다. 서비스 디스커버리는 이러한 인스턴스들의 위치(IP, Port)를 자동으로 관리합니다.

```
[Service A] ----→ [Eureka Server] ←---- [Service B]
                       ↓
              서비스 위치 정보 관리
```

### Eureka Server 설정

**의존성 추가:**
```groovy
implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-server'
```

**메인 클래스:**
```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

**application.yml:**
```yaml
server:
  port: 8761

eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
  server:
    wait-time-in-ms-when-sync-empty: 0
```

### Eureka Client 설정

**의존성 추가:**
```groovy
implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client'
```

**application.yml:**
```yaml
spring:
  application:
    name: user-service

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

### 서비스 간 통신

**RestTemplate 사용:**
```java
@Configuration
public class RestTemplateConfig {

    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

@Service
public class OrderService {

    @Autowired
    private RestTemplate restTemplate;

    public User getUser(Long userId) {
        // 서비스 이름으로 호출 (Eureka가 실제 주소로 변환)
        return restTemplate.getForObject(
            "http://user-service/users/" + userId,
            User.class
        );
    }
}
```

**OpenFeign 사용 (권장):**
```java
@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id);
}
```

## Multi-Module 프로젝트

대규모 프로젝트에서는 코드를 여러 모듈로 분리하여 관리합니다.

### 프로젝트 구조

```
my-project/
├── build.gradle
├── settings.gradle
├── library/
│   ├── build.gradle
│   └── src/
├── application/
│   ├── build.gradle
│   └── src/
└── common/
    ├── build.gradle
    └── src/
```

### settings.gradle

```groovy
rootProject.name = 'my-project'

include 'library'
include 'application'
include 'common'
```

### Root build.gradle

```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management' version '1.1.4'
}

subprojects {
    apply plugin: 'java'
    apply plugin: 'org.springframework.boot'
    apply plugin: 'io.spring.dependency-management'

    group = 'com.example'
    version = '1.0.0'

    java {
        sourceCompatibility = '17'
    }

    repositories {
        mavenCentral()
    }

    dependencies {
        implementation 'org.springframework.boot:spring-boot-starter'
        testImplementation 'org.springframework.boot:spring-boot-starter-test'
    }
}
```

### 모듈 간 의존성

**application/build.gradle:**
```groovy
dependencies {
    implementation project(':library')
    implementation project(':common')
    implementation 'org.springframework.boot:spring-boot-starter-web'
}
```

### Library 모듈 설정

라이브러리 모듈은 실행 가능한 JAR가 아닌 일반 JAR로 빌드해야 합니다:

**library/build.gradle:**
```groovy
bootJar {
    enabled = false
}

jar {
    enabled = true
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter'
}
```

## 마이크로서비스 모범 사례

### 1. 서비스 경계 설계

- 비즈니스 도메인 기반으로 서비스 분리
- 느슨한 결합, 높은 응집도 유지
- 데이터베이스 공유 최소화

### 2. API 버전 관리

```java
@RestController
@RequestMapping("/api/v1/users")
public class UserControllerV1 {
    // v1 API
}

@RestController
@RequestMapping("/api/v2/users")
public class UserControllerV2 {
    // v2 API
}
```

### 3. 서킷 브레이커

```java
@Service
public class UserService {

    @CircuitBreaker(name = "user-service", fallbackMethod = "getUserFallback")
    public User getUser(Long id) {
        return userClient.getUser(id);
    }

    public User getUserFallback(Long id, Exception e) {
        return new User(id, "Unknown", "default@example.com");
    }
}
```

### 4. 설정 중앙화 (Spring Cloud Config)

```yaml
# bootstrap.yml
spring:
  application:
    name: user-service
  cloud:
    config:
      uri: http://config-server:8888
```

## 결론

Spring Cloud와 Eureka를 활용하면 확장 가능한 마이크로서비스 아키텍처를 구축할 수 있습니다. Multi-Module 프로젝트 구성은 코드 재사용성을 높이고 관리를 용이하게 합니다. 서비스 디스커버리, 로드 밸런싱, 서킷 브레이커 등의 패턴을 적용하여 안정적인 시스템을 구축하세요.

## 참고 자료

- [Spring Cloud 공식 문서](https://spring.io/projects/spring-cloud)
- [Spring Multi-Module 가이드](https://spring.io/guides/gs/multi-module/)
- [Netflix Eureka Wiki](https://github.com/Netflix/eureka/wiki)
