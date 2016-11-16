---
url: /thoughts-on-websiting
title: thoughts on websiting
layout: post
comments: true
---

### Pre-compiling your CSS

I think pre compiling CSS is absolutely lovely. it allows you to use variables! that's the
absolutely most delightful feature. compared to regular CSS it allows you to spend your
time in a much more productive way than endlessly scrolling through your code looking for
all the instances of that one colour you foolishly decided to use once before you
realised it's horribly mustard-like. it's also much more readable, maintainable, and
easier to collaborate around.

for this site I mainly used the variables, math and the nesting functions - the variables because they makes for both
much more readable and much more maintainable code, and the nesting mostly because it makes the
code more readable, but also less error prone - you can clearly see what's nested in what, instead
of forgetting to write an ul somewhere and ending up with the links of the whole page floating to the right.
the mixins I mainly used to make the media queries slightly more readable, combined with variables. I used extends
for inheriting when I needed to make only slight adjustments to a layout based on what class was dynamically
assigned in the html, which made me not have to write the whole thing again.

the pros of a CSS processor like sass are obvious - the code becomes more maintainable, you can split it
up into different files which makes it easier to keep track of what you're doing as well as making
collaborations on the same project easier, it becomes more readable with the variables and easier to
evolve, you can use math directly in the code together with variables for a dynamic take on widths, etc.
the cons are, of course, that you have to learn more syntax, and maybe the slight risk of messing up
the cascade of your CSS when you split it into different files and then loose track of what to import when,
but these are neglectable compared to the pros.

### Static site generators

static site generators are a very accessible way to make nice looking, fast web sites with minimal effort and
strain. the downside is, of course, that they take a bit of time to learn how to use, and that the content can
not be dynamically updated. this is only a downside if you really need to have your content dynamically
updated of course, and a lot of the time you don't. another downside can be the fact that there is no content
management system available for updating content, so that you have to learn how to interact with the site directly.
on the other hand you have much more control over the site when you are not filtered through a CMS, so if you
just put in the extra effort to begin with, you can easily customize the site the way you want to.

other downsides are the lack of an admin UI, which makes you in most cases required to sit in front of
your computer with the software installed to update your site, and the lack of possible user input.

on the other hand, the site becomes very secure - there is no way to hack into it when no requests
are being made and no traffic is going back and forth between anywhere. the documents just sit there
flatly on the server. this also makes the site very quick, and the lack of server request makes it
able to respond vary quickly to a huge number of requested page views without risk of breaking.

all this makes them ideal for presenting content that you won't need to
update on the fly - if you just need to present, there is no need
for interaction with the user. if you are presenting something it is also good that you can
handle a huge number of requests - if a lot of people wants to look at what you are presenting at once,
you don't want the site to break. for presenting a project, a portfolio or a small company that
just wants to tell visitors where they are and what they're about, static site generators are ideal.

### robots.txt

by including a robots.txt in your site root you can communicate with robots visiting your site.
it is not a way to fight off evil cylons, because robots can choose to ignore your file, but rather
to direct the robot towards the parts of your site you want it to find easily to display in
search results on google, for example. you can also direct it away from the parts of your site
you feel would be less useful for these kind of results - my own file I have configured to
not give results from the assets folder, where I keep all the icons and thumbnails that would
do badly in a google image search, and the blog page, since it would just drop the poor reader on the
page that contains what they were searching for without any indication of where on the page it is. a
terrible thing, since all of my posts are on the same page. instead the robot kan go directly to the post,
or wherever else on the site they'd like to be.

### humans.txt

humans.txt is an initiative that follows robots.txt in the sense that the one is supposed
to mirror the other - instead of just talking to robots visiting our site, we want to connect
one human being to another. by including a humans.txt we can communicate what actual
people is behind the site, and promote the sense that we are not just robots even though
we are not physically in front of each other.

On this site the humans.txt includes my name, location, origin, contact information. I have
also included thanks for moral support and made it clear what IDEs and other tools I have
used while making the site, as to make a shoutout to the people creating and maintaining those.

### Comments on static site
To implement comments I have made use of Disqus. They provide you with a short
snippet of Javascript code to include on your site, which links to an external
embed script hosted on their server. It does involve including a
bit of Javascript on an otherwise static site, but it is worth the trouble,
especially if you want to include blog posts. Disqus provides a service
to handle comments across all your sites, while just having to make one
account, which is very convenient if you can't or don't want to go through
the trouble of scripting a whole comment system yourself.

### Open graph

Open graph is an initiative to streamline the look of stuff getting shared on
the web. With sharing so many different things on so many different social media
platform, it makes sense to have a system in place to control how your things are
going to look when they get shared. There are a lot of different options depending
on what kind of content you are handling, but for a website it makes sense to include
an image, a description and a link to your site. On this site I have provided meta-tags
for title, description, url, image, determiner (to use "the" if the title is used in
a sentence) and locale.