---
layout: post
title: How to Embed YouTube Videos in Jekyll Blog Posts
date: 2023-12-25 01:57:37 +0900
categories: [tools, jekyll]
description: "Learn how to embed YouTube videos in Jekyll blog posts. Includes responsive video embedding and best practices for performance."
tags: [Jekyll, YouTube, Video, Embed, Responsive]
image: /assets/images/posts/thumbnails/2023-12-25-jekyll-youtube.png
---

Embedding YouTube videos in Jekyll posts enhances your content with multimedia. This guide shows you how to do it properly, from basic embedding to responsive design and performance optimization.

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

For shortened URLs like `https://youtu.be/s17bmlrFXSg`, the video ID is the path after the domain. For playlist URLs, the video ID is still the `v=` parameter value.

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

The `padding-bottom: 56.25%` value creates a 16:9 aspect ratio container (9/16 = 0.5625). If your videos use a different aspect ratio, adjust accordingly:
- **4:3 ratio**: `padding-bottom: 75%`
- **21:9 ratio**: `padding-bottom: 42.86%`

### Creating a Reusable Include

To avoid repeating the responsive wrapper code, create a Jekyll include file:

{% highlight html %}
<!-- _includes/youtube.html -->
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin-bottom: 1em;">
  <iframe
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    src="https://www.youtube.com/embed/{{ include.id }}"
    frameborder="0"
    loading="lazy"
    allowfullscreen>
  </iframe>
</div>
{% endhighlight %}

Then use it in any post with a single line:

{% highlight liquid %}
{% raw %}{% include youtube.html id="s17bmlrFXSg" %}{% endraw %}
{% endhighlight %}

This approach keeps your posts clean and ensures consistent styling across all video embeds.

## Privacy-Enhanced Mode

For GDPR compliance, use the privacy-enhanced embed domain:

{% highlight html %}
<iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID"></iframe>
{% endhighlight %}

When you use `youtube-nocookie.com`, YouTube does not store information about visitors on your website unless they play the video. This is important if your site targets visitors in the EU or if you want to be privacy-conscious in general.

## Additional Parameters

You can customize the embed with URL parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `autoplay=1` | Auto-play video | `?autoplay=1` |
| `start=30` | Start at 30 seconds | `?start=30` |
| `end=60` | End at 60 seconds | `?end=60` |
| `loop=1` | Loop the video | `?loop=1` |
| `mute=1` | Mute audio | `?mute=1` |
| `controls=0` | Hide player controls | `?controls=0` |
| `rel=0` | Don't show related videos | `?rel=0` |
| `modestbranding=1` | Minimal YouTube branding | `?modestbranding=1` |
| `cc_load_policy=1` | Show captions by default | `?cc_load_policy=1` |
| `playlist=ID` | Required for looping a single video | `?loop=1&playlist=VIDEO_ID` |

Example with multiple parameters:
{% highlight html %}
<iframe src="https://www.youtube.com/embed/VIDEO_ID?start=30&autoplay=1&mute=1"></iframe>
{% endhighlight %}

Note: For autoplay to work in most modern browsers, the video must also be muted (`mute=1`), as browsers block autoplaying videos with sound.

## Embedding Playlists

You can also embed entire YouTube playlists:

{% highlight html %}
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/videoseries?list=PLAYLIST_ID"
  frameborder="0"
  allowfullscreen>
</iframe>
{% endhighlight %}

## Performance Tips

- **Lazy Loading**: Add `loading="lazy"` for better page load performance. This defers loading the iframe until it is near the viewport.
- **Facade Pattern**: Consider using a thumbnail that loads the video on click. This dramatically improves initial page load by not loading the YouTube iframe until the user interacts.
- **Limit Videos**: Too many embedded videos can slow down your page. Each iframe loads significant JavaScript and CSS from YouTube.
- **Consider lite-youtube-embed**: The [lite-youtube-embed](https://github.com/nickmessing/lite-youtube-embed) library provides a lightweight facade that looks like a real embed but only loads the full player on click, reducing initial page weight by over 500KB per embed.