/* global TimeSync */
/* global moment */
/* global Email */
/* global Gravatar */
/* global ReactiveVar */
/* global Messages */
Template.timeline.helpers({
	// the posts cursor
	messages: function () {
		return Messages.find({}, {sort: {createdAt: -1}});
	},
	// are there more posts to show?
	moreResults: function () {
		return !(Messages.find().count() < Session.get("itemsLimit"));
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
	var query = { author: { $in: subscriptions }};

	instance.autorun(function () {
		instance.subscribe('messages', Session.get('itemsLimit'), query);
	});
});

function showMoreVisible() {
	var threshold, target = $("#showMoreResults");
	if (!target.length) return;

	threshold = $(window).scrollTop() + $(window).height() - target.height() + 50;

	if (target.offset().top < threshold) {
		if (!target.data("visible")) {
			target.data("visible", true);
			incrementLimit(20);
		}
	} else {
		if (target.data("visible")) {
			target.data("visible", false);
		}
	}        
}

// run the above func every time the user scrolls
$(window).scroll(showMoreVisible);

incrementLimit = function(inc) {
	inc = inc || 20;
	newLimit = Session.get('itemsLimit') + inc;
	Session.set('itemsLimit', newLimit);
};