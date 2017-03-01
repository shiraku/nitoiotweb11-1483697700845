
'use strict';
/**
***?UC000??????
**/

var staticWebsite;

    angular.module('nitoiotweb11App')
    .controller('DeviceListCtrl',['$rootScope','$routeParams','$scope','$http','$location', function ($rootScope,$routeParams,$scope, $http, $location) {




      /**
      API デバイスリスト取得
      **/
      $scope.deviceList = [
        {
              'deviceId':'dev001',
              'deviceName': 'デバイス１',
              'responsiblePerson': '',
              'telNo': '000-0000-0000',
              'statusFlg':'0',
              'status':'異常あり'
       },
         {
              'deviceId':'dev002',
              'deviceName': 'デバイス２',
              'responsiblePerson': '',
              'telNo': '111-1111-1111',
              'statusFlg':'1',
              'status':'????',
              'type':'earthquake',
              'seismicIntensity':'5.4',
              'slope':'',
              'commercialBlackout':'',
              'equipmentAbnormality':'',
              'comment':'',
              'updateTime':''
        },
          {
              'deviceId':'dev003',
              'deviceName': 'デバイス３',
              'responsiblePerson': '????',
              'telNo': '222-2222-2222',
              'statusFlg':'1',
              'status':'????',
              'type':'thunder',
              'power':'大',
              'leakage':'',
              'commercialBlackout':'',
              'equipmentAbnormality':'',
              'comment':'',
              'updateTime':''
         }
       ];



       $scope.deviceDetail = function(){
         $location.path("/user_"+$routeParams.USER_ID+"/device_"+this.item.deviceId);
       }


      $scope.logOut = function() {
          $location.path("/login" );
      };

      //UC002????????
      $scope.device = function() {
          $location.path("/device" );
      };

      //UC009??????????
      $scope.deviceControl = function() {
          $location.path("/deviceManagement" );
      };

      //UC0018??????CSV??????
      $scope.downloadCSV = function() {
          $location.path("/downloadCSV" );
      };

      // POST??ajax??????????app.js?app.post /getAll????
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
