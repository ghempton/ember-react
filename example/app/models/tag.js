/* global faker */

import Ember from "ember";

var Tag = Ember.Object.extend({
  name: null
});

Tag.reopenClass({
  
  generate: function() {
    return this.create({
      name: faker.company.bsAdjective()
    });
  }
  
});


export default Tag;
