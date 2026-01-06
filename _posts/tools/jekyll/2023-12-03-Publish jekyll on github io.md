---
layout: post
title:  "Publish Jekyll on GitHub Pages"
date:   2023-12-03 21:05:37 +0900
categories: [tools, jekyll]
description: "A step-by-step guide on how to install Jekyll on your desktop and publish it on GitHub Pages. Learn Ruby installation, Jekyll setup, and deployment configuration."
tags: [Jekyll, GitHub Pages, Ruby, Static Site, Blog]
image: /assets/images/posts/thumbnails/2023-12-03-Publish-jekyll-on-github-io.png
---

In this blog post, we will walk through the process of installing Jekyll on your desktop and publishing it on Github Pages. This is a great way to create and manage your own website or blog.

## Install Jekyll on your desktop
Jekyll is a simple, blog-aware, static site generator that's ideal for personal, project, or organization sites. To get started, you need to install Jekyll on your desktop. Follow the instructions provided on the [official Jekyll installation guide](https://jekyllrb.com/docs/installation/).

### On Mac
If you're using a Mac, you'll need to install Ruby first before you can install Jekyll.

#### Install Ruby
Ruby is a dynamic, open source programming language with a focus on simplicity and productivity. It has an elegant syntax that is natural to read and easy to write. Here's how you can install Ruby on your Mac:

```bash
brew install chruby ruby-install xz
ruby-install ruby 3.1.3

echo "source $(brew --prefix)/opt/chruby/share/chruby/chruby.sh" >> ~/.zshrc echo "source $(brew --prefix)/opt/chruby/share/chruby/auto.sh" >> ~/.zshrc echo "chruby ruby-3.1.3" >> ~/.zshrc # run 'chruby' to see actual version

ruby -v
```

#### Install Jekyll
Once you have Ruby installed, you can proceed with installing Jekyll. Here's how:

```bash
gem install bundler jekyll
jekyll new site
cd site
```

## Deploy
Now that you have Jekyll installed and a new site created, it's time to deploy your site on Github Pages.

### Create repository named {user-name}.github.io
First, you need to create a new repository on Github. The repository name should be in the format `{user-name}.github.io`.

### Commit and push Jekyll code
Next, commit your Jekyll site code to the repository and push the changes. Github Pages will automatically deploy your site upon each commit.


### Configure deployment setting
It's well described on [Pages Quickstart](https://docs.github.com/pages/quickstart#creating-your-website)


### Check website
Finally, you can check your website by navigating to `{user-name}.github.io` in your web browser. Your Jekyll site should now be live!

## Reference
For more information, you can refer to the official Github Pages documentation on [creating a Github Pages site with Jekyll](https://docs.github.com/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll).