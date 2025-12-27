---
layout: post
title: How to Embed YouTube Videos in Jekyll Blog Posts
date: 2023-12-25 01:57:37 +0900
categories: jekyll
description: "Learn how to embed YouTube videos in Jekyll blog posts. Includes responsive video embedding and best practices for performance."
tags: [Jekyll, YouTube, Video, Embed, Responsive]
---

Embedding YouTube videos in Jekyll posts enhances your content with multimedia. This guide shows you how to do it properly.

## Basic Embedding

To embed a YouTube video, use an iframe with the embed URL format:

{% highlight html %}
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0"
  allowfullscreen>
</iframe>
{% endhighlight %}

### How to Get the Video ID

The video ID is the part after `v=` in the YouTube URL:
- URL: `https://www.youtube.com/watch?v=s17bmlrFXSg`
- Video ID: `s17bmlrFXSg`

## Example

Here's an embedded video:

<iframe width="560" height="315" src="https://www.youtube.com/embed/s17bmlrFXSg" frameborder="0" allowfullscreen></iframe>

## Responsive Video Embedding

For responsive videos that adapt to screen size, wrap the iframe in a container:

{% highlight html %}
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    src="https://www.youtube.com/embed/VIDEO_ID"
    frameborder="0"
    allowfullscreen>
  </iframe>
</div>
{% endhighlight %}

## Privacy-Enhanced Mode

For GDPR compliance, use the privacy-enhanced embed domain:

{% highlight html %}
<iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID"></iframe>
{% endhighlight %}

## Additional Parameters

You can customize the embed with URL parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `autoplay=1` | Auto-play video | `?autoplay=1` |
| `start=30` | Start at 30 seconds | `?start=30` |
| `end=60` | End at 60 seconds | `?end=60` |
| `loop=1` | Loop the video | `?loop=1` |
| `mute=1` | Mute audio | `?mute=1` |

Example with multiple parameters:
{% highlight html %}
<iframe src="https://www.youtube.com/embed/VIDEO_ID?start=30&autoplay=1&mute=1"></iframe>
{% endhighlight %}

## Performance Tips

- **Lazy Loading**: Add `loading="lazy"` for better page load performance
- **Facade Pattern**: Consider using a thumbnail that loads the video on click
- **Limit Videos**: Too many embedded videos can slow down your page