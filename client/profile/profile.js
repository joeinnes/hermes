Template.profile.helpers({
	getUser: function () {
		var username = FlowRouter.getParam('username');
		return Meteor.users.findOne({username: username});
	},
	messages: function () {
		return Template.instance().messages();
	},
});

Template.profile.events({
	'click .load-more': function (event, instance) {
		event.preventDefault();

		// get current value for limit, i.e. how many posts are currently displayed
		var limit = instance.limit.get();

		limit += 20;
		instance.limit.set(limit);
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
		return Messages.find({username: username}, { limit: instance.loaded.get(), sort: {createdAt: -1} });
	}
});