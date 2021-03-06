
'use strict';

    angular.module('nitoiotweb11App')
    .controller('AlertSettingCtrl',['$rootScope','$routeParams','$scope','$http','$location','$mdDialog', function ($rootScope,$routeParams,$scope, $http, $location, $mdDialog) {
      $rootScope.success = false;
      $rootScope.error = false;




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

        //デフォルト値設定
              //スライダー
                $scope.slider = {
                  //震度
                  //SI値 TODO SI値のデフォルト値を設定する
                  //長周期地震動
                  seismicIntensity:3,
                  si:3,
                  longPeriodGroundMotion:2
                };


              //通知する/通知しない
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
                  equipmentAbnormality:true
                };
                //震度とSI値のswitchは震度をデフォルト表示にする
                $scope.switchSI = false;


        //通知闘値データ取得

        //アラート情報
        $http.get('/api/alert/')
        .then(function successCallback(response) {
//          console.log("posted successfully");
//          console.log(response);

          //詰め直す
          var obj = response.data;

          //TODO これで良いかどうかは確認。
          //各設定値が0の場合は設定なしとみなす。0でない場合は、設定有りとみなす。


          //SI値設定あり　震度設定ありの場合　震度をtrueとする
//          var isSiValue = obj.si >0;
//          var isSeismicIntensityValue = obj.seismicIntensity > 0;

          //SI値設定なし　震度設定ありの場合　震度をtrueとする
          if(!obj.seismicIntensityFlg　&& !obj.siFlg ){
            $scope.switch.si  = false;
            $scope.switch.seismicIntensity = false;
            $scope.switchSI = false;

          }else if( obj.seismicIntensityFlg ){
            $scope.switch.si  = false;
            $scope.slider.si  = parseInt(obj.si);
            $scope.switch.seismicIntensity = true;
            $scope.slider.seismicIntensity  = parseInt(obj.seismicIntensity,10);
            $scope.switchSI = false;

          //SI値設定あり　震度設定なしの場合　SI値をtrueとする
          }else if(obj.siFlg ){
            $scope.switch.si  = true;
            $scope.slider.si  = parseFloat(obj.si);
            $scope.switch.seismicIntensity = false;
            $scope.slider.seismicIntensity  = parseInt(obj.seismicIntensity,10);
            $scope.switchSI = true;
          }



          //設定ありの場合
          if(obj.lpgm > 0){
            $scope.switch.longPeriodGroundMotion = true;
            $scope.slider.longPeriodGroundMotion  = parseInt(obj.lpgm,10);
          }else{
            //設定なしの場合
            $scope.switch.longPeriodGroundMotion = false;
          }

          //通知する/通知しない
          $scope.switch.slope  = obj.slope;
          $scope.switch.lightningSurge  = obj.lightningSurge;
          $scope.switch.commercialBlackout  = obj.commercialBlackout;
          $scope.switch.equipmentAbnormality = obj.equipmentAbnormality;


        }, function errorCallback(response) {
          console.error("error in posting");
        });

      $scope.switchIntensity = function(switchSI){
//        console.log(switchSI);
        if(switchSI){
          switchSI=true;
        }else{
          switchSI=false;
        }
      }

      //キャンセルボタン押下
      $scope.cancel = function() {
        $location.path($scope.backUrl);
      }

      //登録ボタン押下
      $scope.regist = function() {

        //POSTするURLを生成する。
        if($scope.case =="group"){
          $scope.postUrl = "group"+$routeParams.USER_ID;
        }else{
          $scope.postUrl = "device"+$routeParams.USER_ID+$routeParams.DEVICE_ID;
        }

        //送信データ
        var postData = {


          //スライダーの値
          switchSI : $scope.switchSI,
          seismicIntensityFlg : $scope.switch.seismicIntensity,
          seismicIntensity : $scope.slider.seismicIntensity,
          siFlg : $scope.switch.si,
          si : $scope.slider.si,
          lpgm : $scope.slider.longPeriodGroundMotion,
          //通知する/通知しない
          slope : $scope.switch.slope,
          lightningSurge : $scope.switch.lightningSurge,
          commercialBlackout : $scope.switch.commercialBlackout,
          equipmentAbnormality: $scope.switch.equipmentAbnormality

        }

        //POST処理
        $http({
          method: 'post',
          url: '/api/alert/',
          data: postData
        })
        .then(function successCallback(response) {
//          console.log("posted successfully");
//          console.log(response);
          $location.path($scope.backUrl);
        }, function errorCallback(response) {
          console.error("error in posting");
        });


      }


  }]);
