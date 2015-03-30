import Ember from 'ember';

import ProfilesIndex from '../react/profiles/index';
import Routing from '../react/routing';

var Routes = ReactRouter.Routes,
    Route = ReactRouter.Route;

export default Ember.Route.extend({

  renderTemplate: function() {
    var rootPath = this.router.generate(this.routeName);
    this.render({
      react: React.createClass({
        render: function() {
          return (
            <Routes location="history">
              <Route name="profiles" path={rootPath + '/profiles'} handler={ProfilesIndex} />
              <Route name="routing" path={rootPath + '/routing'} handler={Routing} />
            </Routes>
          );
        }
      })
    });
  }

});
