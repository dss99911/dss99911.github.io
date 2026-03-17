---
layout: post
title:  "How to Develop an Obsidian Plugin - Getting Started Guide"
date:   2023-12-09 21:05:37 +0900
categories: [tools, obsidian]
description: "Step-by-step guide to developing Obsidian plugins. Learn how to set up your development environment, install the sample plugin, and debug using Chrome developer tools."
tags: [Obsidian, Plugin Development, JavaScript, TypeScript, Node.js]
image: /assets/images/posts/thumbnails/2023-12-09-develop-obsidian-plugin.png
redirect_from:
  - /tools/obsidian/2023/12/06/Develop-Obsidian-Plugin.html
---

# Develop Obsidian Plugin
https://docs.obsidian.md/Home

This is based on the [sample plugin](https://github.com/obsidianmd/obsidian-sample-plugin)

Obsidian plugins allow you to extend the functionality of Obsidian with custom features. Plugins are written in TypeScript/JavaScript and compiled using esbuild. Whether you want to automate workflows, add new UI elements, or integrate with external services, the plugin API gives you full access to the Obsidian ecosystem.

## Prerequisites

Before getting started, you should be familiar with:
- Basic TypeScript or JavaScript
- Node.js and npm
- How Obsidian vaults and files work

## Setup

```
# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# install npm, node
nvm install --lts

# install esbuild
npm install esbuild
```

After installing these tools, verify your setup:
```bash
node --version   # Should show v18+ or v20+
npm --version    # Should show 9+
```

## install sample plugin on Obsidian

### download obsidian sample plugin
```shell
VAULT_PATH="{your-vault-path}"
git clone https://github.com/obsidianmd/obsidian-sample-plugin.git
mv obsidian-sample-plugin $VAULT_PATH/.obsidian/plugins/obsidian-sample-plugin

cd $VAULT_PATH/.obsidian/plugins/obsidian-sample-plugin
```

### Install dependencies
```shell
npm install
```

### run dev
```shell
npm run dev
```

This starts esbuild in watch mode. Every time you save a file, the plugin is automatically recompiled. You need to reload Obsidian (or disable and re-enable the plugin) to see the changes.

### enable the plugin on Obsidian setting

1. Open Obsidian Settings (Cmd+, on macOS)
2. Go to "Community plugins"
3. If prompted, click "Turn on community plugins"
4. Find "Sample Plugin" in the list and toggle it on

If the plugin does not appear, make sure the plugin folder contains `manifest.json`, `main.js`, and `styles.css` files.

### Debugging
> Since Obsidian is an Electron app, you can use the Chromium developer tools to view an in-app console.

- `Cmd + Opt+ I` on macOS
- `Ctrl + Shift + I` on Windows or Linux.

The developer console is essential for plugin development. You can:
- View `console.log()` output from your plugin
- Inspect DOM elements to understand Obsidian's UI structure
- Debug JavaScript errors with stack traces
- Monitor network requests if your plugin calls external APIs

### Hot Reload Plugin

For a better development experience, install the [Hot Reload](https://github.com/pjeby/hot-reload) plugin. With Hot Reload enabled, Obsidian automatically reloads your plugin whenever `main.js` changes, eliminating the need to manually disable and re-enable the plugin.

## Key Plugin Concepts

### Plugin Lifecycle

Every Obsidian plugin has two main lifecycle methods:

```typescript
export default class MyPlugin extends Plugin {
  async onload() {
    // Called when the plugin is enabled
    // Register commands, add UI elements, set up event listeners
  }

  onunload() {
    // Called when the plugin is disabled
    // Clean up resources, remove event listeners
  }
}
```

### Common API Features

| Feature | API | Description |
|---------|-----|-------------|
| Commands | `this.addCommand()` | Add commands to the command palette |
| Settings | `this.addSettingTab()` | Add a settings tab for user configuration |
| Ribbon icons | `this.addRibbonIcon()` | Add an icon to the left sidebar |
| Status bar | `this.addStatusBarItem()` | Add text to the bottom status bar |
| Events | `this.registerEvent()` | Listen for vault events (file create, modify, delete) |
| Views | `this.registerView()` | Create custom panes/views |
| Markdown processing | `this.registerMarkdownPostProcessor()` | Transform rendered markdown |

### Example: Adding a Command

```typescript
this.addCommand({
  id: 'my-command',
  name: 'My Custom Command',
  callback: () => {
    new Notice('Hello from my plugin!');
  }
});
```

### Example: Adding Settings

```typescript
class MySettingTab extends PluginSettingTab {
  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('My Setting')
      .setDesc('Description of the setting')
      .addText(text => text
        .setPlaceholder('Enter value')
        .setValue(this.plugin.settings.mySetting)
        .onChange(async (value) => {
          this.plugin.settings.mySetting = value;
          await this.plugin.saveSettings();
        }));
  }
}
```

## Publishing Your Plugin

When your plugin is ready to share:

1. Create a GitHub repository for your plugin
2. Add a `manifest.json` with your plugin metadata (id, name, version, minAppVersion)
3. Create a release with `main.js`, `manifest.json`, and optionally `styles.css`
4. Submit a pull request to the [obsidian-releases](https://github.com/obsidianmd/obsidian-releases) repository

## Mobile
https://docs.obsidian.md/Plugins/Getting+started/Mobile+development

Mobile development requires additional considerations:
- File system access may differ between desktop and mobile
- Some Node.js APIs are not available on mobile
- Touch interactions need special handling
- Test on actual mobile devices, not just the desktop app