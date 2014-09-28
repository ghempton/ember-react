import ReactComponent from '../components/react';

var EmberHandlebars = Ember.Handlebars;

var helper = function(name, options) {
  var hash = options.hash;
  hash.name = name;
  return EmberHandlebars.helpers.view.call(this, ReactComponent, options);
};

EmberHandlebars.registerHelper('react', helper);
