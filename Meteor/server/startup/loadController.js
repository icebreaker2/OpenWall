Meteor.startup(function () {

	// Show Box Setuo when no user is set
	if (Meteor.users.find().count() == 0) {
		var showBoxSetup = true;
	} else {
		var showBoxSetup = false;
	}
	
	// Init controller model
	controller.remove({});
	controller.insert({_id: 'controller', player1: 0, player2: 0, state1: 0, state2: 0, showBoxSetup: showBoxSetup});
	
	// Only allow one user, reject following users
	Accounts.validateNewUser(function (user) {
		
		if (Meteor.users.find().count() == 0) {
			controller.update("controller", {
			  showBoxSetup: false
			});
			return true
		} 
		return false;
	});
});