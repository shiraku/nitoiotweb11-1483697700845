
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceInfoEditCtrl',['$rootScope','$routeParams','$scope','$http','$location','$mdDialog','SharedService', function ($rootScope,$routeParams,$scope, $http, $location, $mdDialog,SharedService) {


      $scope.text = SharedService.text.get();

      //送信者一覧情報
      $http.get('/api/device_basicinfo/' + $routeParams.DEVICE_ID + '/')
      .then(function successCallback(response) {
        console.log("posted successfully");
        console.log(response);
        var obj = response.data;

        $scope.deviceGroupData = {

          deviceId  :   obj._id,
          address   :   obj.address,
          deviceName:   obj.deviceName,
          latitude  :   obj.latitude,
          longitude :   obj.longitude,
          memo      :   obj.memo,
          responsiblePerson  :   obj.responsiblePerson,
          telNo     :   obj.telNo,

        }

            //小画面でも使用できるようにglobalで値を保持しておく
            SharedService.text.set($scope.deviceGroupData.latitude,$scope.deviceGroupData.longitude);

        //ヘッダータイトル
        $scope.navtitle= obj.deviceName;


      }, function errorCallback(response) {
        console.error("error in posting");
      });

      //送信者一覧情報
      $http.get('/api/user/')
      .then(function successCallback(response) {
        console.log("posted successfully");
        console.log(response);
          var obj = response.data;
          $scope.sendto = obj.sendto;
          $scope.admin_mflg = obj.admin_mflg;
      }, function errorCallback(response) {
        console.error("error in posting");
      });

      //アラート設定画面遷移
     $scope.alertSetting = function(){
       $location.path("/user_"+$routeParams.USER_ID+"/device_"+$routeParams.DEVICE_ID+'/alert');
     }

     //緯度経度の値が変更された場合書き換える。
     $scope.$on('changedText', function() {
          var obj = SharedService.text.get();
          $scope.deviceGroupData.latitude = obj.latitude;
          $scope.deviceGroupData.longitude = obj.longitude;
          //データバインド
          // $scope.$apply();
      });

     this.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
         $mdOpenMenu(ev);
      };

       //グループ名編集画面遷移
      $scope.deviceNameEdit = function(ev){
        var json = {"title":"デバイス名の編集",
                    "placeholder":"デバイス名",
                    "ariaLabel":"",
                    "initialValue":$scope.deviceGroupData.deviceName,
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
                       "initialValue":$scope.deviceGroupData.address,
                       "itemKey":"address",
                       "ok":"登録",
                       "cancel":"キャンセル"}
          dialogShow(ev,json);
       };

       //グループ名編集画面遷移
      $scope.latlonEdit = function(ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'dialog1.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
      };

      function DialogController($scope, $mdDialog) {

        //緯度経度を取得する
        var obj = SharedService.text.get();
        console.log("latitude"+obj.latitude+"longitude"+obj.longitude);

        //地図下部に表示する緯度経度
        $scope.latitude = obj.latitude;
        $scope.longitude = obj.longitude;

        //MAP定義
        $scope.map = {
        // マップ初期表示の中心地
        center: {
          latitude: obj.latitude,// 緯度
          longitude: obj.longitude// 経度
        },
        // マップ初期表示の拡大
        zoom: 13,
        events: {
                    //マップクリック時のイベント
                   click: function(marker, eventName, args) {
                        console.log("user defined event: " + marker, eventName, args);
                        //markerをMAPの中央に表示させる。
                         $scope.map.center.latitude = args[0].latLng.lat(),
                         $scope.map.center.longitude = args[0].latLng.lng(),

                         //地図下部に表示する緯度経度
                         $scope.latitude = args[0].latLng.lat(),
                         $scope.longitude = args[0].latLng.lng(),

                         //地図上に表示するmarker
                         $scope.markers = [
                            {
                              "id":1,
                              "latitude":args[0].latLng.lat(),
                              "longitude":args[0].latLng.lng(),
                            }
                          ];
                          //データバインド
                          $scope.$apply();
                   }
                 }
      };

      //マップにマーカーを立てる
      $scope.markers = [
        {
          "id":1,
          "latitude":obj.latitude,
          "longitude":obj.longitude
        }
      ];


        //キャンセルボタン押下
        $scope.closeDialog = function() {
          $mdDialog.hide();
        }

        //登録ボタン押下
        $scope.regist = function() {
          $mdDialog.hide();

          //globalの値を変更する。
          SharedService.text.set($scope.latitude,$scope.longitude);

          //編集内容をpost
          //TODO　この投げ方で良いか白倉さんに聞く。
          $http({
          method: 'post',
          url: '/api/device_basicinfo/' + $routeParams.DEVICE_ID + '/',
          data: {latitude:$scope.latitude,longitude:$scope.longitude}
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


      }

      //メモ編集画面遷移
      $scope.memoEdit = function(ev){
       var json = {"title":"メモの編集",
                   "placeholder":"メモ",
                   "ariaLabel":"",
                   "initialValue":$scope.deviceGroupData.memo,
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
                   "initialValue":$scope.deviceGroupData.responsiblePerson,
                    "itemKey":"responsiblePerson",
                   "ok":"登録",
                   "cancel":"キャンセル"}
       dialogShow(ev,json);
      };

      //連絡先編集画面遷移
      $scope.telNoEdit = function(ev){

//       var json = {"title":"連絡先",
//                   "placeholder":"連絡先",
//                   "ariaLabel":"",
//                   "initialValue":"",
//                    "itemKey":"telNo",
//                   "ok":"登録",
//                   "cancel":"キャンセル"}

        var tmpTelNo = Number($scope.deviceGroupData.telNo);

        var json = {
           "template":
           '<form name="dialog">'+
           '<md-dialog>'+
           '  <md-dialog-content class="md-dialog-content" role="document" tabindex="-1" id="dialogContent_2">'+
           '    <h2 class="md-title ng-binding">連絡先</h2>'+
           '    <div class="md-dialog-content-body ng-scope">'+
           '     <p class="ng-binding"></p>'+
           '   </div>'+
           '   <md-input-container md-no-float="" class="md-prompt-input-container ng-scope md-input-has-placeholder md-default-theme">'+
           '     <input type="number" ng-keypress="dialog.keypress($event)" md-autofocus="" ng-model="telNo" name="telNo" placeholder="連絡先" class="ng-pristine ng-valid md-autofocus md-input ng-empty ng-touched" aria-label="+this.title+" aria-invalid="false" style="">'+
           '     <div ng-messages="telNo.$error"  class="md-errors-spacer" ng-hide="telNo.$valid">'+
             '     <div ng-message="email">半角数字で入力してください</div>'+
             '     </div>'+
           ' </md-input-container>'+
           ' </md-dialog-content>'+
           ' <md-dialog-actions>'+
           ' <button class="md-primary md-cancel-button md-button ng-scope md-default-theme md-ink-ripple" type="button" ng-click="closeDialog()" style="">キャンセル</button>'+
           ' <button class="md-primary md-confirm-button md-button md-ink-ripple md-default-theme" type="button" ng-click="regist()">登録</button>'+
           ' </md-dialog-actions>'+
           ' </md-dialog>'+
           ' </form>',
           "targetEvent": ev,
        }
      dialogShowTemp(ev,json,tmpTelNo);
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

      function dialogShowTemp(ev,param,tmpTelNo){

          $mdDialog.show({
           targetEvent: param.targetEvent,
           template: param.template,
            controller:['$scope', '$route', '$location', function ($scope, $route, $location) {

              //初期値値設定
              $scope.telNo = tmpTelNo;

              //キャンセルボタン押下
              $scope.closeDialog = function() {
                $mdDialog.hide();
              }

              //登録ボタン押下
              $scope.regist = function() {
                if($scope.dialog.telNo == undefined) return false;
                if($scope.dialog.telNo.$invalid) return false;
                $mdDialog.hide();
                //編集内容をpost
                $http({
                method: 'post',
                url: '/api/device_basicinfo/' + $routeParams.DEVICE_ID + '/',
                data: { key: "telNo", value: $scope.dialog.telNo.$modelValue }
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
  item.placeholder_mailid = 'メールアドレス'

  }else{

  item.title = 'メールアドレスの編集';
  item.placeholder_name = this.item.name;
  item.placeholder_mailid = this.item.mailid;
  item.key = "key='" + item.placeholder_mailid + "'"

}

$mdDialog.show({
     targetEvent: $event,
     template:
     '<form name="dialog">'+
     '<md-dialog>'+
     '  <md-dialog-content class="md-dialog-content" role="document" tabindex="-1" id="dialogContent_2">'+
     '    <h2 class="md-title ng-binding">'+item.title+'</h2>'+
     '    <div class="md-dialog-content-body ng-scope">'+
     '     <p class="ng-binding"></p>'+
     '   </div>'+
     '   <md-input-container md-no-float="" class="md-prompt-input-container ng-scope md-input-has-placeholder md-default-theme">'+
     '     <input ng-keypress="dialog.keypress($event)" md-autofocus="" ng-model="name" name="name" value="'+item.placeholder_name+'" placeholder='+item.placeholder_name+' class="ng-pristine ng-valid md-autofocus md-input ng-empty ng-touched" aria-label="デバイス名" id="input_3" aria-invalid="false" style="">'+
     '     <div class="md-errors-spacer"></div>'+
     '   </md-input-container>'+
     '   <md-input-container md-no-float="" class="md-prompt-input-container ng-scope md-input-has-placeholder md-default-theme md-prompt-input-container-2">'+
     '     <input type="email" ng-keypress="dialog.keypress($event)" md-autofocus="" ng-model="mailAddress" name="mailAddress" value='+item.placeholder_mailid+' placeholder='+item.placeholder_mailid+' class="ng-pristine ng-valid md-autofocus md-input ng-empty ng-touched" aria-label="デバイス名" id="input_3" aria-invalid="false" style="">'+
     '     <input type="hidden" ng-model="key" name="key" placeholder='+item.placeholder_mailid+' ng-init="'+item.key+'" class="ng-hide">'+
     '     <div ng-messages="dialog.mailAddress.$error"  class="md-errors-spacer" ng-hide="dialog.mailAddress.$valid">'+
       '     <div ng-message="email">メールアドレスを正しく入力してください</div>'+
       '     </div>'+
     '   </md-input-container>'+
     ' </md-dialog-content>'+
     ' <md-dialog-actions>'+
     ' <button class="md-primary md-cancel-button md-button ng-scope md-default-theme md-ink-ripple" type="button" ng-click="closeDialog()" style="">キャンセル</button>'+
     ' <button class="md-primary md-confirm-button md-button md-ink-ripple md-default-theme" type="button" ng-click="regist()">登録</button>'+
     ' </md-dialog-actions>'+
     ' </md-dialog>'+
     ' </form>',
controller:['$scope', '$route', '$location', function ($scope, $route, $location) {


//キャンセルボタン押下
$scope.closeDialog = function() {
  $mdDialog.hide();
}

//登録ボタン押下
$scope.regist = function() {
  if($scope.dialog.name == undefined && $scope.dialog.mailAddress == undefined) return false;
  if($scope.dialog.mailAddress.$invalid) return false;
  $mdDialog.hide();
  //編集内容をpost
  $http({
    method: 'POST',
    url: '/api/user/sendto/',
    data: { name: $scope.dialog.name.$modelValue, mailid: $scope.dialog.mailAddress.$modelValue, key: $scope.dialog.key.$modelValue }
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
