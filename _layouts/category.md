---
layout: home
---

{% assign posts = "" | split: "" %}
{% for site_category in site.categories %}
    {% if site_category == page.category %}
      {% assign posts = posts | push: site_category %}
    {% endif %}
{% endfor %}
