
'use strict';
/**
***?UC000??????
**/

var staticWebsite;

    angular.module('nitoiotweb11App')
    .controller('DeviceDetailCtrl',['$rootScope','$routeParams','$scope','$http','$location', function ($rootScope,$routeParams,$scope, $http, $location) {




      /**
      API 地震履歴情報取得
      **/
      $scope.earthquakeHistoryList = [

        {
          "device_id":"00000",
          "data":[
            {
            "date_id":"20170216110735",
            "date":"2017/02/16 11:07:35",
            "datas":
            [{"name":"震度",
              "value":6,
              "values":"6_u"
            }]},
            {"date_id":"20170216110254","date":"2017/02/16 11:02:54","datas":[{"name":"震度","value":6,"values":"6_u"}]},
            {"date_id":"20170216105831","date":"2017/02/16 10:58:31","datas":[{"name":"震度","value":6,"values":"6_u"}]},
            {"date_id":"20170216105553","date":"2017/02/16 10:55:53","datas":[{"name":"震度","value":6,"values":"6_u"}]},
            {"date_id":"20170215182055","date":"2017/02/15 18:20:55","datas":[{"name":"震度","value":6,"values":"6_u"}]},
            {"date_id":"20170215180448","date":"2017/02/15 18:04:48","datas":[{"name":"震度","value":6,"values":"6_u"}]},
            {"date_id":"20170215174601","date":"2017/02/15 17:46:01","datas":[{"name":"震度","value":6,"values":"6_u"}]},
            {"date_id":"20170215172801","date":"2017/02/15 17:28:01","datas":[{"name":"震度","value":6,"values":"6_u"}]},
            {"date_id":"20170215163422","date":"2017/02/15 16:34:22","datas":[{"name":"震度","value":6,"values":"6_u"}]},
            {"date_id":"20170214194843","date":"2017/02/14 19:48:43","datas":[{"name":"震度","value":6.5,"values":"7"}]}
          ]}
       ];

       $scope.thunderHistoryList = [
       {
         "device_id":"00000",
         "data":[
           {"date_id":"20161025160205",
           "date":"2016/10/25 16:02:05",
           "datas":[{
             "value":2,
             "name":"雷レベル"
           }]},
           {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
           {"date_id":"20160830030221","date":"2016/08/30 03:02:21","datas":[{"value":3,"name":"雷レベル"}]}]}
        ];


      //  {
      //       'deviceId':'dev002',
      //       'deviceName': 'デバイス２',
      //       'responsiblePerson': '',
      //       'telNo': '111-1111-1111',
      //       'statusFlg':'1',
      //       'status':'????',
      //       'type':'earthquake',
      //       'seismicIntensity':'5.4',
      //       'slope':'',
      //       'commercialBlackout':'',
      //       'equipmentAbnormality':'',
      //       'comment':'',
      //       'updateTime':''
      // },
      //   {
      //       'deviceId':'dev003',
      //       'deviceName': 'デバイス３',
      //       'responsiblePerson': '????',
      //       'telNo': '222-2222-2222',
      //       'statusFlg':'1',
      //       'status':'????',
      //       'type':'thunder',
      //       'power':'大',
      //       'leakage':'',
      //       'commercialBlackout':'',
      //       'equipmentAbnormality':'',
      //       'comment':'',
      //       'updateTime':''
      //  }



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
