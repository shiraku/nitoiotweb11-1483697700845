
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
                  deviceAbnormality:true
                };



        // //TODO どうにかする
        ////SI値か震度通知する場合は、どちらか一つのみを選択する。
        // //震度が”通知する”になった場合SI値は"通知しない"にする。
        // $scope.$watch('switch.seismicIntensity', function(newValue, oldValue, scope) {
        //       console.log(newValue);
        //       if (newValue) {
        //         $scope.switch.si = false;
        //       }
        // });
        //
        // //SI値が”通知する”になった場合震度は"通知しない"にする。
        // $scope.$watch('switch.si', function(newValue, oldValue, scope) {
        //       console.log(newValue);
        //       if (newValue) {
        //         $scope.switch.seismicIntensity = false;
        //       }
        // });



        //通知闘値データ取得

        //アラート情報
        $http.get('/api/alert/')
        .then(function successCallback(response) {
          console.log("posted successfully");
          console.log(response);

          //詰め直す
          var obj = response.data;

          //TODO これで良いかどうかは確認。
          //各設定値が0の場合は設定なしとみなす。0でない場合は、設定有りとみなす。

          //設定ありの場合
          if(obj.si >0){
            $scope.switch.si  = true;
            $scope.slider.si  = parseFloat(obj.si);
          }else{
            //設定なしの場合
            $scope.switch.si  = false;
          }

          //設定ありの場合
          if(obj.seismicIntensity > 0){
            $scope.switch.seismicIntensity = true;
            $scope.slider.seismicIntensity  = parseInt(obj.seismicIntensity,10);
          }else{
            //設定なしの場合
            $scope.switch.seismicIntensity = false;
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
          $scope.switch.deviceAbnormality = obj.deviceAbnormality;



        }, function errorCallback(response) {
          console.error("error in posting");
        });
      
      $scope.switchIntensity = function(switchSI){
        console.log(switchSI);
        if(switchSI){
          $scope.dispFlg = true;
          switchSI.className="md-warn";
        }else{
          $scope.dispFlg = false;
          switchSI.className="md-primary";
        }
      }

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


          //スライダーの値
          seismicIntensity : $scope.slider.seismicIntensity,
          si : $scope.slider.si,
          lpgm : $scope.slider.longPeriodGroundMotion,
          //通知する/通知しない
          slope : $scope.switch.slope,
          lightningSurge : $scope.switch.lightningSurge,
          commercialBlackout : $scope.switch.commercialBlackout,
          equipmentAbnormality: $scope.switch.deviceAbnormality

        }

        //POST処理
        $http({
          method: 'post',
          url: '/api/alert/',
          data: postData
        })
        .then(function successCallback(response) {
          console.log("posted successfully");
          console.log(response);
          $location.path($scope.backUrl);
        }, function errorCallback(response) {
          console.error("error in posting");
        });


      }


  }]);
