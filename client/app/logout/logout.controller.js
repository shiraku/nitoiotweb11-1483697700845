'use strict';
/**
***　UC000ログイン画面
**/

    angular.module('nitoiotweb11App')
    .controller('LogoutCtrl', ['$scope', '$location', 'AuthService',
      function ($scope, $location, AuthService) {

        $scope.logout = function () {

          // call logout from service
          AuthService.logout()
            .then(function () {
              $location.path('/login');
            });

        };
      
    }]);

