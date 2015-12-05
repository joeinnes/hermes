Meteor.publish('messages', function(limit) {
  return Messages.find({}, {limit: limit, sort: {createdAt: -1}});
});

