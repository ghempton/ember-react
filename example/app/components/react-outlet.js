import Ember from "ember";

export default Ember.Component.extend({

  elementId: 'react-outlet',

  didInsertElement: function() {
    var element = this.get('element');
    window.didInsertReactOutlet(element);
    this._super();
  },

  willDestroyElement: function() {
    var element = this.get('element');
    window.willDestroyReactOutlet(element);
    this._super();
  }

});
