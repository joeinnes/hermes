/* global BlazeLayout */
FlowRouter.route('/', {
    name: 'home',
    action: function () {
        BlazeLayout.render("main", { content: "home" });
    }
});

FlowRouter.route('/user/:username', {
    name: 'profile',
    action: function () {
        BlazeLayout.render("main", { content: "profile" });
    }
});

