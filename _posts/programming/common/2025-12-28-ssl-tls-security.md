---
layout: post
title: "SSL/TLS Security and Certificate Management"
date: 2025-12-28 01:03:00 +0900
categories: [programming, common]
tags: [network, security, ssl, tls]
---

# SSL/TLS Overview

## Certificate Issuance
- Certificates are issued by signing with the Certificate Authority's (CA) private key
- Anyone with the CA's public key can verify if a certificate is valid without contacting the CA

## SSL/TLS Communication Process

1. Client requests certificate from server
2. Verify the public key is valid using the CA's public key (confirms the URL is valid for this certificate)
3. Encrypt a random number with the public key and send to server
4. Use that random number as a symmetric key for communication

## MITM Attack Verification

- SSL/TLS is vulnerable to MITM attacks if not properly implemented
- Attack flow:
  1. Attacker intercepts certificate request
  2. Attacker sends their own certificate
  3. Client verifies if attacker's certificate is valid for the URL
  4. Verification goes up the CA chain to Root CA

## Vulnerabilities

- If browser shows certificate warning but user ignores it, security is compromised
- When certificate warning appears, check:
  - DNS server configuration
  - WiFi AP issues
  - Public WiFi risks
  - Malicious users in subnet
  - IP redirect settings
  - Proxy configuration

## SSL Strip (Browser Vulnerability)
- [SSLstrip for newbies](https://avicoder.me/2016/02/22/SSLstrip-for-newbies/)

## IDN Attack and Others
- [Browser vulnerabilities](https://b.mytears.org/2009/04/1936)

## Certificate Authorities
- [IE SSL Chain](https://moxie.org/ie-ssl-chain.txt)
- In IE6, base CA doesn't verify sub-CAs, allowing potential fake CA attacks

---

# How Charles Proxy HTTPS Interception Works

1. A: Client, B: Server, C: Proxy Server
2. A requests certificate from B (public key request)
3. C intercepts and requests certificate from B
4. B sends certificate cB to C
5. C verifies cB is valid for urlB (error if invalid)
6. C sends fake certificate cC to A
7. A verifies if cC is valid for urlB
8. Normally, cC would be invalid for urlB, but with Charles, device certificate installation makes it appear valid
9. A sends symmetric key via random number to C
10. C sends symmetric key via random number to B
11. C can now decrypt, modify, and re-encrypt HTTPS traffic

---

# Self-Signed Certificates for SSL

## Overview
- Devices have Root CA certificates built-in
- During SSL, server sends its certificate along with intermediate CA certificates
- Sometimes intermediate CAs are not sent (devices cache them)
- Device verifies chain from Root CA through intermediate CAs to server certificate

## CA-issued vs Self-Signed
- CA-certified certificates cost money
- Self-signed certificates can implement SSL without CA certification
- Idea: Buy one cheap certificate and create your own CA for multiple websites

## View Server Certificate Information
```bash
openssl s_client -connect mail.google.com:443
openssl s_client -connect example.com:443
```

## Example CA Chains

**Gmail:**
- Root CA: GlobalSign
- Purchased CA: Google Internet Authority G3

## Certificate Pinning
- Setting a pin allows ignoring certificates except your server's CA certificate
- Tools like Charles Proxy create certificates at proxy and install untrusted CA certificates on devices, enabling MITM attacks

## References
- [Unsafe SSL Implementation and Proper Methods](http://theeye.pe.kr/archives/2609)
- [Building SSL with Self-Signed Certificates](http://theeye.pe.kr/archives/2605)
- [Android SSL Documentation](https://developer.android.com/training/articles/security-ssl)
- [Recommended Encryption Methods](http://csrc.nist.gov/groups/ST/key_mgmt/index.html)
- [TLS/SSL Key Generation](http://btsweet.blogspot.com/2014/06/tls-ssl.html)
