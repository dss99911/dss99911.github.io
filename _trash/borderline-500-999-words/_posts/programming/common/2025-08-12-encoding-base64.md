---
layout: post
title: "Encoding and Base64"
date: 2025-08-12 19:15:00 +0900
categories: [programming, common]
tags: [network, encoding, base64]
image: /assets/images/posts/thumbnails/2025-12-28-encoding-base64.png
redirect_from:
  - "/programming/common/2025/12/28/encoding-base64.html"
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

---

# How Base64 Works

Base64 encoding converts binary data into a string of 64 printable ASCII characters. The encoding process works as follows:

1. Take the input binary data
2. Split it into groups of 6 bits (since 2^6 = 64)
3. Map each 6-bit group to one of 64 characters: `A-Z`, `a-z`, `0-9`, `+`, `/`
4. If the input length is not a multiple of 3 bytes, pad with `=` characters

## Encoding Example

The string `"Hi"` in binary:
```
H = 01001000
i = 01101001
```

Split into 6-bit groups:
```
010010 | 000110 | 1001xx
```

Pad the last group with zeros:
```
010010 | 000110 | 100100
```

Map to Base64 characters:
```
S      | G      | k=
```

Result: `"SGk="`

## Code Examples

### Python
```python
import base64

# Encode
encoded = base64.b64encode(b"Hello World")
print(encoded)  # b'SGVsbG8gV29ybGQ='

# Decode
decoded = base64.b64decode(encoded)
print(decoded)  # b'Hello World'
```

### JavaScript
```javascript
// Encode
const encoded = btoa("Hello World");
console.log(encoded);  // "SGVsbG8gV29ybGQ="

// Decode
const decoded = atob(encoded);
console.log(decoded);  // "Hello World"
```

### Java
```java
import java.util.Base64;

// Encode
String encoded = Base64.getEncoder().encodeToString("Hello World".getBytes());

// Decode
byte[] decoded = Base64.getDecoder().decode(encoded);
String original = new String(decoded);
```

---

# Base64 Variants

| Variant | Characters Used | Padding | Common Use |
|---------|----------------|---------|------------|
| Standard (RFC 4648) | `A-Z`, `a-z`, `0-9`, `+`, `/` | `=` | General purpose |
| URL-safe | `A-Z`, `a-z`, `0-9`, `-`, `_` | Optional | URLs, filenames |
| MIME | Standard + line breaks every 76 chars | `=` | Email attachments |

The URL-safe variant replaces `+` with `-` and `/` with `_` because `+` and `/` have special meanings in URLs.

---

# Base64 Size Overhead

Base64 encoding increases data size by approximately 33%. Every 3 bytes of input becomes 4 bytes of output. This means:

| Original Size | Base64 Size | Overhead |
|--------------|-------------|----------|
| 1 KB | ~1.37 KB | +37% |
| 1 MB | ~1.37 MB | +37% |
| 10 MB | ~13.7 MB | +37% |

This overhead is the trade-off for the ability to safely transmit binary data through text-only channels. For large files, direct binary transfer is preferred when possible.

---

# Common Pitfalls

1. **Base64 is NOT encryption**: Base64 is an encoding scheme, not a security measure. Anyone can decode Base64 data. Never use it to "hide" sensitive information.

2. **Line length limits**: Some systems (like email) require Base64 output to be broken into lines of 76 characters. Use the MIME variant for these cases.

3. **Padding issues**: Some implementations strip padding characters (`=`). Ensure both encoder and decoder agree on whether padding is used.

4. **Performance**: Encoding and decoding large files with Base64 consumes CPU and memory. For large binary transfers, use binary protocols instead of Base64-encoded text.

## Reference
- [OKKY Discussion on Base64](https://okky.kr/article/276104)
- [RFC 4648 - The Base16, Base32, and Base64 Data Encodings](https://tools.ietf.org/html/rfc4648)
