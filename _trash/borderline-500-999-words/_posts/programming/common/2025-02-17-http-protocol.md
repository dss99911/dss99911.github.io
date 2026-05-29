---
layout: post
title: "HTTP Protocol - Request, Response, and Curl"
date: 2025-02-17 21:47:00 +0900
categories: [programming, common]
tags: [network, http]
image: /assets/images/posts/thumbnails/2025-12-28-http-protocol.png
redirect_from:
  - "/programming/common/2025/12/28/http-protocol.html"
---

# HTTP Protocol

## HTTP Features

- **Persistent Connection (HTTP/1.1)**: TCP connection is maintained without explicit disconnection
  - Both server and client must support it
  - Uses keep-alive header
- **Pipelining**: When multiple requests are needed, send all requests before receiving responses (useful for loading scripts and images in HTML documents)
- **Range Request**: Partial download for resume functionality
- **Content Negotiation**
  - Server-driven negotiation
  - Agent-driven negotiation (user decides)
  - Transparent negotiation (mix of both)

---

# HTTP Request

## HTTP Methods

- **GET**: Retrieve resource
- **POST**: Send entity
- **PUT**: Transfer file
- **HEAD**: Get message headers only
- **DELETE**: Delete file
- **OPTIONS**: Query available methods
- **TRACE**: Trace route
- **CONNECT**: Request tunneling from proxy

## Request Message Structure

Components: Method, URI, Protocol Version, Request Headers, Entity

```
POST /form/entry HTTP/1.1
Host: hackr.jp
Connection: keep-alive
Content-Type: application/x-www-form-urlencoded
Content-Length: 16

name=ueno&age=37
```

```
GET /index.html HTTP/1.1
Host: www.hackr.jp
```

## POST Method Content Types (MIME types)

### multipart/form-data
- Use when you have binary (non-alphanumeric) data or a significantly sized payload
- Has overhead for short alphanumeric values

### application/x-www-form-urlencoded
- Use for regular form data
- Not suitable for byte values
- Reserved and non-alphanumeric characters are replaced by `%HH` (percent sign and two hexadecimal digits representing the ASCII code)
- This can triple the size for binary data

---

# HTTP Response

## Response Message Structure

Components: Protocol Version, Status Code, Status Description, Response Headers, Body

```
HTTP/1.1 200 OK
Date: Tue, 10 Jul 2012 06:50:15 GMT
Content-Length: 362
Content-Type: text/html

<html>
...
```

## Common Status Codes

- `200 OK`: Request succeeded
- `400 Bad Request`: Invalid request

---

# Curl - API Testing Tool

## Basic Usage

```bash
curl http://localhost:9091/messagePattern
```

## Options

- `-G`: GET request
- `-v`: Verbose output
- `--data-urlencode`: Encode query parameters

## Examples

### Basic Authentication
```bash
curl --user daniel:secret http://example.com/
```

### URL Encoding
```bash
curl -G -v http://localhost:3000/ --data-urlencode "query=word"
# Results in: http://localhost:3000/?query=word
```

### POST with JSON Body
```bash
curl -X POST http://localhost:9091/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","age":30}'
```

### File Upload
```bash
curl -X POST http://localhost:9091/upload \
  -F "file=@/path/to/file.png" \
  -F "description=profile image"
```

### Custom Headers
```bash
curl -H "Authorization: Bearer token123" \
     -H "Accept: application/json" \
     http://localhost:9091/api/resource
```

---

# HTTP Versions Comparison

Understanding the differences between HTTP versions helps you choose the right configuration for your applications.

## HTTP/1.0
- One request per TCP connection
- Connection closes after each response
- No persistent connections by default

## HTTP/1.1
- Persistent connections (keep-alive) by default
- Pipelining support (send multiple requests without waiting)
- Chunked transfer encoding
- Host header required (enables virtual hosting)

## HTTP/2
- Binary protocol instead of text-based
- Multiplexing: multiple requests over a single TCP connection simultaneously
- Header compression (HPACK)
- Server push: server can proactively send resources
- Significantly faster for loading web pages with many resources

## HTTP/3
- Uses QUIC protocol instead of TCP (built on UDP)
- Faster connection establishment
- Better handling of packet loss
- Built-in encryption (TLS 1.3)

---

# Common HTTP Headers

## Request Headers

| Header | Purpose | Example |
|--------|---------|---------|
| `Host` | Target domain | `Host: www.example.com` |
| `Authorization` | Authentication credentials | `Authorization: Bearer token` |
| `Accept` | Expected response format | `Accept: application/json` |
| `User-Agent` | Client identification | `User-Agent: Mozilla/5.0...` |
| `Cache-Control` | Caching directives | `Cache-Control: no-cache` |

## Response Headers

| Header | Purpose | Example |
|--------|---------|---------|
| `Content-Type` | Body media type | `Content-Type: text/html` |
| `Set-Cookie` | Set browser cookies | `Set-Cookie: id=abc; Path=/` |
| `Location` | Redirect URL | `Location: /new-page` |
| `Access-Control-Allow-Origin` | CORS policy | `Access-Control-Allow-Origin: *` |

---

# Status Code Categories

| Range | Category | Description |
|-------|----------|-------------|
| 1xx | Informational | Request received, continuing process |
| 2xx | Success | Request successfully received and processed |
| 3xx | Redirection | Further action needed to complete request |
| 4xx | Client Error | Request contains bad syntax or cannot be fulfilled |
| 5xx | Server Error | Server failed to fulfill a valid request |

## Most Common Status Codes

- `200 OK`: Standard success response
- `201 Created`: Resource successfully created (common for POST)
- `301 Moved Permanently`: Resource permanently moved (SEO redirect)
- `302 Found`: Temporary redirect
- `400 Bad Request`: Malformed request syntax
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Server understood but refuses to authorize
- `404 Not Found`: Resource does not exist
- `500 Internal Server Error`: Generic server error
- `502 Bad Gateway`: Invalid response from upstream server
- `503 Service Unavailable`: Server temporarily overloaded or under maintenance
