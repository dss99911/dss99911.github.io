---
layout: post
title: "CDN and HTTP Caching"
date: 2025-12-28 01:06:00 +0900
categories: [programming, common]
tags: [network, cdn, caching]
image: /assets/images/posts/thumbnails/2025-12-28-cdn-caching.png
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

## Reference
- [Google Web Fundamentals - HTTP Caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)
