
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DownloadCsvItemSettingCtrl',['$rootScope','$routeParams','$scope','$http','$location', function ($rootScope,$routeParams,$scope, $http, $location) {


      //デバイスグループデータ
      //TODO APIで取得するように変更
      $scope.deviceGroupData = [
              {
              'groupId':'grp_0001',
              'groupName':'日東工業　設備管理',
              'deviceList':[
                { 'deviceId':'001',
                  'deviceName':'デバイス１',
                },
                { 'deviceId':'002',
                  'deviceName':'デバイス２',
                },
                { 'deviceId':'003',
                  'deviceName':'デバイス３',
                },
                { 'deviceId':'004',
                  'deviceName':'デバイス４',
                },
                { 'deviceId':'005',
                  'deviceName':'デバイス５',
                }
            ],
              'alertNotificationList':[
                { 'name':'山田　修',
                  'mailAddress':'yamada@nito.co.jp'
                },
                { 'name':'小林　武',
                  'mailAddress':'kobayashi@nito.co.jp'
                },
                { 'name':'湯浅　あさみ',
                  'mailAddress':'yuasa@nito.co.jp'
                },
                { 'name':'本田　宗太郎',
                  'mailAddress':'honda@nito.co.jp'
                }
              ]
            }];

      //ヘッダータイトル
      $scope.navtitle=$scope.deviceGroupData[0].groupName;


        //デバイス詳細データ遷移
       $scope.deviceDetail = function(){
         $location.path("/user_"+$routeParams.USER_ID+"/device_"+this.item.deviceId);
       }


    }]);
