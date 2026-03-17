---
layout: post
title: Jekyll Variables Usage - Site, Page, and Custom Variables
date: 2023-12-04 04:05:37 +0900
categories: [tools, jekyll]
description: "Complete guide to using Jekyll variables including site variables from _config.yml, page variables from front matter, and custom variables. Essential for Jekyll template development."
tags: [Jekyll, Variables, Liquid, Template, Front Matter]
page_variable: "some_page_variable"
pages: site.categories
image: /assets/images/posts/thumbnails/2023-12-04-jekyll-variables.png
---

Jekyll provides powerful variable access through Liquid templating. Understanding these variables is essential for customizing your Jekyll site. Variables in Jekyll come from three main sources: site-level configuration, page-level front matter, and built-in system variables.

## Site Variables
It's from `_config.yml`

- title: {{ site.title }}
- pages.size: {{ site.pages.size }}
- posts.size: {{ site.posts.size }}
- site.categories.Obsidian.size: {{ pages }}
- site.categories.Jekyll.size: {{ site.categories.Jekyll.size }}
    - titles, excerpt
        {% for j in site.categories.Jekyll %}
        - {{ j.title }}
            - {{ j.excerpt }}
        {% endfor %}

- site.data.navigation: {{ site.data.navigation }}
    {% for item in site.data.navigation %}
    - <a href="{{ item.link }}" {% if page.url == item.link %}style="color: red;"{% endif %}>{{ item.name }}</a>
    {% endfor %}

### Key Site Variables Reference

| Variable | Description |
|----------|-------------|
| `site.title` | Site title from `_config.yml` |
| `site.url` | Base URL of the site |
| `site.baseurl` | Subpath of the site (e.g., `/blog`) |
| `site.posts` | All posts in reverse chronological order |
| `site.pages` | All pages |
| `site.categories` | Posts grouped by category |
| `site.tags` | Posts grouped by tag |
| `site.data` | Data loaded from YAML files in `_data/` |
| `site.time` | Time when the site was built |
| `site.static_files` | All static files (non-processed files) |

Any custom variable you add to `_config.yml` is also accessible via `site.variable_name`. For example, if you add `author: John` to your config, you can access it with `{% raw %}{{ site.author }}{% endraw %}`.

### Working with site.data

The `_data/` directory allows you to store structured data in YAML, JSON, or CSV files. This is useful for navigation menus, team member lists, or any repeated data:

```yaml
# _data/navigation.yml
- name: Home
  link: /
- name: About
  link: /about/
- name: Blog
  link: /blog/
```

Access it with `site.data.navigation` (the filename without extension).

## Page Variables
- Title: {{ page.title }}
- path: {{ page.path }}
- url: {{ page.url }}
- variable: {{ page.page_variable }}
- categories: {{ page.categories }}

### Key Page Variables Reference

| Variable | Description |
|----------|-------------|
| `page.title` | Title from front matter |
| `page.date` | Date assigned to the post |
| `page.url` | URL of the post without the domain |
| `page.path` | Path to the raw post file |
| `page.categories` | Categories the post belongs to |
| `page.tags` | Tags assigned to the post |
| `page.content` | Content of the page (rendered) |
| `page.excerpt` | First paragraph of the post |
| `page.id` | Unique identifier for the post |
| `page.next` | Next post in chronological order |
| `page.previous` | Previous post in chronological order |

### Custom Front Matter Variables

Any variable you define in the front matter is accessible through `page.variable_name`:

```yaml
---
layout: post
title: My Post
author: John
sidebar: true
custom_css: special-page
---
```

You can then use these in your templates:

{% raw %}
```liquid
{% if page.sidebar %}
  {% include sidebar.html %}
{% endif %}

{% if page.custom_css %}
  <link rel="stylesheet" href="/assets/css/{{ page.custom_css }}.css">
{% endif %}
```
{% endraw %}

## Layout Variables

When working inside a layout file, you can access the `layout` object:

{% raw %}
```liquid
{{ layout.title }}
```
{% endraw %}

Layout variables come from the front matter of the layout file itself.

## Content Variable

The `content` variable is special and only available in layout files. It contains the rendered content of the page that uses the layout:

{% raw %}
```html
<!-- _layouts/post.html -->
<article>
  <h1>{{ page.title }}</h1>
  {{ content }}
</article>
```
{% endraw %}

## Paginator Variables

If you use the `jekyll-paginate` plugin, the `paginator` object provides pagination variables:

| Variable | Description |
|----------|-------------|
| `paginator.page` | Current page number |
| `paginator.total_pages` | Total number of pages |
| `paginator.posts` | Posts on the current page |
| `paginator.previous_page` | Previous page number |
| `paginator.next_page` | Next page number |

## Practical Tips

1. **Debug with jsonify**: To inspect what data is available, use the `jsonify` filter: `{% raw %}{{ site.data.navigation | jsonify }}{% endraw %}`
2. **Check for nil**: Always use default values or nil checks to prevent rendering issues: `{% raw %}{{ page.author | default: site.author }}{% endraw %}`
3. **Performance**: Avoid iterating over `site.posts` in frequently rendered includes, as it can slow down build times on large sites. Use `limit` when possible.
4. **Environment variable**: Use `jekyll.environment` to conditionally include scripts (like analytics) only in production: `{% raw %}{% if jekyll.environment == "production" %}{% endraw %}`