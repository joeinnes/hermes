/* global Users */
Meteor.publish('users', function() {
  return Meteor.users.find({}, {fields: {password: 0, hash: 0, services: 0}});
});