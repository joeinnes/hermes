/* global Meteor */
/* global Template */
/* global Bert */
Template.newmessage.events({
	'submit #newmessage': function (event) {
		event.preventDefault();
		var text = event.target.text.value;
		Meteor.call('newMessage', text, function (error, result) {
			if (error) {
				Bert.alert('Unable to post: ' + error, 'danger', 'growl-top-right');
			} else {
				Bert.alert('Message posted!', 'success', 'growl-top-right');
				event.target.text.value = "";
			}
		});
	}
});