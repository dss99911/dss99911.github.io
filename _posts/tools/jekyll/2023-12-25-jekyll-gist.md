---
layout: post
title: How to Embed GitHub Gist in Jekyll Blog Posts
date: 2023-12-25 01:57:37 +0900
categories: [tools, jekyll]
description: "Learn how to embed GitHub Gist code snippets in your Jekyll blog. Simple method to share and display code with syntax highlighting."
tags: [Jekyll, GitHub, Gist, Code Snippet, Embed]
image: /assets/images/posts/thumbnails/2023-12-25-jekyll-gist.png
---

GitHub Gist is a simple way to share code snippets. Embedding Gists in Jekyll posts is straightforward and provides syntax highlighting automatically. Unlike regular code blocks in markdown, Gist embeds stay synchronized with the original Gist, meaning any updates you make to the code are automatically reflected everywhere it is embedded.

## Why Use GitHub Gist?

- **Syntax Highlighting**: Automatic code highlighting for many languages
- **Version Control**: Gists are Git repositories, so you can track changes
- **Easy Updates**: Update the Gist and all embeds update automatically
- **Collaboration**: Others can fork and comment on your Gists
- **Multiple Files**: A single Gist can contain multiple files
- **Revision History**: Full diff history is available for each Gist

## Gist vs Inline Code Blocks

When should you use a Gist embed instead of a regular markdown code block?

| Feature | Gist Embed | Markdown Code Block |
|---------|-----------|-------------------|
| Updateable | Yes, updates everywhere | No, must edit each post |
| Syntax highlighting | Automatic | Depends on theme/highlighter |
| Loading speed | Requires external request | Instant (static HTML) |
| SEO | Not indexed (loaded via JS) | Indexed by search engines |
| Offline viewing | Requires internet | Always available |

**Recommendation**: Use inline code blocks for short, static snippets. Use Gist embeds for longer code examples that you may update over time or want to share across multiple posts.

## How to Embed a Gist

### Step 1: Create a Gist

1. Go to [gist.github.com](https://gist.github.com)
2. Paste your code
3. Add a filename with extension (e.g., `example.py`)
4. Click "Create public gist" or "Create secret gist"

Note: "Secret" gists are not truly private. They are unlisted but anyone with the URL can view them. For truly private code, use a private repository instead.

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

This is particularly useful when you have a Gist that contains multiple related files (e.g., an HTML file, a CSS file, and a JavaScript file) and you want to show only the relevant one in each section of your blog post.

## Alternative: Jekyll Gist Plugin

For GitHub Pages, you can also use the jekyll-gist plugin:

{% highlight liquid %}
{% raw %}{% gist dss99911/01dc67dda8783ed8b0c5c5eb38244822 %}{% endraw %}
{% endhighlight %}

The jekyll-gist plugin provides a noscript fallback, which means the code is still visible even if JavaScript is disabled. This is an advantage over the raw script tag approach. To use it, add the plugin to your `Gemfile`:

```ruby
gem 'jekyll-gist'
```

And add it to your `_config.yml`:

```yaml
plugins:
  - jekyll-gist
```

## Styling Gist Embeds

By default, Gist embeds come with their own styling, which may not match your blog's theme. You can override the default styles with custom CSS:

{% highlight css %}
/* Override Gist font size */
.gist .blob-code-inner {
  font-size: 14px;
}

/* Remove Gist footer */
.gist .gist-meta {
  display: none;
}

/* Customize Gist background */
.gist .highlight {
  background: #f6f8fa;
}
{% endhighlight %}

## Tips

- Keep Gists public for embedding on public sites
- Use descriptive filenames for better readability
- Consider using Gist for frequently updated code examples
- Organize related snippets in multi-file Gists to keep them together
- Use the Gist API for programmatic access: `https://api.github.com/gists/{gist_id}`
- Remember that Gist embeds require JavaScript, so provide alternative content for readers with JavaScript disabled
