
'use strict';

    angular.module('nitoiotweb11App')
    .controller('AlertSettingCtrl',['$rootScope','$routeParams','$scope','$http','$location','$mdDialog', function ($rootScope,$routeParams,$scope, $http, $location, $mdDialog) {


      //URLでグループ設定がアラート設定か切り替えを行う。
      if(!$routeParams.DEVICE_ID){
        //グループ
        $scope.navtitle="アラート設定（グループ）";
      }else{
        //デバイス
        $scope.navtitle="アラート設定（デバイス）";
      };

      //震度地震動のセレクトボックスアイテム
      $scope.seismicIntensitySelectItems =[
        { 'value':3,
          'label':3,
        },
        { 'value':4,
          'label':4,
        },
        { 'value':5,
          'label':5,
        },
        { 'value':6,
          'label':6,
        },
        { 'value':7,
          'label':7,
        },
        { 'value':0,
          'label':'通知しない',
        }
      ]

      //長周期地震動のデフォルト値設定
      $scope.seismicIntensitySelectItem = 3;


      //長周期地震動のセレクトボックスアイテム
      $scope.longPeriodGroundMotionSelectItems =[
        { 'value':1,
          'label':1,
        },
        { 'value':2,
          'label':2,
        },
        { 'value':3,
          'label':3,
        },
        { 'value':4,
          'label':4,
        },
        { 'value':0,
          'label':'通知しない',
        }
      ]

      //長周期地震動のデフォルト値設定
      $scope.longPeriodGroundMotionSelectItem = 2;





      //通知闘値データ
      //TODO APIで取得するように変更
      $scope.thresholdValue = [

        // 震度			1-8の数/通知しない
        // 長周期地震動		1-8の数/通知しない
        // 傾き			1-10の数/通知しない
        // 雷サージ		小/中/大/通知しない
        // 商用停電		停電/通知しない(停電しても通知がこない設定)
        // 機器死活		停電/通知しない(機器が死んでいても通知がこない設定)
        {
        'seismicIntensity':'',
        'longPeriodGroundMotion':'',
        'slope':'',
        'lightningSurge':'',
        'commercialBlackout':'',
        'equipmentLifeAndDeath':''
        }];


      //キャンセルボタン押下
      //TODO 元の画面に戻る処理を追加
      $scope.cancel = function() {
      }

      //登録ボタン押下
      //TODO APIに投げる処理を追加
      $scope.regist = function() {
      }


  }]);
