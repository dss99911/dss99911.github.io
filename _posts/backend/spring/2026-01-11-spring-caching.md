---
layout: post
title: "Spring Cache - 캐싱으로 애플리케이션 성능 최적화하기"
date: 2026-01-11 14:00:00 +0900
categories: [backend, spring]
tags: [spring, cache, caching, performance, redis]
description: "Spring의 캐싱 추상화를 활용하여 애플리케이션 성능을 최적화하는 방법을 알아봅니다. @Cacheable, @CacheEvict, @CachePut 어노테이션 사용법부터 Redis 연동까지 다룹니다."
image: /assets/images/posts/spring-caching.png
---

데이터베이스 조회나 외부 API 호출과 같이 비용이 많이 드는 작업의 결과를 캐싱하면 애플리케이션 성능을 크게 향상시킬 수 있습니다. Spring은 강력한 캐싱 추상화를 제공하여 다양한 캐시 구현체를 일관된 방식으로 사용할 수 있게 해줍니다.

## Spring Cache 기본 설정

### 캐싱 활성화

`@EnableCaching` 어노테이션으로 캐싱 기능을 활성화합니다:

```java
@SpringBootApplication
@EnableCaching
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### Kotlin 예시

```kotlin
@SpringBootApplication
@EnableCaching
class Application

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}
```

### 의존성 추가

Spring Boot Starter Cache를 추가합니다:

**Gradle:**
```groovy
implementation 'org.springframework.boot:spring-boot-starter-cache'
```

**Maven:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```

## 핵심 어노테이션

### @Cacheable

메서드 결과를 캐시에 저장합니다. 동일한 파라미터로 호출되면 캐시된 값을 반환합니다:

```java
@Service
public class UserService {

    @Cacheable("users")
    public User findById(Long id) {
        // 이 메서드는 캐시에 없을 때만 실행됩니다
        return userRepository.findById(id).orElse(null);
    }
}
```

#### 캐시 키 지정

```java
// 특정 파라미터를 키로 사용
@Cacheable(value = "users", key = "#userId")
public User findUser(Long userId, String context) {
    return userRepository.findById(userId).orElse(null);
}

// 여러 파라미터 조합
@Cacheable(value = "products", key = "#category + '_' + #page")
public List<Product> findProducts(String category, int page) {
    return productRepository.findByCategory(category, PageRequest.of(page, 20));
}

// SpEL 표현식 사용
@Cacheable(value = "users", key = "#user.id")
public UserProfile getProfile(User user) {
    return profileService.loadProfile(user);
}
```

#### 조건부 캐싱

```java
// id가 100 이상인 경우에만 캐시
@Cacheable(value = "users", condition = "#id >= 100")
public User findById(Long id) {
    return userRepository.findById(id).orElse(null);
}

// 결과가 null이 아닌 경우에만 캐시
@Cacheable(value = "users", unless = "#result == null")
public User findByEmail(String email) {
    return userRepository.findByEmail(email).orElse(null);
}
```

### @CacheEvict

캐시에서 데이터를 제거합니다:

```java
@Service
public class UserService {

    // 특정 키 제거
    @CacheEvict(value = "users", key = "#user.id")
    public void updateUser(User user) {
        userRepository.save(user);
    }

    // 해당 캐시의 모든 데이터 제거
    @CacheEvict(value = "users", allEntries = true)
    public void clearAllUsersCache() {
        // 캐시만 비움
    }

    // 메서드 실행 전에 캐시 제거
    @CacheEvict(value = "users", key = "#id", beforeInvocation = true)
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
```

### @CachePut

항상 메서드를 실행하고 결과를 캐시에 저장합니다:

```java
@CachePut(value = "users", key = "#user.id")
public User updateUser(User user) {
    return userRepository.save(user);
}
```

> `@Cacheable`과 달리 `@CachePut`은 항상 메서드를 실행합니다.

### @Caching

여러 캐시 작업을 조합할 때 사용합니다:

