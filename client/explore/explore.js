/* global incrementLimit */
/* global Bert */
/* global ITEMS_INCREMENT */
/* global TimeSync */
/* global moment */
/* global Email */
/* global Gravatar */
/* global ReactiveVar */
/* global Messages */
Template.explore.helpers({
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
	}
});

Template.explore.events({
	'click #showMoreResults': function (event) {
		event.preventDefault();

		// get current value for limit, i.e. how many posts are currently displayed
		var limit = Session.get('itemsLimit');

		limit += ITEMS_INCREMENT;
		Session.set('itemsLimit', limit);
	},
	'click .delete': function (event) {
		var messageId = event.target.id;
		Meteor.call('delete', messageId, function(error, result) {
			if (error) {
				Bert.alert('Couldn\'t delete message! ' + error, 'danger', 'growl-top-right');
			} else {
				Bert.alert('Message deleted!', 'success', 'growl-top-right');
			}
		});
	}
});

Template.explore.onCreated(function () {

	var instance = this;

	Session.setDefault('itemsLimit', ITEMS_INCREMENT);

	instance.autorun(function () {
		instance.subscribe('messages', Session.get('itemsLimit'));
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