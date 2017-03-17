
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceGroupCtrl',['$rootScope','$routeParams','$scope','$http','$location','$mdDialog', function ($rootScope,$routeParams,$scope, $http, $location, $mdDialog) {


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


        //デバイス編集遷移
       $scope.deviceDetail = function(){
         $location.path("/user_"+$routeParams.USER_ID+"/device_"+this.item.deviceId+'/edit');
       }

       //アラート設定画面遷移
      $scope.alertSetting = function(){
        $location.path("/user_"+$routeParams.USER_ID+"/group/alert");
      }

       //グループ名編集画面遷移
      $scope.groupNameEdit = function(ev){

        var json = {
          "title":"グループ名の編集",
          "placeholder":"グループ名",
          "ariaLabel":"",
          "initialValue":"",
          "ok":"登録",
          "cancel":"キャンセル",
        }

        dialogShow(ev,json);

    };


    //ボタン押下のアクション
    $scope.mailAddressAdd = showMailAddressDialog;
    $scope.mailAddressEdit = showMailAddressDialog;

    //メールアドレス追加/編集のダイアログ表示
    function showMailAddressDialog($event,flg){

      var item = {};

      //新規作成の場合
      if(flg){
      item.title = 'メールアドレスの追加',
      item.placeholder_name = '名前',
      item.placeholder_mailaddress = 'メールアドレス'

      }else{

      item.title = 'メールアドレスの編集';
      item.placeholder_name = this.item.name;
      item.placeholder_mailaddress = this.item.mailAddress;

    }

    $mdDialog.show({
         targetEvent: $event,
         template:
         '<md-dialog>'+
         '  <md-dialog-content class="md-dialog-content" role="document" tabindex="-1" id="dialogContent_2">'+
         '    <h2 class="md-title ng-binding">'+item.title+'</h2>'+
         '    <div class="md-dialog-content-body ng-scope">'+
         '     <p class="ng-binding"></p>'+
         '   </div>'+
         '   <md-input-container md-no-float="" class="md-prompt-input-container ng-scope md-input-has-placeholder md-default-theme">'+
         '     <input ng-keypress="dialog.keypress($event)" md-autofocus="" ng-model="dialog.name" placeholder='+item.placeholder_name+' class="ng-pristine ng-valid md-autofocus md-input ng-empty ng-touched" aria-label="デバイス名" id="input_3" aria-invalid="false" style="">'+
         '     <div class="md-errors-spacer"></div>'+
         '   </md-input-container>'+
         '   <md-input-container md-no-float="" class="md-prompt-input-container ng-scope md-input-has-placeholder md-default-theme md-prompt-input-container-2">'+
         '     <input ng-keypress="dialog.keypress($event)" md-autofocus="" ng-model="dialog.mailAddress" placeholder='+item.placeholder_mailaddress+' class="ng-pristine ng-valid md-autofocus md-input ng-empty ng-touched" aria-label="デバイス名" id="input_3" aria-invalid="false" style="">'+
         '     <div class="md-errors-spacer"></div>'+
         '   </md-input-container>'+
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
    }

    }]
    });
    };



