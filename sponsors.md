---
layout: simple
title: OpenTechSchool Sponsors
---

## The Sponsor's Wall of Thanks

<p>Although OpenTechSchool is run by volunteers we need a few things to do our job that usually involves money. We are thankful to the sponsors below for supporting us in our work.
    </p>

<div class="sponsor_list">
    {% for sponsor_data in site.sponsors %}
{% assign sponsor_id = sponsor_data[0] %}
{% assign sponsor = sponsor_data[1] %}
<div class="{% cycle 'left', 'right' %}">
    {% if sponsor.logo %}
<img src="{{sponsor.logo}}" alt="{{sponsor.name}} Logo" >
    {% endif %}

<h3 id="{{sponsor_id}}">{{sponsor.name}}</h3>
    <p>{{sponsor.about}}</p>
    <p><a href="{{sponsor.web}}">{{sponsor.web}}</a></p>
</div>
{% endfor %}
</div>