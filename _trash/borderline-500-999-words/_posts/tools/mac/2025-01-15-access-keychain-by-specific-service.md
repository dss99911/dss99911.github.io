---
layout: post
title: How to always allow Mac keychain password only by specific app
date: 2025-01-15 01:57:37 +0900
categories: [tools, mac]
redirect_from:
  - /tools/mac/2025/01/09/access-keychain-by-specific-service.html
tags: [mac, macos, keychain, security, password]
image: /assets/images/posts/thumbnails/2025-01-15-access-keychain-by-specific-service.png
---

# How to always allow Mac keychain password only by specific app

## Background
normally, we use the script below to fetch the password from keychain.
```shell
security find-generic-password -a "$account" -s "$service" -w
```
when we execute the code, Mac ask to input the password and if we don't want to input the password every time, Mac ask us to allow 'security' to get the permission to access the password.
but, any script can invoke the 'security' to access the password even the hacking script.
so, the meaning to grant the permission to 'security' is that anyone can access the permission.

for preventing the security issue,
we can do the 2 way below
1. input the password whenever the password is required.
2. allow only the granted app can access the password

this is about the option 2.

## Why This Matters

The macOS Keychain is the primary credential storage system on Mac. It stores passwords, API keys, certificates, and other sensitive data. When you grant the `security` command-line tool "Always Allow" access, you are essentially opening that password to any process running on your Mac, because any script or program can invoke `security find-generic-password`.

This is a significant security risk, especially if you store:
- API keys for cloud services (AWS, GCP, etc.)
- Database credentials
- SSH keys or tokens
- Third-party service passwords

By creating a dedicated app with restricted permissions, you add an additional layer of security that prevents unauthorized access.

## Method

### 1. Create new app
as anyone can access the 'security' app.
I suggest to create the new Mac app by building commandline tool with Xcode with [the source code](https://github.com/dss99911/dss99911.github.io/blob/main/etc/keychain_reader.swift)

Here is how to build it:

1. Open Xcode and create a new project
2. Select "macOS" > "Command Line Tool"
3. Name it `keychain_reader`
4. Replace the contents of `main.swift` with the source code from the link above
5. Build the project (Cmd+B)
6. Find the compiled binary in the Products folder (right-click > Show in Finder)

The source code uses the macOS Security framework to directly access the Keychain, bypassing the generic `security` command. This means when you grant access in Keychain, it will be specifically tied to your compiled binary.

### 2. change the permission
the app checks if it's invoked with root permission or not.
but, as the hacker can modify the app, change the permission for the app by the below. for doing it, you need root permission.
```
sudo chmod 700 keychain_reader
sudo chown root keychain_reader
```

This does two important things:
- `chmod 700`: Only the owner (root) can read, write, or execute the file. No other user or group can access it.
- `chown root`: Changes the file owner to root, so only root-privileged processes can execute it.

Even if a malicious script knows the path to `keychain_reader`, it cannot execute it without root privileges.

### 3. allow the keychain_reader to access the password
invoke the below, and allow the keychain_reader to access the password always.
now, only the person or service who have root permission can access the password
```shell
sudo ./keychain_reader <account_name> <service_name>
```

When you run this for the first time, macOS will show a Keychain access prompt. Click "Always Allow" to grant permanent access to the `keychain_reader` binary. Since the binary is owned by root with 700 permissions, this "Always Allow" is now restricted to root-only execution.

## Using in Scripts

Once set up, you can use the keychain reader in your automation scripts:

```bash
#!/bin/bash
# Example: Fetch an API key securely
API_KEY=$(sudo /path/to/keychain_reader my-account my-service)
curl -H "Authorization: Bearer $API_KEY" https://api.example.com/data
```

## Verifying Access Control

You can verify the access control settings in Keychain Access app:

1. Open Keychain Access (Applications > Utilities)
2. Find your password entry
3. Right-click > Get Info > Access Control tab
4. You should see `keychain_reader` listed under "Always allow access by these applications"
5. The `security` command should NOT be listed

## Alternative Approaches

If building a custom app feels too complex, there are other ways to improve Keychain security:

- **Always require password**: Never click "Always Allow" for the `security` command. This is the simplest but most inconvenient option.
- **Use separate Keychains**: Create a separate Keychain for sensitive credentials and lock it separately from the login Keychain.
- **Environment variables**: For less sensitive data, consider using environment variables stored in a restricted file instead of Keychain.

The custom app approach described in this guide offers the best balance of security and convenience.
