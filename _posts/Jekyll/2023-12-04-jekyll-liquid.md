---
layout: post
title: Jekyll Liquid Usage
date: 2023-12-04 04:05:37 +0900
categories: Jekyll
functions_page: _posts/Jekyll/2023-12-04-jekyll-functions.md
has_variable: "true"
---

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
- [Link by Tag]({% link _posts/Jekyll/2023-12-04-jekyll-functions.md %}): this can be used only for the blog. but, provide link validation on building time.
- [Link by variables]({% link {{ page.functions_page }} %})
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