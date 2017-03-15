
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceListCtrl',['$rootScope','$routeParams','$scope','$http','$location', function ($rootScope,$routeParams,$scope, $http, $location) {


      /**　API テスト
      **/
//      $http.get('/api/things/show')
//      .then(function successCallback(response) {
//        console.log("posted successfully");
//      }, function errorCallback(response) {
//        console.error("error in posting");
//      });
      $http.get('/api/device_list/')
      .then(function successCallback(response) {
        console.log("posted successfully");
        console.log(response);
      }, function errorCallback(response) {
        console.error("error in posting");
      });
        

      //ヘッダータイトル
      $scope.navtitle='デバイス一覧';

//      $http.get('/api/things/')
//      .then(function successCallback(response) {
//        console.log("posted successfully");
//      }, function errorCallback(response) {
//        console.error("error in posting");
//      });

      //TODO APIでデータ取得する
      $scope.deviceList = [
        {
              'deviceId':'dev001',
              'deviceName': 'デバイス１',
              'responsiblePerson': '山田　修',      //責任者
              'telNo': '000-0000-0000',     //連絡先
              'status':'0'
       },
         {
              'deviceId':'dev002',
              'deviceName': 'デバイス２',
              'responsiblePerson': '湯浅　あさみ',      //責任者
              'telNo': '111-1111-1111',     //連絡先
              'status':'1',                 //感知あり(1)or無し(0)
              'type':'earthquake',          //感知した種類(地震or雷)
              'seismicIntensity':'5.4',     //震度
              'slope':'あり',                   //傾き
              'commercialBlackout':'なし',      //停電
              'equipmentAbnormality':'あり',    //機器異常
              'commentList':[               //コメント・連絡事項
                {
                  'comment':'建物に破損あり',          //コメント
                  'commentDate':'2017/01/15 10:15', //コメント日時
                },
                {
                  'comment':'業務を一時停止',
                  'commentDate':'2017/01/15 10:15',
                }],
        },
          {
              'deviceId':'dev003',
              'deviceName': 'デバイス３',
              'responsiblePerson': '本田　宗太',
              'telNo': '222-2222-2222',
              'status':'1',
              'type':'thunder',
              'power':'大',
              'leakage':'あり',
              'commercialBlackout':'なし',
              'equipmentAbnormality':'あり',
              'commentList':[
                {
                  'comment':'建物に破損あり・窓ガラ割れ。',
                  'commentDate':'2017/01/15 10:15',
                },
                {
                  'comment':'業務を一時停止',
                  'commentDate':'2017/01/15 10:15',
                }]
         }
       ];

       //画面遷移
       $scope.deviceDetail = function(){
         $location.path("/user_"+$routeParams.USER_ID+"/device_"+this.item.deviceId);
       }

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
      },
      {
        "id":2,
        "latitude":35.457511,
        "longitude":139.632704,
        "title":"みなとみらい駅"
      }
    ];

    }]);
