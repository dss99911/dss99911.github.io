---
layout: post
title: How to fix the "Authentication is disabled" error?
date: 2024-11-19 01:57:37 +0900
categories: miscellanea
---

## Solution
This worked for me. after execute the below, reboot

```shell
#Check if your account has securetoken enabled, (it probably does)
# Disable it then reenable it.
sysadminctl -secureTokenStatus <username>
sysadminctl -secureTokenOff <username> -password - -adminUser <adminusername> -adminPassword -
sysadminctl -secureTokenOn <username> -password - -adminUser <adminusername> -adminPassword -
diskutil apfs UpdatePreboot /
```

## Reference
- https://community.jamf.com/t5/jamf-pro/softwareupdate-is-trying-to-authenticate-user-authentication-is/m-p/245357