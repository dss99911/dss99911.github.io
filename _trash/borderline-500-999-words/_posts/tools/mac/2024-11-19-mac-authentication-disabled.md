---
layout: post
title: How to fix the "Authentication is disabled" error?
date: 2024-11-19 01:57:37 +0900
categories: [tools, mac]
tags: [mac, macos, authentication, securetoken, troubleshooting]
image: /assets/images/posts/thumbnails/2024-11-19-mac-authentication-disabled.png
---

## What is the "Authentication is disabled" Error?

This error typically appears when trying to install macOS software updates. The full message usually reads something like: "softwareupdate is trying to authenticate user. Authentication is disabled." This happens when the secure token associated with your user account becomes corrupted or misconfigured, preventing the system from authenticating your credentials during the update process.

The error is particularly common after:
- Major macOS upgrades
- Migrating a user account from another Mac
- Changes to FileVault encryption settings
- Password resets or account modifications by MDM (Mobile Device Management) solutions
- Creating new admin accounts or modifying existing ones

## Understanding Secure Token

Secure Token is a macOS security feature introduced in macOS High Sierra. It is a per-user attribute that grants the ability to perform certain security-sensitive operations, including:

- Enabling FileVault disk encryption
- Installing macOS software updates
- Managing kernel extensions
- Approving system extensions

When the secure token becomes corrupted, macOS cannot verify your identity for these operations, resulting in the "Authentication is disabled" error.

## Solution
This worked for me. After executing the commands below, reboot your Mac.

```shell
# Check if your account has securetoken enabled (it probably does)
sysadminctl -secureTokenStatus <username>

# Disable it then reenable it
sysadminctl -secureTokenOff <username> -password - -adminUser <adminusername> -adminPassword -
sysadminctl -secureTokenOn <username> -password - -adminUser <adminusername> -adminPassword -

# Update the preboot volume
diskutil apfs UpdatePreboot /
```

### Step-by-Step Explanation

1. **Check secure token status**: The first command verifies whether your account currently has a secure token. The output will show `ENABLED` or `DISABLED`.

2. **Disable secure token**: The `-password -` flag prompts you to enter the password interactively. Replace `<username>` with the affected user and `<adminusername>` with an admin account that has a valid secure token.

3. **Re-enable secure token**: This creates a fresh secure token for the account, replacing the potentially corrupted one.

4. **Update preboot volume**: The `diskutil apfs UpdatePreboot /` command refreshes the preboot volume, which stores the boot-time authentication information. This ensures the system recognizes the new token on the next boot.

5. **Reboot**: After completing these steps, restart your Mac for the changes to take effect.

## Troubleshooting

### If sysadminctl fails
If you get a permission error, make sure you are running the commands from an admin account. You may need to use `sudo`:

```shell
sudo sysadminctl -secureTokenStatus <username>
```

### If no admin user has a valid secure token
In rare cases, no user account may have a valid secure token. In this situation:

1. Boot into Recovery Mode (hold Cmd+R on Intel Macs, or press and hold the power button on Apple Silicon Macs)
2. Open Terminal from the Utilities menu
3. Reset the password using `resetpassword` command
4. Boot normally and retry the secure token commands

### If the issue persists after reboot
- Try running `diskutil apfs UpdatePreboot /` again
- Check the system log for related errors: `log show --predicate 'subsystem == "com.apple.opendirectoryd"' --last 1h`
- Consider creating a new admin account and transferring your data

## Preventing Future Issues

- Keep macOS updated to the latest version
- Avoid manually modifying user accounts through Terminal unless necessary
- If using FileVault, ensure at least one admin account always has a valid secure token
- Before making changes to admin accounts, verify secure token status first

## Reference
- https://community.jamf.com/t5/jamf-pro/softwareupdate-is-trying-to-authenticate-user-authentication-is/m-p/245357
- [Apple Support - About Secure Token](https://support.apple.com/guide/deployment/use-secure-and-bootstrap-tokens-dep24dbdcf9e/web)