
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceInfoEditCtrl',['$rootScope','$routeParams','$scope','$http','$location','$mdDialog', function ($rootScope,$routeParams,$scope, $http, $location, $mdDialog) {

      //送信者一覧情報
      $http.get('/api/device_basicinfo/' + $routeParams.DEVICE_ID + '/')
      .then(function successCallback(response) {
        console.log("posted successfully");
        console.log(response);
      }, function errorCallback(response) {
        console.error("error in posting");
      });
      
      //送信者一覧情報
      $http.get('/api/user/')
      .then(function successCallback(response) {
        console.log("posted successfully");
        console.log(response);
      }, function errorCallback(response) {
        console.error("error in posting");
      });
      

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

      //アラート設定画面遷移
     $scope.alertSetting = function(){
       $location.path("/user_"+$routeParams.USER_ID+"/device_"+$routeParams.DEVICE_ID+'/alert');
     }

       //グループ名編集画面遷移
      $scope.deviceNameEdit = function(ev){
        var json = {"title":"デバイス名の編集",
                    "placeholder":"デバイス名",
                    "ariaLabel":"",
                    "initialValue":"",
                    "itemKey":"deviceName",
                    "ok":"登録",
                    "cancel":"キャンセル"}
        dialogShow(ev,json);
      };

       //住所編集画面遷移
      $scope.addressEdit = function(ev){
           var json = {"title":"住所の編集",
                       "placeholder":"住所",
                       "ariaLabel":"",
                       "initialValue":"",
                       "itemKey":"address",
                       "ok":"登録",
                       "cancel":"キャンセル"}
          dialogShow(ev,json);
       };

       //グループ名編集画面遷移
      $scope.latlonEdit = function(ev){

      };

      //メモ編集画面遷移
      $scope.memoEdit = function(ev){
       var json = {"title":"メモの編集",
                   "placeholder":"メモ",
                   "ariaLabel":"",
                   "initialValue":"",
                    "itemKey":"memo",
                   "ok":"登録",
                   "cancel":"キャンセル"}
       dialogShow(ev,json);
      };

      //責任者編集画面遷移
      $scope.responsiblePersonEdit = function(ev){
       var json = {"title":"責任者の編集",
                   "placeholder":"責任者",
                   "ariaLabel":"",
                   "initialValue":"",
                    "itemKey":"responsiblePerson",
                   "ok":"登録",
                   "cancel":"キャンセル"}
       dialogShow(ev,json);
      };

      //連絡先編集画面遷移
      $scope.telNoEdit = function(ev){

       var json = {"title":"連絡先",
                   "placeholder":"連絡先",
                   "ariaLabel":"",
                   "initialValue":"",
                    "itemKey":"telNo",
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
        
        var itemKey = param.itemKey

          $mdDialog.show(confirm)
            .then(function(val) {
            //登録の場合
            //TODO 削除のリクエストを投げる
              $http({
                method: 'post',
                url: '/api/device_basicinfo/' + $routeParams.DEVICE_ID + '/',
                data: { key: itemKey, value: val }
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
          });

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
  //編集内容をpost
  $http({
    method: 'POST',
    url: '/api/user/sendto/',
    data: { name: $scope.dialog.name, mailid: $scope.dialog.mailAddress, key: "nito_nems02@yahoo.co.jp" }
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
};


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
        $http({
          method: 'DELETE',
          url: '/api/user/sendto/nito_nems02@yahoo.co.jp/'
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
    //キャンセルの場合
    , function() {
      //特になし。
    }
  );
};





  }]);
