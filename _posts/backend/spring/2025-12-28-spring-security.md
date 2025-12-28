---
layout: post
title: "Spring Security 시작하기 - 기본 설정과 인증"
date: 2025-12-28 12:04:00 +0900
categories: [backend, spring]
tags: [spring, spring-security, authentication, authorization, security]
description: "Spring Security의 기본 설정 방법과 인증 메커니즘을 알아봅니다. 의존성 추가만으로 시작하는 간단한 보안 설정부터 커스터마이징까지 다룹니다."
---

Spring Security는 Spring 기반 애플리케이션의 인증(Authentication)과 인가(Authorization)를 담당하는 강력한 보안 프레임워크입니다. 이 글에서는 기본 설정부터 시작하는 방법을 알아봅니다.

## 기본 설정

### 의존성 추가

Spring Security를 사용하려면 의존성만 추가하면 됩니다. 추가하는 것만으로 기본 보안이 활성화됩니다.

**Maven:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

**Gradle:**
```groovy
implementation 'org.springframework.boot:spring-boot-starter-security'
```

### 기본 동작

의존성을 추가하면 다음과 같은 기본 동작이 활성화됩니다:

1. **모든 HTTP 엔드포인트에 인증 필요**
2. **기본 로그인 폼 제공** (`/login`)
3. **기본 사용자 생성**
   - 사용자 ID: `user`
   - 비밀번호: 애플리케이션 시작 시 콘솔에 출력

```
Using generated security password: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

> 이 기본 비밀번호는 개발 환경에서만 사용하세요.

## 사용자 정의 설정

### application.properties에서 기본 사용자 설정

```properties
spring.security.user.name=admin
spring.security.user.password=secret
spring.security.user.roles=ADMIN
```

### SecurityFilterChain 설정 (Spring Security 6.x)

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/home", "/public/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout")
                .permitAll()
            );

        return http.build();
    }
}
```

### 인메모리 사용자 정의

```java
@Bean
public UserDetailsService userDetailsService() {
    UserDetails user = User.withDefaultPasswordEncoder()
        .username("user")
        .password("password")
        .roles("USER")
        .build();

    UserDetails admin = User.withDefaultPasswordEncoder()
        .username("admin")
        .password("admin")
        .roles("USER", "ADMIN")
        .build();

    return new InMemoryUserDetailsManager(user, admin);
}
```

> `withDefaultPasswordEncoder()`는 개발 환경용입니다. 운영에서는 BCrypt 등을 사용하세요.

## 비밀번호 인코딩

### BCryptPasswordEncoder 사용

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

### 비밀번호 인코딩 예시

```java
@Autowired
private PasswordEncoder passwordEncoder;

public void createUser(String username, String rawPassword) {
    String encodedPassword = passwordEncoder.encode(rawPassword);
    // 인코딩된 비밀번호 저장
}
```

## 로그아웃 기능

### 기본 로그아웃 설정

```java
.logout(logout -> logout
    .logoutUrl("/logout")
    .logoutSuccessUrl("/login?logout")
    .invalidateHttpSession(true)
    .deleteCookies("JSESSIONID")
    .permitAll()
)
```

### 로그아웃 버튼 (JSP/Thymeleaf)

```html
<form action="/logout" method="post">
    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
    <button type="submit">Logout</button>
</form>
```

## CSRF 보호

Spring Security는 기본적으로 CSRF 보호가 활성화되어 있습니다.

### CSRF 토큰 사용

```html
<!-- Thymeleaf -->
<form th:action="@{/login}" method="post">
    <!-- CSRF 토큰 자동 포함 -->
</form>

<!-- JSP -->
<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
```

### REST API에서 CSRF 비활성화

```java
http.csrf(csrf -> csrf.disable());
```

> REST API에서는 주로 JWT 토큰 인증을 사용하므로 CSRF를 비활성화해도 됩니다.

## 메서드 수준 보안

### 활성화

```java
@Configuration
@EnableMethodSecurity
public class MethodSecurityConfig {
}
```

### 사용 예시

```java
@Service
public class UserService {

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(Long userId) {
        // ADMIN 권한만 실행 가능
    }

    @PreAuthorize("#username == authentication.name")
    public User getProfile(String username) {
        // 본인만 조회 가능
    }
}
```

## 참고 자료

- [Spring Security 공식 문서](https://docs.spring.io/spring-security/reference/)
- [Spring Boot Security Getting Started](https://spring.io/guides/gs/securing-web/)

## 결론

Spring Security는 의존성 추가만으로 기본 보안을 제공하며, `SecurityFilterChain`을 통해 세밀한 설정이 가능합니다. 인증과 인가를 분리하여 관리하고, 비밀번호 인코딩을 반드시 적용하세요. 메서드 수준 보안까지 활용하면 더욱 견고한 보안을 구현할 수 있습니다.
