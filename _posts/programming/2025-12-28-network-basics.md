---
layout: post
title: "Network Basics - Protocols, Web Server, WebSocket, and More"
date: 2025-12-28 01:07:00 +0900
categories: programming
tags: [network, protocol, websocket]
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
