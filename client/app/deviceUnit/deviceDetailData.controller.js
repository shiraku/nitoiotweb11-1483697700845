
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceDetailDataCtrl',['$rootScope','$routeParams','$scope','$http','$location', function ($rootScope,$routeParams,$scope, $http, $location) {

      //ヘッダータイトル
      //TODO 日付の形式を変更する。
      $scope.navtitle=$routeParams.YYYYMMDDHHMM+"詳細データ";

      //TODO APIでデータ取得する
      $scope.mapInfo = [

        {
          "device_id":"00000",
          "latitude":"00000",
          "longitude":"00000",
        }
       ];

       $scope.detailData = [
       {
            'deviceId':'dev002',
            'deviceName': 'デバイス２',
            'responsiblePerson': '',
            'telNo': '111-1111-1111',
            'statusFlg':'1',
            'status':'????',
            'type':'earthquake',
            'seismicIntensity':'5.4',
            'slope':'倒壊',
            'leakage':'なし',
            'commercialBlackout':'あり',
            'equipmentAbnormality':'なし',
            'commentList':[
              {
                'comment':'建物に破損あり',
                'commentDate':'2017/01/15 10:15',
              },
              {
                'comment':'業務を一時停止',
                'commentDate':'2017/01/15 10:15',
              }],
            'JapanMeteorologicalAgency':'4',
            'LongPeriodSeismicActivityClass':'3'
      }];


    }]);
