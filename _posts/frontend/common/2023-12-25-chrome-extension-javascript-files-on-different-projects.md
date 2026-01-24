---
layout: post
title: "[Chrome Extension] How to import same javascript file on different projects"
date: 2023-12-25 01:05:37 +0900
categories: [frontend, common]
tags: [chrome-extension, javascript, hard-link, mac, development]
image: /assets/images/posts/thumbnails/2023-12-25-chrome-extension-javascript-files-on-different-projects.png
redirect_from:
  - /frontend/common/2023/12/25/chrome-extension-javascript-files-on-different-projects.html
  - /frontend/2023/12/24/chrome-extension-javascript-files-on-different-projects.html
---

This explains only on Mac environment.
When developing Chrome plugin.
each Plugin can refer only the files inside the folder.
so, If there are several project like below(`sample`, `tabswitcher-master`), I had to copy and past the utility javascript file to each project's folder. but I would like to use same files in `util` folder

![img.png](/assets/images/posts/frontend/img.png)

Then, how can we use just same file from several projects?
I solved by hard link from Linux.

{% highlight bash %}

ln ./util/Preference.js ./<project-name>/util/Preference.js
ln ./util/Tabs.js ./<project-name>/util/Tabs.js
{% endhighlight %}

you can check [the source code](https://github.com/dss99911/chrome-extension-study).
If you want to know how to import javascript file. I recommend [this article](https://medium.com/@otiai10/how-to-use-es6-import-with-chrome-extension-bd5217b9c978)