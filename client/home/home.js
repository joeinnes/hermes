Template.home.helpers({
	'loggedIn': function () {
		var loggedIn = Meteor.userId() ? true : false;
		return loggedIn;
	}
})