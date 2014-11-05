import ReactHelper from './helper';
import ReactComponent from './component';

export default {
  name: "ember-react",
  
  initialize: function(container, application) {
    container.register('helper:react', ReactHelper);
    container.register('component:react', ReactComponent);
  }
};
