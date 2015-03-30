var get = Ember.get;

/**
  Renders a React component with the passed in options hash
  set as props.

  Usage:

  ```handlebars
    {{react 'my-component' value=value onChange=valueChanged}}
  ```
*/
var ReactComponent = Ember.Component.extend({

  _props: null,
  _reactComponent: null,
  componentName: null,
  tagName: 'div',

  // These cannot be unknown properties or else: https://github.com/emberjs/ember.js/issues/10400
  helperName: null,
  _morph: null,
  renderer: null,

  reactClass: Ember.computed(function() {
    var container = get(this, 'container'),
        name = get(this, 'componentName');

    return container.lookupFactory('react:' + name);
  }).property('componentName'),

  buildReactContext: function() {
    var container = get(this, 'container'),
        controller = get(this, 'controller');

    return {
      container: container,
      controller: controller
    };
  },

  renderReact: function() {
    var el = get(this, 'element'),
        reactClass = get(this, 'reactClass'),
        controller = get(this, 'controller'),
        context = this.buildReactContext();

    var props = this._props || {};
    props.model = props.model || get(controller, 'model');

    var descriptor = React.withContext(context, function() {
      if(React.isValidElement(reactClass)) {
        return reactClass;
      } else {
        return React.createElement(reactClass, this._props);
      }
    }.bind(this));

    this._reactComponent = React.render(descriptor, el);
  },

  didInsertElement: function() {
    this.renderReact();
  },

  willDestroyElement: function() {
    var el = get(this, 'element');
    React.unmountComponentAtNode(el);
  },

  unknownProperty: function(key) {
    return this._props && this._props[key];
  },

  setUnknownProperty: function(key, value) {
    var reactComponent = this._reactComponent;
    if(!this._props) {
      this._props = {};
    }
    this._props[key] = value;
    if(reactComponent) {
      var props = {};
      props[key] = value;
      reactComponent.setProps(props);
    }
    return value;
  }

});

export default ReactComponent;
