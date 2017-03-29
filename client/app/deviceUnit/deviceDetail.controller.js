
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceDetailCtrl',['$rootScope','$routeParams','$scope','$http','$location', function ($rootScope,$routeParams,$scope, $http, $location) {


      //デバイス情報
      $http.get('/api/device_detail/'+$routeParams.DEVICE_ID)
      .then(function successCallback(response) {
        console.log("/api/device_detail/00000 successfully");
        console.log(response);

        var obj = response.data;
        var obj2;
        if(obj.earthquakeCurrentData.datas){
          obj2 = obj.earthquakeCurrentData.datas;
        }else{
          obj2 = obj.thunderCurrentData.datas
        }

        //ヘッダータイトル
        $scope.navtitle = obj.deviceName;

        if(obj2.commercialBlackout){
          obj2.commercialBlackout = "あり"
        }else{
          obj2.commercialBlackout = "なし"
        }

        if(obj2.equipmentAbnormality){
          obj2.equipmentAbnormality = "あり"
        }else{
          obj2.equipmentAbnormality = "なし"
        }

        if(obj2.leakage){
          obj2.leakage = "あり"
        }else{
          obj2.leakage = "なし"
        }

        if(obj2.slope){
          obj2.slope = "あり（"+obj2.slope+"°）";
        }else{
          obj2.slope = "なし"
        }

        $scope.deviceDetail =
        {
             deviceId       :obj._id,
             deviceName     :obj.deviceName,
             responsiblePerson :obj.responsiblePerson,
             telNo          :obj.telNo,
             address        :obj.address,
             memo           :obj.memo
       };

       //地震の最新データある場合のみObjectにpush
       if(obj.earthquakeCurrentData){
         $scope.deviceDetail.earthquakeCurrentData = obj.earthquakeCurrentData;
       }
       //雷の最新データある場合のみObjectにpush
       if(obj.thunderCurrentData){
         $scope.deviceDetail.thunderCurrentData = obj.thunderCurrentData;
       }


      }, function errorCallback(response) {
        console.error("error in /api/device_detail/00000");
      });


      //地震履歴情報
      $http.get('/api/device_history_eq/00000')
      .then(function successCallback(response) {
        console.log("/api/device_history_eq/00000 successfully");
        console.log(response);

        var tmpearthquakeHistoryList = [];
        var tmpthunderHistoryList = [];
        angular.forEach(response.data.data, function(value, index, array) {
          if (value.datas.type=="EQ") {
            tmpearthquakeHistoryList.push(value);
          }else if(value.datas.type=="FL"){
            tmpthunderHistoryList.push(value);
          }
          console.log(index + '. ' + value.datas.type);
        });

        $scope.earthquakeHistoryList = tmpearthquakeHistoryList;
        $scope.thunderHistoryList = tmpthunderHistoryList;

      }, function errorCallback(response) {
        console.error("error in /api/device_history_eq/00000");
      });
      //雷履歴情報
      $http.get('/api/device_history_fl/00000')
      .then(function successCallback(response) {
        console.log("/api/device_history_fl/00000 successfully");
        console.log(response);

        $scope.thunderHistoryList = response.data.data;
        console.log($scope.thunderHistoryList);

      }, function errorCallback(response) {
        console.error("error in /api/device_history_fl/00000");
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

       $scope.deviceDetailData = function(){
//         $location.path("/user_"+$routeParams.USER_ID+"/device_"+$routeParams.DEVICE_ID+"/date"+this.item.date_id);
         $location.path("/user_u000/device_00000/date20170216105553");
       }

    }]);
