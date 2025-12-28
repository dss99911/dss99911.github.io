---
layout: post
title: "Authentication Methods - OAuth, Basic Auth, and JWT"
date: 2025-12-28 01:04:00 +0900
categories: [programming, common]
tags: [network, authentication, oauth, jwt]
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
