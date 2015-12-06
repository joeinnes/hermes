/* global TimeSync */
/* global moment */
/* global Email */
/* global Gravatar */
/* global ReactiveVar */
/* global Messages */
Template.timeline.helpers({
	// the posts cursor
	messages: function () {
		Template.instance().messages();
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
	},
});

Template.timeline.events({
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

Template.timeline.onCreated(function () {

	var instance = this;
	var subscriptions = Meteor.user().profile.subscriptions || [];
	var query = {author: { $in: subscriptions }};

	Session.setDefault('itemsLimit', ITEMS_INCREMENT);

	instance.autorun(function () {
		instance.subscribe('messages', Session.get('itemsLimit'), query);
	});

	instance.messages = function () {
		if (subscriptions.length) {
			return Messages.find({}, { limit: Session.get('itemsLimit'), sort: {createdAt: -1} });
		} else { 
			return [];
		}
	}
});