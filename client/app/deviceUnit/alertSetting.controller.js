
'use strict';

    angular.module('nitoiotweb11App')
    .controller('AlertSettingCtrl',['$rootScope','$routeParams','$scope','$http','$location','$mdDialog', function ($rootScope,$routeParams,$scope, $http, $location, $mdDialog) {


      //URLでグループ設定がアラート設定か切り替えを行う。
      if(!$routeParams.DEVICE_ID){
        //グループ
        $scope.navtitle = "アラート設定";
        $scope.backUrl = "/user_"+$routeParams.USER_ID+"/group";
        $scope.case = "group";
      }else{
        //デバイス
        $scope.navtitle="アラート設定";
        $scope.backUrl = "/user_"+$routeParams.USER_ID+"/device_"+$routeParams.DEVICE_ID+"/edit";
        $scope.case = "device";
      };

      //スライダーのデフォルト値設定
        $scope.slider = {
          //震度
          //SI値 TODO SI値のデフォルト値を設定する
          //長周期地震動
          seismicIntensity:3,
          si:3,
          longPeriodGroundMotion:2
        };


      //通知する/通知しないのデフォルト値設定
        $scope.switch = {
          //震度
          //SI値
          //長周期地震動
          //傾き
          //雷サージ
          //商用停電
          //機器異常
          seismicIntensity:true,
          si:false,
          longPeriodGroundMotion:true,
          slope:true,
          lightningSurge:true,
          commercialBlackout:true,
          deviceAbnormality:true
        };



        //SI値か震度通知する場合は、どちらか一つのみを選択する。
        //震度が”通知する”になった場合SI値は"通知しない"にする。
        $scope.$watch('switch.seismicIntensity', function(newValue, oldValue, scope) {
              console.log(newValue);
              if (newValue) {
                $scope.switch.si = false;
              }
        });

        //SI値が”通知する”になった場合震度は"通知しない"にする。
        $scope.$watch('switch.si', function(newValue, oldValue, scope) {
              console.log(newValue);
              if (newValue) {
                $scope.switch.seismicIntensity = false;
              }
        });



        //通知闘値データ取得
        //TODO APIで取得するように変更

        // $http.get('/api/device_list/')
        // .then(function successCallback(response) {
        //   console.log("posted successfully");
        //   console.log(response);


          var response = {

            seismicIntensityValue : 4,
            siValue : 127.8,
            longPeriodGroundMotionValue : 3,
            seismicIntensity: true,
            si : false,
            longPeriodGroundMotion : true,
            slope : true,
            lightningSurge : true,
            commercialBlackout : false,
            deviceAbnormality: false

          }


          //スライダー
          $scope.slider.seismicIntensity  = response.seismicIntensityValue;
          $scope.slider.si  = response.siValue;
          $scope.slider.longPeriodGroundMotion  = response.longPeriodGroundMotionValue;

          //通知する/通知しない
          $scope.switch.seismicIntensity = response.seismicIntensity;
          $scope.switch.si  = response.si;
          $scope.switch.longPeriodGroundMotion  = response.longPeriodGroundMotion;
          $scope.switch.slope  = response.slope;
          $scope.switch.lightningSurge  = response.lightningSurge;
          $scope.switch.commercialBlackout  = response.commercialBlackout;
          $scope.switch.deviceAbnormality = response.deviceAbnormality;


        // }, function errorCallback(response) {
        //   console.error("error in posting");
        // });





      //キャンセルボタン押下
      //TODO 元の画面に戻る処理を追加
      $scope.cancel = function() {
        $location.path($scope.backUrl);
      }

      //登録ボタン押下
      //TODO APIに投げる処理を追加
      $scope.regist = function() {

        //POSTするURLを生成する。
        if($scope.case =="group"){
          $scope.postUrl = "group"+$routeParams.USER_ID;
        }else{
          $scope.postUrl = "device"+$routeParams.USER_ID+$routeParams.DEVICE_ID;
        }


        //送信データ
        var postData = {


          //スライダー
          seismicIntensityValue : $scope.slider.seismicIntensity,
          siValue : $scope.slider.si,
          longPeriodGroundMotionValue : $scope.slider.longPeriodGroundMotion,
          //通知する/通知しない
          seismicIntensity: $scope.switch.seismicIntensity,
          si : $scope.switch.si,
          longPeriodGroundMotion : $scope.switch.longPeriodGroundMotion,
          slope : $scope.switch.slope,
          lightningSurge : $scope.switch.lightningSurge,
          commercialBlackout : $scope.switch.commercialBlackout,
          deviceAbnormality: $scope.switch.deviceAbnormality

        }


        //POST処理
        // $http.post('/api/alertSetting/')
        // .then(function successCallback(response) {
        //   console.log("posted successfully");
        //   console.log(response);
            $location.path($scope.backUrl);
        // }, function errorCallback(response) {
        //   console.error("error in posting");
        // });


      }


  }]);
