
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceListCtrl',['$rootScope','$routeParams','$scope','$http','$location', function ($rootScope,$routeParams,$scope, $http, $location) {



      /**　API テスト
      **/
      $http.get('/api/things/show')
      .then(function successCallback(response) {
        console.log("posted successfully");
      }, function errorCallback(response) {
        console.error("error in posting");
      });


      //ヘッダータイトル
      $scope.navtitle='デバイス一覧';

      //TODO APIでデータ取得する
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

       //画面遷移
       $scope.deviceDetail = function(){
         $location.path("/user_"+$routeParams.USER_ID+"/device_"+this.item.deviceId);
       }



    }]);
