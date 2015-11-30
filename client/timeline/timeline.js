/* global Messages */
Template.timeline.helpers({
	// the posts cursor
	messages: function () {
		return Template.instance().messages();
	},
	// are there more posts to show?
	hasMoreMessages: function () {
		return Template.instance().messages().count() >= Template.instance().limit.get();
	}
});

Template.timeline.events({
	'click .load-more': function (event, instance) {
		event.preventDefault();

		// get current value for limit, i.e. how many posts are currently displayed
		var limit = instance.limit.get();

		limit += 20;
		instance.limit.set(limit);
	}
});

Template.timeline.onCreated(function () {

	var instance = this;

	instance.loaded = new ReactiveVar(0);
	instance.limit = new ReactiveVar(20);

	instance.autorun(function () {
		var limit = instance.limit.get();
		var subscription = instance.subscribe('messages', limit);
		if (subscription.ready()) {
			instance.loaded.set(limit);
		} else {
			console.log("> Subscription is not ready yet. \n\n");
		}
	});

    instance.messages = function () {
		return Messages.find({}, { limit: instance.loaded.get() });
	}
});