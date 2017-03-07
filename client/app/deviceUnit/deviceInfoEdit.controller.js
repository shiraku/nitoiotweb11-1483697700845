
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceInfoEditCtrl',['$rootScope','$routeParams','$scope','$http','$location','$mdDialog', function ($rootScope,$routeParams,$scope, $http, $location, $mdDialog) {


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

       //グループ名編集画面遷移
      $scope.deviceNameEdit = function(ev){

        var json = {
          "title":"デバイス名の編集",
          "placeholder":"デバイス名",
          "ariaLabel":"",
          "initialValue":"",
          "ok":"登録",
          "cancel":"キャンセル",
        }

        dialogShow(ev,json);

    };


    //住所編集画面遷移
   $scope.addressEdit = function(ev){

     var json = {
       "title":"住所の編集",
       "placeholder":"住所",
       "ariaLabel":"",
       "initialValue":"",
       "ok":"登録",
       "cancel":"キャンセル",
     }

     dialogShow(ev,json);

 };


 //グループ名編集画面遷移
$scope.latlonEdit = function(ev){

  // var json = {
  //   "title":"グループ名の編集",
  //   "placeholder":"グループ名",
  //   "ariaLabel":"",
  //   "initialValue":"",
  //   "ok":"登録",
  //   "cancel":"キャンセル",
  // }

  dialogShow(ev,json);

};



//メモ編集画面遷移
$scope.memoEdit = function(ev){

 var json = {
   "title":"メモの編集",
   "placeholder":"メモ",
   "ariaLabel":"",
   "initialValue":"",
   "ok":"登録",
   "cancel":"キャンセル",
 }

 dialogShow(ev,json);

};
//責任者編集画面遷移
$scope.responsiblePersonEdit = function(ev){

 var json = {
   "title":"責任者の編集",
   "placeholder":"責任者",
   "ariaLabel":"",
   "initialValue":"",
   "ok":"登録",
   "cancel":"キャンセル",
 }

 dialogShow(ev,json);

};

//連絡先編集画面遷移
$scope.telNoEdit = function(ev){

 var json = {
   "title":"連絡先",
   "placeholder":"連絡先",
   "ariaLabel":"",
   "initialValue":"",
   "ok":"登録",
   "cancel":"キャンセル",
 }

 dialogShow(ev,json);

};



    function dialogShow(ev,param){
      var confirm = $mdDialog.prompt()
        .title(param.title)
        .placeholder(param.placeholder)
        .ariaLabel(param.ariaLabel)
        .initialValue(param.initialValue)
        .targetEvent(ev)
        .ok(param.ok)
        .cancel(param.cancel);

        $mdDialog.show(confirm);


      // $mdDialog.show(confirm).then(function(result) {
      //     return result;
      //   });

    };


  }]);
