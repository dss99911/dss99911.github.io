---
layout: post
title: "Spring AOP - 관점 지향 프로그래밍 완벽 가이드"
date: 2026-01-11 10:00:00 +0900
categories: [backend, spring]
tags: [spring, aop, aspect, pointcut, advice]
description: "Spring AOP(Aspect Oriented Programming)를 활용하여 횡단 관심사를 분리하는 방법을 알아봅니다. 로깅, 트랜잭션, 보안 등 공통 로직을 깔끔하게 관리하세요."
image: /assets/images/posts/spring-aop.png
---

Spring AOP(Aspect Oriented Programming)는 횡단 관심사(Cross-Cutting Concerns)를 모듈화하는 프로그래밍 패러다임입니다. 로깅, 보안, 트랜잭션 관리 등 여러 모듈에 걸쳐 반복되는 코드를 분리하여 관리할 수 있습니다.

## AOP 핵심 개념

### 주요 용어

| 용어 | 설명 |
|-----|------|
| **Aspect** | 횡단 관심사를 모듈화한 것 (예: 로깅, 트랜잭션) |
| **Join Point** | Aspect를 적용할 수 있는 지점 (메서드 실행, 예외 발생 등) |
| **Pointcut** | Join Point를 선별하는 표현식 |
| **Advice** | 실제로 실행되는 코드 (Before, After, Around 등) |
| **Weaving** | Aspect를 대상 객체에 적용하는 과정 |

### AOP 처리 흐름

```
Business Method 호출
    ↓
Point Cut (어디에 적용할지 결정)
    ↓
Advice (언제 실행할지 결정)
    ↓
Aspect (실제 실행되는 공통 로직)
```

## Spring AOP 설정

### 의존성 추가

**Gradle:**
```groovy
implementation 'org.springframework.boot:spring-boot-starter-aop'
```

**Maven:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

### Kotlin 프로젝트 추가 설정

Kotlin에서 AOP를 사용하려면 추가 의존성이 필요합니다:

```groovy
implementation 'org.springframework.boot:spring-boot-starter-aop'
implementation 'org.jetbrains.kotlin:kotlin-stdlib-jdk8'
implementation 'org.jetbrains.kotlin:kotlin-reflect'
```

## Aspect 클래스 작성

### 기본 구조

```java
@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @After("execution(* com.example.service.*.*(..))")
    public void logAfterMethod(JoinPoint joinPoint) {
        logger.info("Method executed: {}", joinPoint.getSignature().toShortString());
    }
}
```

### Kotlin 예시

```kotlin
@Aspect
@Component
class LoggingAspect {

    private val logger = LoggerFactory.getLogger(LoggingAspect::class.java)

    @After("execution(* com.example.service.*.*(..))")
    fun logAfterMethod(joinPoint: JoinPoint) {
        logger.info("Method executed: ${joinPoint.signature.toShortString()}")
    }
}
```

## Advice 종류

### @Before

메서드 실행 전에 실행됩니다:

```java
@Before("execution(* com.example.service.*.*(..))")
public void beforeAdvice(JoinPoint joinPoint) {
    logger.info("Before: {}", joinPoint.getSignature().getName());
}
```

### @After

메서드 실행 후 항상 실행됩니다 (예외 발생 여부와 관계없이):

```java
@After("execution(* com.example.service.*.*(..))")
public void afterAdvice(JoinPoint joinPoint) {
    logger.info("After: {}", joinPoint.getSignature().getName());
}
```

### @AfterReturning

메서드가 정상적으로 반환된 후 실행됩니다:

```java
@AfterReturning(pointcut = "execution(* com.example.service.*.*(..))",
                returning = "result")
public void afterReturningAdvice(JoinPoint joinPoint, Object result) {
    logger.info("Method {} returned: {}",
        joinPoint.getSignature().getName(), result);
}
```

### @AfterThrowing

메서드에서 예외가 발생한 후 실행됩니다:

```java
@AfterThrowing(pointcut = "execution(* com.example.service.*.*(..))",
               throwing = "exception")
public void afterThrowingAdvice(JoinPoint joinPoint, Exception exception) {
    logger.error("Method {} threw exception: {}",
        joinPoint.getSignature().getName(), exception.getMessage());
}
```

### @Around

메서드 실행 전후를 모두 제어할 수 있습니다:

```java
@Around("execution(* com.example.service.*.*(..))")
public Object aroundAdvice(ProceedingJoinPoint joinPoint) throws Throwable {
    long startTime = System.currentTimeMillis();

    try {
        Object result = joinPoint.proceed();
        return result;
    } finally {
        long endTime = System.currentTimeMillis();
        logger.info("Method {} execution time: {}ms",
            joinPoint.getSignature().getName(), (endTime - startTime));
    }
}
```

## Pointcut 표현식

### execution 표현식

```
execution(modifiers-pattern? return-type-pattern declaring-type-pattern?
          method-name-pattern(param-pattern) throws-pattern?)
```

**예시:**

```java
// 모든 public 메서드
@Pointcut("execution(public * *(..))")
public void publicMethod() {}

// 특정 패키지의 모든 메서드
@Pointcut("execution(* com.example.service.*.*(..))")
public void serviceLayer() {}

// 특정 클래스의 모든 메서드
@Pointcut("execution(* com.example.service.UserService.*(..))")
public void userServiceMethods() {}

// 특정 메서드명으로 시작하는 메서드
@Pointcut("execution(* com.example.service.*.get*(..))")
public void getterMethods() {}

// 특정 인자 타입을 가진 메서드
@Pointcut("execution(* com.example.service.*.*(String, ..))")
public void methodsWithStringFirstParam() {}
```

