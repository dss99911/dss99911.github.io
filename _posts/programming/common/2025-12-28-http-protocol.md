---
layout: post
title: "HTTP Protocol - Request, Response, and Curl"
date: 2025-12-28 01:00:00 +0900
categories: [programming, common]
tags: [network, http]
image: /assets/images/posts/thumbnails/2025-12-28-http-protocol.png
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
