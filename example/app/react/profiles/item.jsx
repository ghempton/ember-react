import GravatarDisplay from '../gravatar-display';
import TimeAgo from '../time-ago';

export default React.createClass({

  getDefaultProps: function() {
    return {
      selected: false,
      onChange: function() {}
    };
  },

  handleChange: function(evt) {
    var value = evt.target.checked;
    this.props.onChange(value);
  },

  render: function() {
    var className = this.props.selected ? 'selected' : '';
    var model = this.props.model;
    return (
      <li className={className}>
        <input type="checkbox" checked={this.props.selected} onChange={this.handleChange} />
        <GravatarDisplay email={model.get('email')} size="24" />
        <div className="name">{model.get('name')}</div>
        <div className="email">{model.get('email')}</div>

        <ul className="tags">
          {
            model.get('tags').map(function(tag) {
              return <li>{tag.get('name')}</li>;
            }, this)
          }
        </ul>

        <TimeAgo date={model.createdAt} />
      </li>
    );
  }

});
