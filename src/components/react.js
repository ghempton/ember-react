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
  modulePrefix: 'outreach/react/',
  _props: null,
  _reactComponent: null,
  
  reactClass: Ember.computed(function() {
    var moduleName = get(this, 'modulePrefix') + get(this, 'name');
    return requireModule(moduleName)['default'];
  }).property('name'),
  
  renderReact: function() {
    var el = get(this, 'element'),
        reactClass = get(this, 'reactClass');
        
    var container = get(this, 'container');
    
    var props = this._props;
    
    props.model = props.model || this.controller.model;
    
    // need to pull the session from the controller since we could potentially
    // be dealing with a child session (all views get the global session injected)
    var view = this;
    while(!view.controller || !view.controller.session) {
      view = view._parentView;
    }
    var session = view.controller.session;
    
    var descriptor = React.withContext({container: container, session: session, controller: this.controller}, function() {
      return reactClass(this._props);
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
