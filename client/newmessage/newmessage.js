/* global Bert */
Template.newmessage.events({
	'submit #newmessage': function(event) {
		event.preventDefault();
		console.log(event.target.text.value)
		Bert.alert(event.target.text.value, 'success', 'growl-top-right');
		event.target.text.value = "";
	}
})