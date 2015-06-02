Meteor.startup(function () {

	controller.remove({});
	controller.insert({_id: 'controller', player1: 0, player2: 0, state1: 0, state2: 0, movingToStart: false});
  
  //Create default admin
  if (Meteor.users.find().count() === 0) {
      Accounts.createUser({email: 'openwall@jumax.net', password: ''}); //Set custom password
  }
  
  //Don't allow more users
  Accounts.config(
  	{forbidClientAccountCreation: true }
  );
 });