//     //アラート通知追加
//     $scope.mailAddressAdd = function (ev){
//
//       $scope.mailAddressAdd.title = 'メールアドレスの追加',
//       $scope.mailAddressAdd.placeholder_name = '名前',
//       $scope.mailAddressAdd.placeholder_mailaddress = 'メールアドレス'
//
//       var item = $scope.mailAddressAdd;
//
//     $mdDialog.show({
//          targetEvent: ev,
//          template:
//          '<md-dialog>'+
//          '  <md-dialog-content class="md-dialog-content" role="document" tabindex="-1" id="dialogContent_2">'+
//          '    <h2 class="md-title ng-binding">'+item.title+'</h2>'+
//          '    <div class="md-dialog-content-body ng-scope">'+
//          '     <p class="ng-binding"></p>'+
//          '   </div>'+
//          '   <md-input-container md-no-float="" class="md-prompt-input-container ng-scope md-input-has-placeholder md-default-theme">'+
//          '     <input ng-keypress="dialog.keypress($event)" md-autofocus="" ng-model="dialog.name" placeholder='+item.placeholder_name+' class="ng-pristine ng-valid md-autofocus md-input ng-empty ng-touched" aria-label="デバイス名" id="input_3" aria-invalid="false" style="">'+
//          '     <div class="md-errors-spacer"></div>'+
//          '   </md-input-container>'+
//          '   <md-input-container md-no-float="" class="md-prompt-input-container ng-scope md-input-has-placeholder md-default-theme md-prompt-input-container-2">'+
//          '     <input ng-keypress="dialog.keypress($event)" md-autofocus="" ng-model="dialog.mailAddress" placeholder='+item.placeholder_mailaddress+' class="ng-pristine ng-valid md-autofocus md-input ng-empty ng-touched" aria-label="デバイス名" id="input_3" aria-invalid="false" style="">'+
//          '     <div class="md-errors-spacer"></div>'+
//          '   </md-input-container>'+
//          ' </md-dialog-content>'+
//          ' <md-dialog-actions>'+
//          ' <button class="md-primary md-cancel-button md-button ng-scope md-default-theme md-ink-ripple" type="button" ng-click="closeDialog()" style="">キャンセル</button>'+
//          ' <button class="md-primary md-confirm-button md-button md-ink-ripple md-default-theme" type="button" ng-click="regist()">登録</button>'+
//          ' </md-dialog-actions>'+
//          ' </md-dialog>',
//   controller:['$scope', '$route', '$location', function ($scope, $route, $location) {
//
//     //キャンセルボタン押下
//     $scope.closeDialog = function() {
//       $mdDialog.hide();
//     }
//
//     //登録ボタン押下
//     $scope.regist = function() {
//       $mdDialog.hide();
//     }
//
//   }]
// });
// };
//
// //アラート通知追加
// $scope.mailAddressEdit = function (ev){
//
// $scope.mailAddressEdit.title = 'メールアドレスの編集';
// $scope.mailAddressEdit.placeholder_name = this.item.name;
// $scope.mailAddressEdit.placeholder_mailaddress = this.item.mailAddress;
//
// var item = $scope.mailAddressEdit;
//
// $mdDialog.show({
//    targetEvent: ev,
//    template:
//    '<md-dialog>'+
//    '  <md-dialog-content class="md-dialog-content" role="document" tabindex="-1" id="dialogContent_2">'+
//    '    <h2 class="md-title ng-binding">'+item.title+'</h2>'+
//    '    <div class="md-dialog-content-body ng-scope">'+
//    '     <p class="ng-binding"></p>'+
//    '   </div>'+
//    '   <md-input-container md-no-float="" class="md-prompt-input-container ng-scope md-input-has-placeholder md-default-theme">'+
//    '     <input ng-keypress="dialog.keypress($event)" md-autofocus="" ng-model="dialog.name" value='+item.placeholder_name+' placeholder='+item.placeholder_name+' class="ng-pristine ng-valid md-autofocus md-input ng-empty ng-touched" aria-label="デバイス名" id="input_3" aria-invalid="false" style="">'+
//    '     <div class="md-errors-spacer"></div>'+
//    '   </md-input-container>'+
//    '   <md-input-container md-no-float="" class="md-prompt-input-container ng-scope md-input-has-placeholder md-default-theme md-prompt-input-container-2">'+
//    '     <input ng-keypress="dialog.keypress($event)" md-autofocus="" ng-model="dialog.mailAddress" placeholder='+item.placeholder_mailaddress+' class="ng-pristine ng-valid md-autofocus md-input ng-empty ng-touched" aria-label="デバイス名" id="input_3" aria-invalid="false" style="">'+
//    '     <div class="md-errors-spacer"></div>'+
//    '   </md-input-container>'+
//    ' </md-dialog-content>'+
//    ' <md-dialog-actions>'+
//    ' <button class="md-primary md-cancel-button md-button ng-scope md-default-theme md-ink-ripple" type="button" ng-click="closeDialog()" style="">キャンセル</button>'+
//    ' <button class="md-primary md-confirm-button md-button md-ink-ripple md-default-theme" type="button" ng-click="regist()">登録</button>'+
//    ' </md-dialog-actions>'+
//    ' </md-dialog>',
// controller:['$scope', '$route', '$location', function ($scope, $route, $location) {
//
// //キャンセルボタン押下
// $scope.closeDialog = function() {
// $mdDialog.hide();
// }
//
// //登録ボタン押下
// $scope.regist = function() {
// $mdDialog.hide();
// }
//
// }]
// });
// };

//アラート通知追加
$scope.mailAddressDelete = function (ev){

  // Appending dialog to document.body to cover sidenav in docs app
  var confirm = $mdDialog.confirm()
        .title('メールアドレスの削除')
        .textContent('本当にメールアドレスを削除してもいいですか？')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('削除')
        .cancel('キャンセル');

  $mdDialog.show(confirm).then(function() {
  //削除の場合
    //TODO 削除のリクエストを投げる
  }
  //キャンセルの場合
  , function() {
    //特になし。
  }
);
};

//グループ名編集画面遷移
$scope.deviceNameEdit = function(ev){
 var json = {"title":"グループ名前の編集",
             "placeholder":"グループ名前",
             "ariaLabel":"",
             "initialValue":"",
             "ok":"登録",
             "cancel":"キャンセル"}
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

  };



  }]);
