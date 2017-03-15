
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
      $http.get('/api/device_list/')
      .then(function successCallback(response) {
        console.log("posted successfully");
        console.log(response);
      }, function errorCallback(response) {
        console.error("error in posting");
      });
        

      //ヘッダータイトル
      $scope.navtitle='デバイス一覧';

      //グラフのX軸選択用
      $scope.selectItems=[
                { 'value':'day',
                  'label':'直近の１日',
                },
                { 'value':'week',
                  'label':'直近の１週間',
                },
                { 'value':'month',
                  'label':'直近の１か月',
                },
                { 'value':'year',
                  'label':'直近の１年',
                }
            ];



      $scope.selectItem = $scope.selectItems['day'];


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



        rePackJson();

        //グラフの表示期間が変更された時、グラフを再描画する。
        $scope.$watch('selectItem', function(newValue, oldValue, scope) {
              console.log(newValue);
              rePackJson();
        });

       //過去データを取得する

       //TODO デフォルト表示は1日で良いか
      //→１ヶ月
       //TODO 地震のデータがない場合は、”地震データなし”と表記することで良いか。
         //→オK
       //TODO 表示する直近の1日、１週間の定義について
                //最後に地震が起きた日から　１週間
                //今現在ページを開いている日時から　１週間　こっち！！！！
       //TODO 地震のデータは過去ぶん全部取得してくるのか（表示に不要な１年前以上も）
       //TODO 最新データは履歴のデータに入ってくるか。
              //→くる場合、グラフに考慮必要なし　　　こっち！！！！
              //→来ない場合、グラフデータに組み込む必要あり。


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

            function drawChart() {

              for(var x=0; tmpdeviceList.length>x; x++){

                var data = new google.visualization.DataTable();
                data.addColumn('datetime', 'Time of Day');
                data.addColumn('number', 'Motivation Level');

                data.addRows(
                  [
                             [new Date(2014,7,1,15,0,0), 3],
                             [new Date(2014,11,20,18,0,0), 4],
                             [new Date(2014,11,21,21,0,0), 7],
                             [new Date(2014,11,22,15,0,0), 3],
                             [new Date(2014,11,23,18,0,0), 4],
                ]
              );

                var options = {
                  // title: '',
                  hAxis: {
                    title: '日時',
                    format: 'yyyy/MM/dd',
                    viewWindow: {
                        min: new Date(2014,11,1,0,0,0),
                        max: new Date(2014,11,31,0,0,0)
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

        // //チャートを作成する
        // function createChart(dataList) {
        //      var chart = {};
        //      chart.type = "ColumnChart";
        //
        //     //  chart.data = [{label:'date' type:'datetime'},{label:'number',type:'number'}];
        //
        //     chart.data ={
        //
        //     cols: [
        //       {
        //           id: 'month',
        //           label: '年月',
        //           type: 'date'
        //       },
        //       {
        //           id: 'sales',
        //           label: '地震',
        //           type: 'number'
        //       }
        //   ],
        //   rows: []}
        //
        //
        //
        //      for(var s=0; dataList.length > s; s++){
        //
        //        var d = dataList[s];
        //
        //       //  chart.data.rows.push([new Date(d.date),d.datas[0].value]);
        //
        //       // var tmpdate = Date(d.date);
        //
        //
        //       chart.data.rows.push({c:[{v:new Date(2017,1,1),f:"hello"},{v:d.datas[0].value,f:"hello"}]});
        //
        //      }
        //
        //      chart.options = {
        //             hAxis: {
        //               title: '時間',
        //                format: 'yyyy/MM/dd',
        //               viewWindow: {
        //                   min: new Date(2017,1,1),
        //                   max: new Date(2017,1,31)
        //                 }
        //             },
        //             vAxis: {
        //               title: '震度',
        //               viewWindow : {
        //                   min: 0,
        //                   max: 8
        //               }
        //             },
        //             legend:'none'
        //
        //       }
        //      return chart;
        // }




       //画面遷移
       $scope.deviceDetail = function(){
         $location.path("/user_"+$routeParams.USER_ID+"/device_"+this.item.deviceId);
       }

      $scope.map = {
      // マップ初期表示の中心地
      center: {
        latitude: 34.7019399, // 緯度
        longitude: 135.51002519999997 // 経度
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
