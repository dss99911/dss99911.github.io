---
layout: post
title: "Spring Scheduling - 작업 스케줄링 완벽 가이드"
date: 2026-01-11 10:30:00 +0900
categories: [backend, spring]
tags: [spring, scheduling, cron, scheduled, timer]
description: "Spring의 @Scheduled 어노테이션을 활용한 작업 스케줄링 방법을 알아봅니다. Cron 표현식부터 동적 스케줄링까지 상세히 다룹니다."
image: /assets/images/posts/spring-scheduling.png
---

Spring Boot에서는 `@Scheduled` 어노테이션을 사용하여 정기적인 작업을 간편하게 예약할 수 있습니다. 배치 작업, 데이터 동기화, 알림 발송 등 다양한 상황에서 활용됩니다.

## 기본 설정

### 스케줄링 활성화

`@EnableScheduling` 어노테이션을 메인 클래스나 설정 클래스에 추가합니다:

```java
@SpringBootApplication
@EnableScheduling
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### 기본 사용법

스케줄링을 적용할 메서드는 다음 조건을 만족해야 합니다:
- **void 반환 타입**
- **파라미터 없음**

```java
@Component
public class ScheduledTasks {

    private static final Logger logger = LoggerFactory.getLogger(ScheduledTasks.class);

    @Scheduled(fixedRate = 5000)
    public void reportCurrentTime() {
        logger.info("현재 시간: {}", LocalDateTime.now());
    }
}
```

## 스케줄링 옵션

### fixedRate

이전 작업 시작 시점부터 일정 간격으로 실행됩니다:

```java
@Scheduled(fixedRate = 5000)  // 5초마다
public void fixedRateTask() {
    logger.info("Fixed rate task - {}", System.currentTimeMillis() / 1000);
}
```

> 작업 실행 시간이 간격보다 길어도 다음 작업이 예약된 시간에 시작됩니다.

### fixedDelay

이전 작업 완료 시점부터 일정 시간 후 실행됩니다:

```java
@Scheduled(fixedDelay = 5000)  // 이전 작업 완료 후 5초 뒤
public void fixedDelayTask() {
    logger.info("Fixed delay task - {}", System.currentTimeMillis() / 1000);
}
```

### initialDelay

애플리케이션 시작 후 첫 실행까지 대기 시간을 설정합니다:

```java
@Scheduled(fixedRate = 5000, initialDelay = 10000)  // 10초 후 첫 실행, 이후 5초마다
public void taskWithInitialDelay() {
    logger.info("Task with initial delay");
}
```

### Cron 표현식

정교한 스케줄링을 위해 Cron 표현식을 사용합니다:

```java
@Scheduled(cron = "0 15 10 15 * ?")  // 매월 15일 10:15에 실행
public void cronTask() {
    logger.info("Cron task executed");
}
```

## Cron 표현식 상세

### 기본 형식

```
초(0-59) 분(0-59) 시(0-23) 일(1-31) 월(1-12) 요일(0-7)
```

> 요일에서 0과 7은 모두 일요일입니다.

### 특수 문자

| 문자 | 의미 | 예시 |
|-----|------|------|
| `*` | 모든 값 | `* * * * * *` - 매초 |
| `?` | 특정 값 없음 (일, 요일) | `0 0 0 ? * MON` - 매주 월요일 |
| `-` | 범위 | `0 0 9-17 * * *` - 9시~17시 매 정각 |
| `,` | 여러 값 | `0 0 9,12,18 * * *` - 9시, 12시, 18시 |
| `/` | 증분 | `0 0/30 * * * *` - 30분마다 |
| `L` | 마지막 | `0 0 0 L * ?` - 매월 마지막 날 |
| `W` | 가장 가까운 평일 | `0 0 0 15W * ?` - 15일과 가장 가까운 평일 |
| `#` | N번째 요일 | `0 0 0 ? * 6#3` - 세 번째 금요일 |

### 자주 사용하는 Cron 예시

```java
// 매일 자정
@Scheduled(cron = "0 0 0 * * *")

// 매일 오전 9시
@Scheduled(cron = "0 0 9 * * *")

// 평일 오전 9시
@Scheduled(cron = "0 0 9 * * MON-FRI")

// 매주 월요일 오전 10시
@Scheduled(cron = "0 0 10 * * MON")

// 매월 1일 자정
@Scheduled(cron = "0 0 0 1 * *")

// 매시간
@Scheduled(cron = "0 0 * * * *")

// 5분마다
@Scheduled(cron = "0 */5 * * * *")

// 매월 마지막 날 오후 11시
@Scheduled(cron = "0 0 23 L * ?")
```

