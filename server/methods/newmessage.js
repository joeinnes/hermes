Meteor.methods({
  newMessage: function (text) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("You are not logged in");
    }

    Messages.insert({
      message: text,
      createdAt: new Date(),
      author: Meteor.userId(),
      username: Meteor.user().username
    });
  },
});