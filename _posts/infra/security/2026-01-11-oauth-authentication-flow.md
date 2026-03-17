---
layout: post
title: "OAuth 2.0 인증 플로우 완벽 가이드 - Authorization Code Grant 방식"
date: 2026-01-11 10:00:00 +0900
categories: [infra, security]
tags: [security, oauth, authentication, authorization, jwt, api-security]
description: "OAuth 2.0 Authorization Code Grant 방식의 전체 플로우를 상세히 설명합니다. Google OAuth 예시와 함께 각 단계별 구현 방법과 보안 고려사항을 다룹니다."
image: /assets/images/posts/oauth-authentication-flow.png
---

# OAuth 2.0 인증 플로우 완벽 가이드

OAuth 2.0은 현대 웹과 모바일 애플리케이션에서 가장 널리 사용되는 인증/인가 프로토콜입니다. 이 글에서는 가장 안전한 방식인 **Authorization Code Grant** 플로우를 상세히 설명합니다.

## 인증 방식 비교

웹 애플리케이션에서 사용하는 주요 인증 방식을 비교해 보겠습니다.

| 방식 | 특징 | 사용 사례 |
|------|------|----------|
| **OAuth 2.0** | 비밀번호 없이 제3자 앱에 권한 위임 | 소셜 로그인, API 접근 |
| **Basic Auth** | ID/비밀번호를 Base64로 인코딩하여 전송 | 간단한 API 인증 |
| **JWT** | 토큰 기반 stateless 인증 | 마이크로서비스, SPA |
| **Bearer Token** | OAuth에서 발급한 토큰을 헤더에 포함 | API 요청 인증 |

---

## Authorization Code Grant 플로우

Authorization Code Grant는 OAuth 2.0에서 가장 안전한 인증 방식입니다. 서버 사이드 애플리케이션에 적합하며, Access Token이 클라이언트에 노출되지 않습니다.

### 전체 플로우 다이어그램

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  사용자   │     │  클라이언트 │     │  앱 서버  │     │ OAuth 서버│
│ (브라우저)│     │   (앱)    │     │          │     │ (Google) │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │ 1. 로그인 요청  │                │                │
     │───────────────>│                │                │
     │                │ 2. OAuth 요청  │                │
     │                │───────────────>│                │
     │                │                │ 3. Authorize URL│
     │<───────────────────────────────────────────────────
     │                                                  │
     │ 4. 로그인 페이지로 리다이렉트                      │
     │─────────────────────────────────────────────────>│
     │                                                  │
     │ 5. 사용자 로그인 및 권한 승인                      │
     │<─────────────────────────────────────────────────│
     │                                                  │
     │ 6. Authorization Code와 함께 앱 서버로 리다이렉트   │
     │─────────────────────────────────>│                │
     │                                  │                │
     │                                  │ 7. Code로 Token│
     │                                  │───────────────>│
     │                                  │                │
     │                                  │ 8. Access Token│
     │                                  │<───────────────│
     │                                  │                │
     │                                  │ 9. 사용자 정보  │
     │                                  │───────────────>│
     │                                  │                │
     │                                  │ 10. Profile    │
     │                                  │<───────────────│
     │                                  │                │
     │ 11. 서비스 토큰 발급              │                │
     │<─────────────────────────────────│                │
