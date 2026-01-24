---
layout: post
title: "DNS - Domain Name System Basics"
date: 2025-12-28 01:01:00 +0900
categories: [programming, common]
tags: [network, dns]
image: /assets/images/posts/thumbnails/2025-12-28-dns-basics.png
redirect_from:
  - /programming/common/2025/12/28/dns-basics.html
---

# DNS (Domain Name System)

## Key Components

### Authoritative Name Servers (Delegation Set)
```
ns-576.awsdns-08.net.
ns-1086.awsdns-07.org.
ns-1630.awsdns-11.co.uk.
ns-47.awsdns-05.com.
pdns1.ultradns.net.
pdns6.ultradns.co.uk.
```

### Resolver
- Requests list of authoritative name servers for TLD from root name servers

### TLD (Top-Level Domain)
- The last part of the domain name (e.g., .com, .org, .net)

### DNS Providers
- Services that manage DNS records for domains

---

# DNS Server Check

## Using nslookup

Check DNS server response:
```bash
nslookup www.google.com
```

This command queries the name server for the IP address associated with the domain.

---

## Reference
- [AWS DNS Troubleshooting](https://aws.amazon.com/ko/premiumsupport/knowledge-center/partial-dns-failures/)
