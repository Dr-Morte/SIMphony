Capstone Project : Simphony
===========================
## CSCE 482 FALL 2018 CAPSTONE PROJECT
## Team : Simphony
## Members: Dario Avendano, Richard Padilla, Austin Ruff, Kyle Streng

Important Info
==

The project is built on the template rendering engine, Handlebars, so instead of writing your html content in an html file, you will write it in the handlebars file corresponding to that page ("home.handlebars" for the home page, "error.handlebars" for the error page, etc.).

The javascript for the project will be written in the app.js file, unless the script for the website gets too long, and we have a separatable code base.

Images and other things that are not scss, css, js, or handlebars files go in the etc folder, probably in a subfolder within.

Build Instructions
==================

To build the project, run "foundation watch" from the foundation cli, this should start a server on localhost and update source files as needed.  This is currently used to automate building the sass compiled css files.

I highly recommend installing "nodemon" as a global npm package and using that to continuously run the server with "nodemon server.js".  This will restart the server locally any time there is a file changed, which will make development much smoother.