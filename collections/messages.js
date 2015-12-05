/* global Mongo */
/* global Messages */
Messages = new Mongo.Collection('messages');
if (Meteor.isServer) {
	Messages._ensureIndex({"message": "text"});
}