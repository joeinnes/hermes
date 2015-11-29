/* global BlazeLayout */
FlowRouter.route('/', {
    name: 'home',
    action: function() {
        if (Meteor.userId()) {
            BlazeLayout.render("main", {content: "timeline"});
        } else {
            BlazeLayout.render("main", {content: "notloggedin"});
        }
    }
});

