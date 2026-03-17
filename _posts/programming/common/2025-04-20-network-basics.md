---
layout: post
title: "Network Basics - Protocols, Web Server, WebSocket, and More"
date: 2025-04-20 21:49:00 +0900
categories: [programming, common]
tags: [network, protocol, websocket]
image: /assets/images/posts/thumbnails/2025-12-28-network-basics.png
redirect_from:
  - "/programming/common/2025/12/28/network-basics.html"
---

# Network Protocols

## DHCP (Dynamic Host Configuration Protocol)

- Simplifies IP address management
- Administrators don't need to manually assign IP addresses to each client in the network

Reference: [Oracle DHCP Documentation](https://docs.oracle.com/cd/E26925_01/html/E25873/dhcp-overview-12a.html)

---

# Middleware

## RPC (Remote Procedure Call)

- **REST**: Representational State Transfer
- **SOAP**: Simple Object Access Protocol

---

# Web Server

## Virtual Host

- One computer hosting multiple domains
- Implementation methods:
  - Specify host name and domain name in URI
  - Specify host header field

## Proxy Types

- **Cache Proxy**: Uses cached responses
- **Transparent Proxy**: No changes, just redirects requests

---

# WebSocket

## Use Case

When a server needs to push values to a browser.

**Example**: In Jira, when a value is changed elsewhere, the Jira page open in the browser automatically refreshes.

## STOMP over WebSocket

- **STOMP**: Simple Text Oriented Messaging Protocol
- Provides a frame-based protocol on top of WebSocket

---

# Mesh Network

## Features

- **Censorship resistant**: No central control point
- **Decentralized**: Civilian network
- **Ubiquitous**: Essential for home networking

## How it Differs

Traditional networks require a central system for communication, but mesh networks allow direct communication between devices.

---

# Network Speed Check

## Tools

Use [webpagetest.org](https://www.webpagetest.org/) to check which layer is causing slow performance.

This tool helps identify:
- DNS lookup time
- Connection time
- Time to first byte
- Content download time

---

# OSI Model Overview

Understanding the OSI (Open Systems Interconnection) model helps you reason about where problems occur in networking.

| Layer | Name | Protocol Examples | Description |
|-------|------|-------------------|-------------|
| 7 | Application | HTTP, FTP, SMTP, DNS | User-facing protocols |
| 6 | Presentation | SSL/TLS, JPEG, ASCII | Data formatting and encryption |
| 5 | Session | NetBIOS, PPTP | Session management |
| 4 | Transport | TCP, UDP | Reliable/unreliable data delivery |
| 3 | Network | IP, ICMP, ARP | Routing and addressing |
| 2 | Data Link | Ethernet, Wi-Fi | Frame delivery on local network |
| 1 | Physical | Cables, Radio waves | Physical signal transmission |

## TCP vs UDP

| Feature | TCP | UDP |
|---------|-----|-----|
| Connection | Connection-oriented | Connectionless |
| Reliability | Guaranteed delivery | Best-effort delivery |
| Ordering | Maintains order | No ordering guarantee |
| Speed | Slower (overhead) | Faster (minimal overhead) |
| Use Cases | Web, email, file transfer | Video streaming, gaming, DNS |

TCP uses a three-way handshake (SYN, SYN-ACK, ACK) to establish connections, ensuring both sides are ready to communicate. UDP skips this process, making it faster but less reliable.

---

# Port Numbers

Common port numbers every developer should know:

| Port | Service | Protocol |
|------|---------|----------|
| 20/21 | FTP | TCP |
| 22 | SSH | TCP |
| 25 | SMTP (email) | TCP |
| 53 | DNS | TCP/UDP |
| 80 | HTTP | TCP |
| 443 | HTTPS | TCP |
| 3306 | MySQL | TCP |
| 5432 | PostgreSQL | TCP |
| 6379 | Redis | TCP |
| 8080 | HTTP (alternate) | TCP |

---

# Network Debugging Tools

## ping
Tests basic connectivity to a host:
```bash
ping google.com
```

## traceroute / tracert
Shows the route packets take to reach a destination:
```bash
traceroute google.com    # Linux/Mac
tracert google.com       # Windows
```

## netstat / ss
Shows active network connections:
```bash
netstat -an | grep LISTEN    # Show listening ports
ss -tuln                     # Modern alternative on Linux
```

## tcpdump
Captures and analyzes network packets:
```bash
tcpdump -i eth0 port 80     # Capture HTTP traffic on eth0
```

These tools are essential for diagnosing network issues such as connectivity problems, slow responses, or unexpected traffic patterns.
