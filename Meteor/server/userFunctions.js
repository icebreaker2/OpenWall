Meteor.methods({
	getSessionId: function() {
		return this.connection.id;
	},
	movingToStartCompleted: function() {
		controller.update("controller", {
		  $set: {movingToStart: false}
		});
	},
	setMotor: function(motorNr, level) {
		
		var currentController = controller.findOne();
		
		//Logged in or a current player?
		if (this.userId || currentController.player1 == this.connection.id || currentController.player2 == this.connection.id) {
			
			if (motorNr == 1) {
				controller.update("controller", {
				  $set: {state1: level}
				});
			} else if (motorNr == 2) {
				controller.update("controller", {
				  $set: {state2: level}
				});
			}
		}
		
	},
	setPlayer: function(playerNr, user) {
		
		//User logged in?
		if (this.userId) {
			
			if (playerNr == 1) {
				controller.update("controller", {
				  $set: {player1: user}
				});
			} else if (playerNr == 2) {
				controller.update("controller", {
				  $set: {player2: user}
				});
			}
		}
	},
	moveToStart: function(value) {

		//User logged in?
		if (this.userId) {
			controller.update("controller", {
			  $set: {movingToStart: value}
			});
		}
	},
	/**calibrate different variables and db-entries to recognise changes on those
	 * the time is a variable to recognise newer entries and making validations in the controller possible**/
	calibrateStart: function() {
	
		var time = new Date();
		time = time.getTime();

		//User logged in?
		if (this.userId) {
			controller.update("controller", {
			  $set: {calibrateStart: time}
			});
		}
	},
	calibrateCheckPoint1: function() {
		var time = new Date();
		time = time.getTime();
		//User logged in?
		if (this.userId) {
			controller.update("controller", {
				$set: {calibrateCheckPoint1: time}
			});
		}
	},
	calibrateCheckPoint2: function () {
		var time = new Date();
		time = time.getTime();
		//User logged in?
		if (this.userId) {
			controller.update("controller", {
				$set: {calibrateCheckPoint2: time}
			});
		}
	},
	calibrateCheckPoint3: function () {
		var time = new Date();
		time = time.getTime();
		//User logged in?
		if (this.userId) {
			controller.update("controller", {
				$set: {calibrateCheckPoint3: time}
			});
		}

	},
	calibrateMaxHeight: function () {
		var time = new Date();
		time = time.getTime();
		//User logged in?
		if (this.userId) {
			controller.update("controller", {
				$set: {calibrateMaxHeight: time}
			});
		}
	},
	removeMaxHeight: function () {
		var time = new Date();
		time = time.getTime();
		//User logged in?
		if (this.userId) {
			controller.update("controller", {
				$set: {removeMaxHeight: time}
			});
		}
	}

});