## 외부 설정 활용

### application.properties에서 설정값 주입

```properties
schedule.cron.daily-report=0 0 9 * * *
schedule.fixed-rate=5000
schedule.fixed-delay=3000
```

```java
@Component
public class ConfigurableScheduler {

    @Scheduled(cron = "${schedule.cron.daily-report}")
    public void dailyReport() {
        logger.info("Daily report generated");
    }

    @Scheduled(fixedRateString = "${schedule.fixed-rate}")
    public void configurableFixedRate() {
        logger.info("Configurable fixed rate task");
    }

    @Scheduled(fixedDelayString = "${schedule.fixed-delay}")
    public void configurableFixedDelay() {
        logger.info("Configurable fixed delay task");
    }
}
```

## 비동기 스케줄링

### 기본 동작

기본적으로 모든 스케줄 작업은 단일 스레드에서 순차적으로 실행됩니다.

### 스레드 풀 설정

여러 작업을 병렬로 실행하려면 스레드 풀을 설정합니다:

```java
@Configuration
public class SchedulerConfig implements SchedulingConfigurer {

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        taskRegistrar.setScheduler(taskExecutor());
    }

    @Bean(destroyMethod = "shutdown")
    public Executor taskExecutor() {
        return Executors.newScheduledThreadPool(10);
    }
}
```

또는 `application.properties`에서 설정:

```properties
spring.task.scheduling.pool.size=10
spring.task.scheduling.thread-name-prefix=scheduled-task-
```

### @Async와 함께 사용

비동기 실행이 필요한 경우:

```java
@SpringBootApplication
@EnableScheduling
@EnableAsync
public class Application {
}

@Component
public class AsyncScheduledTasks {

    @Async
    @Scheduled(fixedRate = 5000)
    public void asyncTask() {
        // 비동기로 실행됨
        logger.info("Async task on thread: {}", Thread.currentThread().getName());
    }
}
```

## 동적 스케줄링

### SchedulingConfigurer 사용

런타임에 스케줄을 동적으로 변경할 수 있습니다:

```java
@Component
public class DynamicScheduler implements SchedulingConfigurer {

    @Autowired
    private ScheduleConfigRepository scheduleConfigRepository;

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        taskRegistrar.addTriggerTask(
            () -> executeTask(),
            triggerContext -> {
                // DB에서 Cron 표현식 조회
                String cronExpression = scheduleConfigRepository.getCronExpression();
                return new CronTrigger(cronExpression).nextExecutionTime(triggerContext);
            }
        );
    }

    private void executeTask() {
        logger.info("Dynamic scheduled task executed");
    }
}
```

### TaskScheduler 직접 사용

```java
@Service
public class DynamicTaskService {

    private final TaskScheduler taskScheduler;
    private ScheduledFuture<?> scheduledFuture;

    public DynamicTaskService(TaskScheduler taskScheduler) {
        this.taskScheduler = taskScheduler;
    }

    public void scheduleTask(String cronExpression) {
        // 기존 작업 취소
        if (scheduledFuture != null) {
            scheduledFuture.cancel(false);
        }

        // 새 스케줄로 작업 등록
        scheduledFuture = taskScheduler.schedule(
            () -> executeTask(),
            new CronTrigger(cronExpression)
        );
    }

    public void stopTask() {
        if (scheduledFuture != null) {
            scheduledFuture.cancel(false);
        }
    }

    private void executeTask() {
        logger.info("Dynamically scheduled task executed");
    }
}
```

## 실전 예제

### 데이터 동기화 스케줄러

