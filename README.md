# [www.opentechschool.org](http://www.opentechschool.org)

[![Join the chat at https://gitter.im/OpenTechSchool/www.opentechschool.org](https://badges.gitter.im/OpenTechSchool/www.opentechschool.org.svg)](https://gitter.im/OpenTechSchool/www.opentechschool.org?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Travis Build Status](https://travis-ci.org/OpenTechSchool/www.opentechschool.org.svg "Travis Build Status")](https://travis-ci.org/OpenTechSchool/www.opentechschool.org)


The source code behind OTS' main web site.

This project is built with the help of

 * bootstrap
 * jekyll

In order to be able to compile the site on your own computer, you can install
the two ruby dependencies with `bundle install` if you have bundler.

## Building the site

1. run `bundle install` to grab ruby dependencies
2. clean up jekyll's build directory: `rm -r _site/*`
3. build and serve the site: `jekyll serve`
4. Navigate to http://localhost:4000


## Adding a city

If you want to add a new city to the site, follow these steps:

* Create a file in the `_cities` directory.  It should have a `.md` extension.

  The file name is important and will be used as the key in several places, eg.
  the applicable RSS feed, relevant Discourse category, default Meetup page,
  and CSS class.  We will refer to it as `$city` from here on.

* Add a preamble, looking like this, to the top of the file:

  <!-- To people reading this file's source, it's actually:

    ---
    title: ...
    ...
    ---

  -->

  <pre>
  &#45;&#45;&#45;
  title: My City
  location: City, Country
  &#45;&#45;&#45;
  </pre>

  `title` and `location` are the name and the geographic context of your city,
  respectively, in your preferred locale used for formatting only.  That means
  --- depending on your cultural background --- `Berlin, Germany` and
  `Washington, DC` are both perfectly fine.

* Add members to your city:

  * Add the `members` key to your preamble and have its value be a bullet list
    with all your members' opentechschool.org usernames, for example:

        members:
          - alice
          - bob

    (See below for members without an opentechschool.org account.)

  * Explain the usernames in `_data/names.yml`.  (This *should* have been done
    by [team.tech@](mailto:team.tech@opentechschool.org) when they set up the
    user, if they knew her real name.)  It is a simple mapping between username
    and real name, such as:

        alice: Alice Smith
        bob: Bob Johnson

  * Put images into `images/team/`, named like their opentechschool.org
    account and ending in `.jpg`.

  * ***Caveat for non-opentechschool.org accounts:***  If you are adding
    members to your chapter which do not yet have an opentechschool.org
    account, you can use an alternative syntax:

        members:
          - charlie: Charlie Jones

    The first value acts as an image key, the second as a name.  It is not
    possible to add emails for non-opentechschool.org accounts for privacy
    reasons.  (While we are confident that opentechschool.org accounts won't
    receive large amounts of spam, we can't guarantee that for third-party
    accounts and thus wouldn't want to publish them unmasked on the Web.)


### Optional metadata

All the following values can go into the preamble as well:

* `tagline` is a catchy, single line in the top banner of the page describing
   your chapter/city in a playful way.
* `twitter` is your chapter's Twitter account.
* `meetup` is the group name on Meetup and would result in links to
  `https://meetup.com/$meetup`.  It defaults to `opentechschool-$city`.
* `does` is the list of projects present in your chapter.  It defaults to
  `[workshops]`.
* `mailing_list` is the mailing list potential coaches can write to.  It is
  used in the call-to-action at the bottom of the members list and adds a neat
  *Subscribe* button.

### Redirect stub

If you don't have too much to say about your city yet and just want to redirect
to your Meetup page, do the following:

* Create a HTML(!) file in the `cities` directory (eg. `berlin.html`.)
  Redirects to *not* work with files ending in `.md`.
* Add a preamble:

  <pre>
  &#45;&#45;&#45;
  title: My City
  location: City, Country
  redirect_to: "http://meetup.com/opentechschool-city"
  &#45;&#45;&#45;
  </pre>

  (See above for a description of the values.)
