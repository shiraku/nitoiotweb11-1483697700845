
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceDetailDataCtrl',['$rootScope','$routeParams','$scope','$http','$location','$mdDialog', function ($rootScope,$routeParams,$scope, $http, $location,$mdDialog) {

      //ヘッダータイトル
      var str = $routeParams.YYYYMMDDHHMM;
      var titleYear = str.slice(0,4);
      var titleMonth = str.slice(4,6);
      var titleDay = str.slice(6,8);
      $scope.navtitle=titleYear+"/"+titleMonth+"/"+titleDay+"詳細データ";


      //TODO APIでデータ取得する
      $scope.graphData = [

      ];

       $scope.detailData = [
       {
            'deviceId':'dev002',
            'deviceName': 'デバイス２',
            // 'responsiblePerson': '',
            // 'telNo': '111-1111-1111',
            'type':'earthquake',          //地震or雷
            'seismicIntensity':'5.4',     //震度（地震のみ）
            'slope':'倒壊',               //傾き（地震のみ）
            'leakage':'なし',             //漏電（雷のみ）
            'commercialBlackout':'あり',
            'equipmentAbnormality':'なし',
            'commentList':[
              {
                'comment':'建物に破損あり',
                'commentDate':'2017/01/15 10:15',
              },
              {
                'comment':'業務を一時停止',
                'commentDate':'2017/01/15 10:15',
              }],
              'mediaNewsletter':[
                {
                  'japanMeteorologicalAgency':'4',      //メディア速報　震度
                  'longPeriodSeismicActivityClass':'3'　//メディア速報長周期地震動階級
              }
            ]
      }];


      $scope.addComment = function(ev){
        // $scope.mailAddressEdit.title = 'メールアドレスの編集';
        // $scope.mailAddressEdit.placeholder_name = this.item.name;
        // $scope.mailAddressEdit.placeholder_mailaddress = this.item.mailAddress;

        var item = {
          title : "コメント追加",
          // placeholder:"コメント"
        };

        $mdDialog.show({
           targetEvent: ev,
           template:
           '<md-dialog>'+
           '  <md-dialog-content class="md-dialog-content" role="document" tabindex="-1" id="dialogContent_2">'+
           '    <h2 class="md-title ng-binding">'+item.title+'</h2>'+
           '    <div class="md-dialog-content-body ng-scope">'+
           '     <p class="ng-binding"></p>'+
           '   </div>'+
           '<md-input-container class="md-block">'+
            // '<label>'+item.placeholder+'</label>'+
            '<textarea ng-model="user.biography" md-maxlength="150" rows="5" md-select-on-focus=""></textarea>'+
            '</md-input-container>'+
           '  <md-checkbox name="tos" ng-model="project.tos" required="">重要なコメントとして登録する</md-checkbox>'+
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
      }

      ///MAP用データ/////////////////////////////////////////////

      $scope.map = {
      // マップ初期表示の中心地
      center: {
        latitude: 35.459923, // 緯度
        longitude: 139.635290 // 経度
      },
      // マップ初期表示の拡大
      zoom: 19
    };

    // マップ上に表示するマーカーの情報
    //TODO
    $scope.markers = [
      {
        "id":1,
        "latitude":35.459923,
        "longitude":139.635290,
        "title":"パシフィコ横浜"
      }
    ];


    }]);
