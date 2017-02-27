
'use strict';
/**
***　UC000ログイン画面
**/

var staticWebsite;

    angular.module('nitoiotweb11App')
    .controller('DeviceListCtrl',['$rootScope','$scope','$http','$location', function ($rootScope,$scope, $http, $location) {

      //初期表示の処理
      // $scope.username = $.rootScope.user.username


      // (function() {
      //   'use strict';
      //
      //   angular.module('MyApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
      //       .controller('AppCtrl', AppCtrl);
      //
      //   function AppCtrl($scope) {
          $scope.currentNavItem = 'page1';
      //   }
      // })();



      $scope.logOut = function() {
          $location.path("/login" );
      };

      //UC002デバイス一覧画面
      $scope.device = function() {
          $location.path("/device" );
      };

      //UC009デバイスグループ画面
      $scope.deviceControl = function() {
          $location.path("/deviceManagement" );
      };

      //UC0018ダウンロードCSV項目設定画面
      $scope.downloadCSV = function() {
          $location.path("/downloadCSV" );
      };

      // POSTでのajaxコールで、サーバーのapp.jsのapp.post /getAll呼び出し
        // $scope.getAll = function() {
        //     // $.ajax({
        //     // type: 'POST',
        //     // data: {},
        //     // contentType: 'application/json',
        //     // url: '/getAll',
        //     // success: function(rows) {
        //     //   alert("getAll success! rows.length"+rows.length);
        //     // // for(var i=0; i<rows.length; i++) {
        //     // // console.log(' row '+ i +": "+ JSON.stringify(rows[i]));
        //     // // showTable(rows[i].value);
        //     // // }
        //     // },
        //     // error: function(data) {
        //     //   // console.log('error getAll: ' + JSON.stringify(data));
        //     //   alert("getAll error;; rows.length");
        //     // }
        //     // });
        //     });
          // };


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
