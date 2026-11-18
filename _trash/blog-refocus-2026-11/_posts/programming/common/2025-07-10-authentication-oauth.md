---
layout: post
title: "Authentication Methods - OAuth, Basic Auth, and JWT"
date: 2025-07-10 19:04:00 +0900
categories: [programming, common]
tags: [network, authentication, oauth, jwt]
image: /assets/images/posts/thumbnails/2025-12-28-authentication-oauth.png
redirect_from:
  - "/programming/common/2025/12/28/authentication-oauth.html"
---

# Authentication Methods

## OAuth
- Allows apps to get information from user's account without password
- Uses bearer token type

## Basic Access Authentication
- Uses password
- [Wikipedia - Basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication)

## JWT Token
- Uses HTTP headers like Referer and Origin to reject requests from unauthorized sources
- [JWT Explanation](http://lazyhoneyant.blogspot.com/2016/08/jwt.html?m=1)

---

# OAuth Authorization Code Grant Flow

## Simple Flow Overview

1. User initiates Google login from a client app
2. App server generates authorizeUrl and sends to client
3. Client opens authorizeUrl in browser
4. User logs in to Google in browser
5. Browser redirects to redirect_url (app server URL)
6. App server receives code and state via redirect_url
7. App server requests access token from Google using code and state
8. Access Google resources with accessToken

## Detailed Flow

### Step 1: App Request to Server
The app sends OAuth authentication request to app server via web browser with:
- **Server URL**: If modified by attacker, requests could go to attacker's server
- **OAuth Server Name**: (Google, Facebook, etc.)
- **Redirection URL**: Deep link defined by app
- **Platform**: Deep link behavior varies by platform
- **Package Name**: Required for Android deep links

### Security Warning
When logging in, users should check:
- Which site is requesting OAuth
- What permissions are being requested

### Step 2-3: Server Processes Request
- `providerLookup` is called to get `OAuth2ServerSettings`
- `urlProvider` sets where to receive results after Google auth (server URL + required queries)
- Server sends 302 redirect to Google's authorizeUrl

### Step 4-6: Authentication Flow
- User logs in to Google
- Client receives code + status
- Server includes redirect_uri when redirecting to Google
- After login, Google redirects client to that URI

### Step 7-8: Token Exchange
- Client sends status + code to redirected app server
- App server requests access token from `accessTokenUrl`
- Server creates principal containing access token

### Step 9: Profile Retrieval
- Call `https://www.googleapis.com/userinfo/v2/me` with access token
- Get user's unique ID from profile info
- OAuth login complete

### Step 10: Service Token
- Send redirect response to client with service token

---

# InstalledAppFlow

## First Run
- Google login window appears for authentication
- After authentication, Access Token and Refresh Token are saved to token.json

## Subsequent Runs
- If Access Token in token.json is valid, use it
- If expired, request new Access Token using Refresh Token

---

# Security Considerations

## Token Storage Best Practices

| Storage Location | Security Level | Use Case |
|-----------------|---------------|----------|
| HTTP-only Cookie | High | Web applications (server-rendered) |
| Secure Cookie + SameSite | High | Web apps with CSRF protection |
| Memory (variable) | Medium | SPAs during session only |
| localStorage | Low | Not recommended for sensitive tokens |
| sessionStorage | Low-Medium | Better than localStorage, cleared on tab close |

**Never store access tokens or refresh tokens in localStorage** for production applications. An XSS attack can easily read localStorage values. HTTP-only cookies are the safest option for web applications because JavaScript cannot access them.

## Common Security Vulnerabilities

### CSRF (Cross-Site Request Forgery)
- Attacker tricks the user's browser into making authenticated requests
- The `state` parameter in OAuth prevents this by verifying that the request originated from your application
- Always validate the `state` parameter when receiving the callback

### Token Leakage
- Tokens in URL query parameters can be logged in server logs, browser history, and referrer headers
- Use POST requests for token exchange instead of GET
- Use short-lived access tokens (5-15 minutes) with longer-lived refresh tokens

### Redirect URI Manipulation
- Always register exact redirect URIs in your OAuth provider settings
- Avoid wildcard redirect URIs
- Validate that the redirect URI in the callback matches the registered URI

---

# OAuth Scopes

Scopes define what resources and operations the application can access on behalf of the user.

## Google OAuth Common Scopes

| Scope | Access Granted |
|-------|---------------|
| `openid` | User's basic identity |
| `profile` | Name, profile picture |
| `email` | Email address |
| `https://www.googleapis.com/auth/drive.readonly` | Read Google Drive files |
| `https://www.googleapis.com/auth/calendar` | Full calendar access |

## Best Practices for Scopes
- Request only the minimum scopes your application needs (principle of least privilege)
- Request scopes incrementally as features are used, not all at once during initial login
- Clearly explain to users why each permission is needed

---

# Token Refresh Flow

Access tokens are intentionally short-lived for security. When an access token expires, the refresh flow is:

1. Client sends a request with an expired access token
2. Server responds with `401 Unauthorized`
3. Client sends the refresh token to the token endpoint
4. Server validates the refresh token and issues a new access token
5. Client retries the original request with the new access token

If the refresh token itself has expired or been revoked, the user must go through the full OAuth login flow again.

## Handling Token Refresh in Code

A common pattern is to implement an HTTP interceptor that automatically handles token refresh:

```
Request → Check if token expired → If yes, refresh → Retry request
                                 → If refresh fails → Redirect to login
```

This ensures a seamless user experience where the user does not need to re-login unless absolutely necessary.

---

# OAuth 2.0 Grant Types

OAuth 2.0 defines several grant types for different use cases. Choosing the right one depends on your application type.

## Authorization Code Grant (with PKCE)

This is the **recommended flow** for most applications, including SPAs and mobile apps. PKCE (Proof Key for Code Exchange) adds an extra security layer to prevent authorization code interception attacks.

### How PKCE Works

1. Client generates a random `code_verifier` string
2. Client creates a `code_challenge` by hashing the verifier with SHA-256
3. Client sends the `code_challenge` with the authorization request
4. When exchanging the authorization code for tokens, client sends the original `code_verifier`
5. Server verifies that the hash of `code_verifier` matches the original `code_challenge`

This prevents an attacker who intercepts the authorization code from exchanging it for tokens, because they don't have the original `code_verifier`.

## Client Credentials Grant

Used for **server-to-server** communication where no user is involved. The client authenticates directly with its own credentials.

```
POST /token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=YOUR_CLIENT_ID
&client_secret=YOUR_CLIENT_SECRET
&scope=read:data
```

Common use cases:
- Background services accessing APIs
- Microservice-to-microservice authentication
- Automated scripts and cron jobs

## Device Authorization Grant

Used for devices with limited input capabilities (smart TVs, IoT devices, CLI tools). The user authenticates on a separate device (phone or computer).

1. Device requests a user code and verification URL
2. Device displays the URL and code to the user
3. User navigates to the URL on their phone/computer and enters the code
4. Device polls the token endpoint until the user completes authentication

---

# Implementing OAuth in Practice

## Server-Side Implementation (Node.js Example)

```javascript
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();

// Step 1: Redirect to OAuth provider
app.get('/auth/google', (req, res) => {
    const state = crypto.randomBytes(16).toString('hex');
    // Store state in session for validation
    req.session.oauthState = state;

    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: 'https://yourapp.com/auth/callback',
        response_type: 'code',
        scope: 'openid profile email',
        state: state,
    });

    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// Step 2: Handle callback
app.get('/auth/callback', async (req, res) => {
    const { code, state } = req.query;

    // Validate state parameter
    if (state !== req.session.oauthState) {
        return res.status(403).send('Invalid state parameter');
    }

    // Step 3: Exchange code for tokens
    const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: 'https://yourapp.com/auth/callback',
            grant_type: 'authorization_code',
        }
    );

    const { access_token, refresh_token, id_token } = tokenResponse.data;

    // Step 4: Get user info
    const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        { headers: { Authorization: `Bearer ${access_token}` } }
    );

    // Create session or JWT for your application
    // ...
});
```

## Common Implementation Mistakes

### 1. Not Validating the State Parameter
The `state` parameter prevents CSRF attacks. Always generate a unique, unpredictable value, store it in the session, and validate it when receiving the callback.

### 2. Storing Tokens Insecurely
Never store tokens in localStorage for production apps. Use HTTP-only cookies with the `Secure` and `SameSite` flags, or keep tokens in memory only.

### 3. Not Implementing Token Rotation
When issuing a new access token using a refresh token, also issue a new refresh token and invalidate the old one. This limits the window of exposure if a refresh token is compromised.

### 4. Requesting Too Many Scopes
Only request the permissions your app actually needs. Requesting excessive scopes makes users less likely to approve the authorization request and increases the risk if tokens are compromised.

---

# OpenID Connect (OIDC)

OpenID Connect is an identity layer built on top of OAuth 2.0. While OAuth 2.0 only handles **authorization** (what can I access?), OIDC adds **authentication** (who am I?).

## Key Differences from OAuth 2.0

| Feature | OAuth 2.0 | OIDC |
|---------|-----------|------|
| Purpose | Authorization | Authentication + Authorization |
| Token | Access Token | Access Token + ID Token |
| User Info | Separate API call needed | Included in ID Token (JWT) |
| Standard Claims | None | Name, email, picture, etc. |

## ID Token

The ID Token is a JWT that contains claims about the authenticated user:

```json
{
  "iss": "https://accounts.google.com",
  "sub": "110169484474386276334",
  "aud": "YOUR_CLIENT_ID",
  "exp": 1711234567,
  "iat": 1711230967,
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://example.com/photo.jpg"
}
```

Always validate the ID Token on your server: verify the signature, check the `iss` (issuer), `aud` (audience), and `exp` (expiration) claims.
