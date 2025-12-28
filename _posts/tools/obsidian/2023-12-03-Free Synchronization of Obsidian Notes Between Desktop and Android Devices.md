---
layout: post
title:  "Free Synchronization of Obsidian Notes Between Desktop and Android Devices"
date:   2023-12-03 21:05:37 +0900
categories: [tools, obsidian]
description: "Explore free sync solutions for Obsidian notes across desktop and Android devices. Compare Autosync, Syncthing, and Git options with pros and cons."
tags: [Obsidian, Sync, Android, Syncthing, Git, Free]
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


## Git by Termux
[Setting guide](https://gist.github.com/Makeshift/43c7ecb3f1c28a623ea4386552712114)

**Pros:**
- Same way with desktop
- able to backup when desktop is not available

**Cons:**
- Complicated setup
- Periodic push, pull occurs. it'll spend much battery. 
- push, pull by shortcut on homescreen: we should touch the shortcut every time the note changed.
- seems heavy.

**Opinion:**
- If [Obsidian git](https://github.com/denolehov/obsidian-git#mobile) provides the function on Android with push function on file changes, and share the option with desktop. we can consider to use git. but, otherwise, I prefer Syncthing.

## Auto Sync Plan

Android device <-> Desktop -> Github

- for synchronization between Android and Desktop, use Syncthing.
- for backing-up the notes, use [Obsidian Git](https://github.com/denolehov/obsidian-git)


## Handling Sync Errors

When using these notes on Android, be aware that the Android file system does not support certain special characters in file names. These include /, <, >, *, ", :, ?, , and |. You can remove these characters using the following command:

```bash
DIR=md_output_dir

find $DIR -type f -name "*[:/<>|*?\\\\"'"'"]*" -exec bash -c 'mv -i ${0} $(echo ${0} | tr '"'"':<>*?|\\"'"'"' "_")' {} \;
```

And that’s it! You now have two free options for synchronizing your Obsidian notes between your desktop and Android device. Happy note-taking!