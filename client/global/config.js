/* global Accounts */
Accounts.ui.config({
  requestPermissions: {},
  extraSignupFields: [{
    fieldName: 'username',
    fieldLabel: 'Username',
    inputType: 'text',
    visible: true,
    validate: function (value, errorFunction) {
      if (!value) {
        Bert.alert('Please choose a user name', 'danger', 'growl-top-right');
        return false;
      } else {
        if (value.indexOf(" ") > -1) {
          Bert.alert('Sorry, no spaces!', 'danger', 'growl-top-right');
          return false;
        } else {
          return true;
        }
      }
    }
  }]
});

Meteor.subscribe('users');

Accounts.onLogin(function() {
  FlowRouter.go('home');
});