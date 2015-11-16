---
layout: project
title: Hackership
image: projects/hackership/background.jpg
indicator: "hackership"
---

After working in the industry for some time, you might get tired of your field and want to learn something new or switch into a different field. That's exactly what Hackership wants to help you with. Consider it like the Continuous Learning Group for experienced Developers. Over the course of three month, this peer-learning, self-driven format wants to get you from being a good developer to becoming a great Hacker.

<a href="http://www.hackership.org/" class="ots_action">Learn more about the programme on hackership.org</a>

This wouldn't be possible without our many supporters:

<h3>Team &amp; Advocates</h3>
<p>The active supporters and forespeakers of the Hackership crowdfunding campaign.</p>

<div class="advocats">
    <ul class="float_list float_list_4 team_list">
      {% for advocate in site.data.advocates %}
      <li class="member">
        <img src="{{advocate.image}}"
        alt="{{advocate.name}}">
        {% if advocate.url %}
        	<h3><a href="{{advocate.url}}" target="_blank">{{advocate.name}}</a></h3>
        {% else %}
        	<h3>{{advocate.name}}</h3>
        {% endif %}
      </li>
      {% endfor %}
     </ul>
</div>

<h3>Donors</h3>

<div class="donors">
    <ul class="float_list float_list_4 team_list">
      {% for donor in site.data.donors %}
      <li class="member">
        <img src="{{donor.image}}"
        alt="{{donor.name}}">
        {% if donor.url %}
        	<h3><a href="{{donor.url}}" target="_blank">{{donor.name}}</a></h3>
        {% else %}
        	<h3>{{donor.name}}</h3>
        {% endif %}
      </li>
      {% endfor %}
     </ul>
</div>
