---
layout: post
title: Jekyll Theme Usage - How to Find and Change Themes
date: 2023-12-04 04:05:37 +0900
categories: jekyll
description: "Learn how to find Jekyll theme files, customize themes, and change themes in your Jekyll site. Complete guide for Minima and other popular themes."
tags: [Jekyll, Theme, Minima, Customization, Web Design]
---

Jekyll themes control the look and feel of your website. This guide explains how to locate theme files and customize your Jekyll site's appearance.

## Finding Theme Files

When you want to customize a theme, you first need to find where the theme files are located.

### Locate the theme directory
```bash
bundle info --path minima
```

This command shows the path to the theme files. You can copy files from this directory to your project to override them.

## Changing Themes

### Method 1: Change in _config.yml

Edit your `_config.yml` file to change the theme:

```yaml
theme: minima
```

For remote themes (from GitHub):

```yaml
remote_theme: owner/repository
```

### Method 2: Install a New Gem Theme

1. Add the theme to your `Gemfile`:
```ruby
gem "jekyll-theme-minimal"
```

2. Run bundle install:
```bash
bundle install
```

3. Update `_config.yml`:
```yaml
theme: jekyll-theme-minimal
```

## Popular Jekyll Themes

- **Minima**: Default Jekyll theme, clean and simple
- **Minimal Mistakes**: Feature-rich, great for blogs and portfolios
- **Just the Docs**: Perfect for documentation sites
- **Chirpy**: Modern blog theme with dark mode

## Customizing Theme Layouts

To override a theme file:

1. Find the original file path using `bundle info --path`
2. Create the same directory structure in your project
3. Copy and modify the file

For example, to customize the header:
```bash
mkdir -p _includes
cp $(bundle info --path minima)/_includes/header.html _includes/
```

## Reference
- [Jekyll Themes Documentation](https://jekyllrb.com/docs/themes/)
- [GitHub Pages Supported Themes](https://pages.github.com/themes/)
