import ReactHelper from '../helpers/react';
import ReactComponent from '../components/react';

export default {
  name: "ember-react",
  
  initialize: function(container, application) {
    container.register('helper:react', ReactHelper);
    container.register('component:react', ReactComponent);
  }
};
