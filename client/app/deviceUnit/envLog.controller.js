
'use strict';

    angular.module('nitoiotweb11App')
    .controller('EnvLogCtrl',['$rootScope','$routeParams','$scope','$http','$location','$window','$timeout', function ($rootScope,$routeParams,$scope, $http, $location,$window,$timeout) {
      
      var logName;
      
      switch($routeParams.type){
        case 'noise':
          logName = '騒音';
          break;
        case 'pm25':
          logName = 'PM2.5';
          break;
        case 'pm10':
          logName = '花粉';
          break;
      }
      
      //ヘッダータイトル
      $scope.navtitle=logName;
      
    //画面遷移
    $scope.backtoList = function () {
      $location.path("/user_" + $routeParams.USER_ID + "/");
    }



    }]);
