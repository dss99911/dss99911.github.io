---
layout: post
title:  "Publish Jekyll on Gihub Pages"
date:   2023-12-03 21:05:37 +0900
categories: jekyll
---

https://docs.github.com/ko/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll


install jekyll on your desktop
- https://jekyllrb.com/docs/installation/

on mac

install ruby
```

brew install chruby ruby-install xz
ruby-install ruby 3.1.3

echo "source $(brew --prefix)/opt/chruby/share/chruby/chruby.sh" >> ~/.zshrc echo "source $(brew --prefix)/opt/chruby/share/chruby/auto.sh" >> ~/.zshrc echo "chruby ruby-3.1.3" >> ~/.zshrc # run 'chruby' to see actual version

ruby -v


```

create repository name {user-name}.github.io
install gekyll
```
gem install bundler jekyll
jekyll new site
cd site

```


automatic deploy on commit