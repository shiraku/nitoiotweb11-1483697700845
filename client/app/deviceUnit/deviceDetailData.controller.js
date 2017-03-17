
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceDetailDataCtrl',['$rootScope','$routeParams','$scope','$http','$location', function ($rootScope,$routeParams,$scope, $http, $location) {

      //ヘッダータイトル
      //TODO 日付の形式を変更する。
      $scope.navtitle=$routeParams.YYYYMMDDHHMM+"詳細データ";

      //TODO APIでデータ取得する
      $scope.graphData = [

      ];
      // $scope.mapInfo = [
      //
      //   {
      //     "device_id":"00000",
      //     "device_name":"00000",
      //     "latitude":"00000",
      //     "longitude":"00000",
      //   }
      //  ];

       $scope.detailData = [
       {
            'deviceId':'dev002',
            'deviceName': 'デバイス２',
            // 'responsiblePerson': '',
            // 'telNo': '111-1111-1111',
            'type':'earthquake',          //地震or雷
            'seismicIntensity':'5.4',     //震度（地震のみ）
            'slope':'倒壊',               //傾き（地震のみ）
            'leakage':'なし',             //漏電（雷のみ）
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
              'mediaNewsletter':[
                {
                  'japanMeteorologicalAgency':'4',      //メディア速報　震度
                  'longPeriodSeismicActivityClass':'3'　//メディア速報長周期地震動階級
              }
            ]
      }];

      //グラフイメージ取得
      var datePrm = $routeParams.YYYYMMDDHHMM.substr(0,4) + '-' + 
        $routeParams.YYYYMMDDHHMM.substr(4,2) + '-' + 
        $routeParams.YYYYMMDDHHMM.substr(6,2) + 'T' + 
        $routeParams.YYYYMMDDHHMM.substr(8,2) + ':' + 
        $routeParams.YYYYMMDDHHMM.substr(10,2) + ':' + 
        $routeParams.YYYYMMDDHHMM.substr(12,2);
      var id = datePrm + '_' + $routeParams.DEVICE_ID;
      console.log(id);
      $http.get('/api/chart_acceleration/' + id)
      .then(function successCallback(response) {
        console.log("posted successfully");
        console.log(response);
        $scope.chart_acceleration = response.data;
      }, function errorCallback(response) {
        console.error("error in posting");
      });
      
      
      //デバイス情報
      $http.get('/api/device_detail/' + $routeParams.DEVICE_ID)
      .then(function successCallback(response) {
        console.log("/api/device_detail/ successfully");
        console.log(response);
      }, function errorCallback(response) {
        console.error("error in /api/device_detail/");
      });
      
      
      $scope.map = {
      // マップ初期表示の中心地
      center: {
        latitude: 34.7019399, // 緯度
        longitude: 135.51002519999997 // 経度
      },
      // マップ初期表示の拡大
      zoom: 19
    };

    // マップ上に表示するマーカーの情報
    //TODO
    $scope.markers = [
      {
        "id":1,
        "latitude":35.459923,
        "longitude":139.635290,
        "title":"パシフィコ横浜"
      }
    ];


    }]);
