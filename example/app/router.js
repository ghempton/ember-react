import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('ember', function() {
    this.route('react-components');
    this.resource('profiles', function() {
      this.resource('profile', {path: '/:profile_id'});
    });
  });
  this.resource('react', function() {
    this.route('route', {path: '/*_'});
  });
});

export default Router;
