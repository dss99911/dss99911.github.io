---
layout: post
title: "Spring REST Client - RestTemplate과 WebClient 완벽 가이드"
date: 2026-01-11 11:00:00 +0900
categories: [backend, spring]
tags: [spring, rest-client, resttemplate, webclient, http-client]
description: "Spring에서 외부 API를 호출하는 방법을 알아봅니다. RestTemplate, WebClient, UriComponentsBuilder 등 다양한 HTTP 클라이언트 사용법을 다룹니다."
image: /assets/images/posts/spring-rest-client.png
---

Spring 애플리케이션에서 외부 REST API를 호출해야 하는 경우가 많습니다. 이 글에서는 RestTemplate, WebClient, 그리고 Spring 6의 RestClient까지 다양한 HTTP 클라이언트 사용법을 알아봅니다.

## RestTemplate (Spring MVC)

RestTemplate은 동기식 HTTP 클라이언트로, Spring 5.0 이전부터 사용되어온 전통적인 방법입니다.

### 기본 설정

```java
@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

### GET 요청

```java
@Service
public class UserApiService {

    private final RestTemplate restTemplate;

    public UserApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // 단일 객체 조회
    public User getUser(Long id) {
        String url = "https://api.example.com/users/{id}";
        return restTemplate.getForObject(url, User.class, id);
    }

    // ResponseEntity로 상태 코드 확인
    public ResponseEntity<User> getUserWithStatus(Long id) {
        String url = "https://api.example.com/users/{id}";
        return restTemplate.getForEntity(url, User.class, id);
    }

    // 목록 조회
    public List<User> getAllUsers() {
        String url = "https://api.example.com/users";
        User[] users = restTemplate.getForObject(url, User[].class);
        return Arrays.asList(users);
    }
}
```

### POST 요청

```java
// 객체 전송
public User createUser(User user) {
    String url = "https://api.example.com/users";
    return restTemplate.postForObject(url, user, User.class);
}

// HttpEntity 사용 (헤더 포함)
public User createUserWithHeaders(User user) {
    String url = "https://api.example.com/users";

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Authorization", "Bearer token123");

    HttpEntity<User> request = new HttpEntity<>(user, headers);
    return restTemplate.postForObject(url, request, User.class);
}
```

### PUT, DELETE 요청

```java
// PUT
public void updateUser(Long id, User user) {
    String url = "https://api.example.com/users/{id}";
    restTemplate.put(url, user, id);
}

// DELETE
public void deleteUser(Long id) {
    String url = "https://api.example.com/users/{id}";
    restTemplate.delete(url, id);
}
```

### exchange() 메서드

더 유연한 요청이 필요한 경우 `exchange()` 메서드를 사용합니다:

```java
public List<User> getUsersWithCustomHeaders() {
    String url = "https://api.example.com/users";

    HttpHeaders headers = new HttpHeaders();
    headers.set("X-Custom-Header", "value");
    headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

    HttpEntity<?> entity = new HttpEntity<>(headers);

    ResponseEntity<List<User>> response = restTemplate.exchange(
        url,
        HttpMethod.GET,
        entity,
        new ParameterizedTypeReference<List<User>>() {}
    );

    return response.getBody();
}
```

## URI 빌더

### UriComponentsBuilder

URL을 동적으로 구성할 때 사용합니다:

```java
// 기본 URL 구성
URI uri = UriComponentsBuilder
    .fromUriString("https://api.example.com")
    .path("/users")
    .build()
    .toUri();
// 결과: https://api.example.com/users

// 경로 변수 사용
URI uri = UriComponentsBuilder
    .fromUriString("https://api.example.com")
    .path("/{resource}/{id}")
    .buildAndExpand("users", 123)
    .encode()
    .toUri();
// 결과: https://api.example.com/users/123

// 쿼리 파라미터 추가
URI uri = UriComponentsBuilder
    .fromUriString("https://api.example.com/search")
    .queryParam("keyword", "spring")
    .queryParam("page", 1)
    .queryParam("size", 10)
    .build()
    .toUri();
