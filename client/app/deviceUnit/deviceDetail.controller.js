
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceDetailCtrl',['$rootScope','$routeParams','$scope','$http','$location', function ($rootScope,$routeParams,$scope, $http, $location) {

      //デバイス情報
      $http.get('/api/device_detail/'+$routeParams.DEVICE_ID)
      .then(function successCallback(response) {
//        console.log("/api/device_detail/"+$routeParams.DEVICE_ID+" successfully");
//        console.log(response);

        var obj = response.data;

        //地震の最新データある場合のみObjectにpush
        if(obj.earthquakeCurrentData){
          $scope.earthquakeCurrentData = obj.earthquakeCurrentData;
        }
        //雷の最新データある場合のみObjectにpush
        if(obj.thunderCurrentData){
          $scope.thunderCurrentData = obj.thunderCurrentData;
        }

        //ヘッダータイトル
        $scope.navtitle = obj.deviceName;

        $scope.deviceDetail =
        {
             deviceId       :obj._id,
             deviceName     :obj.deviceName,
             responsiblePerson :obj.responsiblePerson,
             telNo          :obj.telNo,
             address        :obj.address,
             memo           :obj.memo
       };

        //TODO コメントを取得する
//            console.log('/api/comment/related/DEV_' + $routeParams.DEVICE_ID + '_' + obj.earthquakeCurrentData.date_id + '/');
        $http.get('/api/comment/related/DEV_' + $routeParams.DEVICE_ID + '_' + obj.earthquakeCurrentData.data.date_id + '/')
          .then(function successCallback(response) {
//            console.log("/api/comment/related/ successfully");
//            console.log(response);
            if(response.data){
                $scope.commentList = response.data;
            }
          });


      }, function errorCallback(response) {
        console.error("error in /api/device_detail/00000");
      });


      //地震履歴情報
      $http.get('/api/device_history_eq/'+$routeParams.DEVICE_ID)
      .then(function successCallback(response) {
//        console.log("/api/device_history_eq/"+$routeParams.DEVICE_ID+" successfully");
//        console.log(response);

        $scope.earthquakeHistoryList = response.data.data;
//        console.log($scope.earthquakeHistoryList);

      }, function errorCallback(response) {
        console.error("error in /api/device_history_eq/"+$routeParams.DEVICE_ID);
      });
      //雷履歴情報
      $http.get('/api/device_history_fl/'+$routeParams.DEVICE_ID)
      .then(function successCallback(response) {
//        console.log("/api/device_history_fl/"+$routeParams.DEVICE_ID+" successfully");
//        console.log(response);

        $scope.thunderHistoryList = response.data.data;
//        console.log($scope.thunderHistoryList);

      }, function errorCallback(response) {
        console.error("error in /api/device_history_fl/"+$routeParams.DEVICE_ID);
      });


      //TODO さらに見るボタンが動かないので、修正する。
        $scope.earthquakeHistoryViews = 10; // 地震情報表示する件数(初期表示件数を指定)
        $scope.thunderHistoryViews = 10; //　雷情報表示する件数(初期表示件数を指定)
        $scope.nextView = 10; // 地震&雷情報もっと見るをクリックしたときに表示する数

        // 地震情報さらに見るクリック時
        $scope.earthquakeHistoryMoreClick = function() {
            $scope.moreCount++;
            $scope.earthquakeHistoryViews = $scope.earthquakeHistoryViews + $scope.nextView;
        };

        // 雷情報さらに見るクリック時
        $scope.thunderHistoryMoreClick = function() {
            $scope.moreCount++;
            $scope.thunderHistoryViews = $scope.thunderHistoryViews + $scope.nextView;
        };

       $scope.deviceDetailData = function(arg,type){
        var di = arg || this.item.date_id;
        var item = type || this.item.type
        if(item === undefined) item = 'FL';
          $location.path("/user_"+$routeParams.USER_ID+"/device_"+$routeParams.DEVICE_ID+"/date"+di+"/" + item);
//         $location.path("/user_u000/device_00000/date20170216105553");
       }
       

    }]);
