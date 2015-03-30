

import Item from './item';
import Profile from '../../models/profile';

var Link = ReactRouter.Link;

export default React.createClass({

  getInitialState: function() {
    return {
      selection: [],
      profiles: []
    };
  },

  getPage: function() {
    return parseInt(this.props.query.page || 1);
  },

  componentWillMount: function() {
    this.setState({
      profiles: Profile.load(this.getPage())
    });
  },

  componentWillReceiveProps: function(props) {
    this.setState({
      profiles: Profile.load(parseInt(props.query.page))
    });
  },

  renderPrev: function() {
    var page = this.getPage();
    var prevPage = page - 1;
    if(prevPage > 0) {
      return <Link to="profiles" query={{page: prevPage}}>prev page</Link>;
    }
  },

  renderNext: function() {
    var page = this.getPage();
    var nextPage = page + 1;
    return <Link to="profiles" query={{page: nextPage}}>next page</Link>;
  },

  handleSelect: function(profile, value) {
    var selection = this.state.selection;
    if(value) {
      selection.push(profile);
    } else {
      selection.removeObject(profile);
    }
    this.forceUpdate();
  },

  render: function() {
    var selection = this.state.selection;
    return (
      <div className="profiles-index react">
        <header>
          <h1>Profiles Rendered With React</h1>

          <div className="subheader">
            <div className="selection">
              {selection.length} Selected
            </div>

            <div className="pagination">
              {this.renderPrev()}
              &nbsp;
              {this.renderNext()}
            </div>
          </div>
        </header>
        <ul className="profiles">
          {
            this.state.profiles.map(function(profile) {
              var selected = selection.indexOf(profile) !== -1;
              return <Item model={profile} selected={selected} onChange={this.handleSelect.bind(this, profile)} />;
            }, this)
          }
        </ul>
      </div>
    );
  }

});
