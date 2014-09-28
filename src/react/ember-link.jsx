/** @jsx React.DOM */

export default React.createClass({
  displayName: 'EmberLink',
  contextTypes: {
    container: React.PropTypes.object
  },
  propTypes: {
    to: React.PropTypes.string.isRequired,
    context: React.PropTypes.object,
    query: React.PropTypes.object
  },
  getRouterArgs: function() {
    var args, context;
    args = [this.props.to];
    context = this.props.context || this.props.params;
    if (context) {
      if (Array.isArray(context)) {
        args = args.concat(context);
      } else {
        args.push(context);
      }
    }
    if (this.props.query) {
      args.push({
        query: this.props.query
      });
    }
    return args;
  },
  getHref: function() {
    var router;
    router = this.context.container.lookup('router:main');
    return router.generate.apply(router, this.getRouterArgs());
  },
  handleClick: function(e) {
    var router;
    if (!e.defaultPrevented && !(e.button === 1 || e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      router = this.context.container.lookup('router:main');
      return router.transitionTo.apply(router, this.getRouterArgs());
    }
  },
  render: function() {
    return <a href={this.getHref()} onClick={this.handleClick}>{this.props.children}</a> 
  }
});
