var React = require("react");
var ReactDOM = require("react-dom");
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

    if (reactClass) {
      var descriptor = React.createElement(
        ContextWrapper(context, reactClass),
        this._props
      );

      this._reactComponent = ReactDOM.render(descriptor, el);
    }
  },
  didInsertElement: function() {
    this.renderReact();
  },

  willDestroyElement: function() {
    var el = get(this, 'element');
    ReactDOM.unmountComponentAtNode(el);
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
      reactComponent.updateProps(this._props)
    }
    return value;
  }

});

function ContextWrapper(context, Component) {

  var contextTypes = {};
  for(var key in context) {
    if(!context.hasOwnProperty(key)) continue;
    contextTypes[key] = React.PropTypes.any;
  }

  return React.createClass({

    childContextTypes: contextTypes,

    getInitialState(){
      return {childProps: this.props};
    },

    getChildContext: function() {
      return context;
    },

    updateProps: function(newProps) {
      this.setState({childProps: newProps})
    },

    render: function() {
      return <Component {...this.state.childProps} />;
    }

  });

}

module.exports = ReactComponent;
