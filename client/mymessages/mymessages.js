/* global TimeSync */
/* global moment */
/* global Email */
/* global Gravatar */
/* global ReactiveVar */
/* global Messages */
Template.mymessages.helpers({
	// the posts cursor
	messages: function () {
		return Template.instance().messages();
	},
	// are there more posts to show?
	hasMoreMessages: function () {
		return Template.instance().messages().count() >= Template.instance().limit.get();
	},
	getAvatarUrl: function(userId) {
		var options = {
			secure: true,
			size: 64
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
	}
});

Template.mymessages.events({
	'click .load-more': function (event, instance) {
		event.preventDefault();

		// get current value for limit, i.e. how many posts are currently displayed
		var limit = instance.limit.get();

		limit += 20;
		instance.limit.set(limit);
	},
	'click .delete': function (event) {
		var messageId = event.target.id;
		Meteor.call('delete', messageId, function(error, result) {
			if (error) {
				Bert.alert('Couldn\'t delete message! ' + error, 'danger', 'growl-top-right');
			} else {
				Bert.alert('Message deleted!', 'success', 'growl-top-right');
			}
		})
		// Call delete this
	}
});

Template.mymessages.onCreated(function () {

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
		var search = new RegExp('@' + Meteor.user().username, 'g');
		return Messages.find({ message: { $regex: search } }, { limit: instance.loaded.get(), sort: {createdAt: -1} });
	}
});