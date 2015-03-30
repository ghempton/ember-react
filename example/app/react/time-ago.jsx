export default React.createClass({

  render: function() {
    var date = this.props.date;
    return <time datetime={date}>{moment(date).fromNow()}</time>;
  }

});
