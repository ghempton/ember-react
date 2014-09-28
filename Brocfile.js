var fs = require('fs');
var traceur = require('broccoli-traceur');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');
var writeFile = require('broccoli-file-creator');
var moveFile = require('broccoli-file-mover');
var concat = require('broccoli-concat');
var uglify = require('broccoli-uglify-js');
var removeFile = require('broccoli-file-remover');
var defeatureify = require('broccoli-defeatureify');
var replace = require('broccoli-replace');
var react = require('broccoli-react');

var calculateVersion = require('./lib/calculate-version');

var licenseJs = fs.readFileSync('./generators/license.js').toString();

var devAmd = (function() {
  var tree = pickFiles('src', {
    srcDir: '/',
    destDir: 'ember-react'
  });
  tree = moveFile(tree, {
    srcFile: 'ember-react/index.js',
    destFile: '/ember-react.js'
  });
  tree = react(tree);
  var transpiled = traceur(tree, {
    moduleName: true,
    modules: 'amd'
  });
  return concat(transpiled, {
    inputFiles: ['**/*.js'],
    outputFile: '/ember-react.amd.js'
  });
})();

var prodAmd = (function() {

  var tree = moveFile(devAmd, {
    srcFile: 'ember-react.amd.js',
    destFile: '/ember-react.prod.amd.js'
  });

  tree = defeatureify(tree, {
    enabled: true,
    enableStripDebug: true,
    debugStatements: [
      "console.assert"
    ]
  });

  return tree;

})();

var vendor = 'bower_components';

function concatStandalone(tree, inputFile, outputFile) {
  var iifeStart = writeFile('iife-start', '(function() {');
  var iifeStop  = writeFile('iife-stop', '})();');
  var bootstrap = writeFile('bootstrap', 'this.EmberReact = requireModule("ember-react")["default"];\n');

  var trees = [vendor, iifeStart, iifeStop, bootstrap, tree];

  return concat(mergeTrees(trees), {
    inputFiles: [
      'iife-start',
      'loader/loader.js',
      inputFile,
      'bootstrap',
      'iife-stop'
    ],
    outputFile: outputFile
  });
}


var devStandalone = concatStandalone(devAmd, 'ember-react.amd.js', '/ember-react.global.js');
var prodStandalone = concatStandalone(prodAmd, 'ember-react.prod.amd.js', '/ember-react.prod.global.js');

var minStandalone = (function() {

  var tree = moveFile(prodStandalone, {
    srcFile: 'ember-react.prod.global.js',
    destFile: '/ember-react.prod.global.min.js'
  });
  return uglify(tree);

})();

var bowerJSON = writeFile('bower.json', JSON.stringify({
  name: 'ember-react',
  version: 'VERSION_STRING_PLACEHOLDER',
  license: "MIT",
  main: 'ember-react.js',
  ignore: ['docs', 'test', 'testem.js'],
  keywords: [
    "ember",
    "react",
    "react-router",
    "mvc"
  ]
}, null, 2));

distTree = mergeTrees([bowerJSON, devAmd, prodAmd, devStandalone, prodStandalone, minStandalone]);
distTree = replace(distTree, {
  files: [ '**/*.js' ],
  patterns: [
    { match: /^/, replacement: licenseJs }
  ]
});
distTree = replace(distTree, {
  files: [ '**/*' ],
  patterns: [
    { match: /VERSION_STRING_PLACEHOLDER/g, replacement: calculateVersion }
  ]
});

module.exports = distTree;
