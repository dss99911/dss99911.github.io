---
layout: post
title: How to always allow Mac keychain password only by specific app 
date: 2025-01-09 01:57:37 +0900
categories: miscellanea
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

## Method

### 1. Create new app
as anyone can access the 'security' app.
I suggest to create the new Mac app by building commandline tool with Xcode with [the source code](https://github.com/dss99911/dss99911.github.io/blob/main/etc/keychain_reader.swift)

### 2. change the permission
the app checks if it's invoked with root permission or not.
but, as the hacker can modify the app, change the permission for the app by the below. for doing it, you need root permission.
```
sudo chmod 700 keychain_reader
sudo chown root keychain_reader
```

### 3. allow the keychain_reader to access the password
invoke the below, and allow the keychain_reader to access the password always.
now, only the person or service who have root permission can access the password
```shell
sudo ./keychain_reader <account_name> <service_name>
```
