BootstrapPlayground
===================

A simple AJAX template system to fiddle with Bootstrap and build rough prototypes. It's very simplistic CMS: browser based and requires no PHP or SQL backend. The magic is supplied by js/router.js

It provides 2 primary functions.

1. Intercept all links that end in *.phtml and dynamically load them in the #dynamic-container unless a data-target is specified
2. Load all div[data-load] with their linked content

This was hacked together in a few hours and comes with NO WARRANTY

Syntax:

`<a href="pages/index.phtml" data-target="#target-div" data-history="yes">`

`<div data-load="pages/sidebar.phtml">`

Getting Started
---------------
Upload files to a webserver or place them under your local http server. (It can't be used through file:// protocol because of cross-domain security policies in e.g. Chrome). For a quick, no-install server try [Mongoose](http://cesanta.com/mongoose.shtml).

Edit the less files and compile to CSS through command line or a tool like [Koala](http://koala-app.com)