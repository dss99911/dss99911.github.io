---
layout: post
title: Jekyll Theme Usage - How to Find and Change Themes
date: 2023-12-04 04:05:37 +0900
categories: [tools, jekyll]
description: "Learn how to find Jekyll theme files, customize themes, and change themes in your Jekyll site. Complete guide for Minima and other popular themes."
tags: [Jekyll, Theme, Minima, Customization, Web Design]
image: /assets/images/posts/thumbnails/2023-12-04-jekyll-theme.png
---

Jekyll themes control the look and feel of your website. This guide explains how to locate theme files, customize your Jekyll site's appearance, and switch between themes. Understanding how themes work is fundamental to building a polished Jekyll site that matches your brand or personal style.

## How Jekyll Themes Work

Jekyll themes are packaged as Ruby gems. When you install a theme, it provides default layouts, includes, stylesheets, and assets. Your project files take precedence over theme files, which means you can selectively override any part of the theme without modifying the original gem.

The typical theme structure includes:
- `_layouts/` - Page layout templates (default.html, post.html, page.html)
- `_includes/` - Reusable HTML snippets (header.html, footer.html, head.html)
- `_sass/` - SCSS/Sass stylesheets
- `assets/` - Static files like CSS, JavaScript, and images

## Finding Theme Files

When you want to customize a theme, you first need to find where the theme files are located.

### Locate the theme directory
```bash
bundle info --path minima
```

This command shows the path to the theme files. You can copy files from this directory to your project to override them.

To explore the full structure of a theme:
```bash
ls -la $(bundle info --path minima)
tree $(bundle info --path minima)
```

This helps you understand which files are available for customization and how the theme is organized.

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

Remote themes are particularly useful for GitHub Pages, as they allow you to use themes hosted on GitHub without installing them as gems locally. You will also need the `jekyll-remote-theme` plugin:

```yaml
plugins:
  - jekyll-remote-theme
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

### Important: Check Layout Compatibility

When switching themes, be aware that different themes may use different layout names. For example, one theme might use `post` while another uses `single`. If your posts reference a layout that doesn't exist in the new theme, Jekyll will fall back to the `default` layout or show no layout at all. Check your front matter and update layout names accordingly.

## Popular Jekyll Themes

- **Minima**: Default Jekyll theme, clean and simple
- **Minimal Mistakes**: Feature-rich, great for blogs and portfolios
- **Just the Docs**: Perfect for documentation sites
- **Chirpy**: Modern blog theme with dark mode
- **Beautiful Jekyll**: Easy to set up, ideal for personal blogs
- **Hyde**: A brazen two-column Jekyll theme
- **Architect**: Clean theme for project pages

You can browse more themes at:
- [jamstackthemes.dev](https://jamstackthemes.dev/ssg/jekyll/)
- [jekyllthemes.org](http://jekyllthemes.org/)
- [jekyllthemes.io](https://jekyllthemes.io/)

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

### Customizing Styles

To override theme styles without modifying the original SCSS files, create a file at `assets/css/style.scss`:

```scss
---
---
@import "minima";  // Import the original theme styles

// Add your custom styles below
.site-header {
  background-color: #2c3e50;
}

.post-title {
  color: #e74c3c;
}
```

This approach ensures your customizations are applied on top of the theme defaults, making it easy to update the theme later without losing your changes.

### Creating Custom Layouts

You can create entirely new layouts by adding files to the `_layouts/` directory:

```html
---
layout: default
---
<article class="custom-post">
  <h1>{{ page.title }}</h1>
  <div class="meta">{{ page.date | date: "%B %d, %Y" }}</div>
  <div class="content">{{ content }}</div>
</article>
```

Then reference it in your post's front matter:
```yaml
---
layout: custom-post
---
```

## Tips for Theme Management

1. **Version pinning**: Specify exact theme versions in your Gemfile to avoid unexpected changes when updating.
2. **Override minimally**: Only copy the files you need to modify. This makes theme updates easier.
3. **Test locally**: Always run `bundle exec jekyll serve` to preview changes before deploying.
4. **Keep a backup**: Before switching themes, commit your current state to git so you can easily revert.

## Reference
- [Jekyll Themes Documentation](https://jekyllrb.com/docs/themes/)
- [GitHub Pages Supported Themes](https://pages.github.com/themes/)
