---
layout: post
title: "REST API Basics - Headers and Body"
date: 2025-08-29 15:52:00 +0900
categories: [programming, common]
tags: [rest-api, api]
image: /assets/images/posts/thumbnails/2025-12-28-rest-api-basics.png
redirect_from:
  - "/programming/common/2025/12/28/rest-api-basics.html"
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

---

# REST API Design Principles

REST (Representational State Transfer) is an architectural style for designing networked applications. A well-designed REST API follows these core principles:

## Resource-Oriented URLs

URLs should represent resources (nouns), not actions (verbs):

```
# Good - resource-oriented
GET    /api/users          # List users
GET    /api/users/123      # Get specific user
POST   /api/users          # Create user
PUT    /api/users/123      # Update user
DELETE /api/users/123      # Delete user

# Bad - action-oriented
GET    /api/getUsers
POST   /api/createUser
POST   /api/deleteUser/123
```

## Use Proper HTTP Methods

Each HTTP method has a specific semantic meaning:

| Method | Purpose | Idempotent | Safe |
|--------|---------|-----------|------|
| GET | Retrieve resource | Yes | Yes |
| POST | Create resource | No | No |
| PUT | Replace resource entirely | Yes | No |
| PATCH | Update resource partially | No | No |
| DELETE | Remove resource | Yes | No |

**Idempotent** means calling the same request multiple times produces the same result. **Safe** means the request does not modify the resource.

---

# Response Status Codes for REST APIs

Choosing the right status code makes your API predictable and self-documenting:

| Status | When to Use |
|--------|------------|
| `200 OK` | Successful GET, PUT, PATCH, or DELETE |
| `201 Created` | Successful POST that creates a resource |
| `204 No Content` | Successful DELETE with no response body |
| `400 Bad Request` | Malformed request (invalid JSON, missing field) |
| `401 Unauthorized` | Missing or invalid authentication |
| `403 Forbidden` | Authenticated but not authorized |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | Resource state conflict (duplicate entry) |
| `422 Unprocessable Entity` | Valid syntax but semantic errors (validation failed) |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unexpected server failure |

---

# Pagination, Filtering, and Sorting

For endpoints that return lists, always support pagination to avoid returning massive datasets:

```
# Offset-based pagination
GET /api/users?page=2&size=20

# Cursor-based pagination (better for large datasets)
GET /api/users?cursor=eyJpZCI6MTIzfQ&size=20

# Filtering
GET /api/users?status=active&role=admin

# Sorting
GET /api/users?sort=created_at&order=desc
```

## Pagination Response Format

Include pagination metadata in the response:

```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "size": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

---

# Error Response Format

Use a consistent error response structure across all endpoints:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "age",
        "message": "Must be a positive number"
      }
    ]
  }
}
```

This format allows clients to programmatically handle errors and display user-friendly messages.

---

# API Versioning

As your API evolves, you need versioning to avoid breaking existing clients:

## Common Approaches

| Approach | Example | Pros | Cons |
|----------|---------|------|------|
| URL path | `/api/v1/users` | Clear and simple | URL changes |
| Query parameter | `/api/users?version=1` | Easy to add | Easy to miss |
| Header | `Accept: application/vnd.api.v1+json` | Clean URLs | Less visible |

URL path versioning is the most common and recommended approach because it is explicit and easy to understand.

---

# Authentication Headers

## Common Authentication Patterns

```
# Bearer Token (OAuth2, JWT)
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

# API Key (in header)
X-API-Key: your-api-key-here

# Basic Auth (Base64-encoded username:password)
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

## Accept Header

Use the `Accept` header to specify what response format you expect:

```
Accept: application/json        # JSON response
Accept: application/xml         # XML response
Accept: text/csv               # CSV response
```

---

# Rate Limiting

APIs should implement rate limiting to prevent abuse. Common headers used to communicate rate limits:

```
X-RateLimit-Limit: 100        # Maximum requests per window
X-RateLimit-Remaining: 45     # Requests remaining in current window
X-RateLimit-Reset: 1625097600 # Unix timestamp when the window resets
Retry-After: 60               # Seconds to wait (sent with 429 response)
```

Clients should handle `429 Too Many Requests` responses gracefully by implementing exponential backoff retry logic.
