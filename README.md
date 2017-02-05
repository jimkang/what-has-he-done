what-has-he-done
==================

[Website](http://jimkang.com/what-has-he-done/)

Lists the actions the Trump administration has made since taking office. Actions include such policy changes and orders to government agencies.

As important as they are, it excludes Trump statements that are not actions.

Contributing
-------------

I would love your help!

**Citizen journalism**

For now, the only way you can add a Trump deed to this is if you are familiar with GitHub and YAML. The steps are:

- Fork this repo.
- Edit [deeds.yaml](https://github.com/jimkang/what-has-he-done/blob/gh-pages/data/deeds.yaml) in your fork.
- Add an entry to the file. An entry looks like this:

    -
      name: Trump forces out Border Patrol chief
      stamp: 2017-01-26
      description: >
        <blockquote>Border Patrol Chief Mark Morgan said he was asked to leave and decided to resign rather than fight the request, according to a U.S. official with knowledge of the brief video conference in which Morgan informed senior agents of the change.</blockquote>
      urls:
        -
          name: Official: Border Patrol chief tells agents he was forced out
          url: http://www.chicagotribune.com/news/nationworld/ct-border-patrol-chief-exits-20170126-story.html
      tags:
      - dismantling
      - destablization

The name, stamp, and at least one url is required. Everything else is optional.

- After your edits, make sure the file validates in [YAML Lint](http://www.yamllint.com/).
- Make a pull request back to this repo.
- I'll then review and merge it if it looks good.

There is a [web app](http://jimkang.com/what-has-he-done/add-deed/) for submitting deeds in the works, but it's not ready yet.

**Development**

[Open issues are here.](https://github.com/jimkang/what-has-he-done/issues)

Structure
------

There's two apps here:

1. [The presenter app](http://jimkang.com/what-has-he-done/).
2. [The submission app](http://jimkang.com/what-has-he-done/add-deed/), which is for submitting deeds to be added.

These are both JavaScript apps that are built with [Browserify](http://browserify.org/). Browserify lets you structure your app as Node-style modules. The apps are a collection of modules. The entry points for the modules are app.js and add-deed-app.js. Each of those compiles into a single index.js that is referenced by an html file.

TODO


Development setup
------------

First, install Node. Then:

    npm install
    npm install wzrd -g

Run it with:

    make run

Then, wzrd will say something like:

    wzrd index.js
    server started at http://localhost:9966

You can open your browser to that.

Run `make lint` and before committing.

Tests
-----

Run tests with `make test`.

License
-------

The MIT License (MIT)

Copyright (c) 2017 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
