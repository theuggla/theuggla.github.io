---
title: projects
weight: 2
menu: main
layout: projects
---

{% if site.projects_intro == 'none' %}
{% elsif site.projects_intro %}
  {{ site.projects_intro }}
{% else %}
This is the landing page for the projects. If you do not want to create your own, this page can be kept and the text can be changed or omitted by setting the value of the `projects_intro` variable in the `_config-yml`. If you want to keep the page but omit the intro-text, set the variable to `none`. If you want to create your own page, use the Front Matter :

``` 
---  
title: projects   
layout: projects   
weight: 2  
menu: main  
---  
```

where `title` is the title to be displayed on the menu and in the browser as the title of the page, `layout: projects` is necessary to display the project posts, `weight` tells the menue what position this page should take in the global navigation,and `menu: main` places the page in the global navigation.
{% endif %}