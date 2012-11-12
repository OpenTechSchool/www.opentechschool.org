---
layout: local_group
title: Berlin
rss_feed: berlin
meetupcom_group: opentechschool-berlin
---

<section id="events">
  <h2>Upcoming events</h2>
  <a href="">cal</a>
  <div id="events-list"></div>
  <script type="text/x-template" data-template="event">
    <div class="event">
    <h1>${name}</h1>
    <p>${venue}</p>
  </div>
  </script>
</section>

<section id="blog-posts">
  <h2>Latest news</h2>
  <a href="http://blog.opentechschool.org/feeds/{{page.rss_feed}}.xml">rss</a>
  <div id="blog-posts-list"></div>
  <script type="text/x-template" data-template="blog-post">
    <div class="blog-post">
	  <h1><a href="${link}">${title}</a></h1>
	  <p>${date}</p>
	</div>
  </script>
</section>
