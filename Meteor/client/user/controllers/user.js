angular.module("OpenWall").controller('userCtrl', ['$scope', 'md5', '$modal', '$meteor',
function($scope, md5, $modal, $meteor) {

	var modal;
	$scope.stateNr = 0;

	$scope.openModal = function() {
		if (!modal) {
			modal = $modal.open({
				templateUrl: 'waitingTicket.html',
				backdrop: 'static',
				keyboard: false,
				scope: $scope
		    });
		}
	}
	
	$scope.closeModal = function() {
		if (modal) {
			modal.close();
			modal = false;
		}
	}
	
	$scope.setMotor = function(value) {
		$meteor.call("setMotor", $scope.stateNr, value);
		//For direct response
		$scope.controller['state' + $scope.stateNr] = level;
	}
	
	$scope.getTicketFromId = function(uid) {
		var userTicket = "000" + parseInt(md5.createHash(uid), 16) % 9999;
		userTicket = userTicket.substr(userTicket.length-4);
		return userTicket;
	}
	
	$scope.afterAuth = function(uid) {
		$scope.openModal();
		$scope.userTicket = $scope.getTicketFromId(uid);
		$scope.user = uid;
	}
	
	$scope.controller = $meteor.object(controller, 'controller', false);
	Meteor.call("getSessionId", function(err, uid) {
		$scope.afterAuth(uid);
	});
	
	$scope.$watchGroup(['controller.player1', 'controller.player2'], function() {
		if ($scope.controller._id && $scope.user) {
			if ($scope.controller.player1 == $scope.user) {
				$scope.closeModal();
				$scope.stateNr = 1;
			} else if ($scope.controller.player2 == $scope.user) {
				$scope.closeModal();
				$scope.stateNr = 2;
			} else {
				$scope.openModal();
				if ($scope.stateNr == 1) {
					$scope.controller.state1 = 0;
				} else {
					$scope.controller.state2 = 0;
				}
				$scope.stateNr = 0;
			}
		}
	});
}]);