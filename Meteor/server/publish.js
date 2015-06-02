Meteor.publish(null, function () {
  return controller.find();
});
Meteor.publish(null, function () {
  return UserStatus.connections.find();
});