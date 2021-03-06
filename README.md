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
<a name="yaml-example-entry">
```
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
```
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

**Presenter app**

`index.html` contains the static content in the app, which is mostly just text and a `<section>` tag. It's the first thing the browser loads. It then loads `index.js`.

`index.js`, in production, is a single JavaScript file containing all of the application logic.

It is built from several modules, each with its own job. [Browserify](http://browserify.org/). Browserify stitches them into a single index.js for easy consumption by the browser.

Modules are units of code that have their own scope. They can export functions or objects or values out of their scope. e.g.:

    const heyString = 'hey';

    function sayHey() {
      console.log(heyString);
    }

    module.exports = sayHey;

In the above module `heyString` is not available outside of the module, but `sayHey` is.

Modules reference each other with `require`. e.g.:

    var sayHey = require('./say-hey');
    var request = require('basic-browser-request');

    function sayHeyIfGoogleIsUp() {
      var reqOpts = {
        url: 'https://google.com',
        method: 'GET'
      };
      request(reqOpts, decideOnResponse);
    }

    function decideOnResponse(error, response, body) {
      if (error) {
        console.error(error);
      }
      else if (response.statusCode === 200) {
        sayHey();
      }
      else {
        console.log(`Got status code ${response.statusCode} for google.com.`);
      }
    }

    module.exports = sayHeyIfGoogleIsUp;

Here, the function exported by the `say-hey` module is stored in the variable `sayHey`. Similarly, the function exported by the `basic-browser-request` module is stored in `request`. The argument to `require` to pull in `say-hey` starts with a `.`. This indicates that it's a file path, and the module is to be found on the local file system. When a `require` argument does not start with a `.`, that indicates that it's an external Node module has been installed from [NPM](https://docs.npmjs.com/getting-started/what-is-npm).

In the case of this app, the root module is defined in `app.js`. It has an [IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) named `go` that kicks everything off. You can think of it like `main()` in a C program. Right now, all it does is call `route`.

`route` parses the URL hash (which it expects to be key-value pairs, like '#dataURL=http://something.com/data.yaml&what=something') into a dictionary that tells the app what to present. It looks for a `dataURL` param. If it finds that, it will use data from that URL. (In the future, things may not be this flexible.) If it does not find that parameter, it defaults to `data/deeds.yaml`.

Then, it asks the [list-em-all module](https://github.com/jimkang/list-em-all) to load that data. If the load is successful, `updateAllThings` sorts the loaded deeds, then asks `renderCurrentRoute` to filter the deeds by tags specified in the route, then calls list-em-all to render them.

In the near future, there will be other views that will present the data in ways other than the `list-em-all`-style list.

**Submission app**

The submission app works like this:

1. Gather and validate information comprising an adminstration deed from the form.
2. Either retrieve a stored GitHub API token if it's there or send the user to GitHub to get one.
3. Submit a commit that adds to the list of deeds to a [git repo](https://github.com/jimkang/what-has-he-done-data).

`add-deed/index.html` contains the static content in the app, which is a form that contains fields that corresponds to the properties of a [YAML entry](https://github.com/jimkang/what-has-he-done#yaml-example-entry). It's the first thing the browser loads. It then loads `add-deed/index.js`.

`index.js`, in production, is a single JavaScript file containing all of the application logic.

For the submission app, the root module is defined in `add-deed-app.js`. As in the presenter app, it has an IIFE named `go` that calls `route`.

`route` in this app parses the hash, and then calls `findToken` (defined in `find-token.js`). 

`findToken`'s job is to callback with a valid GitHub API token, either by finding it in a store object or by exchanging a code from the GitHub API for one. 

It looks for a `tokenInfo` property in whichever `store` object you send it. In this case, we're sending it `window.localStorage`, so it's looking for `tokenInfo` in local storage. If it finds it, it calls back with that. If it doesn't find one but does find a `code` param in the URL route, it calls a [service](https://github.com/jimkang/github-token-exchanger) to trade the code for a token, stores that token, then calls back with the token.

Once it has the token, it passes it to [DeedSubmitter](https://github.com/jimkang/what-has-he-done/blob/gh-pages/deed-submitter.js). Deed submitter is a module that exports two functions:

- `submitDeed`, which takes a [deed entry](https://github.com/jimkang/what-has-he-done#yaml-example-entry), fetches the existing list of deeds, adds the deed to it, then makes a commit to GitHub with the new list.

- `getDeeds`, which fetches the current list of deeds from GitHub.

`submitDeed` is connected to the UI via [wireAddButton](https://github.com/jimkang/what-has-he-done/blob/gh-pages/representers/wire-add-button.js), a function that:

- Connects the click event listener for the form button to a function that validates the form input.
- Validates the form button and passes the form values to an external function (in this case, `submitDeed`).

Modules that interact with the DOM will all be kept in  `/representers`.

Style
-----

- Make sure everything adheres to style rules by running `eslint .`.
- Use closures and currying instead of prototypal inheritance. By doing this, we avoid having to be careful with `this` and binding. When we pass a function to another function, we know they can be used safely without having to take special care to set up its context. While prototypal inheritance would give us faster instantiation than closures (40 times faster, 7 ns vs. 280 ns in a simple case (http://trevnorris.github.io/NodeDay/#/13)), we do not instantiate anywhere near enough for it to matter.
- Favor functions as logical units over objects.

Development setup
------------

First, install Node. Then:

    npm install
    npm install wzrd -g
    npm install eslint -g

Run it with:

    make run

Then, wzrd will say something like:

    wzrd index.js
    server started at http://localhost:9966

You can open your browser to that.

Run `eslint .` and before committing.

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
