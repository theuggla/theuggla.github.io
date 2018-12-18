---
title: home
weight: 1
menu: main
---

<section id="about">
    {% if site.index_text %}
    <p>{{ site.index_text }} </p>
    {% else %}
    <p>this site is a portfolio to showcase my projects, and this text is about me. maybe I'm introducing myself and what I do here. the section can of course be ignored completely, or restyles using the <code>assets/main.scss-file</code></p>
    <p>the important thing is to keep the Front Matter on the index-page to:
    <br />
    <br />
        <code>
            ---<br />
            title: home<br />
            weight: 1<br />
            menu: main<br />
            ---
        </code>  
    </p>
    <p>to the right, links to the three first project categories are displayed together with an icon with the path
        <code>/assets/projects/symbols/{{category}}.png</code>. It is possible to supply your own icons on this path.
    </p>
    {% endif %}
</section>

<section id="projects">
    {% assign collectionName = 'projects' %}
    {% assign c = site.collections | where:'label', collectionName | first %}
    {% for category in c.categories limit:3 %}
    <div id="{{category}}">
        <img src="/assets/projects/symbols/{{category}}.png" />
        <h2>{{category}}</h2>
        <a href="/projects#{{category}}">go to {{category}} projects</a>
    </div>
    {% endfor %}
</section>
