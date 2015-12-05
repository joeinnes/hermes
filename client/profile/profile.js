Template.profile.helpers({
	getUser: function () {
		var username = FlowRouter.getParam('username');
		return Meteor.users.findOne({ username: username });
	},
	// the posts cursor
	messages: function () {
		return Template.instance().messages();
	},
	// are there more posts to show?
	hasMoreMessages: function () {
		return Template.instance().messages().count() >= Template.instance().limit.get();
	},
	getAvatarUrl: function(userId, size) {
		var options = {
			secure: true,
			size: size
		};
		var userEmail = Meteor.users.findOne(userId).emails[0].address;
		var url = Gravatar.imageUrl(userEmail, options);
		return url;
	},
	createdAtTime: function(createdAt) {
		return moment(createdAt).from(TimeSync.serverTime());
	},
	usersOwn: function(userId) {
		if (Meteor.userId() === userId) {
			return true;
		} else {
			return false;
		}
	},
	following: function() {
		var username = FlowRouter.getParam('username');
		var viewingUserId = Meteor.users.findOne({ username: username })._id;
		var following = Meteor.users.find({ _id: Meteor.userId(), "profile.subscriptions": viewingUserId}).count();
		if (following > 0) {
			return true;
		} else {
			return false;
		}
	}
});

Template.profile.events({
	'click .load-more': function (event, instance) {
		event.preventDefault();

		// get current value for limit, i.e. how many posts are currently displayed
		var limit = instance.limit.get();

		limit += 20;
		instance.limit.set(limit);
	},
	'click .subscribe': function () {
		var username = FlowRouter.getParam('username');
		var viewingUser = Meteor.users.findOne({ username: username });
		Meteor.users.update( { _id: Meteor.userId() }, { $push: {"profile.subscriptions": viewingUser._id}} );
		Bert.alert('Successfully subscribed', 'success', 'growl-top-right');
	},
	'click .unsubscribe': function () {
		var username = FlowRouter.getParam('username');
		var viewingUser = Meteor.users.findOne({ username: username });
		Meteor.users.update( { _id: Meteor.userId() }, { $pull: {"profile.subscriptions": viewingUser._id}} );
		Bert.alert('Successfully unsubscribed', 'success', 'growl-top-right');
	}
});

Template.profile.onCreated(function () {

	var instance = this;

	instance.loaded = new ReactiveVar(0);
	instance.limit = new ReactiveVar(20);

	instance.autorun(function () {
		var limit = instance.limit.get();
		var subscription = instance.subscribe('messages', limit);
		if (subscription.ready()) {
			instance.loaded.set(limit);
		}
	});

    instance.messages = function () {
		var username = FlowRouter.getParam('username');
		return Messages.find({ username: username }, { limit: instance.loaded.get(), sort: { createdAt: -1 } });
	}
});