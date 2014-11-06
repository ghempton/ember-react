/** @jsx React.DOM */
/* global Prism */

export default React.createClass({
  
  getDefaultProps: function() {
    return {
      language: 'markup'
    };
  },
  
  componentDidMount: function() {
    Prism.highlightElement(this.refs.code.getDOMNode());
  },
  
  componentDidUpdate: function() {
    Prism.highlightElement(this.refs.code.getDOMNode());
  },
  
  render: function() {
    var languageClass = "language-" + this.props.language;
    return (
      <pre>
        <code ref="code" className={languageClass}>{this.props.children}</code>
      </pre>
    );
  }
  
});
