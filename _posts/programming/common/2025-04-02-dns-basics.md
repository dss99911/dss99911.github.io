---
layout: post
title: "DNS - Domain Name System Basics"
date: 2025-04-02 11:51:00 +0900
categories: [programming, common]
tags: [network, dns]
image: /assets/images/posts/thumbnails/2025-12-28-dns-basics.png
redirect_from:
  - "/programming/common/2025/12/28/dns-basics.html"
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

---

# How DNS Resolution Works

When you type a URL like `www.example.com` into your browser, a multi-step process happens behind the scenes to resolve it to an IP address.

## Step-by-Step Resolution Process

1. **Browser Cache Check**: The browser first checks its own DNS cache for a recently resolved result.
2. **OS Cache Check**: If not found, the operating system's DNS cache is checked.
3. **Resolver Query**: The OS sends a query to the configured DNS resolver (typically your ISP's or a public resolver like Google's 8.8.8.8).
4. **Root Server Query**: The resolver queries a root name server, which responds with the TLD server address (e.g., the server for `.com`).
5. **TLD Server Query**: The resolver queries the TLD server, which responds with the authoritative name server for the domain.
6. **Authoritative Server Query**: The resolver queries the authoritative server, which returns the IP address for the domain.
7. **Response Cached**: The resolver caches the result and returns it to the client.

This entire process typically happens in under 100 milliseconds.

---

# DNS Record Types

| Record Type | Purpose | Example |
|------------|---------|---------|
| **A** | Maps domain to IPv4 address | `example.com → 93.184.216.34` |
| **AAAA** | Maps domain to IPv6 address | `example.com → 2606:2800:220:1:...` |
| **CNAME** | Alias for another domain | `www.example.com → example.com` |
| **MX** | Mail server for the domain | `example.com → mail.example.com` |
| **TXT** | Text records (SPF, DKIM, verification) | `example.com → "v=spf1 include:..."` |
| **NS** | Authoritative name servers | `example.com → ns1.example.com` |
| **SOA** | Start of Authority (zone information) | Zone admin info, serial number |

---

# DNS Troubleshooting Commands

## dig Command

`dig` provides more detailed DNS information than `nslookup`:

```bash
# Basic lookup
dig www.google.com

# Query specific record type
dig example.com MX

# Query specific DNS server
dig @8.8.8.8 example.com

# Trace the full resolution path
dig +trace example.com
```

## Common DNS Issues

### 1. DNS Propagation Delay
After changing DNS records, it can take up to 48 hours for changes to propagate worldwide. Check propagation status with online tools like `dnschecker.org`.

### 2. TTL (Time to Live)
Each DNS record has a TTL value in seconds. A lower TTL means faster propagation but more DNS queries. Before making DNS changes, reduce the TTL in advance so the old record expires quickly.

```bash
# Check the TTL of a record
dig example.com +noall +answer
# Output shows TTL value: example.com. 300 IN A 93.184.216.34
```

### 3. NXDOMAIN Errors
An NXDOMAIN response means the domain does not exist. Common causes:
- Typo in the domain name
- Domain registration expired
- DNS records not configured

---

# Popular Public DNS Resolvers

| Provider | Primary | Secondary |
|----------|---------|-----------|
| Google | 8.8.8.8 | 8.8.4.4 |
| Cloudflare | 1.1.1.1 | 1.0.0.1 |
| OpenDNS | 208.67.222.222 | 208.67.220.220 |

Using a public DNS resolver can improve resolution speed and reliability compared to your ISP's default DNS.

---

# DNS Security

## DNSSEC (DNS Security Extensions)

DNSSEC adds a layer of security to the DNS by digitally signing DNS records. This prevents attackers from forging DNS responses (DNS spoofing/poisoning).

### How DNSSEC Works

1. The zone owner generates a public/private key pair
2. DNS records are signed with the private key
3. The public key is published as a DNSKEY record
4. Resolvers verify signatures using the public key
5. A chain of trust extends from the root zone down to individual domains

### Checking DNSSEC Status

```bash
# Check if a domain has DNSSEC enabled
dig example.com +dnssec

# Verify the DNSSEC chain of trust
dig +sigchase +trusted-key=./trusted-key.key example.com A
```

## DNS over HTTPS (DoH) and DNS over TLS (DoT)

Traditional DNS queries are sent in plaintext, which means anyone on the network can see which domains you are resolving. DoH and DoT encrypt DNS queries for privacy.

| Feature | DNS over HTTPS (DoH) | DNS over TLS (DoT) |
|---------|---------------------|---------------------|
| Port | 443 (same as HTTPS) | 853 (dedicated) |
| Protocol | HTTPS | TLS |
| Firewall bypass | Easy (blends with web traffic) | Can be blocked by filtering port 853 |
| Adoption | Chrome, Firefox, Edge | Android 9+, systemd-resolved |

### Configuring DNS over HTTPS

Most modern browsers support DoH natively:
- **Chrome**: Settings > Privacy and Security > Use secure DNS
- **Firefox**: Settings > Privacy & Security > Enable DNS over HTTPS
- **macOS**: Can be configured system-wide with a profile

---

# DNS for Web Developers

## Setting Up a Custom Domain

When deploying a web application, you typically need to configure DNS records to point your domain to your hosting provider.

### Example: GitHub Pages

```
# A records for apex domain (example.com)
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153

# CNAME record for www subdomain
www.example.com → username.github.io
```

### Example: AWS CloudFront

```
# CNAME record pointing to CloudFront distribution
www.example.com → d1234abcd.cloudfront.net

# For apex domain, use Route 53 Alias record
example.com → d1234abcd.cloudfront.net (Alias)
```

## Wildcard DNS Records

A wildcard record matches any subdomain that does not have a more specific record:

```
*.example.com → 93.184.216.34
```

This means `foo.example.com`, `bar.example.com`, and any other subdomain will resolve to the same IP address. This is commonly used for multi-tenant SaaS applications where each customer gets their own subdomain.

## DNS Load Balancing

DNS can be used for simple load balancing by returning multiple A records for the same domain. The client (or resolver) typically picks one at random or uses round-robin selection.

```bash
# Multiple A records for load balancing
dig example.com A
# Returns:
# example.com. 300 IN A 93.184.216.34
# example.com. 300 IN A 93.184.216.35
# example.com. 300 IN A 93.184.216.36
```

However, DNS load balancing has limitations: it does not account for server health, geographic proximity (without GeoDNS), or current server load. For production systems, a dedicated load balancer (ALB, NLB, Nginx, HAProxy) is usually preferred.

## Reference
- [AWS DNS Troubleshooting](https://aws.amazon.com/ko/premiumsupport/knowledge-center/partial-dns-failures/)
- [Cloudflare DNS Learning Center](https://www.cloudflare.com/learning/dns/what-is-dns/)
