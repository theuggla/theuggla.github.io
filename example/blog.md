---
title: blog
layout: blog
weight: 3
menu: main
---

{% if site.data.theme.t.blog_intro == 'none' %}
{% elsif site.data.theme.t.blog_intro %}
  {{ site.data.theme.t.blog_intro }}
{% else %}
This is the landing page for the blog. If you do not want to create your own, this page can be kept and the text can be changed or omitted by setting the value of the `blog_intro` variable in the `_config-yml`. If you want to keep the page but omit the intro-text, set the variable to `none`. If you want to create your own page, use the Front Matter :

``` 
---  
title: blog  
layout: blog  
weight: 3  
menu: main  
---  
```

where `title` is the title to be displayed on the menue and in the browser as the title of the page, `layout: blog` is necessary to display the blog posts, `weight` tells the menue what position this page should take in the global navigation,and `menu: main` places the page in the global navigation.
{% endif %}