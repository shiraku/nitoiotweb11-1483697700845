'use strict';
/**
***　UC000ログイン画面
**/

var staticWebsite;

    angular.module('nitoiotweb11App')
    .controller('LoginCtrl',['$rootScope','$scope','$http','$location', function ($rootScope,$scope, $http, $location) {

      //$scopehttp/timeout etc... Angularjsのmodule
      //TODO ルートスコープ読み込みする。引数でもらって来る。
      //初期表示の処理
      //1画面1コントーラが理想(複数画面１コントローラ可能だけどスコープの範囲の意識が必要なので面倒)

      //TODO　ルートスコープに値を入れて取得する
      //ルーティング続き

      /**
      ***　処理概要：IDとPWを入力してログインする。
      **/
      $scope.login = function() {
        // $.rootScope.username = $scope.user.userId;
        // $.rootScope.password = $scope.user.password;
        // if (username == "admin" && password == "admin") {
          $location.path("/menu" );
        // } else {
        //   alert('invalid username and password');
        // }

        // $http.get('/api/things/')
        // .then(function successCallback(response) {
        //   console.log("posted successfully");
        // }, function errorCallback(response) {
        //   console.error("error in posting");
        // });

};

$scope.login2 = function() {
  // $.rootScope.username = $scope.user.userId;
  // $.rootScope.password = $scope.user.password;
  // if (username == "admin" && password == "admin") {
    // $location.path("/menu" );
  // } else {
  //   alert('invalid username and password');
  // }

  $http.get('/api/things/show')
  .then(function successCallback(response) {
    console.log("posted successfully");
  }, function errorCallback(response) {
    console.error("error in posting");
  });

};


    }]);


staticWebsite = {
    'heading': 'generate',
    'tagline': 'Kick-start a materialized Angular app, with  Bluemix runtime and services',
    'features': [
        {
            'key': '0',
            'name': 'Scaffold Bluemix services',
            'info': 'Single-sign-on, Cloudant, BigData, are scaffolded to Express framework, via generators. '
        }, {
            'key': '1',
            'name': 'Built with Angular, Node, Express',
            'info': 'Built with a fullstack: Cloudant, Express, AngularJS, and NodeJS; along Karma unit test.'
        }, {
            'key': '2',
            'name': 'Optimized responsive design',
            'info': 'Built with mobile-first/responsive web design, Bootstrap; added with Material Design.'
        }, {
            'key': '3',
            'name': 'Modular structure',
            'info': 'Best practice client and server structures, with scaffolding api; ideal for complex project.'
        }, {
            'key': '4',
            'name': 'Optimized production build',
            'info': 'Automated build process optimizes, minimizes & cdnifies your scripts/css/icon/images.'
        }, {
            'key': '5',
            'name': 'Deployment ready for Bluemix',
            'info': 'Create a small-size, production-grade, and deployment-ready build for IBM Bluemix.'
        }
    ]
};
