
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceDetailDataCtrl',['$rootScope','$routeParams','$scope','$http','$location','$mdDialog', function ($rootScope,$routeParams,$scope, $http, $location,$mdDialog) {

      //ヘッダータイトル
      var str = $routeParams.YYYYMMDDHHMM;
      var titleYear = str.slice(0,4);
      var titleMonth = str.slice(4,6);
      var titleDay = str.slice(6,8);
      $scope.navtitle=titleYear+"/"+titleMonth+"/"+titleDay+"詳細データ";


      //TODO APIでデータ取得する
      $scope.graphData = [

      ];



      ///MAP用データ/////////////////////////////////////////////

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
        console.log("/api/chart_acceleration/ successfully");
        console.log(response);
        $scope.chart_acceleration = 'data:image/jpg;base64,' + response.data.toString('base64');
      }, function errorCallback(response) {
        console.error("error in /api/chart_acceleration/");
      });


      ///デバイス情報取得/////////////////////////////////////////////
      $http.get('/api/device_detail/' + $routeParams.DEVICE_ID)
      .then(function successCallback(response) {
        console.log("/api/device_detail/ successfully");
        console.log(response);

          var obj = response.data;
          var obj2;
          if(obj.earthquakeCurrentData.datas){
          obj2 = obj.earthquakeCurrentData.datas;
        }else{
          obj2 = obj.thunderCurrentData.datas
        }

          //
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

          //TODO コメントを取得する
        $scope.detailData =
        {
             deviceId   :obj._id,
             deviceName :obj.deviceName,
             type       :obj2.type,          //地震or雷
             seismicIntensity:obj2.seismicIntensity,     //震度（地震のみ）
             power :obj2.power,
             slope:obj2.slope,               //傾き（地震のみ）
             leakage:obj2.leakage,             //漏電（雷のみ）
             commercialBlackout:obj2.commercialBlackout,
             equipmentAbnormality:obj2.equipmentAbnormality,
             commentList:[
               {
                 comment:'建物に破損あり',
                 commentDate:'2017/01/15 10:15',
               }],
               mediaNewsletter:
                 {
                   japanMeteorologicalAgency:'4',      //メディア速報　震度
                   longPeriodSeismicActivityClass:'3'　//メディア速報長周期地震動階級
               }
       };

       //TODO 地図が出ない問題を解消する
       $scope.map = {
       // マップ初期表示の中心地
       center: {
         latitude: 35.459923, // 緯度
         longitude: 139.635290 // 経度
       },
       // マップ初期表示の拡大
       zoom: 19
     };

     $scope.markers = [
       {
         "id":1,
         "latitude":obj.latitude,
         "longitude":obj.longitude,
         "title":obj.deviceName
       }
     ];


      }, function errorCallback(response) {
        console.error("error in /api/device_detail/");
      });


      ///ボタンアクション/////
      $scope.addComment = function(ev){

        var title =  "コメント追加";

        $mdDialog.show({
           targetEvent: ev,
           template:
           '<md-dialog>'+
           '  <md-dialog-content class="md-dialog-content" role="document" tabindex="-1" id="dialogContent_2">'+
           '    <h2 class="md-title ng-binding">'+title+'</h2>'+
           '    <div class="md-dialog-content-body ng-scope">'+
           '     <p class="ng-binding"></p>'+
           '   </div>'+
           '<md-input-container class="md-block">'+
            '<textarea ng-model="user.biography" md-maxlength="150" rows="5" md-select-on-focus=""></textarea>'+
            '</md-input-container>'+
           '  <md-checkbox name="tos" ng-model="project.tos" required="">重要なコメントとして登録する</md-checkbox>'+
           ' </md-dialog-content>'+
           ' <md-dialog-actions>'+
           ' <button class="md-primary md-cancel-button md-button ng-scope md-default-theme md-ink-ripple" type="button" ng-click="closeDialog()" style="">キャンセル</button>'+
           ' <button class="md-primary md-confirm-button md-button md-ink-ripple md-default-theme" type="button" ng-click="regist()">登録</button>'+
           ' </md-dialog-actions>'+
           ' </md-dialog>',
        controller:['$scope', '$route', '$location', function ($scope, $route, $location) {

        //キャンセルボタン押下
        $scope.closeDialog = function() {
        $mdDialog.hide();
        }

        //登録ボタン押下
        $scope.regist = function() {
          $mdDialog.hide();
          //TODO 削除のリクエストを投げる
            $http({
              method: 'post',
              url: '/api/comment/DEV_00000_20170314142134/',
              data: { comment: this.user.biography, impFlg: this.project.tos }
            })
            .then(
              function successCallback(response){
                console.log(response);
                if(!response.data.error) {
                  console.log("success");
                  $rootScope.success = response.data.message;
                } else {
                  $rootScope.error = response.data.message;
                }

              },
              function errorCallback(response){
                  $rootScope.error = response.data.message;

              }
            ); 
          
        }

        }]
        });
      }

    }]);
