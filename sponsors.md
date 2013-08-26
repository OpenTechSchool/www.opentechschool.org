---
layout: simple
title: OpenTechSchool Sponsors

sponsors:
  co_up:
    name: Co.Up Berlin Coworking Space
    web: http://co-up.de
    logo: /images/sponsors/coup.png
    about: Co.Up is the coworking space where the roots of OpenTechSchool lie. There we had our first meetup leading up to the founding of the organisation. Many meetings and events followed until today and Co.Up provided us gratiously with space and all help possible. We are thankful to have them on our side.
  google:
    name: Google Apps for Education
    web: https://www.google.com/enterprise/apps/education/
    logo: /images/sponsors/google_apps_edu.png
    about: Working with a distrubted network of volunteers brings it's challanges. Thanks to Google Apps we can offer Gmail, Docs, Drive and Groups to every supporter allowing us to act on a professional level of cloud-based collaboration.
  paypal:
    name: PayPal
    web: https://www.paypal.com
    logo: /images/sponsors/paypal.jpg
    about: PayPal allows us to easily collect donations via electronic payments. Thanks to their support this service comes free of charges, so every cent donated reaches us. Through the personal level of support we never felt lost during the process and always know who to contact. Just perfect.

---

## The Sponsor's Wall of Thanks

<p>Although OpenTechSchool is run by volunteers we need a few things to do our job that usually involves money. We are thankful to the sponsors below for supporting us in our work.
    </p>

<div class="sponsor_list">
	{% for sponsor_data in page.sponsors %}
		{% assign sponsor_id = sponsor_data[0] %}
		{% assign sponsor = sponsor_data[1] %}
		<div class="{% cycle 'left', 'right' %}">
		    {% if sponsor.logo %}
				<a href="{{sponsor.web}}"><img src="{{sponsor.logo}}" alt="{{sponsor.name}} Logo" ></a>
		    {% endif %}

		<h3 id="{{sponsor_id}}">{{sponsor.name}}</h3>
		    <p>{{sponsor.about}}</p>
		    <p><a href="{{sponsor.web}}">{{sponsor.web}}</a></p>
		</div>
	{% endfor %}
</div>