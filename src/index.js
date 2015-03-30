import EmberLink from './ember-link';
import ReactComponent from './component';
import initializer from './initializer';
import './ext/route';

var EmberReact = {
  EmberLink: EmberLink,
  ReactComponent: ReactComponent,
  initializer: initializer
};

Ember.Application.initializer(initializer);

export default EmberReact;
