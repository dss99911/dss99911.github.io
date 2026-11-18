---
layout: post
title: "CDN and HTTP Caching"
date: 2025-07-25 14:10:00 +0900
categories: [programming, common]
tags: [network, cdn, caching]
image: /assets/images/posts/thumbnails/2025-12-28-cdn-caching.png
redirect_from:
  - "/programming/common/2025/12/28/cdn-caching.html"
---

# CDN (Content Delivery Network)

## What is CDN?

CDN allows CDN providers to deliver content that doesn't change frequently from servers to users.

## How it Works

1. User makes a request to the server
2. DNS server redirects to CDN provider's server
3. CDN delivers cached content from the nearest server to the user

## Benefits

- **Faster delivery**: Content served from geographically closer servers
- **Reduced server load**: Main server doesn't handle all requests
- **Better performance**: Cached content is served quickly

---

# HTTP Caching

Effective caching strategies can significantly improve website performance.

## Cache-Control Headers

The `Cache-Control` header is the primary mechanism for controlling HTTP caching behavior.

### Common Directives

| Directive | Meaning |
|-----------|---------|
| `public` | Response can be cached by any cache (browser, CDN, proxy) |
| `private` | Response can only be cached by the browser, not shared caches |
| `no-cache` | Must revalidate with server before using cached version |
| `no-store` | Do not cache the response at all |
| `max-age=3600` | Cache is valid for 3600 seconds (1 hour) |
| `s-maxage=86400` | Shared cache (CDN) max age, overrides max-age for CDN |
| `must-revalidate` | Cache must verify stale responses with origin server |
| `immutable` | Content will never change, browser should never revalidate |

### Example Headers

```
# Static assets that rarely change (cache for 1 year)
Cache-Control: public, max-age=31536000, immutable

# API responses (no caching)
Cache-Control: no-store

# HTML pages (revalidate every time)
Cache-Control: no-cache

# User-specific content
Cache-Control: private, max-age=300
```

---

## ETag and Conditional Requests

ETags enable efficient cache validation without downloading the full resource again.

### How ETags Work

1. Server sends response with an `ETag` header (a hash or version identifier):
   ```
   ETag: "abc123"
   ```
2. Browser caches the response along with the ETag
3. On the next request, browser sends:
   ```
   If-None-Match: "abc123"
   ```
4. If the resource has not changed, server responds with `304 Not Modified` (no body)
5. If changed, server sends the new resource with a new ETag

This saves bandwidth because the server only sends the full response when the content has actually changed.

---

## CDN Cache Invalidation

One of the most challenging aspects of using a CDN is cache invalidation — ensuring users see updated content when you deploy changes.

### Strategies

1. **Cache Busting with File Hashing**: Append a hash to filenames (e.g., `app.a1b2c3.js`). When content changes, the filename changes, and the CDN fetches the new file.

2. **Purge/Invalidation API**: Most CDN providers offer APIs to manually invalidate cached content:
   - AWS CloudFront: `CreateInvalidation`
   - Cloudflare: `Purge Cache`
   - Fastly: `Instant Purge`

3. **Short TTL for Dynamic Content**: Use short `max-age` values for content that changes frequently, and long TTLs for static assets.

### Best Practice: Versioned Static Assets

```
# HTML (short TTL, always check for updates)
index.html → Cache-Control: no-cache

# CSS/JS (long TTL, filename changes on deploy)
app.v2.1.0.js → Cache-Control: public, max-age=31536000, immutable
styles.a3f8b2.css → Cache-Control: public, max-age=31536000, immutable

# Images (medium TTL)
logo.png → Cache-Control: public, max-age=86400
```

This approach ensures that HTML always fetches the latest asset URLs, while static files are cached aggressively because their filenames change when content changes.

---

## CDN Providers Comparison

| Provider | Strengths | Best For |
|----------|-----------|----------|
| CloudFront | Deep AWS integration | AWS-based infrastructure |
| Cloudflare | Free tier, DDoS protection, easy setup | Small to medium websites |
| Fastly | Real-time purging, edge computing | Dynamic content, APIs |
| Akamai | Largest network, enterprise features | Large enterprises |

---

## Browser Caching Behavior

Understanding how browsers handle caching is essential for web developers. Different browsers may have slight variations, but the general behavior follows the HTTP specification.

### Cache Lifecycle

