/* global BlazeLayout */
FlowRouter.route('/', {
    name: 'home',
    action: function () {
        BlazeLayout.render("main", { content: "home" });
    }
});

