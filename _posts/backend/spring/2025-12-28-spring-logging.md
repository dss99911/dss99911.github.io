---
layout: post
title: "Spring Boot 로깅 설정 가이드 - Logback 설정과 활용"
date: 2025-12-28 12:05:00 +0900
categories: [backend, spring]
tags: [spring, logging, logback, slf4j]
description: "Spring Boot의 로깅 시스템을 알아봅니다. application.properties 설정부터 logback.xml을 통한 상세 설정까지 다룹니다."
---

로깅은 애플리케이션 운영과 디버깅에 필수적입니다. Spring Boot는 기본적으로 Logback을 사용하며, 간단한 설정부터 상세한 커스터마이징까지 가능합니다.

## 기본 로깅 설정

### application.properties에서 로그 레벨 설정

```properties
# Spring 프레임워크 로그 레벨
logging.level.org.springframework=info

# Hibernate 로그 레벨
logging.level.org.hibernate=info
logging.level.org.hibernate.sql=info

# 애플리케이션 로그 레벨
logging.level.com.myapp=debug
```

### Web 디버깅 로그

Spring Web 관련 상세 로그를 보려면:

```properties
logging.level.org.springframework.web=DEBUG
```

### 로그 레벨 종류

| 레벨 | 설명 | 사용 상황 |
|-----|------|----------|
| TRACE | 가장 상세한 로그 | 아주 세밀한 디버깅 |
| DEBUG | 디버깅용 로그 | 개발 환경 디버깅 |
| INFO | 정보성 로그 | 일반적인 운영 정보 |
| WARN | 경고 로그 | 잠재적 문제 상황 |
| ERROR | 에러 로그 | 오류 발생 시 |

## Logback XML 설정

더 세밀한 로깅 설정이 필요하다면 `logback-spring.xml` 또는 `logback.xml` 파일을 사용합니다.

### logback-spring.xml 예시

```xml
<configuration scan="true" scanPeriod="10 seconds">

    <!-- 로그 경로 설정 -->
    <property name="LOG_HOME" value="/var/log/myapp" />
    <property name="FILE_PREFIX_NAME" value="com.example.myapp" />

    <!-- Profile별 로그 경로 설정 -->
    <springProfile name="dev">
        <property name="LOG_HOME" value="./" />
    </springProfile>

    <!-- 콘솔 Appender -->
    <appender name="consoleAppender" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <Pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} (%line) - %msg%n</Pattern>
        </encoder>
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>TRACE</level>
        </filter>
    </appender>

    <!-- 일별 롤링 파일 Appender -->
    <appender name="dailyRollingFileAppender" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- 일별 로그 파일 생성 -->
            <FileNamePattern>${LOG_HOME}/${FILE_PREFIX_NAME}.%d{yyyy-MM-dd}.log</FileNamePattern>
            <!-- 30일간 보관 -->
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <Pattern>%d{HH:mm:ss.SSS} - %msg%n</Pattern>
        </encoder>
    </appender>

    <!-- 루트 로거 설정 -->
    <root>
        <level value="INFO" />
        <appender-ref ref="consoleAppender" />
    </root>

    <!-- 특정 패키지 로거 설정 -->
    <logger name="com.example.myapp.log.Logger" additivity="false">
        <level value="INFO" />
        <appender-ref ref="dailyRollingFileAppender" />
    </logger>

</configuration>
```

### 주요 설정 요소 설명

#### scan 속성
```xml
<configuration scan="true" scanPeriod="10 seconds">
```
설정 파일 변경을 감지하여 런타임에 재로드합니다.

#### Pattern 포맷

| 패턴 | 설명 |
|-----|------|
| `%d{HH:mm:ss.SSS}` | 시:분:초.밀리초 |
| `%d{yyyy-MM-dd HH:mm:ss}` | 년-월-일 시:분:초 |
| `%thread` | 스레드 이름 |
| `%-5level` | 로그 레벨 (5자리 왼쪽 정렬) |
| `%logger{36}` | 로거 이름 (최대 36자) |
| `%line` | 라인 번호 |
| `%msg` | 로그 메시지 |
| `%n` | 줄바꿈 |

#### Profile별 설정

`springProfile` 태그로 환경별 다른 설정을 적용할 수 있습니다:

```xml
<springProfile name="dev">
    <property name="LOG_HOME" value="./logs" />
    <root level="DEBUG">
        <appender-ref ref="consoleAppender" />
    </root>
</springProfile>

<springProfile name="prod">
    <property name="LOG_HOME" value="/var/log/myapp" />
    <root level="INFO">
        <appender-ref ref="consoleAppender" />
        <appender-ref ref="dailyRollingFileAppender" />
    </root>
</springProfile>
```

## 롤링 정책

### TimeBasedRollingPolicy

시간 기반 롤링:

```xml
<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
    <FileNamePattern>${LOG_HOME}/myapp.%d{yyyy-MM-dd}.log</FileNamePattern>
    <maxHistory>30</maxHistory>
</rollingPolicy>
```

### SizeAndTimeBasedRollingPolicy

크기와 시간 기반 롤링:

```xml
<rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
    <FileNamePattern>${LOG_HOME}/myapp.%d{yyyy-MM-dd}.%i.log</FileNamePattern>
    <maxFileSize>100MB</maxFileSize>
    <maxHistory>30</maxHistory>
    <totalSizeCap>3GB</totalSizeCap>
</rollingPolicy>
```

## Logger 사용법

### SLF4J Logger 사용

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    public void createUser(String username) {
        logger.info("Creating user: {}", username);

        try {
            // 비즈니스 로직
            logger.debug("User creation successful");
        } catch (Exception e) {
            logger.error("Failed to create user: {}", username, e);
        }
    }
}
```

### Lombok @Slf4j 사용

```java
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserService {

    public void createUser(String username) {
        log.info("Creating user: {}", username);
    }
}
```

## 로그 파일 설정 (application.properties)

간단한 파일 로깅은 properties로도 가능합니다:

```properties
# 로그 파일 경로
logging.file.path=/var/log/myapp

# 또는 파일 이름 직접 지정
logging.file.name=/var/log/myapp/application.log

# 로그 파일 최대 크기
logging.logback.rollingpolicy.max-file-size=10MB

# 로그 파일 보관 기간
logging.logback.rollingpolicy.max-history=30

# 로그 패턴
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
```

## 결론

Spring Boot의 로깅 시스템은 간단한 설정부터 상세한 커스터마이징까지 유연하게 대응합니다. 개발 환경에서는 콘솔 로그를, 운영 환경에서는 파일 로그와 적절한 롤링 정책을 설정하세요. Profile별 설정을 활용하면 환경에 맞는 로깅 전략을 쉽게 구현할 수 있습니다.