When a browser receives a response with caching headers, it goes through this decision process for subsequent requests:

1. **Check if cache entry exists** for the URL
2. **Check if it's fresh** (within `max-age` or before `Expires`)
3. **If fresh**: Use cached version without contacting server
4. **If stale**: Send conditional request (with `If-None-Match` or `If-Modified-Since`)
5. **If 304 Not Modified**: Use cached version
6. **If 200 OK**: Replace cache with new version

### Stale-While-Revalidate

The `stale-while-revalidate` directive allows the browser to immediately serve a stale cached response while revalidating in the background:

```
Cache-Control: max-age=3600, stale-while-revalidate=60
```

This means: cache is fresh for 1 hour. After that, serve the stale version for up to 60 more seconds while fetching the new version in the background. This provides a better user experience because users never have to wait for revalidation.

### Vary Header

The `Vary` header tells caches that the response varies based on certain request headers. This is important for content negotiation.

```
Vary: Accept-Encoding, Accept-Language
```

CDNs cache different versions of the same URL based on these headers. For example, a gzipped version and a non-gzipped version are cached separately.

---

## Service Workers and Caching

Service Workers provide programmatic control over caching, allowing you to implement sophisticated offline-first strategies.

### Cache-First Strategy

```javascript
// Good for static assets that rarely change
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
```

### Network-First Strategy

```javascript
// Good for dynamic content where freshness matters
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const clone = response.clone();
                caches.open('dynamic-cache').then((cache) => {
                    cache.put(event.request, clone);
                });
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
```

### Stale-While-Revalidate Strategy

```javascript
// Serve cached content immediately, update cache in background
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            const fetchPromise = fetch(event.request).then((response) => {
                caches.open('sw-cache').then((cache) => {
                    cache.put(event.request, response.clone());
                });
                return response;
            });
            return cached || fetchPromise;
        })
    );
});
```

---

## CDN Configuration Examples

### AWS CloudFront

```json
{
    "CacheBehaviors": {
        "DefaultCacheBehavior": {
            "ViewerProtocolPolicy": "redirect-to-https",
            "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
            "Compress": true
        }
    }
}
```

Key settings for CloudFront:
- **Origin Shield**: Additional caching layer to reduce load on your origin
- **Lambda@Edge**: Run code at CDN edge locations for dynamic content manipulation
- **Price Class**: Control which edge locations to use (affects cost and coverage)

### Cloudflare Page Rules

```
URL: example.com/static/*
Cache Level: Cache Everything
Edge Cache TTL: 1 month
Browser Cache TTL: 1 year

URL: example.com/api/*
Cache Level: Bypass
```

---

## Measuring Cache Performance

### Key Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| **Cache Hit Ratio** | Percentage of requests served from cache | > 90% |
| **TTFB** | Time to First Byte | < 200ms |
| **Origin Offload** | Percentage of requests NOT reaching origin | > 85% |
| **Bandwidth Savings** | Data served from cache vs. total | > 80% |

### Checking Cache Status

Most CDNs add response headers indicating cache status:

```
# CloudFront
X-Cache: Hit from cloudfront

# Cloudflare
CF-Cache-Status: HIT

# Fastly
X-Cache: HIT
```

These headers are invaluable for debugging caching issues. When you see `MISS`, it means the CDN had to fetch from the origin. When you see `HIT`, the content was served from the CDN cache.

---

## Common Caching Pitfalls

1. **Caching user-specific content**: Never cache responses that contain personal data with `Cache-Control: public`. Always use `private` for authenticated content.

2. **Forgetting to set Vary headers**: If your server returns different content based on `Accept-Language` but doesn't set `Vary: Accept-Language`, CDNs may serve the wrong language to users.

3. **Overly aggressive caching of HTML**: HTML pages should typically use `no-cache` so the browser always checks for updates. Static assets referenced by HTML can be cached aggressively with content hashing.

4. **Not invalidating after deploys**: If you update a CSS file but keep the same filename and long cache TTL, users will see the old version. Always use content hashing or cache busting for static assets.

5. **Ignoring mobile vs. desktop**: If your site serves different content for mobile and desktop users, make sure to include `Vary: User-Agent` or use separate URLs.

## Reference
- [Google Web Fundamentals - HTTP Caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)
- [MDN - HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Cache-Control Header Explained](https://web.dev/http-cache/)