// 결과: https://api.example.com/search?keyword=spring&page=1&size=10

// 다중 값 쿼리 파라미터
URI uri = UriComponentsBuilder
    .fromUriString("https://api.example.com/search")
    .queryParam("tag", "java", "spring", "kotlin")
    .build()
    .toUri();
// 결과: https://api.example.com/search?tag=java&tag=spring&tag=kotlin
```

> 주의: Spring은 내부에서 URL 인코딩을 수행하므로, 이미 인코딩된 값을 전달하면 이중 인코딩이 됩니다. 원본 값을 그대로 전달하세요.

## 인증 설정

### Basic Authentication

```java
public void callApiWithBasicAuth() {
    String username = "user";
    String password = "password";

    HttpHeaders headers = new HttpHeaders();
    String auth = username + ":" + password;
    byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes());
    headers.set("Authorization", "Basic " + new String(encodedAuth));

    HttpEntity<?> entity = new HttpEntity<>(headers);

    restTemplate.exchange(
        "https://api.example.com/secure",
        HttpMethod.GET,
        entity,
        String.class
    );
}
```

### Bearer Token

```java
public void callApiWithBearerToken(String token) {
    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(token);

    HttpEntity<?> entity = new HttpEntity<>(headers);

    restTemplate.exchange(
        "https://api.example.com/secure",
        HttpMethod.GET,
        entity,
        String.class
    );
}
```

### 인터셉터로 공통 헤더 설정

```java
@Configuration
public class RestTemplateConfig {

    @Value("${api.token}")
    private String apiToken;

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getInterceptors().add((request, body, execution) -> {
            request.getHeaders().setBearerAuth(apiToken);
            return execution.execute(request, body);
        });
        return restTemplate;
    }
}
```

## 타임아웃 설정

### 간단한 타임아웃 설정

```java
@Bean
public RestTemplate restTemplate() {
    SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
    factory.setConnectTimeout(5000);  // 연결 타임아웃 5초
    factory.setReadTimeout(5000);     // 읽기 타임아웃 5초

    return new RestTemplate(factory);
}
```

### HttpClient 사용

Apache HttpClient를 사용하면 더 상세한 설정이 가능합니다:

```java
@Bean
public RestTemplate restTemplate() {
    RequestConfig config = RequestConfig.custom()
        .setConnectTimeout(5000)
        .setConnectionRequestTimeout(5000)
        .setSocketTimeout(5000)
        .build();

    CloseableHttpClient client = HttpClientBuilder
        .create()
        .setDefaultRequestConfig(config)
        .setMaxConnTotal(100)
        .setMaxConnPerRoute(20)
        .build();

    HttpComponentsClientHttpRequestFactory factory =
        new HttpComponentsClientHttpRequestFactory(client);

    return new RestTemplate(factory);
}
```

의존성 추가가 필요합니다:

```groovy
implementation 'org.apache.httpcomponents.client5:httpclient5'
```

## 에러 처리

### ResponseErrorHandler

```java
@Component
public class CustomResponseErrorHandler implements ResponseErrorHandler {

    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        return response.getStatusCode().isError();
    }

    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        HttpStatusCode statusCode = response.getStatusCode();

        if (statusCode.is4xxClientError()) {
            throw new ClientException("Client error: " + statusCode);
        } else if (statusCode.is5xxServerError()) {
            throw new ServerException("Server error: " + statusCode);
        }
    }
}

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate(CustomResponseErrorHandler errorHandler) {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setErrorHandler(errorHandler);
        return restTemplate;
    }
}
```

## WebClient (Spring WebFlux)

WebClient는 Spring 5에서 도입된 비동기/논블로킹 HTTP 클라이언트입니다.

### 의존성 추가

```groovy
implementation 'org.springframework.boot:spring-boot-starter-webflux'
```

### 기본 설정

```java
@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
            .baseUrl("https://api.example.com")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
    }
}
```

### GET 요청

```java
@Service
public class UserApiService {

