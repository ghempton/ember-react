import Ember from "ember";

export default Ember.ArrayController.extend({
  itemController: 'profiles.item',
  queryParams: ['page'],
  
  nextPage: function() {
    var page = this.get('page') || 1;
    return parseInt(page) + 1;
  }.property('page'),
  
  prevPage: function() {
    var page = this.get('page');
    return page > 1 && parseInt(page) - 1; 
  }.property('page'),
  
  selection: Ember.computed.filterBy('', 'isSelected')
});