```

### 단계별 상세 설명

#### 1단계: OAuth 인증 요청

사용자가 앱에서 "Google로 로그인" 버튼을 클릭하면, 앱은 서버로 OAuth 인증을 요청합니다.

```kotlin
// Android 클라이언트
val oauthRequest = OAuthRequest(
    serverUrl = "https://my-app-server.com",
    provider = "google",
    redirectUri = "myapp://oauth/callback",  // 딥링크
    platform = "android",
    packageName = "com.example.myapp"
)
```

**보안 고려사항:**
- `serverUrl`이 변조되면 공격자 서버로 요청이 전송될 수 있습니다.
- 앱 무결성 검증을 통해 이러한 변조를 방지해야 합니다.

#### 2-3단계: Authorize URL 생성

서버는 OAuth 제공자(Google)의 인증 URL을 생성합니다.

```kotlin
// Ktor 서버 예시
fun createAuthorizeUrl(provider: String, state: String): String {
    val settings = getOAuthSettings(provider)
    return URLBuilder(settings.authorizeUrl).apply {
        parameters.append("client_id", settings.clientId)
        parameters.append("redirect_uri", settings.redirectUri)
        parameters.append("response_type", "code")
        parameters.append("scope", settings.scope)
        parameters.append("state", state)  // CSRF 방지
    }.buildString()
}
```

**주요 파라미터:**

| 파라미터 | 설명 |
|---------|------|
| `client_id` | OAuth 제공자에 등록된 앱 ID |
| `redirect_uri` | 인증 후 콜백 받을 URL |
| `response_type` | "code" (Authorization Code Grant) |
| `scope` | 요청할 권한 범위 |
| `state` | CSRF 공격 방지용 랜덤 문자열 |

#### 4-5단계: 사용자 인증

브라우저가 Google 로그인 페이지로 리다이렉트되고, 사용자가 로그인 후 권한을 승인합니다.

**권한 승인 화면에서 확인할 사항:**
- 요청하는 앱이 신뢰할 수 있는지
- 요청하는 권한이 적절한지

#### 6단계: Authorization Code 수신

사용자가 승인하면, OAuth 서버는 `redirect_uri`로 리다이렉트하며 Authorization Code를 전달합니다.

```
https://my-app-server.com/oauth/callback?code=AUTH_CODE&state=RANDOM_STATE
```

#### 7-8단계: Access Token 교환

서버는 Authorization Code를 사용하여 Access Token을 요청합니다.

```kotlin
suspend fun exchangeCodeForToken(code: String): TokenResponse {
    val response = httpClient.post(settings.accessTokenUrl) {
        setBody(FormDataContent(Parameters.build {
            append("grant_type", "authorization_code")
            append("code", code)
            append("redirect_uri", settings.redirectUri)
            append("client_id", settings.clientId)
            append("client_secret", settings.clientSecret)
        }))
    }
    return response.body<TokenResponse>()
}
```

**응답 예시:**

```json
{
    "access_token": "ya29.a0AfH6SMB...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "refresh_token": "1//0g...",
    "scope": "email profile"
}
```

#### 9-10단계: 사용자 정보 조회

Access Token으로 사용자 프로필을 조회합니다.

```kotlin
suspend fun getUserProfile(accessToken: String): UserProfile {
    val response = httpClient.get("https://www.googleapis.com/userinfo/v2/me") {
        headers {
            append("Authorization", "Bearer $accessToken")
        }
    }
    return response.body<UserProfile>()
}
```

#### 11단계: 서비스 토큰 발급

OAuth 인증이 완료되면, 서버는 자체 서비스용 토큰(JWT 등)을 생성하여 클라이언트에 전달합니다.

---

## InstalledAppFlow (데스크톱/CLI 앱용)

데스크톱 앱이나 CLI 도구에서는 InstalledAppFlow 방식을 사용합니다.

```python
from google_auth_oauthlib.flow import InstalledAppFlow

def get_credentials():
    flow = InstalledAppFlow.from_client_secrets_file(
        'credentials.json',
        scopes=['https://www.googleapis.com/auth/gmail.readonly']
    )

    # 브라우저에서 로그인 후 토큰 저장
    credentials = flow.run_local_server(port=8080)

    # token.json에 저장
    with open('token.json', 'w') as token:
        token.write(credentials.to_json())

    return credentials