    private final WebClient webClient;

    // 단일 객체 조회
    public Mono<User> getUser(Long id) {
        return webClient.get()
            .uri("/users/{id}", id)
            .retrieve()
            .bodyToMono(User.class);
    }

    // 목록 조회
    public Flux<User> getAllUsers() {
        return webClient.get()
            .uri("/users")
            .retrieve()
            .bodyToFlux(User.class);
    }

    // 동기식으로 변환
    public User getUserSync(Long id) {
        return webClient.get()
            .uri("/users/{id}", id)
            .retrieve()
            .bodyToMono(User.class)
            .block();  // 블로킹
    }
}
```

### POST 요청

```java
public Mono<User> createUser(User user) {
    return webClient.post()
        .uri("/users")
        .bodyValue(user)
        .retrieve()
        .bodyToMono(User.class);
}
```

### 에러 처리

```java
public Mono<User> getUserWithErrorHandling(Long id) {
    return webClient.get()
        .uri("/users/{id}", id)
        .retrieve()
        .onStatus(
            HttpStatusCode::is4xxClientError,
            response -> Mono.error(new ClientException("User not found"))
        )
        .onStatus(
            HttpStatusCode::is5xxServerError,
            response -> Mono.error(new ServerException("Server error"))
        )
        .bodyToMono(User.class);
}
```

### 타임아웃 설정

```java
@Bean
public WebClient webClient() {
    HttpClient httpClient = HttpClient.create()
        .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
        .responseTimeout(Duration.ofSeconds(5));

    return WebClient.builder()
        .clientConnector(new ReactorClientHttpConnector(httpClient))
        .baseUrl("https://api.example.com")
        .build();
}
```

## RestClient (Spring 6.1+)

Spring 6.1에서 새롭게 도입된 동기식 HTTP 클라이언트입니다. RestTemplate의 대안으로 설계되었습니다.

```java
@Configuration
public class RestClientConfig {

    @Bean
    public RestClient restClient() {
        return RestClient.builder()
            .baseUrl("https://api.example.com")
            .build();
    }
}

@Service
public class UserApiService {

    private final RestClient restClient;

    public User getUser(Long id) {
        return restClient.get()
            .uri("/users/{id}", id)
            .retrieve()
            .body(User.class);
    }

    public User createUser(User user) {
        return restClient.post()
            .uri("/users")
            .contentType(MediaType.APPLICATION_JSON)
            .body(user)
            .retrieve()
            .body(User.class);
    }
}
```

## 선택 가이드

| 특성 | RestTemplate | WebClient | RestClient |
|-----|--------------|-----------|------------|
| 동기/비동기 | 동기 | 비동기 (동기도 가능) | 동기 |
| Spring 버전 | 3.x+ | 5.x+ | 6.1+ |
| 권장 여부 | 유지보수 모드 | 권장 | 권장 |
| 논블로킹 | X | O | X |
| 학습 곡선 | 낮음 | 높음 | 낮음 |

**추천:**
- 새 프로젝트 (Spring 6.1+): **RestClient**
- 리액티브 스택: **WebClient**
- 레거시 프로젝트: **RestTemplate** (유지보수)

## 결론

Spring에서 REST API를 호출하는 방법은 프로젝트 요구사항에 따라 선택할 수 있습니다. 동기식 호출에는 RestClient(Spring 6.1+) 또는 RestTemplate을, 비동기/리액티브 환경에서는 WebClient를 사용하세요. UriComponentsBuilder를 활용하면 URL을 안전하고 깔끔하게 구성할 수 있습니다.

## 참고 자료

- [Spring RestTemplate 문서](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html)
- [Spring WebClient 문서](https://docs.spring.io/spring-framework/reference/web/webflux-webclient.html)
- [Spring RestClient 문서](https://docs.spring.io/spring-framework/reference/integration/rest-clients.html)
