---
layout: post
title: Jekyll Liquid Usage - Complete Template Syntax Guide
date: 2023-12-04 04:05:37 +0900
categories: [tools, jekyll]
description: "Master Jekyll Liquid templating with this comprehensive guide. Learn tags, filters, conditionals, loops, includes, and linking techniques for Jekyll sites."
tags: [Jekyll, Liquid, Template, Syntax, Tutorial]
functions_page: _posts/tools/jekyll/2023-12-05-jekyll-seo.md
has_variable: "true"
---

Liquid is the templating language used by Jekyll. This guide covers the essential Liquid syntax for building dynamic Jekyll sites.

## Reference
- https://jekyllrb.com/docs/step-by-step/02-liquid/



## Tags
- https://jekyllrb.com/docs/liquid/tags/

 %-: remove empty space on the tag
{%- if page.has_variable -%} 
  no empty space
{%- endif -%}

<br/>
%: empty space on the tag
{% if page.has_variable %} 
  no empty space
{% endif %}

### syntax highlight

{% highlight ruby %}
def foo
  puts 'foo'
end
{% endhighlight %}

{% highlight python %}
def foo():
  print('foo')

{% endhighlight %}
### [Link](https://jekyllrb.com/docs/liquid/tags/#link)
- [Link by Tag]({% link _posts/tools/jekyll/2023-12-05-jekyll-seo.md %}): provides link validation on build time. if front matter not exists, the error below occurs.
  - Liquid Exception: Could not find document '_posts/tools/jekyll/2023-12-05-jekyll-seo.md' in tag 'link'. Make sure the document exists and the path is correct. in /github/workspace/_posts/tools/jekyll/2023-12-04-jekyll-liquid.md
- [Link by variables] % link {{ page.functions_page }} %: this way is not supported on Github Pages.
- [Link by post_url]({% post_url 2023-12-03-Free Synchronization of Obsidian Notes Between Desktop and Android Devices %}): able to access other directory's post with post name


### [Filter](https://jekyllrb.com/docs/liquid/filters/)

- {{ "capitalize" | capitalize }}
- {{ page.no_variable | default: "default value" }}
- {{ page.date | date_to_string }}

### if
{% if page.has_variable %} page variable {% endif %}

### for
{% for j in site.categories.Jekyll %}
- {{ j.title }}
{% endfor %}

### include
{% include navigation.html %}