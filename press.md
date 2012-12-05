---
layout: simple
title: Press
---


<section id="about">
	<h2>About OpenTechSchool</h2>
	<span>(free to copy)</span>
	<p>Read in:
		<!-- FIXME: make this inline -->
		<ul id="js-lang-selector">
			<li><a href="#js-about-eng" class="active">English</a></li>
			<li><a href="#js-about-de">German</a></li>
			<li><a href="#js-about-it">Italian</a></li>
			<li><a href="#js-about-fr">French</a></li>
			<li><a href="#js-about-es">Spanish</a></li>
			<li><a href="#js-about-hi">Hindi</a></li>
		</ul>
	</p>
	<div class="carousel">
		<div class="carousel-inner">
			<div class="item active" id="js-about-eng">
				OpenTechSchool is a community initiative offering free programming workshops and meetups to technology enthusiasts of all genders, backgrounds, and experience levels. It supports volunteer coaches in setting up the events taking care of the organizational details and encouraging them to create original teaching material, to be then openly shared online and further developed with contributions from the global OTS community. OTS's main goal is to crate a friendly learning environment where no one feels shy about asking any question. Everyone is invited to participate, whether as a coach or a learner, and get in contact to organize OTS events anywhere in the world.
			</div>
			<div class="item" id="js-about-de">
				Über in Deutsch
			</div>
			<div class="item" id="js-about-it">
				Italiano
			</div>
			<div class="item" id="js-about-fr">
				Français
			</div>
			<div class="item" id="js-about-es">
				español
			</div>
			<div class="item" id="js-about-hi">
				ओपन टेक स्कूल एक सामुदायिक पहल है जिसके द्वारा लोगो के लिए मुफ्त में
प्रोग्रामिंग वोर्क्शोप्स और बैठकों का आयोजन किया जाता है। इन बैठकों में
लोगो के बीच कोई भेदभाव नहीं किया जाता और यह सभी के लिए खुली है। यहाँ हम
उनको प्रोत्साहित करते है जो या तो आगे आके पढाना चाहते है या पढना।हर चीज़ जो
इन वोर्क्शोप्स एवं बैठकों में बनती है वोह पूरी दुनिया के साथ ऑनलाइन बाटी
जाती है ताकि और बाकी ओपन टेक स्कूल से झुदे लोग भी इसमें अपना योगदान दे सके।
ओपन टेक स्कूल का लक्ष्य एक ऐसी जगह का निर्माण करना है जहा लोग कोई भी तकनीकी
प्रष्न पूछ सके।सभी निमंत्रित है, चाहे आप पढना चाहते है या पढाना, या फिर
किसी और जगह ओपन टेक स्कूल की बैठक आयोजित करना चाहते है।हमसे संपर्क करे !

			</div>
		</div>
	</div>
</section>

<script>
	$(function() {
		$('#js-lang-selector li a').click(function() {
			var $me = $(this),
					href = $me.attr("href"),
					$target = $(href);
			$me.parent().siblings().removeClass("active");
			$me.parent().addClass("active");

			$target.addClass("active").siblings().removeClass("active");
			return false;
		});
	});
</script>

## In the press

### In English

 * [OpenTechSchool in Stockholm – GeekGirls wanted!](http://geekgirlmeetup.com/stockholm/opentechschool-in-stockholm-geekgirls-wanted/
) at [GeekGirlMeetup.com](http://www.geekgirlmeetup.com). November 8th, 2012.

 * [Berlin Geekettes: Building A Collective Strength In Germany
 women 2.0](http://www.women2.com/berlin-geekettes-building-a-collective-strength-in-germany/
), October 23rd, 2012.

* [The Big Berlin Breakdown: August 27- 31](http://siliconallee.com/events/2012/08/27/the-big-berlin-breakdown-august-27-31) on [Silicon Allee](http://siliconallee.com/), August 27th, 2012.

* [Berlin Geekette of the Week – Amélie Anglade](http://berlingeekettes.com/post/30090123718/berlin-geekette-of-the-week) on [Berlin Geekettes](http://www.berlingeekettes.com), August 24th, 2012.

* [Berlin Geekettes of the Week: the women behind OpenTechSchool](http://berlingeekettes.com/post/29112914602/berlin-geekettes-of-the-week-the-women-behind)
on [Berlin Geekettes](http://www.berlingeekettes.com) August 10th, 2012.


### In German

* [Python OpenTechSchool](http://python-verband.org/news/python-opentechschool) by [Python Software Verband](http://python-verband.org), November 23rd, 2012.


#### In Swedish

* [OpenTechSchool På Export](https://camfia.wordpress.com/2012/09/26/open-tech-school-pa-export/) on [Hallo Welt!](https://camfia.wordpress.com/), September 26th, 2012.