### within 표현식

특정 타입 내의 모든 메서드를 선택합니다:

```java
@Pointcut("within(com.example.service.*)")
public void inServicePackage() {}

@Pointcut("within(com.example.service..*)")
public void inServicePackageAndSubPackages() {}
```

### @annotation 표현식

특정 어노테이션이 붙은 메서드를 선택합니다:

```java
@Pointcut("@annotation(com.example.annotation.Loggable)")
public void loggableMethods() {}
```

### Pointcut 조합

```java
@Pointcut("execution(* com.example.service.*.*(..))")
public void serviceMethods() {}

@Pointcut("execution(* com.example.repository.*.*(..))")
public void repositoryMethods() {}

// AND 조합
@Before("serviceMethods() && repositoryMethods()")
public void combinedAdvice(JoinPoint joinPoint) {}

// OR 조합
@Before("serviceMethods() || repositoryMethods()")
public void eitherAdvice(JoinPoint joinPoint) {}

// NOT 조합
@Before("serviceMethods() && !repositoryMethods()")
public void excludeAdvice(JoinPoint joinPoint) {}
```

## 실전 예제

### 실행 시간 측정 Aspect

```java
@Aspect
@Component
public class PerformanceAspect {

    private static final Logger logger = LoggerFactory.getLogger(PerformanceAspect.class);

    @Around("@annotation(com.example.annotation.MeasureExecutionTime)")
    public Object measureTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();

        try {
            return joinPoint.proceed();
        } finally {
            long executionTime = System.currentTimeMillis() - start;
            logger.info("{} executed in {}ms",
                joinPoint.getSignature().toShortString(), executionTime);
        }
    }
}

// 커스텀 어노테이션
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface MeasureExecutionTime {}

// 사용 예시
@Service
public class UserService {

    @MeasureExecutionTime
    public User findUser(Long id) {
        // 비즈니스 로직
        return userRepository.findById(id);
    }
}
```

### 감사(Audit) 로깅 Aspect

```java
@Aspect
@Component
public class AuditAspect {

    private static final Logger logger = LoggerFactory.getLogger(AuditAspect.class);

    @AfterReturning(
        pointcut = "execution(* com.example.service.*.save*(..)) || " +
                   "execution(* com.example.service.*.update*(..)) || " +
                   "execution(* com.example.service.*.delete*(..))",
        returning = "result"
    )
    public void auditDataChange(JoinPoint joinPoint, Object result) {
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        logger.info("AUDIT: {} called with args: {}, result: {}",
            methodName, Arrays.toString(args), result);
    }
}
```

### 예외 처리 Aspect

```java
@Aspect
@Component
public class ExceptionHandlingAspect {

    private static final Logger logger = LoggerFactory.getLogger(ExceptionHandlingAspect.class);

    @Autowired
    private NotificationService notificationService;

    @AfterThrowing(
        pointcut = "execution(* com.example.service.*.*(..))",
        throwing = "ex"
    )
    public void handleException(JoinPoint joinPoint, Exception ex) {
        String methodName = joinPoint.getSignature().toShortString();

        logger.error("Exception in {}: {}", methodName, ex.getMessage(), ex);

        // 심각한 예외인 경우 알림 발송
        if (ex instanceof CriticalException) {
            notificationService.sendAlert(
                "Critical error in " + methodName + ": " + ex.getMessage()
            );
        }
    }
}
```

## Kotlin에서 AOP 사용 시 주의사항

Kotlin 클래스는 기본적으로 final이므로, AOP 프록시가 상속을 통해 동작할 수 없습니다. 다음과 같이 `open` 키워드를 사용해야 합니다:

```kotlin
open class UserService(private val userRepository: UserRepository) {

    open fun findUser(id: Long): User {
        return userRepository.findById(id)
    }
}
```

또는 `all-open` 플러그인을 사용하면 자동으로 처리됩니다:

```groovy
plugins {
    kotlin("plugin.spring") version "1.9.0"
}
```

## AOP 동작 원리

### 프록시 기반 AOP

Spring AOP는 프록시 패턴을 사용합니다:

1. **JDK Dynamic Proxy**: 인터페이스 기반으로 프록시 생성
2. **CGLIB Proxy**: 클래스 기반으로 프록시 생성 (인터페이스가 없는 경우)

### Self-Invocation 문제

같은 클래스 내에서 메서드를 호출하면 AOP가 적용되지 않습니다:

```java
@Service
public class UserService {

    public void processUser(Long id) {
        // AOP가 적용되지 않음!
        this.logUser(id);
    }

    @Loggable
    public void logUser(Long id) {
        // 로직
    }
}
```

해결 방법:

```java
@Service
public class UserService {

    @Autowired
    private ApplicationContext applicationContext;

    public void processUser(Long id) {
        // 프록시를 통해 호출
        applicationContext.getBean(UserService.class).logUser(id);
    }

    @Loggable
    public void logUser(Long id) {
        // 로직
    }
}
```

## 결론

Spring AOP는 횡단 관심사를 효과적으로 분리하여 코드의 모듈성을 높입니다. 로깅, 보안, 트랜잭션, 캐싱 등 비즈니스 로직과 분리해야 하는 공통 관심사에 적용하면 깔끔한 코드를 유지할 수 있습니다. 다만, 프록시 기반으로 동작하므로 self-invocation 문제와 Kotlin final 클래스 문제를 인지하고 사용해야 합니다.

## 참고 자료

- [Spring AOP 공식 문서](https://docs.spring.io/spring-framework/reference/core/aop.html)
- [AspectJ Programming Guide](https://www.eclipse.org/aspectj/doc/next/progguide/)
