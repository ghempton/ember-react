/** @jsx React.DOM */

import SyntaxHighlight from './syntax-highlight';

export default React.createClass({
  
  render: function() {
    return (
<div className="content">
<h1>Routing</h1>

<p>Ember-React extends Ember.Route with support for rendering the route's template as a react component. Specifically, Ember-React adds an additional <code>react:</code> hash parameter to the <code>render()</code> function:</p>

<SyntaxHighlight language="javascript">
renderTemplate: function() &#123;
  this.render(&#123;react: ...&#125;);
&#125;
</SyntaxHighlight>

<p>Ember-React also plays well with <a href="https://github.com/rackt/react-router">React-Router</a>. Simply pass in a react class containing a &lt;Routes&gt; component. See the source of this example.</p>
</div>
    );
  }
  
});
