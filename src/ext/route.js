
Ember.Route.reopen({
  
  render: function(name, options) {
    if (typeof name === 'object' && !options) {
      options = name;
      name = this.routeName;
    }
    if(options && options.react) {
      var container = this.container,
          containerName = 'view:' + name;
          
      name = name || this.routeName;
      
      if(!container.has(containerName)) {
        var View = ReactComponent.extend({
          reactClass: options.react,
          rootPath: this.router.generate(this.routeName)
        });
        this.container.register(containerName, View);
      }
    }
    this._super.apply(this, arguments);
  }
  
});
