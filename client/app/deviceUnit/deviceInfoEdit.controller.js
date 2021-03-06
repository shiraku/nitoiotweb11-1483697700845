
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceInfoEditCtrl',['$rootScope','$routeParams','$scope','$http','$location','$mdDialog','SharedService','$timeout','filterFilter','uiGmapIsReady', function ($rootScope,$routeParams,$scope, $http, $location, $mdDialog,SharedService,$timeout,filterFilter,uiGmapIsReady) {
      $rootScope.success = false;
      $rootScope.error = false;

      //送信者一覧情報
      $http.get('/api/device_basicinfo/' + $routeParams.DEVICE_ID + '/')
      .then(function successCallback(response) {
//        console.log("posted successfully");
//        console.log(response);
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
        SharedService.text.set($scope.deviceGroupData.latitude,$scope.deviceGroupData.longitude,$scope.deviceGroupData.address);

        //ヘッダータイトル
        $scope.navtitle= obj.deviceName;


      }, function errorCallback(response) {
        console.error("error in posting");
      });
      
      
      var adminFlg = document.cookie.split( '; ' )[ 0 ].split( '=' )[ 1 ];
        if(adminFlg=="true"){
          //一般ユーザーはアカウントDBから送信者一覧情報を取得
          $http.get('/api/device_sender_list/' + $routeParams.DEVICE_ID + '/')
          .then(function successCallback(response) {
//            console.log("posted successfully");
//            console.log(response);
              var obj = response.data;
              $scope.sendto = obj.sendto;
//              $scope.admin_mflg = obj.admin_mflg;
          }, function errorCallback(response) {
            console.error("error in posting");
          });
        }else{
          //一般ユーザーはアカウントDBから送信者一覧情報を取得
          $http.get('/api/user/')
          .then(function successCallback(response) {
//            console.log("posted successfully");
//            console.log(response);
              var obj = response.data;
              $scope.sendto = obj.sendto;
//              $scope.admin_mflg = obj.admin_mflg;
          }, function errorCallback(response) {
            console.error("error in posting");
          });
        }
      
      

      //アラート設定画面遷移
     $scope.alertSetting = function(){
       $location.path("/user_"+$routeParams.USER_ID+"/device_"+$routeParams.DEVICE_ID+'/alert');
     }

     //緯度経度の値が変更された場合書き換える。
     $scope.$on('changedText', function() {
          var obj = SharedService.text.get();
          $scope.deviceGroupData.latitude = obj.latitude;
          $scope.deviceGroupData.longitude = obj.longitude;
          $scope.deviceGroupData.address = obj.address;
      });

      //連絡先の値が変更された場合書き換える。
      $scope.$on('changedTelNo', function() {
           var telNo = SharedService.telNo.get();
           $scope.deviceGroupData.telNo = telNo;
       });

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

        //メールアドレスの値が削除された場合書き換える。
        $scope.$on('deletealert', function() {
             var mailid = SharedService.deletealert.get();
             var list = [];
            angular.forEach($scope.sendto,function(value, index, array){
               if(value.mailid != mailid){
                 list.push(value);
               }
            });
            $scope.sendto = list;

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
//        console.log("latitude"+obj.latitude+"longitude"+obj.longitude+"address"+obj.address);

        if(obj.latitude == undefined){
          obj.latitude = 34.4506112;
          obj.longitude = 125.3561481;
        }

//        //地図下部に表示する緯度経度
        $scope.latitude = obj.latitude;
        $scope.longitude = obj.longitude;
        
//          MAP定義
          $scope.map = {
          // マップ初期表示の中心地
          center: {
            latitude: obj.latitude,
            longitude: obj.longitude
          },
          // マップ初期表示の拡大
          zoom: 13,
          control : {},
          markers:{},
          events: {
                //マップクリック時のイベント
               click: function(marker, eventName, args) {
//                    console.log("user defined event: " + marker, eventName, args);
                    //markerをMAPの中央に表示させる。
                    //markerが移動したかどうかわからなくなるので一旦コメントアウト
                    //  $scope.map.center.latitude = args[0].latLng.lat(),
                    //  $scope.map.center.longitude = args[0].latLng.lng(),

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
          }
        uiGmapIsReady.promise().then(function (maps){
          // google.maps.Geocoder()コンストラクタのインスタンスを生成
          if(obj.address){
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode( { 'address': obj.address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {   
                $scope.map.control.getGMap().setCenter(results[0].geometry.location);
//                $scope.map.markers.latitude = results[0].geometry.location.lat();
//                $scope.map.markers.longitude = results[0].geometry.location.lng();
                } else {
//                    console.log("Geocode was not successful for the following reason: " + status);
                }
            });
          }
        });
        

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
//              console.log(response);
              if(!response.data.error) {
//                console.log("success");
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

        var tmpTelNo = $scope.deviceGroupData.telNo;

        var json = {
           "template":
           '<form name="dialog">'+
           '<md-dialog>'+
           '  <md-dialog-content class="md-dialog-content" role="document" tabindex="-1" id="dialogContent_2">'+
           '    <h2 class="md-title ng-binding">連絡先</h2>'+
           '    <div class="md-dialog-content-body ng-scope">'+
           '     <p class="ng-binding"></p>'+
           '   </div>'+
          '   <md-input-container md-no-float="" class="md-prompt-input-container ng-scope md-input-has-placeholder md-default-theme md-prompt-input-container-2">'+
          '     <input type="text" ng-keypress="dialog.keypress($event)" ng-pattern="/^[0-9]{2,5}-[0-9]{1,4}-[0-9]{4}$/" md-autofocus="" ng-model="telNo" name="telNo" placeholder="連絡先" class="ng-pristine ng-valid md-autofocus md-input ng-empty ng-touched" aria-label="連絡先" id="input_3" aria-invalid="false" style="">'+
          '     <div ng-messages="dialog.telNo.$error"  class="md-errors-spacer" ng-hide="dialog.telNo.$valid">'+
          '     <div ng-message="pattern">正しい電話番号の形式で入力してください 例：####-####-####</div>'+
          '     </div>'+
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
            var param = {};
            param[itemKey] = val;
            //登録の場合
            //TODO 削除のリクエストを投げる
              $http({
                method: 'post',
                url: '/api/device_basicinfo/' + $routeParams.DEVICE_ID + '/',
                data: param
              })
              .then(
                function successCallback(response){
//                  console.log(response);
                  if(!response.data.error) {
//                    console.log("success");
                    $rootScope.success = response.data.message;
                    $scope.deviceGroupData[itemKey] = val;
                    if(itemKey == 'address') SharedService.text.setAddress(val);
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
                data: { telNo: $scope.dialog.telNo.$modelValue }
              })
                .then(
                  function successCallback(response){
//                    console.log(response);
                    if(!response.data.error) {
//                      console.log("success");
                      $rootScope.success = response.data.message;
                      SharedService.telNo.set($scope.telNo);
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
  item.placeholder_key = this.item.id;

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
     '     <input ng-keypress="dialog.keypress($event)" md-autofocus="" ng-model="name" name="name" value="'+item.placeholder_name+'" placeholder='+item.placeholder_name+' class="ng-pristine ng-valid md-autofocus md-input ng-empty ng-touched" aria-label="送信者" id="input_3" aria-invalid="false" style="">'+
     '     <div class="md-errors-spacer"></div>'+
     '   </md-input-container>'+
     '   <md-input-container md-no-float="" class="md-prompt-input-container ng-scope md-input-has-placeholder md-default-theme md-prompt-input-container-2">'+
     '     <input type="email" ng-keypress="dialog.keypress($event)" md-autofocus="" ng-model="mailAddress" name="mailAddress" value='+item.placeholder_mailid+' placeholder='+item.placeholder_mailid+' class="ng-pristine ng-valid md-autofocus md-input ng-empty ng-touched" aria-label="メールアドレス" id="input_3" aria-invalid="false" style="">'+
     '     <div ng-messages="dialog.mailAddress.$error"  class="md-errors-spacer" ng-hide="dialog.mailAddress.$valid">'+
       '     <div ng-message="email">メールアドレスを正しく入力してください</div>'+
       '     </div>'+
     '   </md-input-container>'+
     ' </md-dialog-content>'+
     ' <md-dialog-actions>'+
     ' <button class="md-primary md-cancel-button md-button ng-scope md-default-theme md-ink-ripple" type="button" ng-click="closeDialog()" style="">キャンセル</button>'+
     ' <button class="md-primary md-confirm-button md-button md-ink-ripple md-default-theme" type="button" ng-click="checkRegi()">登録</button>'+
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

//登録ボタン押下（重複チェックここではデータ登録は行わない
$scope.checkRegi = function(){
  if($scope.dialog.name == undefined && $scope.dialog.mailAddress == undefined) return false;
  if($scope.dialog.mailAddress.$invalid) return false;
  $mdDialog.hide();
  //新規登録の場合
  if(!item.placeholder_key){
    item.placeholder_key = false;
  }
  var cookieAdminFlg = document.cookie.split( '; ' ).filter(function(element){
    if(element.split("=")[0] == 'admin_mflg') return element;
  });
  var adminFlg = cookieAdminFlg[0].split("=")[1];
  var flg　= (adminFlg == 'true') ? true:false;
  
  //編集内容をpost
  $http({
    method: 'POST',
    url: '/api/user/sendto/check/',
    data: { name: $scope.dialog.name.$modelValue, mailid: $scope.dialog.mailAddress.$modelValue, key: item.placeholder_key, adminFlg:flg }
  })
  .then(
    function successCallback(response){
      if(response.data.dupFlag) return $scope.showConfirm(response.data.postDat);
//      console.log(response);
      if(!response.data.error) {
//        console.log("success");
        $rootScope.success = response.data.message;
        SharedService.alert.set($scope.name,$scope.mailAddress,item.placeholder_key);
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


//データ登録
$scope.regist = function(dat) {
  var argName = dat.name||$scope.dialog.name.$modelValue
  var argMailid = dat.mailid||$scope.dialog.mailAddress.$modelValue
  var argKey = dat.key||item.key
  if(argName == undefined && argMailid == undefined) return false;
  $mdDialog.hide();
  var data = {
    name: argName,
    mailid: argMailid,
    key: argKey
  }

  //新規登録の場合
  if(!argKey){
    argKey = false;
  }
  
  var adminFlg = document.cookie.split( '; ' )[ 0 ].split( '=' )[ 1 ];
  data['adminFlg'] = (adminFlg == 'true') ? true : false;
  
//  console.log("data@regist");
//  console.log(data);
  
  //編集内容をpost
  $http({
    method: 'POST',
    url: '/api/user/sendto/',
    data: data
  })
  .then(
    function successCallback(response){
//      console.log(response);
      if(!response.data.error) {
//        console.log("success");
        $rootScope.success = response.data.message;
        SharedService.alert.set(argName,argMailid,argKey);
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


$scope.showConfirm = function(dat,ev) {
  // Appending dialog to document.body to cover sidenav in docs app
  var confirm = $mdDialog.confirm()
        .title('入力されたメールアドレスがすでに登録されています。')
        .textContent('通知があった場合そのメールアドレスに複数通知が送信されますがよろしいですか？')
        .ariaLabel('duplication mail address')
        .targetEvent(ev)
        .ok('はい')
        .cancel('キャンセル');

  $mdDialog.show(confirm).then(function() {
    $scope.regist(dat);
  }, function() {
    $mdDialog.hide();
  });
};

}]
});
};


//アラート通知追加
$scope.mailAddressDelete = function (ev){

    //削除するMailIdを詰める。
    var deleteKey = this.item.id;

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
          url: '/api/user/sendto/'+deleteKey+'/'
        })
        .then(
          function successCallback(response){
//            console.log(response);
            if(!response.data.error) {
//              console.log("success");
              $rootScope.success = response.data.message;
              SharedService.deletealert.set(deleteKey);
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




  }]);