```java
@Component
@Slf4j
public class DataSyncScheduler {

    private final DataSyncService dataSyncService;
    private final AlertService alertService;

    public DataSyncScheduler(DataSyncService dataSyncService, AlertService alertService) {
        this.dataSyncService = dataSyncService;
        this.alertService = alertService;
    }

    @Scheduled(cron = "0 0 2 * * *")  // 매일 새벽 2시
    public void syncExternalData() {
        log.info("Starting data synchronization...");

        try {
            SyncResult result = dataSyncService.synchronize();
            log.info("Sync completed. Added: {}, Updated: {}, Deleted: {}",
                result.getAdded(), result.getUpdated(), result.getDeleted());
        } catch (Exception e) {
            log.error("Sync failed", e);
            alertService.sendAlert("Data sync failed: " + e.getMessage());
        }
    }

    @Scheduled(fixedRate = 300000)  // 5분마다
    public void checkSyncStatus() {
        if (dataSyncService.isStale()) {
            log.warn("Data is stale, last sync: {}", dataSyncService.getLastSyncTime());
        }
    }
}
```

### 캐시 정리 스케줄러

```java
@Component
@Slf4j
public class CacheCleanupScheduler {

    private final CacheManager cacheManager;

    public CacheCleanupScheduler(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    @Scheduled(cron = "0 0 4 * * *")  // 매일 새벽 4시
    public void evictAllCaches() {
        log.info("Starting cache cleanup...");

        cacheManager.getCacheNames()
            .forEach(cacheName -> {
                Cache cache = cacheManager.getCache(cacheName);
                if (cache != null) {
                    cache.clear();
                    log.info("Cache cleared: {}", cacheName);
                }
            });

        log.info("Cache cleanup completed");
    }

    @Scheduled(fixedRate = 3600000)  // 1시간마다
    public void evictExpiredEntries() {
        // 만료된 항목만 제거
        log.debug("Evicting expired cache entries...");
    }
}
```

### 보고서 생성 스케줄러

```java
@Component
@Slf4j
public class ReportScheduler {

    private final ReportService reportService;
    private final EmailService emailService;

    @Scheduled(cron = "0 0 8 * * MON")  // 매주 월요일 오전 8시
    public void generateWeeklyReport() {
        log.info("Generating weekly report...");

        Report report = reportService.generateWeeklyReport();
        emailService.sendReport(report, "weekly-report@example.com");

        log.info("Weekly report sent successfully");
    }

    @Scheduled(cron = "0 0 9 1 * *")  // 매월 1일 오전 9시
    public void generateMonthlyReport() {
        log.info("Generating monthly report...");

        Report report = reportService.generateMonthlyReport();
        emailService.sendReport(report, "monthly-report@example.com");

        log.info("Monthly report sent successfully");
    }
}
```

## 주의사항

### 1. 예외 처리

스케줄 작업에서 예외가 발생하면 해당 실행만 실패하고 다음 실행은 정상적으로 진행됩니다. 하지만 적절한 예외 처리와 로깅이 필요합니다:

```java
@Scheduled(fixedRate = 5000)
public void safeTask() {
    try {
        // 작업 수행
    } catch (Exception e) {
        logger.error("Scheduled task failed", e);
        // 알림 발송 등 추가 처리
    }
}
```

### 2. 장시간 실행 작업

작업 실행 시간이 스케줄 간격보다 길면 작업이 겹칠 수 있습니다. `fixedDelay`를 사용하거나 lock을 구현하세요:

```java
@Scheduled(fixedDelay = 5000)  // 이전 작업 완료 후 5초 뒤 실행
public void longRunningTask() {
    // 오래 걸리는 작업
}
```

### 3. 분산 환경

여러 인스턴스에서 동일한 스케줄 작업이 실행되면 중복 실행됩니다. ShedLock 등을 사용하여 분산 락을 구현하세요:

```java
@Scheduled(cron = "0 */10 * * * *")
@SchedulerLock(name = "dataSync", lockAtMostFor = "9m", lockAtLeastFor = "5m")
public void scheduledTaskWithLock() {
    // 단일 인스턴스에서만 실행
}
```

## 결론

Spring의 스케줄링 기능은 간단한 어노테이션만으로 다양한 정기 작업을 구현할 수 있게 해줍니다. Cron 표현식을 활용하면 복잡한 스케줄도 표현 가능하며, 외부 설정을 통해 유연하게 관리할 수 있습니다. 분산 환경에서는 중복 실행 방지를 위한 추가 설정이 필요합니다.

## 참고 자료

- [Spring Scheduling 공식 문서](https://docs.spring.io/spring-framework/reference/integration/scheduling.html)
- [Cron Expression Generator](https://crontab.cronhub.io/)
- [ShedLock - Distributed Lock](https://github.com/lukas-krecan/ShedLock)
