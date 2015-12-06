Meteor.publish('messages', function(limit, query) {
  var selector = {};
  if (query) {
    selector = query;
  }
  console.log(limit);
  return Messages.find(selector, {limit: limit, sort: {createdAt: -1}});
});

