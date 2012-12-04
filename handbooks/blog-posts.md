---
layout: simple
title: Contributing to the blog
---

So you want to contribute to the blog? That is great! So without further ado let's dive right into how you can do this.

## Introduction
Our blog is hosted on [Github Pages](http://pages.github.com), a static HTML hosting provider from github. We use the normal Github Tools, like Issues, Markdown and Pull-Request to manage our blog as well. So the process is as usual: either via Fork, Write, Pull-Request (for git/github users) or via the Wiki, Issues and emails. If you do not know what Forking means, you probably want to skip right to the [second way of doing it](#via-wiki-and-issues)

## Fork &raquo; Write &raquo; Pull-Reqest
The Source of the blog can found in the [blog.opentechschool.org repository](https://github.com/OpenTechSchool/blog.opentechschool.org) of the OpenTechSchool account. Simply fork the repository by clicking on the "Fork" on the top right.

### Starting Jekyll
This creates your own version of the repository in your account, which you can clone onto your computer. The tool that github pages are hosted on is called [jeykll](https://github.com/mojombo/jekyll/wiki). If you like to see a preview of what it looks like rendered, you should install and run it inside the newly created repo via:

``$ jekyll --serve --auto``

Then point your browser to ``http://localhost:4000``

### Create a post
Now you can create a new blog post via the rake command like this:

``rake post title="My Awesome Day at OpenTechSchool" date="2012-05-24"``

Which creates a new file for you in the _posts/ folder with the name of exactly that date and the title. This will be used by jekyll to put the date into the post meta information as well. So if you want to change the date of the post, rename the file.

### The metadata
Once you opened that newly created file, you'll find that there is a header section encapsulated by three dashes and a first include directive like this:

    ---
    layout: post
    title: "My Awesome Day at OpenTechSchool"
    description: ""
    category: 
    tags: []
    ---
    {% raw %}{% include JB/setup %}{% endraw %}

This top part is metadata information in the [YAML](http://en.wikipedia.org/wiki/YAML)-Format. We generally do not use the description and category so feel free to removes those lines. Instead you can add an author (with your name as the value), an image (if you provide a nice teaser picture with your post) and a teaser, which would be shown on the index-page instead of the whole content. On top, we have build-in support for google-groups-signup forms.

A great example on how to use all of those is in the blog post ``_posts/2012-09-26-stockholm-calling.md". Take a peak there if you are unsure on whether you are doing it right.

### The content

Everything under these lines is published as the content of the blog post. You can simply write it down as you feel appropriate and if you want to do some formatting, please look on how to do this via [markdown](http://daringfireball.net/projects/markdown/syntax), which is the syntax we are using. Again, peaking at any other blog post that makes it look like the way you want it to, probably helps.

### Commit, push, Pull-Request

Once you are done and happy with the rendered result of your blog post, add it to the git repository, commit the file and push it onto your github fork. Then go to your repository on github and click on "Pull Request" to make these changes be issued to the content team. They will now review your post and do some copy-editing if necessary before it gets published.

You'll get notified about that by an update on your pull-request.

## Via Wiki and Issues
Now, if you are not too familiar with git and github but still want to write a blog post, there is a second not that complex but also less powerfull way of doing it (for e.g. you can't really attach any pictures easily).

