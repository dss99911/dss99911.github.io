---
layout: post
title: Jekyll Liquid Usage - Complete Template Syntax Guide
date: 2023-12-04 04:05:37 +0900
categories: [tools, jekyll]
description: "Master Jekyll Liquid templating with this comprehensive guide. Learn tags, filters, conditionals, loops, includes, and linking techniques for Jekyll sites."
tags: [Jekyll, Liquid, Template, Syntax, Tutorial]
functions_page: _posts/tools/jekyll/2023-12-05-jekyll-seo.md
has_variable: "true"
image: /assets/images/posts/thumbnails/2023-12-04-jekyll-liquid.png
---

Liquid is the templating language used by Jekyll. This guide covers the essential Liquid syntax for building dynamic Jekyll sites. Liquid was created by Shopify and is one of the most widely used template languages in the Ruby ecosystem. Understanding Liquid is essential for anyone working with Jekyll, as it powers everything from simple variable output to complex page layouts.

## How Liquid Works

Liquid uses two types of delimiters:
- **Output tags** `{% raw %}{{ }}{% endraw %}`: Output the value of a variable or expression
- **Logic tags** `{% raw %}{% %}{% endraw %}`: Execute logic like conditionals, loops, and includes

These delimiters can be used anywhere in your Jekyll markdown or HTML files.

## Reference
- https://jekyllrb.com/docs/step-by-step/02-liquid/



## Tags
- https://jekyllrb.com/docs/liquid/tags/

{% raw %}
 %-: remove empty space on the tag
{%- if page.has_variable -%}
  no empty space
{%- endif -%}

<br/>
%: empty space on the tag
{% if page.has_variable %}
  no empty space
{% endif %}
{% endraw %}

The whitespace control with `%-` is particularly useful when generating HTML, as extra whitespace from Liquid tags can affect your page layout. Use `{%-` and `-%}` to strip leading and trailing whitespace around the tag.

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

Supported languages include `ruby`, `python`, `javascript`, `html`, `css`, `bash`, `java`, `json`, `yaml`, and many more. You can also add line numbers with `linenos`:

{% highlight ruby linenos %}
def hello
  puts 'hello world'
end
{% endhighlight %}

### [Link](https://jekyllrb.com/docs/liquid/tags/#link)
- [Link by Tag]({% link _posts/tools/jekyll/2023-12-05-jekyll-seo.md %}): provides link validation on build time. if front matter not exists, the error below occurs.
  - Liquid Exception: Could not find document '_posts/tools/jekyll/2023-12-05-jekyll-seo.md' in tag 'link'. Make sure the document exists and the path is correct. in /github/workspace/_posts/tools/jekyll/2023-12-04-jekyll-liquid.md
- [Link by variables] % link {{ page.functions_page }} %: this way is not supported on Github Pages.
- [Link by post_url]({% post_url 2023-12-03-Free Synchronization of Obsidian Notes Between Desktop and Android Devices %}): able to access other directory's post with post name

The `link` tag is preferred over hardcoded URLs because it validates that the linked page exists at build time. If you rename or delete a post, the build will fail with a clear error message rather than silently creating a broken link.

### [Filter](https://jekyllrb.com/docs/liquid/filters/)

Filters transform the output of a Liquid variable. They are applied using the pipe `|` character.

- {{ "capitalize" | capitalize }}
- {{ page.no_variable | default: "default value" }}
- {{ page.date | date_to_string }}

#### Commonly Used Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `capitalize` | Capitalizes the first letter | `{% raw %}{{ "hello" | capitalize }}{% endraw %}` → Hello |
| `downcase` | Converts to lowercase | `{% raw %}{{ "HELLO" | downcase }}{% endraw %}` → hello |
| `upcase` | Converts to uppercase | `{% raw %}{{ "hello" | upcase }}{% endraw %}` → HELLO |
| `strip_html` | Removes HTML tags | `{% raw %}{{ "<p>text</p>" | strip_html }}{% endraw %}` → text |
| `truncate` | Truncates to N characters | `{% raw %}{{ "long text" | truncate: 4 }}{% endraw %}` → long... |
| `date` | Formats a date | `{% raw %}{{ page.date | date: "%Y-%m-%d" }}{% endraw %}` |
| `default` | Default value if nil/empty | `{% raw %}{{ var | default: "N/A" }}{% endraw %}` |
| `jsonify` | Converts to JSON | `{% raw %}{{ site.data.items | jsonify }}{% endraw %}` |
| `where` | Filters an array | `{% raw %}{{ site.posts | where: "draft", false }}{% endraw %}` |
| `sort` | Sorts an array | `{% raw %}{{ site.posts | sort: "title" }}{% endraw %}` |

### if
{% if page.has_variable %} page variable {% endif %}

You can also use `elsif` and `else` for more complex conditions:

{% raw %}
```liquid
{% if page.category == "tutorial" %}
  This is a tutorial
{% elsif page.category == "blog" %}
  This is a blog post
{% else %}
  This is other content
{% endif %}
```
{% endraw %}

Other comparison operators include `==`, `!=`, `>`, `<`, `>=`, `<=`, `contains`, `and`, `or`.

### for
{% for j in site.categories.Jekyll %}
- {{ j.title }}
{% endfor %}

The `for` loop also supports useful features like `limit`, `offset`, and `reversed`:

{% raw %}
```liquid
{% for post in site.posts limit:5 %}
  {{ post.title }}
{% endfor %}

{% for post in site.posts offset:2 limit:3 %}
  {{ post.title }}
{% endfor %}
```
{% endraw %}

Inside a `for` loop, you can access `forloop.index` (1-based), `forloop.index0` (0-based), `forloop.first`, and `forloop.last` to control rendering logic.

### assign

You can create and set variables using `assign`:

{% raw %}
```liquid
{% assign my_variable = "Hello World" %}
{% assign post_count = site.posts | size %}
```
{% endraw %}

### capture

The `capture` tag lets you store a block of content in a variable:

{% raw %}
```liquid
{% capture full_url %}{{ site.url }}{{ page.url }}{% endcapture %}
```
{% endraw %}

### include
{% include navigation.html %}

You can also pass parameters to includes:

{% raw %}
```liquid
{% include alert.html type="warning" message="Be careful!" %}
```
{% endraw %}

Inside `alert.html`, access the parameters with `{% raw %}{{ include.type }}{% endraw %}` and `{% raw %}{{ include.message }}{% endraw %}`.

## Common Pitfalls

1. **Raw tag for Liquid in code blocks**: When showing Liquid code examples, wrap them in `{% raw %}{% raw %}{% endraw %}` and `{% raw %}{% endraw %}{% endraw %}` tags to prevent Jekyll from processing them.
2. **Variable scope**: Variables defined inside `for` loops or `if` blocks are accessible outside them in Liquid, unlike most programming languages.
3. **Nil checking**: Use `{% raw %}{% if variable %}{% endraw %}` or the `default` filter to handle nil values gracefully.