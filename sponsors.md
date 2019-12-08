---
layout: simple
title: OpenTechSchool Sponsors

sponsors:
  co_up:
    name: Co.Up Berlin Coworking Space
    web: https://co-up.de
    logo: images/sponsors/coup.png
    blog_post:
    about: Co.Up is the coworking space where the roots of OpenTechSchool lie. There we had our first meetup leading up to the founding of the organisation. Many meetings and events followed until today and Co.Up provided us gratiously with space and all help possible. We are thankful to have them on our side.
  google:
    name: Google Apps for Education
    web: https://www.google.com/enterprise/apps/education/
    logo: images/sponsors/google_apps_edu.png
    about: Working with a distributed network of volunteers brings its challenges. Thanks to Google Apps we can offer Gmail, Docs, Drive and Groups to every supporter allowing us to act on a professional level of cloud-based collaboration.
    blog_post: https://blog.opentechschool.org/2012/07/we-are-supported-by-google-apps-for-education.html
  paypal:
    name: PayPal
    web: https://www.paypal.com
    logo: images/sponsors/paypal.jpg
    blog_post: https://blog.opentechschool.org/2013/08/paypal-donations.html
    about: PayPal allows us to easily collect donations via electronic payments. Thanks to their support this service comes free of charges, so every cent donated reaches us. Through the personal level of support we never felt lost during the process and always know who to contact. Just perfect.
  wenzelmann:
    name: Wenzelmann
    web: https://www.wenzelmann.de
    logo: images/sponsors/wenzelmann.png
    about: Ernst Wenzelmann Schilderfabrik GmbH generously printed over 5000 of our beautiful stickers in extraordinary quality as a donation.

---

## The Sponsor's Wall of Thanks

<p>Although OpenTechSchool is run by volunteers we need a few things to do our job that usually involves money or need certain infrastructure. We are thankful to the sponsors below for supporting us in our work.
    </p>

<div class="sponsor_list">
	{% for sponsor_data in page.sponsors %}
		{% assign sponsor_id = sponsor_data[0] %}
		{% assign sponsor = sponsor_data[1] %}
		<div class="{% cycle 'left', 'right' %}">
		    {% if sponsor.logo %}
				<a href="{{sponsor.web}}"><img src="{{site.baseurl}}/{{sponsor.logo}}" alt="{{sponsor.name}} Logo" ></a>
		    {% endif %}

			<div>
			<h3 id="{{sponsor_id}}"><a href="{{sponsor.web}}">{{sponsor.name}}</a></h3>
			    <p>{{sponsor.about}}
			    	{% if sponsor.blog_post %}
			    		<span class="blog_post"><a href="{{sponsor.blog_post}}">Learn more about their sponsorship on our blog.</a></span>
			    	{% endif %}
			    </p>
			</div>
		</div>
	{% endfor %}
</div>

<h4 style="text-align: center">You like what we do and want to sponsor us?<br/> <a href="{{site.baseurl}}/handbooks/sponsorship-and-support.html">Learn here how.</a></h4>
