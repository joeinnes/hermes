Meteor.publish('messages', function(limit, query) {
  var selector = query || {};
  console.log(selector);
  return Messages.find(selector, {limit: limit, sort: {createdAt: -1}});
});