```java
@Caching(
    cacheable = @Cacheable(value = "users", key = "#id"),
    evict = @CacheEvict(value = "allUsers", allEntries = true)
)
public User findById(Long id) {
    return userRepository.findById(id).orElse(null);
}

@Caching(evict = {
    @CacheEvict(value = "users", key = "#user.id"),
    @CacheEvict(value = "userEmails", key = "#user.email"),
    @CacheEvict(value = "allUsers", allEntries = true)
})
public void deleteUser(User user) {
    userRepository.delete(user);
}
```

### @CacheConfig

클래스 레벨에서 공통 캐시 설정을 지정합니다:

```java
@Service
@CacheConfig(cacheNames = "users")
public class UserService {

    @Cacheable
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @CacheEvict
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
}
```

## Repository에서 캐싱 사용

Spring Data JPA Repository에서도 캐싱을 적용할 수 있습니다:

```kotlin
interface DictionaryDao : JpaRepository<Dictionary, Int> {

    @Cacheable("dictionary")
    override fun findAll(): MutableList<Dictionary>

    @CacheEvict(value = "dictionary", allEntries = true)
    override fun <S : Dictionary?> save(entity: S): S

    @CacheEvict(value = "dictionary", allEntries = true)
    override fun <S : Dictionary?> saveAll(entities: MutableIterable<S>): MutableList<S>
}
```

## 캐시 구현체

### 기본 ConcurrentMapCache

별도 설정 없이 사용하면 `ConcurrentHashMap` 기반의 간단한 캐시가 사용됩니다:

```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        cacheManager.setCaches(Arrays.asList(
            new ConcurrentMapCache("users"),
            new ConcurrentMapCache("products")
        ));
        return cacheManager;
    }
}
```

### Caffeine Cache

고성능 인메모리 캐시:

**의존성:**
```groovy
implementation 'com.github.ben-manes.caffeine:caffeine'
```

**설정:**
```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .expireAfterWrite(10, TimeUnit.MINUTES)
            .maximumSize(1000)
            .recordStats());
        return cacheManager;
    }
}
```

또는 application.properties로 설정:

```properties
spring.cache.type=caffeine
spring.cache.caffeine.spec=maximumSize=500,expireAfterWrite=10m
```

### Redis Cache

분산 환경에서 권장되는 캐시:

**의존성:**
```groovy
implementation 'org.springframework.boot:spring-boot-starter-data-redis'
```

**설정:**
```properties
spring.cache.type=redis
spring.redis.host=localhost
spring.redis.port=6379

# TTL 설정 (밀리초)
spring.cache.redis.time-to-live=600000
```

**Java 설정:**
```java
@Configuration
@EnableCaching
public class RedisCacheConfig {

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()))
            .disableCachingNullValues();

        // 캐시별 설정
        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();
        cacheConfigs.put("users", config.entryTtl(Duration.ofHours(1)));
        cacheConfigs.put("products", config.entryTtl(Duration.ofMinutes(30)));

        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(config)
            .withInitialCacheConfigurations(cacheConfigs)
            .build();
    }
}
```

## 캐시 통계 및 모니터링

### Caffeine 통계

```java
@Bean
public CacheManager cacheManager() {
    CaffeineCacheManager cacheManager = new CaffeineCacheManager();
    cacheManager.setCaffeine(Caffeine.newBuilder()
        .recordStats());  // 통계 활성화
    return cacheManager;
}

// 통계 조회
@Autowired
CacheManager cacheManager;

public void printStats() {
    CaffeineCache cache = (CaffeineCache) cacheManager.getCache("users");
    CacheStats stats = cache.getNativeCache().stats();

    System.out.println("Hit rate: " + stats.hitRate());
    System.out.println("Miss rate: " + stats.missRate());
    System.out.println("Eviction count: " + stats.evictionCount());
}
```

### Actuator 연동

Spring Boot Actuator와 연동하여 캐시 메트릭을 노출할 수 있습니다:

```properties
management.endpoints.web.exposure.include=caches
```

## 실전 예제

### 서비스 레이어에서의 캐싱

