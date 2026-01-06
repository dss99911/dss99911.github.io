---
layout: post
title: "REST API Basics - Headers and Body"
date: 2025-12-28 03:05:00 +0900
categories: [programming, common]
tags: [rest-api, api]
image: /assets/images/posts/thumbnails/2025-12-28-rest-api-basics.png
---

# REST API Basics

## Request Body Types

### Raw vs Multipart

Raw and multipart are different request body types.

- **Raw**: Send data as-is in the body. Used for JSON, XML, or plain text.
- **Multipart**: Used for file uploads and form data with mixed content types.

In REST client apps, typically use raw for general data:

```
Content-Type: application/json

{
  "key": "value"
}
```

---

## Common Headers

### Content-Type Header

Specifies the media type of the request body.

```
Content-Type: text/html
Content-Type: application/json
Content-Type: multipart/form-data
```

### Common Content-Type Values

| Content-Type | Use Case |
|--------------|----------|
| `application/json` | JSON data |
| `text/html` | HTML content |
| `text/plain` | Plain text |
| `multipart/form-data` | File uploads |
| `application/x-www-form-urlencoded` | Form submissions |

---

## Best Practices

1. Always set appropriate `Content-Type` header
2. Use `application/json` for API requests unless uploading files
3. Use `multipart/form-data` when sending files
4. For simple form data without files, `application/x-www-form-urlencoded` works well
