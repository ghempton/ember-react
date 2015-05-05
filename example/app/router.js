import Ember from 'ember';
import config from './config/environment';

var EmberRouter = Ember.Router.extend({
  location: config.locationType,
  updateReactRouter: function() {
    var loc = this.location.location,
        fullUrl = loc.pathname + loc.search;
    if(lastMatch && lastMatch.Handler.match(fullUrl)) {
      if(lastMatch.state.path !== fullUrl) {
        lastMatch.Handler.transitionTo(fullUrl);
      }
    }
  }.on('didTransition')
});

EmberRouter.map(function() {
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

import ProfilesIndex from './react/profiles/index';
import Routing from './react/routing';

var Root = React.createClass({

  render: function() {
    return (
      /* jshint ignore:start */
      <ReactRouter.RouteHandler {...this.props} />
      /* jshint ignore:end */
    );
  }

});

var Route = ReactRouter.Route;

var routes = (
  /* jshint ignore:start */
  <Route handler={Root} path="/ember-react/">
    <Route name="profiles" path="react/profiles" handler={ProfilesIndex} />
    <Route name="routing" path="react/routing" handler={Routing} />
  </Route>
  /* jshint ignore:end */
);

var lastMatch, outletElement;


window.didInsertReactOutlet = function(element) {
  ReactRouter.run(routes, ReactRouter.HistoryLocation, function(Handler, state) {
    lastMatch = { Handler, state };
    var element = document.getElementById('react-outlet');
    /* jshint ignore:start */
    React.render(<Handler query={state.query} />, element);
    /* jshint ignore:end */
  });
}

window.willDestroyReactOutlet = function(element) {
  // unmounting will stop the router
  React.unmountComponentAtNode(element);
}

export default EmberRouter;
