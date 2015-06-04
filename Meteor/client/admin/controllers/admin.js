angular.module("OpenWall").controller("adminCtrl", ["$scope", "$meteor", "md5", function($scope, $meteor, md5) {

	$scope.controller = $meteor.object(controller, 'controller', false);
	var connections = new Mongo.Collection("user_status_sessions");
	$scope.presence = $meteor.collection(connections, false);
	
	//Get own id
	Meteor.call("getSessionId", function(err, uid) {
		$scope.user = uid;
	});
	
	$scope.login = function() {

		Meteor.loginWithPassword($scope.email, $scope.password,
			function(error) {

				if (error) {
					console.log(error)
					$scope.authError = true;
				} else {
					$scope.email = null;
					$scope.password = null;
					$scope.authError = false;
				}
			}
		);
	};
	
	$scope.logout = function() {
		alert("Logout");
		Meteor.logout();
	};
	
	$scope.setMotor = function(motorNr, level) {
		Meteor.call("setMotor", motorNr, level);
		
		//For direct response
		if (motorNr == 1) {
			$scope.controller.state1 = level;
		} else if (motorNr == 2) {
			$scope.controller.state2 = level;
		}
	};
	
	$scope.setPlayer = function(nr, user) {
		Meteor.call("setPlayer", nr, user);
		
		//For direct response
		if (nr == 1) {
			$scope.controller.player1 = user;
		} else if (nr == 2) {
			$scope.controller.player2 = user;
		}
	};

	/**Calibrate various points on the Playing-Field**/
	$scope.moveToStart = function(value) {
		Meteor.call("moveToStart", value);
		
		//For direct response
		$scope.controller.movingToStart = value;
	};
	
	$scope.calibrateStart = function() {
		Meteor.call("calibrateStart");
	};

	$scope.calibrateCheckPoint1 = function () {
		$meteor.object(controller, 'controller', false);

		$meteor

		Meteor.call("calibrateCheckPoint1");
	};

	$scope.calibrateCheckPoint2 = function () {
		Meteor.call("calibrateCheckPoint2");
	};

	$scope.calibrateCheckPoint3 = function () {
		Meteor.call("calibrateCheckPoint3");
	};

	$scope.calibrateMaxHeight = function (){
		Meteor.call("calibrateMaxHeight");
	};

	$scope.removeMaxHeight = function () {
		Meteor.call("removeMaxHeight");
	};

	//Function is used to filter the current players from the users list
	$scope.userIsPlaying = function(item) {
	
		//Controller loaded?
		if ($scope.controller._id) {
			//Player not playing?
			if ($scope.controller.player1 != item._id && $scope.controller.player2 != item._id) {
				//In User-UI?
				if (item._id != $scope.user) {
					return true;
				}
			}
		}
		return false;
	};

	//Calculates a 4 digit ticket id from the session id
	$scope.getTicketFromId = function(uid) {
		var userTicket = "000" + parseInt(md5.createHash(uid), 16) % 9999;
		userTicket = userTicket.substr(userTicket.length-4);
		return userTicket;
	};
	
	//Delete user from Controller when he disconnects
	$scope.$watchCollection('presence', function(newSessions, oldSessions) {
		var player1Found = false;
		var player2Found = false;
		
		//Check if players are in Sessions
		if ($scope.controller.player1 || $scope.controller.player2) {
			angular.forEach(newSessions, function(session, key) {
				if ($scope.controller.player1 == session._id) {
					player1Found = true;
				} else if ($scope.controller.player2 == session._id) {
					player2Found = true;
				}
			});
			
			if (!player1Found) {
				$scope.controller.player1 = 0;
			}
			if (!player2Found) {
				$scope.controller.player2 = 0;
			}
		}
	});
}]);