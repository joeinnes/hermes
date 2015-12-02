/* global FlowRouter */
/* global BlazeLayout */
FlowRouter.route('/', {
    name: 'home',
    action: function () {
        BlazeLayout.render("main", { content: "home", view: "explore" });
    }
});

FlowRouter.route('/user/:username', {
    name: 'profile',
    action: function () {
        BlazeLayout.render("main", { content: "profile" });
    }
});

FlowRouter.route('/explore', {
    name: 'explore',
    action: function () {
        BlazeLayout.render("main", { content: "home", view: "explore" });
    }
});

FlowRouter.route('/timeline', {
    name: 'timeline',
    action: function () {
        BlazeLayout.render("main", { content: "home", view: "timeline" });
    }
});