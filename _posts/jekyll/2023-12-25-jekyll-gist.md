---
layout: post
title: How to Embed GitHub Gist in Jekyll Blog Posts
date: 2023-12-25 01:57:37 +0900
categories: jekyll
description: "Learn how to embed GitHub Gist code snippets in your Jekyll blog. Simple method to share and display code with syntax highlighting."
tags: [Jekyll, GitHub, Gist, Code Snippet, Embed]
---

GitHub Gist is a simple way to share code snippets. Embedding Gists in Jekyll posts is straightforward and provides syntax highlighting automatically.

## Why Use GitHub Gist?

- **Syntax Highlighting**: Automatic code highlighting for many languages
- **Version Control**: Gists are Git repositories, so you can track changes
- **Easy Updates**: Update the Gist and all embeds update automatically
- **Collaboration**: Others can fork and comment on your Gists

## How to Embed a Gist

### Step 1: Create a Gist

1. Go to [gist.github.com](https://gist.github.com)
2. Paste your code
3. Add a filename with extension (e.g., `example.py`)
4. Click "Create public gist" or "Create secret gist"

### Step 2: Get the Embed Code

1. On your Gist page, click the "Embed" dropdown
2. Copy the script tag

### Step 3: Add to Jekyll Post

Paste the script tag directly in your markdown file:

{% highlight html %}
<script src="https://gist.github.com/dss99911/01dc67dda8783ed8b0c5c5eb38244822.js"></script>
{% endhighlight %}

## Example

Here's an embedded Gist:

<script src="https://gist.github.com/dss99911/01dc67dda8783ed8b0c5c5eb38244822.js"></script>

## Embedding Specific Files

If your Gist has multiple files, you can embed a specific one:

{% highlight html %}
<script src="https://gist.github.com/username/gist-id.js?file=filename.py"></script>
{% endhighlight %}

## Alternative: Jekyll Gist Plugin

For GitHub Pages, you can also use the jekyll-gist plugin:

{% highlight liquid %}
{% raw %}{% gist dss99911/01dc67dda8783ed8b0c5c5eb38244822 %}{% endraw %}
{% endhighlight %}

## Tips

- Keep Gists public for embedding on public sites
- Use descriptive filenames for better readability
- Consider using Gist for frequently updated code examples
