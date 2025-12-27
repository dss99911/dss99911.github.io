---
layout: post
title: "Encoding and Base64"
date: 2025-12-28 01:05:00 +0900
categories: programming
tags: [network, encoding, base64]
---

# Encoding

## Why Encode Data?

Encoding prevents invalid values during transmission (communication can have various issues with cookies, etc.)

## Example: Base64 in Android
```java
result = Base64.encodeToString(bytes, Base64.NO_WRAP);
```

---

# Why Use Base64?

## Use Cases

1. **Converting binary data to text**
   - When you need to handle binary data as text

2. **Storing binary in databases**
   - Databases often cannot store raw binary values directly
   - Convert binary to text format

3. **Embedding images in HTML**
   - Include images directly without external links (inline images)

## When to Use Base64

1. **Not needed when:**
   - Both sides have same encoding/decoding rules
   - Data is already binary (like images)
   - Start and end of binary data is clear

2. **Required for:**
   - Data managed by humans (DBMS, Excel, etc.)
   - Binary data must be represented as ASCII

3. **For different character sets:**
   - Use BASE64/HEX as intermediate format to transfer binary data between systems with different character sets

## Reference
- [OKKY Discussion on Base64](https://okky.kr/article/276104)
