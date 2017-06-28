'use strict';

angular.module('nitoiotweb11App')
  .controller('DeviceListCtrl', ['$rootScope', '$routeParams', '$scope', '$http', '$location', 'GoogleChartService', '$modal', '$interval', function ($rootScope, $routeParams, $scope, $http, $location, GoogleChartService, $modal, $interval) {

    //モーダル処理
    $scope.modalInstance = $modal.open({
      templateUrl: "T_inProgress",
      backdrop: "static",
      keyboard: false // ユーザーがクローズできないようにする,
    });

    //ヘッダータイトル
    $scope.navtitle = 'デバイス一覧';

    //グラフのX軸選択用
    $scope.selectItems = [
      {
        'value': 'day',
        'label': '１日',
                },
      {
        'value': 'week',
        'label': '１週間',
                },
      {
        'value': 'month',
        'label': '１か月',
                },
      {
        'value': 'year',
        'label': '１年',
                }
            ];
    //グラフの表示期間のデフォル値設定
    $scope.selectItem = 'month';
    
    //デバイス一覧情報
    $http.get('/api/device_list/')
      .then(function successCallback(response) {
        //        console.log("/api/device_list/ successfully");
        //        console.log(response);
        //TODO dataに発生日時を追加していただく。（白倉さん）
        var obj = response.data;
        $scope.deviceList = obj.device_list;
        console.log($scope.deviceList);
      
      
        //MAP

        //初期値
        var latitude = 35.459923; //34.7019399, // 緯度
        var longitude = 139.635290; //135.51002519999997 // 経度
        var minX = longitude;
        var minY = latitude;
        var maxX = longitude;
        var maxY = latitude;


        //MAPの定義
        var map = new google.maps.Map(document.getElementById('map-deviceList'), {
          zoom: 13, // ズーム値
          center: new google.maps.LatLng(latitude, longitude), // 中心の位置座標
        });


        //markerの作成
        $scope.markers = [];
        angular.forEach($scope.deviceList, function (value, index) {
          //            console.log(index+' latitude: ' + value.latitude + ' longitude: ' + value.longitude);

          
          
          //マーカー
          var marker = new google.maps.Marker({
            map: map, // 地図
            position: new google.maps.LatLng(value.latitude, value.longitude), // 位置座標
            title: value.deviceName
          });

          $scope.markers.push(marker);

          var content = "デバイス名：" + value.deviceName + "<br>最新状況：" + value.status
          if (value.type == undefined) {
            //何もしない
          } else if (value.type == "EQ") {
            content += "<br>震度：" + value.seismicIntensity;
          } else if (value.type == "FL") {
            content += "<br>雷：" + value.power;
          }
          var infowin = new google.maps.InfoWindow({
            content: content
          });

          // mouseoverイベントを取得するListenerを追加
          google.maps.event.addListener(marker, 'mouseover', function () {
            infowin.open(map, marker);
          });

          // mouseoutイベントを取得するListenerを追加
          google.maps.event.addListener(marker, 'mouseout', function () {
            infowin.close();
          });

          if (index == 0) {
            //一つ目のデバイスを初期値とする
            latitude = value.latitude;
            longitude = value.longitude;
            minX = longitude;
            minY = latitude;
            maxX = longitude;
            maxY = latitude;
          }

          var lt = value.latitude;
          var lg = value.longitude;
          if (lg <= minX) {
            minX = lg;
          }
          if (lg > maxX) {
            maxX = lg;
          }
          if (lt <= minY) {
            minY = lt;
          }
          if (lt > maxY) {
            maxY = lt;
          }


        });

        //デバイスが全て見える領域を表示する
        var sw = new google.maps.LatLng(maxY, minX); // 左下の緯度、経度
        var ne = new google.maps.LatLng(minY, maxX); // 右上の緯度、経度
        var LatLngBounds = new google.maps.LatLngBounds(sw, ne);
        map.fitBounds(LatLngBounds);




      }, function errorCallback(response) {
        console.error("error in posting");
      });




    //環境データ
    //       var testDataEnv = { 
    //         "deviceId": "dd4c78468628",
    //         "memo": "OM",
    //         "time": "2017-04-20T07:24:20.477Z",
    //         "humidity": 31.64,
    //         "temperature": 24.96,
    //         "light": 269,
    //         "uvi": 0.03,
    //         "pressure": 1001.9,
    //         "noise": 31.58,
    //         "discomfortIndex": 69.81,
    //         "heatstroke": 18.76,
    //         "battery": 3026
    //       }
    
    
    $scope.getEnvLatest = function () {
      $http.get('/api/device_env_latest/dd4c78468628/')
        .then(function successCallback(response) {
          var dat = response.data.docs[0].payload.d;
          var env = {};
          env["temperature"] = dat.temperature;
          env["humidity"] = dat.humidity;
          env["pressure"] = dat.pressure;
          var uvi = function (d) {
            switch (true) {
            case d < 3:
              return '弱い';
            case d > 3 && d < 6:
              return '中程度';
            case d > 6 && d < 8:
              return '強い';
            case d > 8 && d < 10:
              return '非常に強い';
            case d > 10:
              return '極端に強い';
            default:
              return '計測エラー';
            }
          }
          env["uvi"] = uvi(dat.uvi);
          var discomfortIndex = function (d) {
            switch (true) {
            case d < 75:
              return '暑くない';
              break;
            case d > 75 && d < 80:
              return 'やや暑い';
              break;
            case d > 80 && d < 85:
              return '暑くて汗が出る';
              break;
            case d > 85:
              return '暑くてたまらない';
              break;
            default:
              return '計測エラー';
            }
          }
          env["discomfortIndex"] = discomfortIndex(dat.discomfortIndex);
          var heatstroke = function (d) {
            switch (true) {
            case d < 21:
              return 'ほぼ安全';
              z
              break;
            case d > 21 && d < 25:
              return '注意';
              break;
            case d > 25 && d < 28:
              return '警戒';
              break;
            case d > 28 && d < 31:
              return '厳重警戒';
              break;
            case d > 31:
              return '運動は原則中止';
              break;
            default:
              return '計測エラー';
            }
          }
          env["heatstroke"] = heatstroke(dat.heatstroke);
          env["noise"] = dat.noise;
          $scope.env = env;
        }, function errorCallback(response) {
          console.error("error in posting");
        });
    }
    $scope.getEnvLatest();
    $interval($scope.getEnvLatest, 1000 * 30);

    $http.get('/api/device_env_forcast/35.62982_139.7942416/')
      .then(function successCallback(response) {
        var dat = response.data;
        //          $scope.env = env;
      }, function errorCallback(response) {
        console.error("error in posting");
      });

    //    function updateEnv(response) {
    //        var dat = JSON.parse(response.data);
    //        var env = {};
    //        env["temperature"] = dat.temperature;
    //        env["humidity"] = dat.humidity;
    //        env["pressure"] = dat.pressure;
    //        var uvi = function (d) {
    //          switch (true) {
    //          case d < 3:
    //            return '弱い';
    //          case d > 3 && d < 6:
    //            return '中程度';
    //          case d > 6 && d < 8:
    //            return '強い';
    //          case d > 8 && d < 10:
    //            return '非常に強い';
    //          case d > 10:
    //            return '極端に強い';
    //          default:
    //            return '計測エラー';
    //          }
    //        }
    //        env["uvi"] = uvi(dat.uvi);
    //        var discomfortIndex = function (d) {
    //          switch (true) {
    //          case d < 75:
    //            return '暑くない';
    //            break;
    //          case d > 75 && d < 80:
    //            return 'やや暑い';
    //            break;
    //          case d > 80 && d < 85:
    //            return '暑くて汗が出る';
    //            break;
    //          case d > 85:
    //            return '暑くてたまらない';
    //            break;
    //          default:
    //            return '計測エラー';
    //          }
    //        }
    //        env["discomfortIndex"] = discomfortIndex(dat.discomfortIndex);
    //        var heatstroke = function (d) {
    //          switch (true) {
    //          case d < 21:
    //            return 'ほぼ安全';
    //            z
    //            break;
    //          case d > 21 && d < 25:
    //            return '注意';
    //            break;
    //          case d > 25 && d < 28:
    //            return '警戒';
    //            break;
    //          case d > 28 && d < 31:
    //            return '厳重警戒';
    //            break;
    //          case d > 31:
    //            return '運動は原則中止';
    //            break;
    //          default:
    //            return '計測エラー';
    //          }
    //        }
    //        env["heatstroke"] = heatstroke(dat.heatstroke);
    //        env["noise"] = dat.noise;
    //        $scope.env = env;
    //      
    //    }
    //            
    //   var ws = ngSocket('ws://nitoiotdst02.mybluemix.net/ws/om001');
    //
    //    ws.onMessage(function(dat){
    //      console.log('onMessage');
    //      updateEnv(dat);
    //    });
    //    ws.onOpen(function(dat){
    //      console.log('onOpen');
    //      ws.send("update");
    //    });




    $scope.graphDataElem = [];
    $scope.graphDatas = [];
    //グラフ
    $http.get('/api/user/')
      .then(function successCallback(response) {
        //        console.log("/api/user/ successfully");
        //        console.log(response);
        for (var i = 0; i < response.data.device.length; i++) {
          var deviceName = response.data.device[i].name;
          $http.get('/api/device_history_eq/' + response.data.device[i].id)
            .then(function successCallback(hisRes) {
              //              console.log("/api/device_history_eq/ successfully");
              //              console.log(hisRes);
              $scope.graphDataElem.push(hisRes.data);
              $scope.$emit('graphDataElem', hisRes.data);

              if (hisRes.data.hasOwnProperty('data')) {
                $scope.graphDatas.push(hisRes.data);
              }

            }, function errorCallback(hisRes) {
              console.error("error in posting");
            });
        }
        //        console.log("$scope.graphDatas@successCallback");
        //        console.log($scope.graphDatas);

        // google.charts.load('current', {packages: ['controls','corechart', 'bar']});
        // google.charts.setOnLoadCallback(drawChart);


      }, function errorCallback(response) {
        console.error("error in posting");
      });
    // });

    $scope.$on('deviceInfoFinished', function (event) {
      console.log("deviceInfoFinished");
      $scope.modalInstance.close();
    });

    $scope.$on('deviceListFinished', function (event) {
      $scope.graphDatas.forEach(function (dat) {

        //             google.charts.load('current', {packages: ['controls','corechart', 'bar']});
        //             google.charts.setOnLoadCallback(drawChart(deviceName,response));
        google.charts.load('current', {
          packages: ['controls', 'corechart', 'bar']
        });
        google.charts.setOnLoadCallback(function () {

          var dataTable = new google.visualization.DataTable();
          dataTable.addColumn('datetime', 'yyyy/mm/dd hh:mm');
          dataTable.addColumn('number', '震度');

          var rows = [];

          for (var l = 0; dat.data.length > l; l++) {
            var d = dat.data[l];
            //              console.log("d@setOnLoadCallback");
            //              console.log(d);
            var si = (typeof d.datas === 'array') ? d.datas[0].value : d.datas.seismicIntensity
            rows.push([new Date(d.date), Number(si)]);
          }
          dataTable.addRows(rows);

          var dt = new Date();
          var min;
          switch ($scope.selectItem) {
          case 'day':
            min = new Date(dt.setDate(dt.getDate() - 1));
            break;
          case 'week':
            min = new Date(dt.setDate(dt.getDate() - 7));
            break;
          case 'month':
            min = new Date(dt.setMonth(dt.getMonth() - 1));
            break;
          case 'year':
            min = new Date(dt.setFullYear(dt.getFullYear() - 1));
            break;
          default:
            min = new Date(dt.setMonth(dt.getMonth() - 1));
            break;
          }

          var options = {
            hAxis: {
              title: '日時',
              format: ($scope.selectItem != 'day') ? 'yyyy/MM/dd' : 'dd hh:mm',
              viewWindow: {
                min: min,
                max: new Date()
              }
            },
            vAxis: {
              title: '震度',
              viewWindow: {
                min: 0,
                max: 8
              }
            },
            legend: 'none'
          };
          var id = "DEV_" + dat.device_id;
          document.getElementById(id).innerHTML = '';
          var chart = new google.visualization.ColumnChart(document.getElementById(id));
          chart.draw(dataTable, options);
        });
      });
    });

    // $scope.$on('graphDataElem',(event,data){
    // $scope.urls.splice(0, 1);
    // if ($scope.urls.length >= 1) {
    //   $scope.$emit('executeTask', data);
    // }
    // google.charts.load('current', {packages: ['controls','corechart', 'bar']});
    // google.charts.setOnLoadCallback(function(){
    //
    //   var data = new google.visualization.DataTable();
    //   data.addColumn('datetime', 'yyyy/mm/dd hh:mm');
    //   data.addColumn('number', '震度');
    //
    //   var rows = [];
    //
    //   for(var i=0; response.data.data.length > i; i++){
    //     var d = response.data.data[i];
    //     rows.push([new Date(d.date),d.datas[0].value]);
    //     }
    //   data.addRows(rows);
    //
    //   var dt = new Date();
    //   var min = new Date (dt.setMonth(dt.getMonth() -1));
    //
    //   var options = {
    //     hAxis: {
    //       title: '日時',
    //       format: 'yyyy/MM/dd',
    //       viewWindow: {
    //           min: min,
    //           max: new Date()
    //       }
    //     },
    //     vAxis: {
    //       title: '震度',
    //       viewWindow : {
    //           min: 0,
    //           max: 8
    //       }
    //     },
    //     legend:'none'
    //   };
    //
    // var id = "DEV_"+response.data.device_id;
    // var chart = new google.visualization.ColumnChart(document.getElementById(id));
    // chart.draw(data, options);
    // });



    //グラフの表示期間が変更された時、グラフを再描画する。
    $scope.$watch('selectItem', function (newValue, oldValue, scope) {
      console.log(newValue);
      $scope.selectItem = newValue;
      $rootScope.$broadcast('deviceListFinished');
      // rePackJson();
      // google.charts.load('current', {packages: ['controls','corechart', 'bar']});
      // google.charts.setOnLoadCallback(drawChart);
    });


    //TODO APIでデータ取得する
    // $scope.deviceList = [
    var tmpdeviceList = [
      {
        'deviceId': 'dev001',
        'deviceName': 'デバイス１',
        'responsiblePerson': '山田　修', //責任者
        'telNo': '000-0000-0000', //連絡先
        'status': '0'
       },
      {
        'deviceId': 'dev002',
        'deviceName': 'デバイス２',
        'responsiblePerson': '湯浅　あさみ', //責任者
        'telNo': '111-1111-1111', //連絡先
        'status': '1', //感知あり(1)or無し(0)
        'type': 'earthquake', //感知した種類(地震or雷)
        'seismicIntensity': '5.4', //震度
        'slope': 'あり', //傾き
        'commercialBlackout': 'なし', //停電
        'equipmentAbnormality': 'あり', //機器異常
        'commentList': [ //コメント・連絡事項
          {
            'comment': '建物に破損あり', //コメント
            'commentDate': '2017/01/15 10:15', //コメント日時
                },
          {
            'comment': '業務を一時停止',
            'commentDate': '2017/01/15 10:15',
                }],
        'earthquakeHistoryList': [ //地震の履歴データ
          {
            //"device_id":"00000",
            "data": [
              {
                "date_id": "20170216110735",
                "date": "2017/02/16 11:07:35",
                "datas": [{
                  "name": "震度",
                  "value": 6,
                  "values": "6_u"
                      }]
              },
              {
                "date_id": "20170216110254",
                "date": "2017/02/16 11:02:54",
                "datas": [{
                  "name": "震度",
                  "value": 6,
                  "values": "6_u"
                }]
              },
              {
                "date_id": "20170216105831",
                "date": "2017/02/16 10:58:31",
                "datas": [{
                  "name": "震度",
                  "value": 6,
                  "values": "6_u"
                }]
              },
              {
                "date_id": "20170216105553",
                "date": "2017/02/16 10:55:53",
                "datas": [{
                  "name": "震度",
                  "value": 6,
                  "values": "6_u"
                }]
              },
              {
                "date_id": "20170215182055",
                "date": "2017/02/15 18:20:55",
                "datas": [{
                  "name": "震度",
                  "value": 6,
                  "values": "6_u"
                }]
              },
              {
                "date_id": "20170215180448",
                "date": "2017/02/15 18:04:48",
                "datas": [{
                  "name": "震度",
                  "value": 6,
                  "values": "6_u"
                }]
              },
              {
                "date_id": "20170215174601",
                "date": "2017/02/15 17:46:01",
                "datas": [{
                  "name": "震度",
                  "value": 6,
                  "values": "6_u"
                }]
              },
              {
                "date_id": "20170215172801",
                "date": "2017/02/15 17:28:01",
                "datas": [{
                  "name": "震度",
                  "value": 6,
                  "values": "6_u"
                }]
              },
              {
                "date_id": "20170215163422",
                "date": "2017/02/15 16:34:22",
                "datas": [{
                  "name": "震度",
                  "value": 6,
                  "values": "6_u"
                }]
              },
              {
                "date_id": "20170214194843",
                "date": "2017/02/14 19:48:43",
                "datas": [{
                  "name": "震度",
                  "value": 6.5,
                  "values": "7"
                }]
              }
                    ]
          }
                ],
        },
      {
        'deviceId': 'dev003',
        'deviceName': 'デバイス３',
        'responsiblePerson': '本田　宗太',
        'telNo': '222-2222-2222',
        'status': '1',
        'type': 'thunder',
        'power': '大',
        'leakage': 'あり',
        'commercialBlackout': 'なし',
        'equipmentAbnormality': 'あり',
        'commentList': [
          {
            'comment': '建物に破損あり・窓ガラ割れ。',
            'commentDate': '2017/01/15 10:15',
                },
          {
            'comment': '業務を一時停止',
            'commentDate': '2017/01/15 10:15',
                }]
         }
       ];

    /////グラフタブ用///////////////////////////////////////////////////////////////////////////////////////

    // rePackJson();

    // google.charts.load('current', {packages: ['controls','corechart', 'bar']});
    // google.charts.setOnLoadCallback(drawChart);




    //  //取得したデータをもとにチャートを作成し、デバイスリストに詰め直す
    //  function rePackJson(){
    //    //デバイスリストの長さぶん処理を行う。
    //    for(var i=0; tmpdeviceList.length > i; i++ ){
    //      //地震の履歴リストがある場合のみ行う。
    //      if(!!tmpdeviceList[i].earthquakeHistoryList){
    //        //チャートオブジェクトをデバイスリストに詰める。
    //       //  tmpdeviceList[i].chart = createChart(tmpdeviceList[i].earthquakeHistoryList[0].data);
    //
    //       // tmpdeviceList[i].chart = ;
    //       // drawChart();
    //      }}
    //     //  $scope.deviceList = tmpdeviceList;
    //    };





    // function drawChart() {
    //
    //   // for(var x=0; d.length>x; x++){
    //
    //     var data = new google.visualization.DataTable();
    //     data.addColumn('datetime', 'yyyy/mm/dd hh:mm');
    //     data.addColumn('number', '震度');
    //
    //     var rows = [];
    //
    //     for(var i=0; $scope.graphDataElem.length > i; i++){
    //       var d = res.data[i];
    //       rows.push([new Date(d.date),d.datas.seismicIntensity]);
    //                     }
    //
    //     data.addRows(rows);
    //
    //   //   data.addRows(
    //   //     [
    //   //                [new Date(2017,1,1,15,0,0), 3],
    //   //                [new Date(2017,1,20,18,0,0), 4],
    //   //                [new Date(2017,2,2,21,0,0), 7],
    //   //                [new Date(2017,2,11,15,0,0), 3],
    //   //                [new Date(2017,2,12,18,0,0), 4],
    //   //   ]
    //   // );
    //
    //     var dt = new Date();
    //     var min = new Date (dt.setMonth(dt.getMonth() -1));
    //
    //     var options = {
    //       hAxis: {
    //         title: '日時',
    //         format: 'yyyy/MM/dd',
    //         viewWindow: {
    //             min: min,
    //             max: new Date()
    //         }
    //       },
    //       vAxis: {
    //         title: '震度',
    //         viewWindow : {
    //             min: 0,
    //             max: 8
    //         }
    //       },
    //       legend:'none'
    //     };
    //
    //     var id = res.device_id;
    //     var chart = new google.visualization.ColumnChart(
    //       document.getElementById(id));
    //
    //     chart.draw(data, options);
    //
    //   // }
    //
    //
    // }


    // function drawChart() {
    //
    //   for(var x=0; $scope.graphDataElem.length>x; x++){
    //
    //     var data = new google.visualization.DataTable();
    //     data.addColumn('datetime', 'yyyy/mm/dd hh:mm');
    //     data.addColumn('number', '震度');
    //
    //     data.addRows(
    //       [
    //                  [new Date(2017,1,1,15,0,0), 3],
    //                  [new Date(2017,1,20,18,0,0), 4],
    //                  [new Date(2017,2,2,21,0,0), 7],
    //                  [new Date(2017,2,11,15,0,0), 3],
    //                  [new Date(2017,2,12,18,0,0), 4],
    //     ]
    //   );
    //
    //     var dt = new Date();
    //
    //     var min = new Date (dt.setMonth(dt.getMonth() -1));
    //
    //     var options = {
    //       // title: '',
    //       hAxis: {
    //         title: '日時',
    //         format: 'yyyy/MM/dd',
    //         viewWindow: {
    //             min: min,
    //             max: new Date()
    //         }
    //       },
    //       vAxis: {
    //         title: '震度',
    //         viewWindow : {
    //             min: 0,
    //             max: 8
    //         }
    //       },
    //       legend:'none'
    //     };
    //
    //     var id = "DEV_"+$scope.graphDataElem[x].deviceId;
    //
    //     var chart = new google.visualization.ColumnChart(
    //       document.getElementById(id));
    //
    //     chart.draw(data, options);
    //
    //   }
    //
    //
    // }

    //画面遷移
    $scope.deviceDetail = function () {
        $location.path("/user_" + $routeParams.USER_ID + "/device_" + this.item.deviceId.split('_')[1]);
      }
      //画面遷移
    $scope.envLogData = function (type) {
      $location.path("/user_" + $routeParams.USER_ID + "/device_" + this.item.deviceId.split('_')[1] + "/env_" + type);
    }





    /////MAPタブ用///////////////////////////////////////////////////////////////////////////////////////
    // $scope.map = {
    //   // マップ初期表示の中心地
    //   center: {
    //     latitude: 35.459923, //34.7019399, // 緯度
    //     longitude: 139.635290 //135.51002519999997 // 経度
    //   },
    //   // マップ初期表示の拡大
    //   zoom: 19
    // };
    //
    // // マップ上に表示するマーカーの情報
    // //TODO
    // $scope.markers = [
    //   {
    //     "id": 1,
    //     "latitude": 35.459923,
    //     "longitude": 139.635290,
    //     "title": "パシフィコ横浜"
    //   },
    //   {
    //     "id": 2,
    //     "latitude": 35.457511,
    //     "longitude": 139.632704,
    //     "title": "みなとみらい駅"
    //   }
    // ];


    }])
  .directive('onFinishRender', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function () {
            scope.$emit(attr.onFinishRender);
          });
        }
      }
    }
  });