
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceListCtrl',['$rootScope','$routeParams','$scope','$http','$location','GoogleChartService', function ($rootScope,$routeParams,$scope, $http, $location,GoogleChartService) {


      /**　API テスト
      **/
//      $http.get('/api/things/show')
//      .then(function successCallback(response) {
//        console.log("posted successfully");
//      }, function errorCallback(response) {
//        console.error("error in posting");
//      });
      //デバイス一覧情報
      $http.get('/api/device_list/')
      .then(function successCallback(response) {
        console.log("posted successfully");
        console.log(response);
      }, function errorCallback(response) {
        console.error("error in posting");
      });

      //グラフ
      $http.get('/api/user/')
      .then(function successCallback(response) {
        console.log("posted successfully");
        console.log(response);
        for(var i = 0; i < response.data.device.length; i++){
          $http.get('/api/device_history_eq/'+ response.data.device[i].id)
          .then(function successCallback(response) {
            console.log("posted successfully");
            console.log(response);
          }, function errorCallback(response) {
            console.error("error in posting");
          });
        }
      }, function errorCallback(response) {
        console.error("error in posting");
      });






      //ヘッダータイトル
      $scope.navtitle='デバイス一覧';

      //グラフのX軸選択用
      $scope.selectItems=[
                { 'value':'day',
                  'label':'１日',
                },
                { 'value':'week',
                  'label':'１週間',
                },
                { 'value':'month',
                  'label':'１か月',
                },
                { 'value':'year',
                  'label':'１年',
                }
            ];


      //グラフの表示期間のデフォル値設定
      $scope.selectItem = 'month';


//      $http.get('/api/things/')
//      .then(function successCallback(response) {
//        console.log("posted successfully");
//      }, function errorCallback(response) {
//        console.error("error in posting");
//      });

      //TODO APIでデータ取得する
      // $scope.deviceList = [
          var tmpdeviceList = [
        {
              'deviceId':'dev001',
              'deviceName': 'デバイス１',
              'responsiblePerson': '山田　修',      //責任者
              'telNo': '000-0000-0000',     //連絡先
              'status':'0'
       },
         {
              'deviceId':'dev002',
              'deviceName': 'デバイス２',
              'responsiblePerson': '湯浅　あさみ',      //責任者
              'telNo': '111-1111-1111',     //連絡先
              'status':'1',                 //感知あり(1)or無し(0)
              'type':'earthquake',          //感知した種類(地震or雷)
              'seismicIntensity':'5.4',     //震度
              'slope':'あり',                   //傾き
              'commercialBlackout':'なし',      //停電
              'equipmentAbnormality':'あり',    //機器異常
              'commentList':[               //コメント・連絡事項
                {
                  'comment':'建物に破損あり',          //コメント
                  'commentDate':'2017/01/15 10:15', //コメント日時
                },
                {
                  'comment':'業務を一時停止',
                  'commentDate':'2017/01/15 10:15',
                }],
                'earthquakeHistoryList':[//地震の履歴データ
                  {
                    //"device_id":"00000",
                    "data":[
                      {
                      "date_id":"20170216110735",
                      "date":"2017/02/16 11:07:35",
                      "datas":
                      [{"name":"震度",
                        "value":6,
                        "values":"6_u"
                      }]},
                      {"date_id":"20170216110254","date":"2017/02/16 11:02:54","datas":[{"name":"震度","value":6,"values":"6_u"}]},
                      {"date_id":"20170216105831","date":"2017/02/16 10:58:31","datas":[{"name":"震度","value":6,"values":"6_u"}]},
                      {"date_id":"20170216105553","date":"2017/02/16 10:55:53","datas":[{"name":"震度","value":6,"values":"6_u"}]},
                      {"date_id":"20170215182055","date":"2017/02/15 18:20:55","datas":[{"name":"震度","value":6,"values":"6_u"}]},
                      {"date_id":"20170215180448","date":"2017/02/15 18:04:48","datas":[{"name":"震度","value":6,"values":"6_u"}]},
                      {"date_id":"20170215174601","date":"2017/02/15 17:46:01","datas":[{"name":"震度","value":6,"values":"6_u"}]},
                      {"date_id":"20170215172801","date":"2017/02/15 17:28:01","datas":[{"name":"震度","value":6,"values":"6_u"}]},
                      {"date_id":"20170215163422","date":"2017/02/15 16:34:22","datas":[{"name":"震度","value":6,"values":"6_u"}]},
                      {"date_id":"20170214194843","date":"2017/02/14 19:48:43","datas":[{"name":"震度","value":6.5,"values":"7"}]}
                    ]}
                ],
        },
          {
              'deviceId':'dev003',
              'deviceName': 'デバイス３',
              'responsiblePerson': '本田　宗太',
              'telNo': '222-2222-2222',
              'status':'1',
              'type':'thunder',
              'power':'大',
              'leakage':'あり',
              'commercialBlackout':'なし',
              'equipmentAbnormality':'あり',
              'commentList':[
                {
                  'comment':'建物に破損あり・窓ガラ割れ。',
                  'commentDate':'2017/01/15 10:15',
                },
                {
                  'comment':'業務を一時停止',
                  'commentDate':'2017/01/15 10:15',
                }]
         }
       ];



