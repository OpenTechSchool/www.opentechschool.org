---
layout: city
title: Berlin
rss_feed: berlin
meetupcom_group: opentechschool-berlin
about: "lorem ipsum berlin is awesome"
---


<section id="events">
  <h2>Upcoming events</h2>
  <a href="">cal</a>
  <div id="js-events-list"></div>
  <script type="text/x-template" data-template="event">
    <div class="event">
      <h1>${name}</h1>
      <p>${venue}</p>
  </div>
  </script>
</section>

{{page.about}}

<section id="blog-posts">
  <h2>Latest news</h2>
  <a href="http://blog.opentechschool.org/feeds/{{page.rss_feed}}.xml">rss</a>
  <div id="js-blog-posts-list"></div>
  <script type="text/x-template" data-template="blog-post">
    <div class="blog-post">
      <h1><a href="${link}">${title}</a></h1>
      <p>${date}</p>
  </div>
  </script>
</section>
