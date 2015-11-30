Meteor.methods({
  delete: function (messageId) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("You are not logged in");
    }

    var author = Messages.findOne(messageId).author;
    
    if (Meteor.userId() !== author) {
      throw new Meteor.Error("You are not the author of this message");
    }
    
    Messages.remove(messageId);
  },
});