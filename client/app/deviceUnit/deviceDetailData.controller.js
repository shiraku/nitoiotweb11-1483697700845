
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceDetailDataCtrl',['$rootScope','$routeParams','$scope','$http','$location','$mdDialog','$window','$timeout', function ($rootScope,$routeParams,$scope, $http, $location,$mdDialog,$window,$timeout) {

      //ヘッダータイトル
      var str = $routeParams.YYYYMMDDHHMM;
      var titleYear = str.slice(0,4);
      var titleMonth = str.slice(4,6);
      var titleDay = str.slice(6,8);
      $scope.navtitle=titleYear+"/"+titleMonth+"/"+titleDay+"詳細データ";


      //グラフイメージ取得
      var datePrm = $routeParams.YYYYMMDDHHMM.substr(0,4) + '-' +
        $routeParams.YYYYMMDDHHMM.substr(4,2) + '-' +
        $routeParams.YYYYMMDDHHMM.substr(6,2) + 'T' +
        $routeParams.YYYYMMDDHHMM.substr(8,2) + ':' +
        $routeParams.YYYYMMDDHHMM.substr(10,2) + ':' +
        $routeParams.YYYYMMDDHHMM.substr(12,2);
      var id = datePrm + '_' + $routeParams.DEVICE_ID;
