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
  
  name: null,
  _props: null,
  _reactComponent: null,
  
  reactClass: Ember.computed(function() {
    var container = get(this, 'container'),
        name = get(this, 'name');
        
    return container.lookupFactory('react:' + name);
  }).property('name'),
  
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
    
    var props = this._props;
    props.model = props.model || get(controller, 'model');
    
    var descriptor = React.withContext(context, function() {
      if(React.isValidClass(reactClass)) {
        return reactClass(this._props);
      } else if(React.isValidComponent(reactClass)) {
        return reactClass;
      } else {
        throw new Ember.Error("Invalid react component or class");
      }
    }.bind(this));
    
    this._reactComponent = React.renderComponent(descriptor, el);
  },
  
  didInsertElement: function() {
    this.renderReact();
  },
  
  willDestroyElement: function() {
    var el = get(this, 'element');
    React.unmountComponentAtNode(el);
  },
  
  unknownProperty: function(key) {
    return this._props[key];
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
