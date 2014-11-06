import Ember from "ember";

export default Ember.Component.extend({
  
  size: 80,
  
  d: 'identicon',
  
  email: null,
  
  emailHash: function() {
    var email = this.get('email');
    return email && md5(email);
  }.property('email'),
  
  url: function() {
    var emailHash = this.get('emailHash'),
        size = this.get('size'),
        d = this.get('d');
    return "http://www.gravatar.com/avatar/" + emailHash + "?s=" + size + "&d=" + d;
  }.property('emailHash', 'size')
  
});
