---
layout: post
title: Secure and Convenient Keychain Access with Touch ID
date: 2026-01-06 18:00:00 +0900
categories: [tools, mac]
tags: [mac, macos, keychain, security, password, touchid, cli]
image: /assets/images/posts/thumbnails/2026-01-06-keychain-fingerprint.png
---

# Secure and Convenient Keychain Access with Touch ID

## The Problem

When accessing passwords stored in macOS Keychain via terminal, you face a security vs convenience dilemma:

```bash
security find-generic-password -a "user@example.com" -s "myapp" -w
```

When you run this command, macOS shows a dialog:

> "security" wants to use your confidential information stored in "myapp" in your keychain.
>
> [Deny] [Allow] [Always Allow]

### Option 1: Click "Allow" every time
- Requires typing your Mac password each time
- Secure but inconvenient

### Option 2: Click "Always Allow"
- Any script can now access this password without authentication
- Convenient but insecure

## The Solution: Touch ID Authentication

I created [keychain-fingerprint](https://github.com/dss99911/keychain-fingerprint), a CLI tool that uses Touch ID for Keychain access.

### Benefits

| Aspect | Traditional (`security`) | keychain-fingerprint |
|--------|-------------------------|---------------------|
| Authentication | Mac password (slow) | Touch ID (instant) |
| Security | "Always Allow" = insecure | Always requires Touch ID |
| Convenience | Type password or allow all | One touch |

### How It Works

```
┌─────────────────────────────────────────┐
│         keychain-fingerprint            │
├─────────────────────────────────────────┤
│  1. Touch ID authentication             │
│  2. Access Keychain (auto-authorized)   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Other apps / terminal           │
├─────────────────────────────────────────┤
│  Keychain access → Mac password prompt  │
└─────────────────────────────────────────┘
```

When you store a password with this tool:
- **This app**: Can access with Touch ID (app is auto-authorized for items it created)
- **Other apps**: Still require Mac password to access

## Installation

```bash
# Clone
git clone https://github.com/dss99911/keychain-fingerprint.git
cd keychain-fingerprint

# Compile
swiftc -o keychain-fingerprint main.swift \
    -framework LocalAuthentication \
    -framework Security

# Install (optional)
sudo cp keychain-fingerprint /usr/local/bin/
```

## Usage

### Save a password

```bash
keychain-fingerprint set myapp user@example.com
# Touch ID prompt → Enter password (hidden)
```

### Retrieve a password

```bash
# Direct output
keychain-fingerprint get myapp user@example.com

# Recommended: Capture in variable
PASSWORD=$(keychain-fingerprint get myapp user@example.com)
echo "Password retrieved"
unset PASSWORD  # Clear when done
```

### List saved items

```bash
keychain-fingerprint list
```

### Delete a password

```bash
keychain-fingerprint delete myapp user@example.com
```

## Security Features

- All commands require Touch ID authentication
- Passwords stored encrypted in macOS Keychain
- Password input is hidden (no echo)
- Device-only access (`kSecAttrAccessibleWhenUnlockedThisDeviceOnly`)
- Other apps still require Mac password

## Requirements

- macOS with Touch ID (MacBook Pro/Air with Touch ID, or Apple Silicon Mac with Magic Keyboard with Touch ID)
- Xcode Command Line Tools

## Source Code

Full source code available on GitHub: [dss99911/keychain-fingerprint](https://github.com/dss99911/keychain-fingerprint)

## Related

For an alternative approach using root permissions instead of Touch ID, see: [How to always allow Mac keychain password only by specific app](https://dss99911.github.io/tools/mac/2025/01/15/access-keychain-by-specific-service.html)