//      console.log(id);
      $http.get('/api/chart_acceleration/' + id)
      .then(function successCallback(response) {
//        console.log("/api/chart_acceleration/ successfully");
//        console.log(response);
        $scope.chart_acceleration = 'data:image/jpg;base64,' + response.data.toString('base64');
      }, function errorCallback(response) {
        console.error("error in /api/chart_acceleration/");
      });


      ///デバイス情報取得/////////////////////////////////////////////
      $http.get('/api/device_detail_data/' + $routeParams.DEVICE_ID + '/' + $routeParams.YYYYMMDDHHMM + '/' + $routeParams.TYPE)
      .then(function successCallback(response) {
        console.log("/api/device_detail/ successfully");
        console.log(response);

          var obj = response.data[0];
          var obj2;
          if(obj.data.sdata){
            obj2 = obj.data.sdata;
            obj2["sdataFlg"] = true;
            
            if(obj2.TA){
              obj2.TA = "あり（"+obj2.TA+"°）";
            }else{
              obj2.TA = "なし"
            }
            
          }else{
            obj2 = new Object();
            obj2["sdataFlg"] = false;
          }

          //
          if(obj.data.HC){
            obj.data.HC = "あり"
          }else{
            obj.data.HC = "なし"
          }

          if(obj.data.AP){
            obj.data.AP = "あり"
          }else{
            obj.data.AP = "なし"
          }

          if(obj.data.datas[0].leakage){
            obj.data.datas[0].leakage = "あり"
          }else{
            obj.data.datas[0].leakage = "なし"
          }

        
          if(obj.data.datas[0].power){
            switch(obj.data.datas[0].power){
              case 1:
                obj.data.datas[0].power = "小";
                break;
              case 2:
                obj.data.datas[0].power = "中";
                break;
              case 3:
                obj.data.datas[0].power = "大";
                break;
            }
          }
          $scope.detailData =
          {
               deviceId   :obj._id,
               deviceName :obj.deviceName,
               type       :obj.data.datas[0].type || obj2.ID,          //地震or雷
               dataFlg       :obj2.sdataFlg,          //Sdataフラグ
               seismicIntensity:obj2.S,     //震度（地震のみ）
               ma:obj2.MA,               //最大加速度(gal)(ベクトル合成値)
               si:obj2.SI,               //SI値
               vpx:obj2.VPX,               //X成分卓越周期
               vpy:obj2.VPY,               //Y成分卓越周期
               vpz:obj2.VPZ,               //Z成分卓越周期
               pc:obj2.PC,               //長周期階級
               slope:obj2.TA,               //傾き（地震のみ）
               power :obj.data.datas[0].power,    //かみなり（雷のみ）
               leakage:obj.data.datas[0].leakage,             //漏電（雷のみ）
               commercialBlackout:obj.data.AP,             //停電
               equipmentAbnormality:obj.data.HC             //機器異常
         };

          //TODO コメントを取得する
//              console.log('/api/comment/related/DEV_' + $routeParams.DEVICE_ID + '_' + $routeParams.YYYYMMDDHHMM + '/');
          $http.get('/api/comment/related/DEV_' + $routeParams.DEVICE_ID + '_' + $routeParams.YYYYMMDDHHMM + '/')
            .then(function successCallback(response) {
//              console.log("/api/comment/related/ successfully");
//              console.log(response);
              if(response.data){
                  $scope.detailData["commentList"] = response.data;
              }
            });
//
//        if(obj.commentList){
//          $scope.detailData.commentList = obj.commentList;
//        }
        if(obj.mediaNewsletter){
          $scope.detailData.mediaNewsletter = obj.mediaNewsletter;
        }

       ///MAP用データ/////////////////////////////////////////////
          var type  = obj.data.datas[0].type || obj2.ID;
          $http.get('/api/device_list/logdate/' + $routeParams.DEVICE_ID + '/' + $routeParams.YYYYMMDDHHMM + '/' + type)
          .then(function successCallback(response) {
            $scope.deviceList = response.data;
                var map = new google.maps.Map( document.getElementById( 'map-detailData' ), {
                	zoom: 13 ,	// ズーム値
                	center: new google.maps.LatLng( obj.latitude,obj.longitude ) ,	// 中心の位置座標
                } ) ;
                //マーカー
                var icon; 
                $scope.markers =[];
                for(var i = 0; i < response.data.length; i++){
                  //アイコンを今のデータを以前のデータで分ける
                  if(type == 'EQ' || type == 'AL'){
                    if($routeParams.DEVICE_ID == response.data[i].value.did) {
                        icon = '/assets/images/markerNow' + response.data[i].value.s + '.png'
                    }else{
                        icon = '/assets/images/marker' + response.data[i].value.s + '.png'
                    }
                  }else if(type == 'FL'){
                    if($routeParams.DEVICE_ID == response.data[i].value.did) {
                        icon = '/assets/images/markerNow' + response.data[i].value.s + '_thunder.png'
                    }else{
                        icon = '/assets/images/marker' + response.data[i].value.s + '_thunder.png'
                    }
                  }
                  var image = {
                      url : icon,
                      scaledSize : new google.maps.Size(20, 34)
                  }

                  //アイコンを地図にセット
                  var marker  = new google.maps.Marker({
                      map: map ,
                      position: new google.maps.LatLng( response.data[i].value.lon,response.data[i].value.lat ) ,
                      icon: image
                  }); 
                  $scope.markers.push(marker);
                marker.setMap(map);
                }
            });

      }, function errorCallback(response) {
        console.error("error in /api/device_detail/");
      });


      ///ボタンアクション/////
      $scope.addComment = function(ev){

        var title =  "コメント追加";

        $mdDialog.show({
           targetEvent: ev,
           template:
           '<form name="dialog">'+
           '<md-dialog>'+
           '  <md-dialog-content class="md-dialog-content" role="document" tabindex="-1" id="dialogContent_2">'+
           '    <h2 class="md-title ng-binding">'+title+'</h2>'+
           '    <div class="md-dialog-content-body ng-scope">'+
           '     <p class="ng-binding"></p>'+
           '   </div>'+
           '<md-input-container class="md-block">'+
            '<textarea ng-model="biography" name="biography" md-maxlength="150" rows="5" md-select-on-focus=""></textarea>'+
            '</md-input-container>'+
           '  <md-checkbox ng-model="tos" name="tos" required="">重要なコメントとして登録する</md-checkbox>'+
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
          $mdDialog.hide();
//          console.log('/api/comment/DEV_' + $routeParams.DEVICE_ID + '_' + $routeParams.YYYYMMDDHHMM + '/');
          var tos = $scope.dialog.tos.$modelValue || false;
          //TODO 削除のリクエストを投げる
            $http({
              method: 'post',
              url: '/api/comment/DEV_' + $routeParams.DEVICE_ID + '_' + $routeParams.YYYYMMDDHHMM + '/',
              data: { comment: $scope.dialog.biography.$modelValue, impFlg: tos }
            })
            .then(
              function successCallback(response){
//                console.log(response);
                if(!response.data.error) {
//                  console.log("success");
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
      }

    }]);
