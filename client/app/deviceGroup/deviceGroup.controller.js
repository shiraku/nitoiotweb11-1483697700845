
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceGroupCtrl',['$rootScope','$routeParams','$scope','$http','$location','$mdDialog','$timeout','SharedService','filterFilter', function ($rootScope,$routeParams,$scope, $http, $location, $mdDialog, $timeout,SharedService,filterFilter) {
      $rootScope.success = false;
      $rootScope.error = false;


      //送信者一覧情報
      $http.get('/api/user/')
      .then(function successCallback(response) {
        console.log("posted successfully");
        console.log(response);

        var obj = response.data;

        //ヘッダータイトル
        $scope.navtitle=  obj.name;

        $scope.groupId = $routeParams.USER_ID;
        $scope.groupName = obj.name;
        $scope.deviceList = obj.device
        $scope.sendto = obj.sendto;

        var adminFlg = document.cookie.split( '; ' )[ 0 ].split( '=' )[ 1 ];
        if(adminFlg=="true"){
          $scope.isAdmin = true;
        }else{
          $scope.isAdmin = false;
        }


      }, function errorCallback(response) {
        console.error("error in posting");
      });

        //デバイス編集遷移
       $scope.deviceDetail = function(){
         $location.path("/user_"+$routeParams.USER_ID+"/device_"+this.item.id+'/edit');
       }

       //アラート設定画面遷移
      $scope.alertSetting = function(){
        $location.path("/user_"+$routeParams.USER_ID+"/group/alert");
      }

       //グループ名編集画面遷移
      $scope.groupNameEdit = function(ev){

        var json = {
          "title":"グループ名の編集",
          "placeholder":$scope.groupName,
          "ariaLabel":"",
          "initialValue":$scope.groupName,
          "ok":"登録",
          "cancel":"キャンセル",
        }

        dialogShow(ev,json);

    };

          //メールアドレスの値が変更された場合書き換える。
      $scope.$on('changedAlert', function() {
           var obj = SharedService.alert.get();
           //編集の場合
           if(obj.key){
           filterFilter($scope.sendto, obj.key)[0].name = obj.name;
           filterFilter($scope.sendto, obj.key)[0].mailid = obj.mailAddress;

           //追加の場合
           }else{
             $scope.sendto.push({mailid:obj.mailAddress,name:obj.name})
           }

       });



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
      item.key = this.item.mailid;
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
         '     <input ng-keypress="dialog.keypress($event)" md-autofocus="" ng-model="name" name="name" placeholder='+item.placeholder_name+' initialValue='+item.placeholder_name+' class="ng-pristine ng-valid md-autofocus md-input ng-empty ng-touched" aria-label="送信名" id="input_3" aria-invalid="false" style="">'+
         '     <div class="md-errors-spacer"></div>'+
         '   </md-input-container>'+
         '   <md-input-container md-no-float="" class="md-prompt-input-container ng-scope md-input-has-placeholder md-default-theme md-prompt-input-container-2">'+
         '     <input type="email" ng-keypress="dialog.keypress($event)" md-autofocus="" ng-model="mailAddress" name="mailAddress" placeholder='+item.placeholder_mailid+' initialValue='+item.placeholder_mailid+' class="ng-pristine ng-valid md-autofocus md-input ng-empty ng-touched" aria-label="メールアドレス" id="input_3" aria-invalid="false" style="">'+
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

      if(!flg){
      $scope.name = item.placeholder_name;
      $scope.mailAddress = item.placeholder_mailid;
      }

    //キャンセルボタン押下
    $scope.closeDialog = function() {
      $mdDialog.hide();
    }

    //登録ボタン押下
    $scope.regist = function() {
    if($scope.dialog.name == undefined && $scope.dialog.mailAddress == undefined) return false;
    if($scope.dialog.mailAddress.$invalid) return false;
      $mdDialog.hide();

      //新規登録の場合
      if(!item.key){
        item.key = false;
      }
      console.log ("sendto Post name"+$scope.dialog.name.$modelValue+ "key"+item.key+"mailId"+$scope.dialog.mailAddress.$modelValue);

      //編集内容をpost
      $http({
        method: 'POST',
        url: '/api/user/sendto/',
        data: { name: $scope.dialog.name.$modelValue, mailid: $scope.dialog.mailAddress.$modelValue, key: item.key }
      })
      .then(
        function successCallback(response){
          console.log(response);
          if(!response.data.error) {
            console.log("success");
            $rootScope.success = response.data.message;
            SharedService.alert.set($scope.name,$scope.mailAddress,item.key);
            $timeout(function (){
                $rootScope.success = false;
            },2000);
          } else {
            $rootScope.error = response.data.message;
            $timeout(function (){
                $rootScope.error = false;
            },2000);
          }

        },
        function errorCallback(response){
            $rootScope.error = response.data.message;
            $timeout(function (){
                $rootScope.error = false;
            },2000);

        }
      );
    }

    }]
    });
    };

//アラート通知追加
//TODO mail address DELETEの場合　メールアドレスを送る様にする。
$scope.mailAddressDelete = function (ev){

  //削除するMailIdを詰める。
  var deleteMailId = this.item.mailid;

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
        console.log("send to deleteMailId"+deleteMailId);
        $http({
          method: 'DELETE',
          url: '/api/user/sendto/'+deleteMailId+'/'
        })
        .then(
          function successCallback(response){
            console.log(response);
            if(!response.data.error) {
              console.log("success");
              $rootScope.success = response.data.message;
              $timeout(function (){
                  $rootScope.success = false;
              },2000);
            } else {
              $rootScope.error = response.data.message;
              $timeout(function (){
                  $rootScope.error = false;
              },2000);
            }

          },
          function errorCallback(response){
              $rootScope.error = response.data.message;
              $timeout(function (){
                  $rootScope.error = false;
              },2000);

          }
        );
  }
  //キャンセルの場合
  , function() {
    //特になし。
  }
);
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

    $mdDialog.show(confirm)
      .then(function(val) {
    //TODO 削除のリクエストを投げる
//        console.log("send to groupName"+dialog.groupName);
        $http({
          method: 'post',
          url: '/api/user/',
          data:{name: val}
        })
        .then(
          function successCallback(response){
            console.log(response);
            if(!response.data.error) {
              console.log("success");
              $rootScope.success = response.data.message;
              $scope.groupName = val;
              $timeout(function (){
                  $rootScope.success = false;
              },2000);
            } else {
              $rootScope.error = response.data.message;
              $timeout(function (){
                  $rootScope.error = false;
              },2000);
            }

          },
          function errorCallback(response){
              $rootScope.error = response.data.message;
              $timeout(function (){
                  $rootScope.error = false;
              },2000);

          }
        );
    });

  };



  }]);
