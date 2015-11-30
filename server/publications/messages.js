Meteor.publish('messages', function(limit) {
  return Messages.find({}, {limit: limit});
});