```java
@Service
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final ExternalApiClient apiClient;

    @Cacheable(value = "products", key = "#id", unless = "#result == null")
    public Product findById(Long id) {
        log.info("Fetching product from database: {}", id);
        return productRepository.findById(id).orElse(null);
    }

    @Cacheable(value = "productsByCategory", key = "#category")
    public List<Product> findByCategory(String category) {
        log.info("Fetching products by category: {}", category);
        return productRepository.findByCategory(category);
    }

    @CachePut(value = "products", key = "#product.id")
    @CacheEvict(value = "productsByCategory", key = "#product.category")
    public Product save(Product product) {
        log.info("Saving product: {}", product.getId());
        return productRepository.save(product);
    }

    @Caching(evict = {
        @CacheEvict(value = "products", key = "#id"),
        @CacheEvict(value = "productsByCategory", allEntries = true)
    })
    public void delete(Long id) {
        log.info("Deleting product: {}", id);
        productRepository.deleteById(id);
    }

    // 외부 API 결과 캐싱
    @Cacheable(value = "externalData", key = "#query", unless = "#result.isEmpty()")
    public List<ExternalData> fetchExternalData(String query) {
        log.info("Calling external API: {}", query);
        return apiClient.search(query);
    }
}
```

### 캐시 갱신 스케줄러

```java
@Component
@Slf4j
public class CacheRefreshScheduler {

    private final CacheManager cacheManager;
    private final ProductService productService;

    @Scheduled(fixedRate = 3600000)  // 1시간마다
    public void refreshPopularProductsCache() {
        log.info("Refreshing popular products cache...");

        Cache cache = cacheManager.getCache("products");
        if (cache != null) {
            // 인기 상품만 미리 캐싱
            List<Long> popularProductIds = getPopularProductIds();
            for (Long id : popularProductIds) {
                Product product = productService.findById(id);
                cache.put(id, product);
            }
        }
    }

    @Scheduled(cron = "0 0 4 * * *")  // 매일 새벽 4시
    public void evictAllCaches() {
        log.info("Evicting all caches...");
        cacheManager.getCacheNames().forEach(cacheName -> {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.clear();
            }
        });
    }
}
```

## 주의사항

### 1. Self-Invocation 문제

같은 클래스 내에서 캐시 메서드를 호출하면 AOP 프록시를 거치지 않아 캐싱이 동작하지 않습니다:

```java
@Service
public class UserService {

    // 외부에서 호출 시에만 캐싱 동작
    @Cacheable("users")
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUser(Long id) {
        // 캐싱이 적용되지 않음!
        return this.findById(id);
    }
}
```

**해결 방법:**

```java
@Service
public class UserService {

    @Autowired
    private ApplicationContext context;

    @Cacheable("users")
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUser(Long id) {
        // 프록시를 통해 호출
        return context.getBean(UserService.class).findById(id);
    }
}
```

### 2. Null 값 캐싱

기본적으로 null 값도 캐시됩니다. 이를 방지하려면:

```java
@Cacheable(value = "users", unless = "#result == null")
public User findById(Long id) {
    return userRepository.findById(id).orElse(null);
}
```

### 3. 직렬화

Redis 등 외부 캐시 사용 시 객체는 직렬화 가능해야 합니다:

```java
public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    // ...
}
```

### 4. 캐시 키 충돌

여러 메서드에서 같은 캐시 이름을 사용할 때 키가 충돌할 수 있습니다:

```java
// 문제: 같은 id 값이면 다른 엔티티라도 같은 키
@Cacheable("entities")
public User findUser(Long id) { }

@Cacheable("entities")
public Product findProduct(Long id) { }

// 해결: 캐시 이름 분리 또는 키에 타입 포함
@Cacheable(value = "entities", key = "'user_' + #id")
public User findUser(Long id) { }
```

## 결론

Spring Cache는 간단한 어노테이션으로 애플리케이션 성능을 크게 향상시킬 수 있는 강력한 도구입니다. 개발 환경에서는 간단한 인메모리 캐시를, 운영 환경에서는 Redis와 같은 분산 캐시를 사용하세요. 캐시 무효화 전략을 잘 설계하여 데이터 일관성을 유지하는 것이 중요합니다.

## 참고 자료

- [Spring Cache 공식 문서](https://docs.spring.io/spring-framework/reference/integration/cache.html)
- [Caffeine Cache](https://github.com/ben-manes/caffeine)
- [Spring Data Redis](https://docs.spring.io/spring-data/redis/docs/current/reference/html/)
