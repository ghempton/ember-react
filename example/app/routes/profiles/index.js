import Ember from "ember";
import Profile from '../../models/profile';

export default Ember.Route.extend({
  queryParams: {
    page: {
      refreshModel: true
    }
  },
  
  model: function(params) {
    return Profile.load(params.page || 1);
  }
  
});
