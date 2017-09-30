
'use strict';

    angular.module('nitoiotweb11App')
    .controller('EnvLogCtrl',['$rootScope','$routeParams','$scope','$http','$location','$window','$timeout', function ($rootScope,$routeParams,$scope, $http, $location,$window,$timeout) {
      
      var logName;
      var chartType;
      
      switch($routeParams.type){
        case 'temp':
          logName = '気温・湿度';
          chartType = 'TEMP';
          break;
        case 'pressure':
          logName = '気圧';
          chartType = 'PRES';
          break;
        case 'uvi':
          logName = '紫外線';
          chartType = 'UVI';
          break;
        case 'discomfortIndex':
          logName = '不快指数';
          chartType = 'DISC';
          break;
        case 'heatstroke':
          logName = '熱中症指数';
          break;
        case 'noise':
          logName = '騒音';
          chartType = 'NOIS';
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
      
      
      //グラフイメージの取得と表示
      //$http.get('/api/cahrt_env_' + $routeParams.DEVICE_ID + '/TEMP/')
      if(chartType) {
        $http.get('/api/chart_env_00014/' + chartType + '/')
          .then(function successCallback(response) {
            console.log(response);
             $scope.chart_env = 'data:image/svg+xml;base64,' + response.data.toString('base64');
          }, function errorCallback(response) {
            console.error("error in posting");
          $scope.chart_env = '/assets/images/no-chart.svg';
          });
      }else{
        $scope.chart_env = '/assets/images/no-chart.svg';
      }
      
    //画面遷移
    $scope.backtoList = function () {
      $location.path("/user_" + $routeParams.USER_ID + "/");
    }



    }]);
