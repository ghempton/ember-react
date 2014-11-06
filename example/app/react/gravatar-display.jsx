/** @jsx React.DOM */

export default React.createClass({
  
  getDefaultProps: function() {
    return {
      size: 80,
      d: 'identicon'
    };
  },
  
  getUrl: function() {
    var emailHash = md5(this.props.email),
        size = this.props.size,
        d = this.props.d;
    return "http://www.gravatar.com/avatar/" + emailHash + "?s=" + size + "&d=" + d;
  },
  
  render: function() {
    return <img className="gravatar-display-component" src={this.getUrl()} width={this.props.size} height={this.props.size} />;
  }
  
});
