---
layout: post
title: "Spring Boot Actuator - 애플리케이션 모니터링 가이드"
date: 2025-12-28 12:07:00 +0900
categories: [backend, spring]
tags: [spring, actuator, monitoring, prometheus, grafana]
description: "Spring Boot Actuator를 사용하여 애플리케이션을 모니터링하는 방법을 알아봅니다. 기본 엔드포인트부터 Prometheus, Grafana 연동까지 다룹니다."
image: /assets/images/posts/thumbnails/2025-12-28-spring-actuator.png
---

Spring Boot Actuator는 운영 중인 애플리케이션의 상태를 모니터링하고 관리하기 위한 기능을 제공합니다. 설정, 메모리, CPU, 환경변수, 빈 정보 등 다양한 정보를 확인할 수 있습니다.

## Actuator 설정

### 의존성 추가

**Gradle:**
```groovy
implementation 'org.springframework.boot:spring-boot-starter-actuator'
```

**Maven:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### 기본 엔드포인트 활성화

기본적으로 대부분의 엔드포인트는 비활성화되어 있습니다. `application.properties`에서 활성화합니다:

```properties
# 모든 엔드포인트 활성화
management.endpoints.web.exposure.include=*

# 또는 특정 엔드포인트만 활성화
management.endpoints.web.exposure.include=health,info,metrics
```

## 주요 엔드포인트

| 엔드포인트 | 설명 | URL |
|-----------|------|-----|
| health | 애플리케이션 상태 확인 | /actuator/health |
| info | 애플리케이션 정보 | /actuator/info |
| metrics | 메트릭 정보 | /actuator/metrics |
| beans | 등록된 Bean 목록 | /actuator/beans |
| env | 환경 변수 정보 | /actuator/env |
| configprops | 설정 프로퍼티 | /actuator/configprops |
| loggers | 로거 설정 | /actuator/loggers |
| threaddump | 스레드 덤프 | /actuator/threaddump |
| heapdump | 힙 덤프 (다운로드) | /actuator/heapdump |

### Health 엔드포인트 상세 정보

```properties
# 상세 정보 표시
management.endpoint.health.show-details=always

# 또는 인증된 사용자에게만
management.endpoint.health.show-details=when-authorized
```

### Info 엔드포인트 설정

```properties
# 빌드 정보 포함
management.info.build.enabled=true
management.info.git.enabled=true

# 커스텀 정보
info.app.name=My Application
info.app.version=1.0.0
info.app.description=Spring Boot Application
```

## Metrics 모니터링

### 기본 메트릭 확인

```
GET /actuator/metrics
```

응답:
```json
{
  "names": [
    "jvm.memory.used",
    "jvm.gc.pause",
    "http.server.requests",
    "system.cpu.usage",
    ...
  ]
}
```

### 특정 메트릭 조회

```
GET /actuator/metrics/jvm.memory.used
```

응답:
```json
{
  "name": "jvm.memory.used",
  "measurements": [
    {
      "statistic": "VALUE",
      "value": 123456789
    }
  ],
  "availableTags": [
    {
      "tag": "area",
      "values": ["heap", "nonheap"]
    }
  ]
}
```

## Prometheus & Grafana 연동

### Prometheus 메트릭 엔드포인트 추가

**의존성 추가:**
```groovy
implementation 'io.micrometer:micrometer-registry-prometheus'
```

**설정:**
```properties
management.endpoints.web.exposure.include=health,info,prometheus
management.metrics.export.prometheus.enabled=true
```

### Prometheus 설정 (prometheus.yml)

```yaml
scrape_configs:
  - job_name: 'spring-boot-app'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['localhost:8080']
```

### Grafana 대시보드

1. Prometheus를 데이터 소스로 추가
2. Spring Boot 대시보드 임포트 (ID: 4701 또는 12900)
3. 필요한 메트릭 패널 구성

## 보안 설정

운영 환경에서는 Actuator 엔드포인트를 보호해야 합니다.

### 엔드포인트 노출 제한

```properties
# 기본적으로 health와 info만 노출
management.endpoints.web.exposure.include=health,info

# 특정 엔드포인트 제외
management.endpoints.web.exposure.exclude=env,beans
```

### 별도 포트 사용

```properties
# 관리 포트 분리
management.server.port=9090

# 관리 경로 변경
management.endpoints.web.base-path=/management
```

### Spring Security 연동

```java
@Configuration
public class ActuatorSecurityConfig {

    @Bean
    public SecurityFilterChain actuatorSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/actuator/**")
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .anyRequest().hasRole("ADMIN")
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
```

## 커스텀 Health Indicator

```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    @Autowired
    private DataSource dataSource;

    @Override
    public Health health() {
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(1)) {
                return Health.up()
                    .withDetail("database", "Available")
                    .build();
            }
        } catch (SQLException e) {
            return Health.down()
                .withDetail("database", "Not Available")
                .withException(e)
                .build();
        }
        return Health.down().build();
    }
}
```

## 커스텀 Metrics

```java
@Service
public class OrderService {

    private final Counter orderCounter;
    private final Timer orderTimer;

    public OrderService(MeterRegistry registry) {
        this.orderCounter = registry.counter("orders.created");
        this.orderTimer = registry.timer("orders.processing.time");
    }

    public void createOrder(Order order) {
        orderTimer.record(() -> {
            // 주문 처리 로직
            orderCounter.increment();
        });
    }
}
```

## 결론

Spring Boot Actuator는 애플리케이션 운영에 필수적인 도구입니다. 기본 제공되는 엔드포인트만으로도 충분한 모니터링이 가능하며, Prometheus와 Grafana를 연동하면 시각적인 대시보드를 구축할 수 있습니다. 보안에 주의하여 운영 환경에서는 적절한 접근 제어를 설정하세요.

## 참고 자료

- [Spring Boot Actuator 공식 문서](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [Micrometer 문서](https://micrometer.io/docs)
