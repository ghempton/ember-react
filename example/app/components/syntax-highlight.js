/* global Prism */

export default Ember.Component.extend({
  
  language: 'markup',
  tagName: 'pre',
  
  languageClass: function() {
    return 'language-' + this.get('language');
  }.property('language'),
  
  didInsertElement: function() {
    this._super();
    var el = $('code')[0];
    Prism.highlightElement(this.get('element'));
  }
  
});
