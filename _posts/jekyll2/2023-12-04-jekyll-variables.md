---
layout: post
title: Jekyll Variables Usage
date: 2023-12-04 04:05:37 +0900
categories: jekyll
page_variable: "some_page_variable"
pages: site.categories
---

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

## Page Variables
- Title: {{ page.title }}
- path: {{ page.path }}
- url: {{ page.url }}
- variable: {{ page.page_variable }}
- categories: {{ page.categories }}