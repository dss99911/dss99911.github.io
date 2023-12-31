---
layout: post
title:  "Migrating Notes from Evernote to Obsidian Using a Script"
date:   2023-12-03 21:05:37 +0900
categories: obsidian
description: Easily migrate notes from Evernote to Obsidian using a script. Learn to backup notes to ENEX and convert to Markdown. Simplify your note-taking journey today!
---

In this blog post, we will walk through the process of migrating all your notes from Evernote to Obsidian using a script. This process involves two main steps: backing up all notes to an ENEX file and then converting these files to Markdown for use in Obsidian.

## Backing Up Evernote Notes to an ENEX File

The first step is to back up all your Evernote notes to an ENEX file. For this, we will use a tool available on GitHub called [evernote-backup](https://github.com/vzhd1701/evernote-backup).

Please note that you will need to sign in with your credentials for the backup. The source code does not save or upload your password. Instead, it keeps the authentication token on a local SQLite database. If you have concerns about the package, you can run it by source code.

Here is the code for exporting the ENEX files:

```bash
evernote-backup init-db  # sign-in to your evernote account.
# evernote-backup init-db --oauth  # sign-in with oauth of google or apple account.
evernote-backup sync  # download all notes to sqlite db file
evernote-backup export output_dir/  # export db file to enext files on output_dir
```

## Converting ENEX Files to Markdown
> **Note:**
> This script has been tested on Mac. If you're using a different operating system, you may need to adjust the script for the same purpose.

(This script has been tested on Mac. If you're using a different operating system, you may need to adjust the script for the same purpose.)

Obsidian uses Markdown, so we need to convert the ENEX files to Markdown. For this, we will use another tool available on GitHub called [evernote2md](https://github.com/wormi4ok/evernote2md).

However, please note that this tool does not support folders recursively. Therefore, we need to use the command below for converting the directory recursively:

```bash
# convert enex on 'output_dir' directory to 'md_output_dir'
find output_dir -type f -name "*.enex" -exec bash -c 'evernote2md -t \#{{tag}} "$0" "md_${0%.enex}"' {} \;
```

## Converting images files without file name
there are many image files like '.png', '.jpg' without file name after using evernote2md.
and the image file without file name is not recognized by Obsidian.
so, need to add file name to those image files.


```bash
# change file name
DIR=md_output_dir
find $DIR -type f \( -name ".png" -o -name ".jpg" -o -name ".gif" \) -exec bash -c 'mv "$0" "${0%.*}no-name-image.${0##*.}"' {} \;

# change links on markdown files.
LC_ALL=C find $DIR -type f -exec sed -i '' 's/(image\/.png)/(image\/no-name-image.png)/g' {} \;
LC_ALL=C find $DIR -type f -exec sed -i '' 's/(image\/.jpg)/(image\/no-name-image.jpg)/g' {} \;
LC_ALL=C find $DIR -type f -exec sed -i '' 's/(image\/.gif)/(image\/no-name-image.gif)/g' {} \;
```

## Full Script
```bash
# install the packages
brew install evernote-backup
brew install evernote2md

evernote-backup init-db  # sign-in to your evernote account.
# evernote-backup init-db --oauth  # sign-in with oauth of google or apple account.
evernote-backup sync  # download all notes to sqlite db file
evernote-backup export output_dir/  # export db file to enext files on output_dir

# convert enex on 'output_dir' directory to 'md_output_dir'
find output_dir -type f -name "*.enex" -exec bash -c 'evernote2md -t \#{{tag}} $0 "md_${0%.enex}"' {} \;

# change file name
DIR=md_output_dir
find $DIR -type f \( -name ".png" -o -name ".jpg" -o -name ".gif" \) -exec bash -c 'mv "$0" "${0%.*}no-name-image.${0##*.}"' {} \;

# change links on markdown files.
LC_ALL=C find $DIR -type f -exec sed -i '' 's/(image\/.png)/(image\/no-name-image.png)/g' {} \;
LC_ALL=C find $DIR -type f -exec sed -i '' 's/(image\/.jpg)/(image\/no-name-image.jpg)/g' {} \;
LC_ALL=C find $DIR -type f -exec sed -i '' 's/(image\/.gif)/(image\/no-name-image.gif)/g' {} \;

```


And that’s it! You have now successfully migrated all your notes from Evernote to Obsidian using a script. Happy note-taking!