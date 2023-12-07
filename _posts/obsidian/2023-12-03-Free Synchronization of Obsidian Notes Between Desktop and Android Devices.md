---
layout: post
title:  "Free Synchronization of Obsidian Notes Between Desktop and Android Devices"
date:   2023-12-03 21:05:37 +0900
categories: obsidian
description: Explore free sync solutions for Obsidian notes across desktop and Android devices. Learn about Autosync, Syncthing.
---

In this blog post, we will explore how to synchronize Obsidian notes between your desktop and Android device for free. While Mac and iPhone users can easily sync their note files using iCloud, and Obsidian Pro users have built-in sync functionality, Android users need a different solution.

## Autosync for Google Drive

One option is to use [Autosync for Google Drive](https://play.google.com/store/apps/details?id=com.ttxapps.drivesync&hl=en_US). This app syncs note files on Google Drive and keeps your Android device and Google Drive files in sync. On your laptop, you can use [Google Drive for Desktop](https://www.google.com/drive/download/) to access your files.

**Pros:**

- Easy to use

**Cons:**

- Does not sync files immediately when changes occur
- Only one directory can be set in the free version
- Requests access to all files on your Google Drive
- Contains ads in the free version

## Syncthing

Another option is [Syncthing](https://syncthing.net/), which synchronizes note files between your Android device and desktop without using the cloud. You need to install the application on both your Android device and desktop. If you’re concerned about losing your notes, you can use a cloud service that supports synchronization with your device, like [Google Drive for Desktop](https://www.google.com/drive/download/), or the [Obsidian Git plugin](https://github.com/denolehov/obsidian-git).

**Pros:**

- Saves files directly when changes occur
- No dependency on the cloud
- Supports file versioning
- Free and ad-free

**Cons:**
- If the network connection on both devices is not functioning, synchronization cannot take place.

## Handling Sync Errors

When using these notes on Android, be aware that the Android file system does not support certain special characters in file names. These include /, <, >, *, ", :, ?, , and |. You can remove these characters using the following command:

```bash
DIR=md_output_dir

find $DIR -type f -name "*[:/<>|*?\\\\"'"'"]*" -exec bash -c 'mv -i ${0} $(echo ${0} | tr '"'"':<>*?|\\"'"'"' "_")' {} \;
```

And that’s it! You now have two free options for synchronizing your Obsidian notes between your desktop and Android device. Happy note-taking!