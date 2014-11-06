/* global Prism */

import Ember from 'ember';

export default Ember.Component.extend({
  
  language: 'markup',
  tagName: 'pre',
  
  languageClass: function() {
    return 'language-' + this.get('language');
  }.property('language'),
  
  didInsertElement: function() {
    this._super();
    var el = this.$('code')[0];
    Prism.highlightElement(el);
  }
  
});
