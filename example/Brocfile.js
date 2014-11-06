/* global require, module */

// not made into an addon (yet?), so just preprocess the app tree
var react = require('broccoli-react');
var pickFiles = require('broccoli-static-compiler');

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

// Broccoli rox! Just include the parent project's brocfile to get dynamic build output!
var emberReactTree = require('../Brocfile.js');

emberReactTree = pickFiles(emberReactTree, {
  srcDir: '/',
  destDir: 'ember-react'
});

var app = new EmberApp({
  wrapInEval: false,
  trees: {
    vendor: emberReactTree,
    app: react('app')
  }
});

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

app.import('bower_components/moment/moment.js');
app.import('bower_components/blueimp-md5/js/md5.js');

app.import('bower_components/prism/prism.js');
app.import('bower_components/prism/themes/prism.css');

app.import({
  production: 'bower_components/react/react-with-addons.min.js',
  development: 'bower_components/react/react-with-addons.js'
});
app.import({
  production: 'vendor/react-router/dist/react-router.min.js',
  development: 'vendor/react-router/dist/react-router.js'
});
app.import('vendor/ember-react/ember-react.global.js');
app.import('bower_components/Faker/build/build/faker.js');

module.exports = app.toTree();
