---
layout: post
title: Jekyll with SEO
date: 2023-12-05 01:57:37 +0900
categories: jekyll
page_variable: "some_page_variable"
pages: site.categories
---


# Jekyll reflect SEO


## 1. Use [`jekyll-seo-tag` plugin](https://github.com/jekyll/jekyll-seo-tag)

### [Install](https://github.com/jekyll/jekyll-seo-tag/blob/master/docs/installation.md)
add `gem 'jekyll-seo-tag'` to `Gemfile`

add the below to `_config.yml`
```
plugins:
  - jekyll-seo-tag

```




## 2. Use `jekyll-sitemap` plugin

add `gem 'jekyll-sitemap'` to `Gemfile`

add the below to `_config.yml`
```
plugins:
  - jekyll-sitemap
```

## 3. robots.txt

allow all pages for search robots to search
and teach where the sitemap is
```
user-agent: *
allow: /

Sitemap: https://dss99911.github.io/sitemap.xml

```


## 4. site_verification

### google site verification
if you already integrated google analytics
you can just register your domain on [search console](https://search.google.com/search-console)

if not, perform the below
<Describe how to do it>

### naver site verification

https://searchadvisor.naver.com/console/board



## 3. Meta tag

add the below to _config.xml

- title
- tagline: short description
- description: longer description. if no description on page, this site.description is used
- locale


add the below to each page's front matter

- title
- description: for search engine to know what information in the page
- locale: if the locale is different with site.locale


## 4. Contents
use header tag properly. don't use header too much

easy url


## 5. Site Checking

https://searchadvisor.naver.com/tools/sitecheck


## Reference
- https://github.com/jekyll/jekyll-seo-tag