/////グラフタブ用///////////////////////////////////////////////////////////////////////////////////////

        rePackJson();

        //グラフの表示期間が変更された時、グラフを再描画する。
        $scope.$watch('selectItem', function(newValue, oldValue, scope) {
              console.log(newValue);
              $scope.selectItem = newValue;
              rePackJson();
        });


       //取得したデータをもとにチャートを作成し、デバイスリストに詰め直す
       function rePackJson(){
         //デバイスリストの長さぶん処理を行う。
         for(var i=0; tmpdeviceList.length > i; i++ ){
           //地震の履歴リストがある場合のみ行う。
           if(!!tmpdeviceList[i].earthquakeHistoryList){
             //チャートオブジェクトをデバイスリストに詰める。
            //  tmpdeviceList[i].chart = createChart(tmpdeviceList[i].earthquakeHistoryList[0].data);

            // tmpdeviceList[i].chart = ;
            // drawChart();
           }}
           $scope.deviceList = tmpdeviceList;
         };


          google.charts.load('current', {packages: ['controls','corechart', 'bar']});
          google.charts.setOnLoadCallback(drawChart);


          // function countdate (){
          //
          //   switch scope.selectItem
          //
          //
          // }

            function drawChart() {

              for(var x=0; tmpdeviceList.length>x; x++){

                var data = new google.visualization.DataTable();
                data.addColumn('datetime', 'yyyy/mm/dd hh:mm');
                data.addColumn('number', '震度');

                data.addRows(
                  [
                             [new Date(2017,1,1,15,0,0), 3],
                             [new Date(2017,1,20,18,0,0), 4],
                             [new Date(2017,2,2,21,0,0), 7],
                             [new Date(2017,2,11,15,0,0), 3],
                             [new Date(2017,2,12,18,0,0), 4],
                ]
              );

                var dt = new Date();

                var min = new Date (dt.setMonth(dt.getMonth() -1));

                var options = {
                  // title: '',
                  hAxis: {
                    title: '日時',
                    format: 'yyyy/MM/dd',
                    viewWindow: {
                        min: min,
                        max: new Date()
                    }
                  },
                  vAxis: {
                    title: '震度',
                    viewWindow : {
                        min: 0,
                        max: 8
                    }
                  },
                  legend:'none'
                };

                var id = tmpdeviceList[x].deviceId;

                var chart = new google.visualization.ColumnChart(
                  document.getElementById(id));

                chart.draw(data, options);

              }


            }

       //画面遷移
       $scope.deviceDetail = function(){
         $location.path("/user_"+$routeParams.USER_ID+"/device_"+this.item.deviceId);
       }


/////MAPタブ用///////////////////////////////////////////////////////////////////////////////////////
      $scope.map = {
      // マップ初期表示の中心地
      center: {
        latitude: 35.459923,//34.7019399, // 緯度
        longitude: 139.635290//135.51002519999997 // 経度
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
      },
      {
        "id":2,
        "latitude":35.457511,
        "longitude":139.632704,
        "title":"みなとみらい駅"
      }
    ];

    }]);
