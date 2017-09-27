'use strict';
/**
***　UC000ログイン画面
**/

    angular.module('nitoiotweb11App')
    .config(["$locationProvider", function($locationProvider) {
          // パラメータを取得するためのオプション（但し要HTML5対応ブラウザ）
          $locationProvider.html5Mode(true); 
        }])
    .controller('LoginCtrl',['$rootScope','$routeParams','$scope','$http','$location', '$window', function ($rootScope, $routeParams, $scope, $http, $location, $window) {

      //$scopehttp/timeout etc... Angularjsのmodule
      //TODO ルートスコープ読み込みする。引数でもらって来る。
      //初期表示の処理
      //1画面1コントーラが理想(複数画面１コントローラ可能だけどスコープの範囲の意識が必要なので面倒)

      //TODO　ルートスコープに値を入れて取得する
      //ルーティング続き

//    	alert("$routeParams"+$routeParams.userId)

//      
//      $rootScope.success = false;
//      $rootScope.error = false;
//      
      /**
      ***　処理概要：パラメータを取得してリダイレクト先を返却する
      **/
      $scope.paramName = 'query';
      $scope.getQuery = function(){
        return $location.search()[$scope.paramName];
      }
      
      /**
      ***　処理概要：IDとPWを入力してログインする。
      **/
      $scope.login = function(){
        if(!$scope.user) {
          return false;
        }
        $http({
          method: 'POST',
          url: '/login',
          data: { userId: $scope.user.userId, password: $scope.user.password, query: $scope.user.query }
        })
        .then(
          function successCallback(response){
//            console.log(response);
            if(response.data.authStat){
              $window.location.href = response.data.redirect;
            } else {
              $scope.error = response.data.message;
              $scope.dataLoading = false;
              $timeout(function (){
                  $rootScope.error = false;
              },2000);
            }
            
          },
          function errorCallback(response){
              $scope.error = response.data.message;
              $scope.dataLoading = false;
              $timeout(function (){
                  $rootScope.error = false;
              },2000);
          }
        ); 
      }
    }]);