```

**토큰 갱신 로직:**

1. `token.json`에 저장된 Access Token이 유효하면 사용
2. 만료된 경우 Refresh Token으로 새 Access Token 요청
3. Refresh Token도 만료되면 다시 로그인 필요

---

## 보안 베스트 프랙티스

### 1. PKCE (Proof Key for Code Exchange)

모바일 앱이나 SPA에서는 PKCE를 사용하여 Authorization Code 가로채기 공격을 방지합니다.

```kotlin
// Code Verifier 생성
val codeVerifier = Base64.encodeToString(
    SecureRandom().generateSeed(32),
    Base64.URL_SAFE or Base64.NO_WRAP
)

// Code Challenge 생성
val codeChallenge = Base64.encodeToString(
    MessageDigest.getInstance("SHA-256").digest(codeVerifier.toByteArray()),
    Base64.URL_SAFE or Base64.NO_WRAP
)

// Authorize URL에 추가
parameters.append("code_challenge", codeChallenge)
parameters.append("code_challenge_method", "S256")
```

### 2. State 파라미터로 CSRF 방지

```kotlin
val state = UUID.randomUUID().toString()
session.setAttribute("oauth_state", state)

// 콜백에서 검증
if (receivedState != session.getAttribute("oauth_state")) {
    throw SecurityException("Invalid state parameter")
}
```

### 3. Redirect URI 검증

OAuth 제공자 설정에서 허용된 redirect URI만 사용하도록 제한합니다.

### 4. Token 안전 저장

- Access Token: 메모리 또는 안전한 스토리지에 저장
- Refresh Token: 암호화하여 저장
- Client Secret: 서버 측에서만 보관 (클라이언트에 노출 금지)

---

## JWT vs OAuth

| 특성 | JWT | OAuth |
|------|-----|-------|
| 용도 | 인증 정보 전달 | 권한 위임 |
| Stateless | O | X (Authorization Server 필요) |
| 토큰 유형 | 자체 서명된 토큰 | Access Token, Refresh Token |
| 활용 | API 인증 | 소셜 로그인, 제3자 앱 연동 |

**JWT와 OAuth 조합 사용:**

OAuth로 인증 후, JWT를 발급하여 이후 API 요청에 사용하는 것이 일반적입니다.

```kotlin
// OAuth 인증 완료 후 JWT 발급
fun createServiceToken(userProfile: UserProfile): String {
    return JWT.create()
        .withSubject(userProfile.id)
        .withClaim("email", userProfile.email)
        .withExpiresAt(Date(System.currentTimeMillis() + 3600000))
        .sign(Algorithm.HMAC256(secretKey))
}
```

---

## OAuth 2.0 Grant Types 비교

Authorization Code Grant 외에도 여러 Grant Type이 있습니다. 각각의 사용 시나리오와 보안 수준을 이해하는 것이 중요합니다.

### 1. Authorization Code Grant (+PKCE)

- **가장 안전한 방식** - 서버 사이드 애플리케이션에 권장
- Access Token이 브라우저에 노출되지 않음
- PKCE 확장을 통해 모바일/SPA에서도 안전하게 사용 가능

### 2. Client Credentials Grant

서버 간 통신에 사용됩니다. 사용자 개입 없이 앱 자체가 인증합니다.

```kotlin
// 서버 간 인증 - 사용자 없이 앱 자체 인증
suspend fun getServiceToken(): TokenResponse {
    val response = httpClient.post(tokenUrl) {
        setBody(FormDataContent(Parameters.build {
            append("grant_type", "client_credentials")
            append("client_id", clientId)
            append("client_secret", clientSecret)
            append("scope", "api.read api.write")
        }))
    }
    return response.body<TokenResponse>()
}
```

### 3. Device Authorization Grant

스마트 TV, IoT 디바이스 등 입력 장치가 제한된 환경에서 사용합니다.

1. 디바이스가 인증 서버에 코드 요청
2. 사용자에게 URL과 코드를 화면에 표시
3. 사용자가 별도 기기(스마트폰)에서 URL 접속 후 코드 입력
4. 디바이스가 주기적으로 토큰 발급 상태를 폴링

### 4. Implicit Grant (비권장)

Access Token이 URL Fragment로 직접 전달되어 보안에 취약합니다. OAuth 2.1에서는 제거될 예정이며, 대신 PKCE를 사용한 Authorization Code Grant를 권장합니다.

---

## Refresh Token 전략

Access Token의 만료 시간은 일반적으로 짧게 설정합니다(1시간 등). 사용자 경험을 위해 Refresh Token을 활용한 자동 갱신이 필요합니다.

### Token Refresh 구현

```kotlin
suspend fun refreshAccessToken(refreshToken: String): TokenResponse {
    val response = httpClient.post(tokenUrl) {
        setBody(FormDataContent(Parameters.build {
            append("grant_type", "refresh_token")
            append("refresh_token", refreshToken)
            append("client_id", clientId)
            append("client_secret", clientSecret)
        }))
    }
    return response.body<TokenResponse>()
}
```

### Token Rotation

보안을 강화하기 위해 Refresh Token도 갱신할 수 있습니다. 새 Access Token을 발급할 때 새로운 Refresh Token도 함께 발급하고, 이전 Refresh Token은 무효화합니다.

이 방식은 Refresh Token이 탈취되었을 때, 정상 사용자가 갱신을 시도하면 이전 토큰이 이미 사용되었음을 감지할 수 있어 보안에 유리합니다.

---

## OpenID Connect (OIDC)

OIDC는 OAuth 2.0 위에 구축된 인증 계층입니다. OAuth 2.0이 "권한 위임"에 초점을 맞춘다면, OIDC는 "사용자 인증"을 추가합니다.

### OAuth 2.0 vs OIDC

| 특성 | OAuth 2.0 | OIDC |
|------|-----------|------|
| 목적 | 권한 위임 (Authorization) | 사용자 인증 (Authentication) |
| 토큰 | Access Token | ID Token (JWT) + Access Token |
| 사용자 정보 | 표준화되지 않음 | 표준 claims 제공 |
| scope | 자유 정의 | `openid`, `profile`, `email` 등 표준 scope |

### ID Token

OIDC에서 발급하는 ID Token은 JWT 형태로, 사용자 인증 정보를 담고 있습니다:

```json
{
    "iss": "https://accounts.google.com",
    "sub": "1234567890",
    "aud": "your-client-id",
    "exp": 1700000000,
    "iat": 1699996400,
    "email": "user@example.com",
    "name": "Hong Gildong",
    "picture": "https://..."
}
```

---

## 실무 구현 체크리스트

OAuth 2.0을 실제 서비스에 적용할 때 확인해야 할 항목들입니다.

### 보안 체크리스트

- [ ] State 파라미터로 CSRF 방지
- [ ] PKCE 적용 (모바일/SPA의 경우 필수)
- [ ] Redirect URI를 OAuth 제공자 설정에서 정확히 등록
- [ ] Client Secret을 서버 측에서만 관리 (클라이언트 코드에 포함 금지)
- [ ] Access Token을 로컬 스토리지에 저장하지 않기 (XSS 취약)
- [ ] HTTPS 강제 (HTTP 환경에서 토큰 탈취 위험)
- [ ] Token 만료 시간을 적절히 설정

### 에러 처리

- [ ] 인증 실패 시 사용자에게 명확한 메시지 제공
- [ ] Token 갱신 실패 시 재로그인 유도
- [ ] OAuth 제공자 서비스 장애 시 대비 (타임아웃, 재시도)
- [ ] 사용자가 권한 승인을 거부한 경우 처리

---

## 참고 자료

- [OAuth 2.0 RFC 6749](https://tools.ietf.org/html/rfc6749)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [PKCE RFC 7636](https://tools.ietf.org/html/rfc7636)

