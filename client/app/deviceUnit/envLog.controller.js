
'use strict';

    angular.module('nitoiotweb11App')
    .controller('EnvLogCtrl',['$rootScope','$routeParams','$scope','$http','$location','$window','$timeout', function ($rootScope,$routeParams,$scope, $http, $location,$window,$timeout) {
      
      var logName;
      
      switch($routeParams.type){
        case 'temp':
          logName = '気温・湿度';
          break;
        case 'pressure':
          logName = '気圧';
          break;
        case 'uvi':
          logName = '紫外線';
          break;
        case 'discomfortIndex':
          logName = '不快指数';
          break;
        case 'heatstroke':
          logName = '熱中症指数';
          break;
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
      
      if($routeParams.type == 'noise' || $routeParams.type == 'pm25' || $routeParams.type == 'pm10'){
        $scope.gType=true;
      }else{
        $scope.gType=false;
      }
      
    //画面遷移
    $scope.backtoList = function () {
      $location.path("/user_" + $routeParams.USER_ID + "/");
    }



    }]);
