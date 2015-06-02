angular.module("OpenWall").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $stateProvider
      .state('user', {
        url: '/',
        templateUrl: 'client/user/views/userView.ng.html',
        controller: 'userCtrl'
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'client/admin/views/adminView.ng.html',
        controller: 'adminCtrl'
      })
      $urlRouterProvider.otherwise("/");
}]);