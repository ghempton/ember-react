/* global faker */

import Ember from "ember";

import Tag from './tag';

var Profile = Ember.Object.extend({
  name: null,
  email: null,
  createdAt: null,
  tags: null
});

var cache = [];

Profile.reopenClass({
  
  load: function(page) {
    page = page || 1;
    if(cache[page]) {
      return cache[page];
    }
    var res = [];
    for(var i = 0; i < 100; i++) {
      res.push(this.generate());
    }
    return cache[page] = res;
  },
  
  generate: function() {
    var tags = [];
    for(var num = Math.random() * 6, j = 0; j < num; j++) {
      tags.push(Tag.generate());
    }
    return this.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      createdAt: faker.date.recent(),
      tags: tags
    });
  }
  
});

export default Profile;
