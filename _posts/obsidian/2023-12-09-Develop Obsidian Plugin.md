---
layout: post
title:  "Develop Obsidian Plugin"
date:   2023-12-06 21:05:37 +0900
categories: obsidian
description: Describe how to develop obsidian plugin 
---

# Develop Obsidian Plugin
https://docs.obsidian.md/Home

This is based on the [sample plugin](https://github.com/obsidianmd/obsidian-sample-plugin)

## Setup

```
# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# install npm, node
nvm install --lts

# install esbuild
npm install esbuild
```

## install sample plugin on Obsidian

### download obsidian sample plugin
```shell
VAULT_PATH="{your-vault-path}"
git clone https://github.com/obsidianmd/obsidian-sample-plugin.git
mv obsidian-sample-plugin $VAULT_PATH/.obsidian/plugins/obsidian-sample-plugin

cd $VAULT_PATH/.obsidian/plugins/obsidian-sample-plugin
```

### run dev
```shell
npm run dev
```

### enable the plugin on Obsidian setting


### Debugging
> Since Obsidian is an Electron app, you can use the Chromium developer tools to view an in-app console.

- `Cmd + Opt+ I` on macOS
- `Ctrl + Shift + I` on Windows or Linux.


## Mobile
https://docs.obsidian.md/Plugins/Getting+started/Mobile+development