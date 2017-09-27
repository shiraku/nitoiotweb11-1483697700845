'use strict';

angular.module('nitoiotweb11App', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngMaterial',
  'ngRoute',
  'ngAnimate',
  'ngAria',
  'ngMessages',
  'ngCookies',
  'ui.bootstrap',
  'uiGmapgoogle-maps',
  //'btford.socket-io',
//  'ngSocket',
  'googlechart'
  // "googlechart-docs"
  // 'material.svgAssetsCache'

])
  .config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
    //$mdDialog
    $routeProvider
    .when('/menu', {
      redirectTo: '/menu'
    })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  }])
  .directive('navitop', function () {
      return {
          priority: 0,
          templateUrl: '../components/navbar/navbar.html',
          replace: false,
          transclude: false,
          restrict: 'E',
          scope: false,
          controller: 'NavbarCtrl'
      };
  })
  .directive('buttonpen', function() {
  return {
    scope: true,
    restrict: 'E',
    template: '<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">'
              +'<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>'
              +'<path d="M0 0h24v24H0z" fill="none"/>'
              +'</svg>',
  };
})
.directive('buttontrashbox', function() {
return {
  scope: true,
  restrict: 'E',
  template: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'
            +'<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>'
            +'<path d="M0 0h24v24H0z" fill="none"/>'
            +'</svg>',
};
})
.directive('buttondetail', function() {
return {
  scope: true,
  restrict: 'E',
  template: '<defs></defs><svg width="24px" height="24px" viewBox="315 15 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
            +'<g id="Material/Icons-black/chevron-right" stroke="none" fill="none" transform="translate(315.000000, 15.000000)" fill-rule="evenodd">'
            +'<polygon id="Shape" fill="#D8001A" points="8.59997559 7.4 9.99997559 6 15.9999756 12 9.99997559 18 8.59997559 16.6 13.1999756 12"></polygon></g>'
            +'</svg>',
};
})
.factory("SharedService", ["$rootScope", function($rootScope) {
        var latitude = "";
        var longitude = "";
        var address = "";
        var id = "";
        var auth = "";
        var phoneNumber = "";
        var name = "";
        var mailAddress = "";
        var key = "";
        var deleteMailId = "";

        return {
            text: {
                get: function() {
                  var obj = {latitude:latitude,longitude:longitude,address:address};
                  return obj; },
                set: function(lat,lon,adr) {
//                    console.log("[enter] text.set");
                    latitude = lat;
                    longitude = lon;
                    if(adr) address = adr;
                    $rootScope.$broadcast('changedText');
//                    console.log("[leave] text.set");
                },
                setAddress: function(adr) {
//                    console.log("[enter] text.set");
                    address = adr;
                    $rootScope.$broadcast('changedText');
//                    console.log("[leave] text.set");
                }
            },
            telNo: {
                get: function() {
                  // var obj = {telNo:telNo};
                  return phoneNumber; },
                set: function(d) {
//                    console.log("[enter] telNo.set");
                    phoneNumber = d;
                    $rootScope.$broadcast('changedTelNo');
//                    console.log("[leave] telNo.set");
                }
            },
            alert: {
              get: function() {
                var obj = {name:name,mailAddress:mailAddress,key:key};
                return obj; },
              set: function(n,m,k) {
//                  console.log("[enter] alert.set");
                  name = n;
                  mailAddress = m;
                  key = k
                  $rootScope.$broadcast('changedAlert');
//                  console.log("[leave] alert.set");
              }
            },
            deletealert: {
              get: function() {
                return deleteMailId; },
              set: function(d) {
//                  console.log("[enter] deletealert.set");
                  deleteMailId = d;
                  $rootScope.$broadcast('deletealert');
//                  console.log("[leave] deletealert.set");
              }
            }
        };
    }]);
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
                console.log("/api/device_list/ successfully");
                console.log(response);
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
          //アイコンを今のデータを以前のデータで分ける
          if(value.status == '感知あり'){
            var imgSi;
            switch(true) {
              case value.seismicIntensity > 6.5 :
                  imgSi = '7';
                  break;
              case 6.0 < value.seismicIntensity && value.seismicIntensity < 6.5 :
                  imgSi = '6_u';
                  break;
              case 5.5 < value.seismicIntensity && value.seismicIntensity < 6.0 :
                  imgSi = '6';
                  break;
              case 5.0 < value.seismicIntensity && value.seismicIntensity < 5.5 :
                  imgSi = '5_u';
                  break;
              case 4.5 < value.seismicIntensity && value.seismicIntensity < 5.0 :
                  imgSi = '5';
                  break;
                default :
                  imgSi = Math.round(value.seismicIntensity);
                  break;
                  
            }
            Math.round(value.seismicIntensity); 
            var icon = '/assets/images/marker' + imgSi + '.png';
            var image = {
                url : icon,
                scaledSize : new google.maps.Size(20, 34)
            }
            //マーカー
            var marker = new google.maps.Marker({
              map: map, // 地図
              position: new google.maps.LatLng(value.latitude, value.longitude), // 位置座標
              title: value.deviceName,
              icon: image
            });
          } else {
            //マーカー
            var marker = new google.maps.Marker({
              map: map, // 地図
              position: new google.maps.LatLng(value.latitude, value.longitude), // 位置座標
              title: value.deviceName
            });
          }

          
          

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
//                console.log("/api/device_env_latest/dd4c78468628/");
//                console.log(response);
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
    $interval($scope.getEnvLatest, 1000 * 60 * 30);

//    $http.get('/api/device_env_forcast/35.62982_139.7942416/')
//      .then(function successCallback(response) {
//        var dat = response.data;
//        //          $scope.env = env;
//      }, function errorCallback(response) {
//        console.error("error in posting");
//      });

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
  .directive('onFinishRender', ["$timeout", function ($timeout) {
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
  }]);

'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceGroupCtrl',['$rootScope','$routeParams','$scope','$http','$location','$mdDialog','$timeout','SharedService','filterFilter', function ($rootScope,$routeParams,$scope, $http, $location, $mdDialog, $timeout,SharedService,filterFilter) {
      $rootScope.success = false;
      $rootScope.error = false;


      //送信者一覧情報
      $http.get('/api/user/')
      .then(function successCallback(response) {
//        console.log("posted successfully");
//        console.log(response);

        var obj = response.data;

        //ヘッダータイトル
        $scope.navtitle=  obj.name;

        $scope.groupId = $routeParams.USER_ID;
        $scope.groupName = obj.name;
        $scope.deviceList = obj.device
        $scope.sendto = obj.sendto;

        var cookieAdminFlg = document.cookie.split( '; ' ).filter(function(element){
          if(element.split("=")[0] == 'admin_mflg') return element;
        });
        var adminFlg = cookieAdminFlg[0].split("=")[1];
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
      //編集内容をpost
      $http({
        method: 'POST',
        url: '/api/user/sendto/check/',
        data: { name: $scope.dialog.name.$modelValue, mailid: $scope.dialog.mailAddress.$modelValue, key: item.placeholder_key }
      })
      .then(
        function successCallback(response){
          if(response.data.dupFlag) return $scope.showConfirm(response.data.postDat);
//          console.log(response);
          if(!response.data.error) {
//            console.log("success");
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
      //編集内容をpost
      $http({
        method: 'POST',
        url: '/api/user/sendto/',
        data: { name: argName, mailid: argMailid, key: argKey }
      })
      .then(
        function successCallback(response){
//          console.log(response);
          if(!response.data.error) {
//            console.log("success");
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
//TODO mail address DELETEの場合　メールアドレスを送る様にする。
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
//        console.log("send to deleteMailId"+deleteKey);
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
//            console.log(response);
            if(!response.data.error) {
//              console.log("success");
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


'use strict';

    angular.module('nitoiotweb11App')
    .controller('AlertSettingCtrl',['$rootScope','$routeParams','$scope','$http','$location','$mdDialog', function ($rootScope,$routeParams,$scope, $http, $location, $mdDialog) {
      $rootScope.success = false;
      $rootScope.error = false;




      //URLでグループ設定がアラート設定か切り替えを行う。
      if(!$routeParams.DEVICE_ID){
        //グループ
        $scope.navtitle = "アラート設定";
        $scope.backUrl = "/user_"+$routeParams.USER_ID+"/group";
        $scope.case = "group";
      }else{
        //デバイス
        $scope.navtitle="アラート設定";
        $scope.backUrl = "/user_"+$routeParams.USER_ID+"/device_"+$routeParams.DEVICE_ID+"/edit";
        $scope.case = "device";
      };

        //デフォルト値設定
              //スライダー
                $scope.slider = {
                  //震度
                  //SI値 TODO SI値のデフォルト値を設定する
                  //長周期地震動
                  seismicIntensity:3,
                  si:3,
                  longPeriodGroundMotion:2
                };


              //通知する/通知しない
                $scope.switch = {
                  //震度
                  //SI値
                  //長周期地震動
                  //傾き
                  //雷サージ
                  //商用停電
                  //機器異常
                  seismicIntensity:true,
                  si:false,
                  longPeriodGroundMotion:true,
                  slope:true,
                  lightningSurge:true,
                  commercialBlackout:true,
                  equipmentAbnormality:true
                };
                //震度とSI値のswitchは震度をデフォルト表示にする
                $scope.switchSI = false;


        //通知闘値データ取得

        //アラート情報
        $http.get('/api/alert/')
        .then(function successCallback(response) {
//          console.log("posted successfully");
//          console.log(response);

          //詰め直す
          var obj = response.data;

          //TODO これで良いかどうかは確認。
          //各設定値が0の場合は設定なしとみなす。0でない場合は、設定有りとみなす。


          //SI値設定あり　震度設定ありの場合　震度をtrueとする
//          var isSiValue = obj.si >0;
//          var isSeismicIntensityValue = obj.seismicIntensity > 0;

          //SI値設定なし　震度設定ありの場合　震度をtrueとする
          if(!obj.seismicIntensityFlg　&& !obj.siFlg ){
            $scope.switch.si  = false;
            $scope.switch.seismicIntensity = false;
            $scope.switchSI = false;

          }else if( obj.seismicIntensityFlg ){
            $scope.switch.si  = false;
            $scope.slider.si  = parseInt(obj.si);
            $scope.switch.seismicIntensity = true;
            $scope.slider.seismicIntensity  = parseInt(obj.seismicIntensity,10);
            $scope.switchSI = false;

          //SI値設定あり　震度設定なしの場合　SI値をtrueとする
          }else if(obj.siFlg ){
            $scope.switch.si  = true;
            $scope.slider.si  = parseFloat(obj.si);
            $scope.switch.seismicIntensity = false;
            $scope.slider.seismicIntensity  = parseInt(obj.seismicIntensity,10);
            $scope.switchSI = true;
          }



          //設定ありの場合
          if(obj.lpgm > 0){
            $scope.switch.longPeriodGroundMotion = true;
            $scope.slider.longPeriodGroundMotion  = parseInt(obj.lpgm,10);
          }else{
            //設定なしの場合
            $scope.switch.longPeriodGroundMotion = false;
          }

          //通知する/通知しない
          $scope.switch.slope  = obj.slope;
          $scope.switch.lightningSurge  = obj.lightningSurge;
          $scope.switch.commercialBlackout  = obj.commercialBlackout;
          $scope.switch.equipmentAbnormality = obj.equipmentAbnormality;


        }, function errorCallback(response) {
          console.error("error in posting");
        });

      $scope.switchIntensity = function(switchSI){
//        console.log(switchSI);
        if(switchSI){
          switchSI=true;
        }else{
          switchSI=false;
        }
      }

      //キャンセルボタン押下
      $scope.cancel = function() {
        $location.path($scope.backUrl);
      }

      //登録ボタン押下
      $scope.regist = function() {

        //POSTするURLを生成する。
        if($scope.case =="group"){
          $scope.postUrl = "group"+$routeParams.USER_ID;
        }else{
          $scope.postUrl = "device"+$routeParams.USER_ID+$routeParams.DEVICE_ID;
        }

        //送信データ
        var postData = {


          //スライダーの値
          switchSI : $scope.switchSI,
          seismicIntensityFlg : $scope.switch.seismicIntensity,
          seismicIntensity : $scope.slider.seismicIntensity,
          siFlg : $scope.switch.si,
          si : $scope.slider.si,
          lpgm : $scope.slider.longPeriodGroundMotion,
          //通知する/通知しない
          slope : $scope.switch.slope,
          lightningSurge : $scope.switch.lightningSurge,
          commercialBlackout : $scope.switch.commercialBlackout,
          equipmentAbnormality: $scope.switch.equipmentAbnormality

        }

        //POST処理
        $http({
          method: 'post',
          url: '/api/alert/',
          data: postData
        })
        .then(function successCallback(response) {
//          console.log("posted successfully");
//          console.log(response);
          $location.path($scope.backUrl);
        }, function errorCallback(response) {
          console.error("error in posting");
        });


      }


  }]);

'use strict';

angular.module('nitoiotweb11App')
  .controller('DeviceDetailCtrl', ['$rootScope', '$routeParams', '$scope', '$http', '$location', function ($rootScope, $routeParams, $scope, $http, $location) {

    //デバイス情報
    $http.get('/api/device_detail/' + $routeParams.DEVICE_ID)
      .then(function successCallback(response) {
        //        console.log("/api/device_detail/"+$routeParams.DEVICE_ID+" successfully");
        //        console.log(response);

        var obj = response.data;

        //地震の最新データある場合のみObjectにpush
        if (obj.hasOwnProperty("earthquakeCurrentData")) {
          $scope.earthquakeCurrentData = obj.earthquakeCurrentData;
        }
        //雷の最新データある場合のみObjectにpush
        if (obj.hasOwnProperty("thunderCurrentData")) {
          $scope.thunderCurrentData = obj.thunderCurrentData;
        }

        //ヘッダータイトル
        $scope.navtitle = obj.deviceName;

        $scope.deviceDetail = {
          deviceId: obj._id,
          deviceName: obj.deviceName,
          responsiblePerson: obj.responsiblePerson,
          telNo: obj.telNo,
          address: obj.address,
          memo: obj.memo
        };

        //TODO コメントを取得する
        //            console.log('/api/comment/related/DEV_' + $routeParams.DEVICE_ID + '_' + obj.earthquakeCurrentData.date_id + '/');
        if (obj.hasOwnProperty("earthquakeCurrentData")) {
          $http.get('/api/comment/related/DEV_' + $routeParams.DEVICE_ID + '_' + obj.earthquakeCurrentData.data.date_id + '/')
            .then(function successCallback(response) {
              //            console.log("/api/comment/related/ successfully");
              //            console.log(response);
              if (response.data) {
                $scope.commentList = response.data;
              }
            }, function errorCallback(response) {
              console.error("error in /api/device_detail/00000");
            });
        }

      });
    //地震履歴情報
    $http.get('/api/device_history_eq/' + $routeParams.DEVICE_ID)
      .then(function successCallback(response) {
        //        console.log("/api/device_history_eq/"+$routeParams.DEVICE_ID+" successfully");
        //        console.log(response);

        $scope.earthquakeHistoryList = response.data;
        //        console.log($scope.earthquakeHistoryList);

      }, function errorCallback(response) {
        console.error("error in /api/device_history_eq/" + $routeParams.DEVICE_ID);
      });
    //雷履歴情報
    $http.get('/api/device_history_fl/' + $routeParams.DEVICE_ID)
      .then(function successCallback(response) {
        //        console.log("/api/device_history_fl/"+$routeParams.DEVICE_ID+" successfully");
        //        console.log(response);

        $scope.thunderHistoryList = response.data;
        //        console.log($scope.thunderHistoryList);

      }, function errorCallback(response) {
        console.error("error in /api/device_history_fl/" + $routeParams.DEVICE_ID);
      });


    //TODO さらに見るボタンが動かないので、修正する。
    $scope.earthquakeHistoryViews = 10; // 地震情報表示する件数(初期表示件数を指定)
    $scope.thunderHistoryViews = 10; //　雷情報表示する件数(初期表示件数を指定)
    $scope.nextView = 10; // 地震&雷情報もっと見るをクリックしたときに表示する数

    // 地震情報さらに見るクリック時
    $scope.earthquakeHistoryMoreClick = function () {
      $scope.moreCount++;
      $scope.earthquakeHistoryViews = $scope.earthquakeHistoryViews + $scope.nextView;
    };

    // 雷情報さらに見るクリック時
    $scope.thunderHistoryMoreClick = function () {
      $scope.moreCount++;
      $scope.thunderHistoryViews = $scope.thunderHistoryViews + $scope.nextView;
    };

    $scope.deviceDetailData = function (arg, type) {
      var di = arg || this.item.date_id;
      var item = type || this.item.type
      if (item === undefined) item = 'FL';
      $location.path("/user_" + $routeParams.USER_ID + "/device_" + $routeParams.DEVICE_ID + "/date" + di + "/" + item);
      //         $location.path("/user_u000/device_00000/date20170216105553");
    }


  }]);


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
          if(obj.data.datas){
            obj2 = obj.data.datas[0];
          }

          //
          if(obj2.commercialBlackout){
            obj2.commercialBlackout = "あり"
          }else{
            obj2.commercialBlackout = "なし"
          }

          if(obj2.equipmentAbnormality){
            obj2.equipmentAbnormality = "あり"
          }else{
            obj2.equipmentAbnormality = "なし"
          }

          if(obj2.leakage){
            obj2.leakage = "あり"
          }else{
            obj2.leakage = "なし"
          }

          if(obj2.slope){
            obj2.slope = "あり（"+obj2.slope+"°）";
          }else{
            obj2.slope = "なし"
          }
        
          if(obj2.power){
            switch(obj2.power){
              case 1:
                obj2.power = "小";
                break;
              case 2:
                obj2.power = "中";
                break;
              case 3:
                obj2.power = "大";
                break;
            }
          }
          $scope.detailData =
          {
               deviceId   :obj._id,
               deviceName :obj.deviceName,
               type       :obj2.type,          //地震or雷
               seismicIntensity:obj2.seismicIntensity,     //震度（地震のみ）
               power :obj2.power,
               slope:obj2.slope,               //傾き（地震のみ）
               leakage:obj2.leakage,             //漏電（雷のみ）
               commercialBlackout:obj2.commercialBlackout,
               equipmentAbnormality:obj2.equipmentAbnormality,
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

          $http.get('/api/device_list/logdate/' + $routeParams.DEVICE_ID + '/' + $routeParams.YYYYMMDDHHMM + '/' + obj2.type)
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
                  if(obj2.type == 'EQ' || obj2.type == 'AL'){
                    if($routeParams.DEVICE_ID == response.data[i].value.did) {
                        icon = '/assets/images/markerNow' + response.data[i].value.s + '.png'
                    }else{
                        icon = '/assets/images/marker' + response.data[i].value.s + '.png'
                    }
                  }else if(obj2.type == 'FL'){
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


'use strict';

    angular.module('nitoiotweb11App')
    .controller('EnvLogCtrl',['$rootScope','$routeParams','$scope','$http','$location','$window','$timeout', function ($rootScope,$routeParams,$scope, $http, $location,$window,$timeout) {
      
      var logName;
      
      switch($routeParams.type){
        case 'temp':
          logName = '気温・湿度';
          break;
        case 'pressure':
          logName = '気圧';
          break;
        case 'uvi':
          logName = '紫外線';
          break;
        case 'discomfortIndex':
          logName = '不快指数';
          break;
        case 'heatstroke':
          logName = '熱中症指数';
          break;
        case 'noise':
          logName = '騒音';
          break;
        case 'pm25':
          logName = 'PM2.5';
          break;
        case 'pm10':
          logName = '花粉';
          break;
      }
      
      //ヘッダータイトル
      $scope.navtitle=logName;
      
      if($routeParams.type == 'noise' || $routeParams.type == 'pm25' || $routeParams.type == 'pm10'){
        $scope.gType=true;
      }else{
        $scope.gType=false;
      }
      
    //画面遷移
    $scope.backtoList = function () {
      $location.path("/user_" + $routeParams.USER_ID + "/");
    }



    }]);


'use strict';

    angular.module('nitoiotweb11App')
    .controller('DocumentsSettingCtrl',['$rootScope','$routeParams','$scope','$http','$location','$window','$timeout', function ($rootScope,$routeParams,$scope, $http, $location,$window,$timeout) {

      //ヘッダータイトル
      $scope.navtitle="商品カタログ";

      //画面遷移
      $scope.catalogDL = function (fileName) {
        $window.location.href = "/assets/documents/SP-626.pdf";
      }


    }]);


'use strict';

    angular.module('nitoiotweb11App')
    .controller('DownloadCsvItemSettingCtrl',['$rootScope','$routeParams','$scope','$http','$location','$window','$timeout', function ($rootScope,$routeParams,$scope, $http, $location,$window,$timeout) {
      $rootScope.error = false;

      //ヘッダータイトル
      $scope.navtitle="データダウンロード";

      //ダウンロードデータ
      $scope.selectItems = [
                { 'value':1,
                  'label':'地震発生データ',
                },
                { 'value':2,
                  'label':'速報震度データ',
                },
                { 'value':3,
                  'label':'長周期振動データ',
                },
                { 'value':4,
                  'label':'転倒データ',
                },
                { 'value':5,
                  'label':'雷発生データ',
                },
                { 'value':6,
                  'label':'ユーザー一覧(デバイス一覧)',
                }
            ];
      $scope.selectItem = 1;


      //デフォルト値設定
      $scope.downloadStartDate = new Date();
      $scope.downloadEndDate = new Date();


      //ダウンロードボタンアクション
     $http.get('/api/user/')
      .then(function successCallback(res){
        //デバイスグループデータ
        $scope.deviceList = res.data.device;
     });


      //TODO APIでCSVダウンロードできるように変更
      //ダウンロードボタンアクション
     $scope.download = function(){
       var st = $scope.downloadStartDate;
       var et = $scope.downloadEndDate;
       var type = $scope.selectItem
       var dev = $scope.deviceList
       $http.get('/api/csv/' + dev + '/' + type + '/st_' + st + '/et_' + et)
      .then(function successCallback(res){
//         var anchor = angular.element('<a/>');
//         anchor.css({display: 'none'}); // Make sure it's not visible
//         angular.element(document.body).append(anchor); // Attach to document
//
//         anchor.attr({
//             href: 'data:attachment/csv;charset=Shift_JIS,' + encodeURI(res.data),
//             target: '_blank'
//         })[0].click();
//         anchor.remove();

         if(res.data.error){
           $rootScope.error = res.data.error;
            $timeout(function (){
                $rootScope.error = false;
            },2000);
         }else{
//           console.log(res);
           var filename = res.headers('content-disposition').split('=')[1];

              // Convert text to blob object with Blob API.
              var blob = new Blob([ res.data ], { "type" : "text/csv; charset=Shift_JIS" });

              // For Internet Expolorer
              if ($window.navigator.msSaveBlob) {
                  $window.navigator.msSaveBlob(blob, filename);

              // For other browsers
              } else {
                  var link = $window.document.getElementById("csv_exporter");

                  if (link == null) {
                      link = $window.document.createElement("a");
                      link.setAttribute("id", "csv_exporter");
                      link.setAttribute("style", "display:none;");
                      link.setAttribute("download", filename);
                  }

                  link.setAttribute("href", $window.URL.createObjectURL(blob));
                  link.click();
              }
         }
     });

     }



    }])
    //DatePickerFormat
    .config(["$mdDateLocaleProvider", function($mdDateLocaleProvider) {
  $mdDateLocaleProvider.formatDate = function(date) {
    return moment(date).format('YYYY/M/D');
  };
}]);;

'use strict';
/**
***　UC000ログイン画面
**/

    angular.module('nitoiotweb11App')
    .config(["$locationProvider", function($locationProvider) {
          // パラメータを取得するためのオプション（但し要HTML5対応ブラウザ）
          $locationProvider.html5Mode(true); 
        }])
    .controller('LoginCtrl',['$rootScope','$routeParams','$scope','$http','$location', '$window', function ($rootScope, $routeParams, $scope, $http, $location, $window) {

      //$scopehttp/timeout etc... Angularjsのmodule
      //TODO ルートスコープ読み込みする。引数でもらって来る。
      //初期表示の処理
      //1画面1コントーラが理想(複数画面１コントローラ可能だけどスコープの範囲の意識が必要なので面倒)

      //TODO　ルートスコープに値を入れて取得する
      //ルーティング続き

//    	alert("$routeParams"+$routeParams.userId)

//      
//      $rootScope.success = false;
//      $rootScope.error = false;
//      
      /**
      ***　処理概要：パラメータを取得してリダイレクト先を返却する
      **/
      $scope.paramName = 'query';
      $scope.getQuery = function(){
        return $location.search()[$scope.paramName];
      }
      
      /**
      ***　処理概要：IDとPWを入力してログインする。
      **/
      $scope.login = function(){
        if(!$scope.user) {
          return false;
        }
        $http({
          method: 'POST',
          url: '/login',
          data: { userId: $scope.user.userId, password: $scope.user.password, query: $scope.user.query }
        })
        .then(
          function successCallback(response){
//            console.log(response);
            if(response.data.authStat){
              $window.location.href = response.data.redirect;
            } else {
              $scope.error = response.data.message;
              $scope.dataLoading = false;
              $timeout(function (){
                  $rootScope.error = false;
              },2000);
            }
            
          },
          function errorCallback(response){
              $scope.error = response.data.message;
              $scope.dataLoading = false;
              $timeout(function (){
                  $rootScope.error = false;
              },2000);
          }
        ); 
      }
    }]);


'use strict';
/**
***　UC000ログイン画面
**/

    angular.module('nitoiotweb11App')
    .controller('LogoutCtrl', ['$scope', '$location', 'AuthService',
      function ($scope, $location, AuthService) {

        $scope.logout = function () {

          // call logout from service
          AuthService.logout()
            .then(function () {
              $location.path('/login');
            });

        };
      
    }]);


'use strict';

angular.module('nitoiotweb11App')
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      //UC000ログイン画面
      .when('/login', {
        templateUrl: 'app/login/login.html',
        //controller: 'LoginCtrl'
      })


    //  UC001	デバイス一覧画面				/user_:USER_ID
    .when('/user_:USER_ID', {
      templateUrl: 'app/device/deviceList.html',
      //controller: 'DeviceListCtrl'
    })
    //  UC002	デバイス詳細					/user_:USER_ID/device_:DEVICE_ID
    .when('/user_:USER_ID/device_:DEVICE_ID', {
      templateUrl: 'app/deviceUnit/deviceDetail.html',
      // controller: 'DeviceDetailCtrl'
    })
    //  UC003	デバイス詳細　データ				/user_:USER_ID/device_:DEVICE_ID/date:YYYYMMDDHHMM/:TYPE
    .when('/user_:USER_ID/device_:DEVICE_ID/date:YYYYMMDDHHMM/:TYPE', {
      templateUrl: 'app/deviceUnit/deviceDetailData.html',
      // controller: 'DeviceDetailDataCtrl'
    })
    //  UC005	デバイスグループ画面				/user_:USER_ID/group_:GROUP_ID
    .when('/user_:USER_ID/group', {
      templateUrl: 'app/deviceGroup/deviceGroup.html',
      // controller: 'DeviceGroupCtrl'
    })
    //  UC006	デバイス情報編集画面				/user_:USER_ID/device_:DEVICE_ID/edit
    .when('/user_:USER_ID/device_:DEVICE_ID/edit', {
      templateUrl: 'app/deviceUnit/deviceInfoEdit.html',
      // controller: 'DeviceInfoEditCtrl'
    })
    //  UC007	アラート設定画面(デバイスごと）	/user_:USER_ID/device_:DEVICE_ID/alert
    .when('/user_:USER_ID/device_:DEVICE_ID/alert', {
      templateUrl: 'app/deviceUnit/alertSetting.html',
      // controller: 'AlertSettingCtrl'
    })
    //  UC007	アラート設定画面（グループ）		/user_:USER_ID/group/alert
    .when('/user_:USER_ID/group/alert', {
      templateUrl: 'app/deviceUnit/alertSetting.html',
      // controller: 'AlertSettingCtrl'
    })
    //  UC008	ダウンロードCSV項目設定画面		/user_:USER_ID/data/download
    .when('/user_:USER_ID/data/download', {
      templateUrl: 'app/downloadCSV/downloadCsvItemSetting.html',
      // controller: 'DownloadCsvItemSettingCtrl'
    })
    //  UC009	ドキュメントダウンロード画面		/user_:USER_ID/data/download
    .when('/documents', {
      templateUrl: 'app/documents/documents.html'
    })
    //  UC---	計測ログダミー画面		/user_:USER_ID/data/download
    .when('/user_:USER_ID/device_:DEVICE_ID/env_:type', {
      templateUrl: 'app/deviceUnit/envLog.html'
    })
    .otherwise({
      redirectTo: '/login'
    });



  }]);

'use strict';

angular.module('nitoiotweb11App')
  .factory('Modal', ["$rootScope", "$modal", function ($rootScope, $modal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    // Public API here
    return {

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed straight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirm Delete',
                html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Delete',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        }
      }
    };
  }]);

'use strict';

angular.module('nitoiotweb11App')
  .controller('NavbarCtrl',['$rootScope','$scope','$location','$mdSidenav',function ($rootScope,$scope, $location,$mdSidenav) {



    $scope.toggleLeft = buildToggler('left');

     //ハンバーガメニューの押下でメニューを表示する。
    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    $scope.menuItemClick = function(url){
      $location.path(url);
      buildToggler('left');
    }


    var adminFlg = document.cookie.split( '; ' )[ 0 ].split( '=' )[ 1 ];
    var cookieUID = document.cookie.split( '; ' ).filter(function(element){
      return (element.split( '=' )[0] == 'user_id');
    });
    var userID = cookieUID[0].split( '=' )[1]


    if(adminFlg=="true"){

      //管理者
      $scope.menuItem = [
        {
          label : "デバイス一覧",
          url : "/user_"+userID
        },
        {
          label : "デバイス管理",
          url : "/user_"+userID+"/group"
        },
        {
          label : "CSVダウンロード",
          url : "/user_"+userID+"/data/download"
        },
        {
          label : "商品カタログ",
          url : "/documents/"
        },
        {
          label : "ログアウト",
          url : "/logout/"
        }
      ]

    }else{

      //一般
    $scope.menuItem = [
      {
        label : "デバイス一覧",
        url : "/user_"+userID
      },
      {
        label : "デバイス管理",
        url : "/user_"+userID+"/group"
      },
      {
        label : "ログアウト",
        url : "/logout/"
      }
    ]

  }


  }]);

angular.module('nitoiotweb11App').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/device/deviceList.html',
    "<div ng-controller=DeviceListCtrl ng-cloak=\"\" class=navBardemoBasicUsage><!--ヘッダー読み込み--><navitop></navitop><div class=\"md-toolbar-tools searchbox\"><md-input-container><input ng-model=query><md-icon><svg width=24px height=24px viewbox=\"296 5 24 24\" version=1.1 xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink><g id=Material/Icons-white/search stroke=none fill=none transform=\"translate(296.000000, 5.000000)\" fill-rule=evenodd><path d=\"M15.502,9.491 L14.708,9.491 L14.432,9.765 C15.407,10.902 16,12.376 16,13.991 C16,17.581 13.09,20.491 9.5,20.491 C5.91,20.491 3,17.581 3,13.991 C3,10.401 5.91,7.491 9.5,7.491 C11.115,7.491 12.588,8.083 13.725,9.057 L14.001,8.783 L14.001,7.991 L18.999,3 L20.49,4.491 L15.502,9.491 L15.502,9.491 Z M9.5,9.491 C7.014,9.491 5,11.505 5,13.991 C5,16.476 7.014,18.491 9.5,18.491 C11.985,18.491 14,16.476 14,13.991 C14,11.505 11.985,9.491 9.5,9.491 L9.5,9.491 Z\" id=Shape fill=#FFFFFF transform=\"translate(11.745000, 11.745500) scale(1, -1) translate(-11.745000, -11.745500) \"></path></g></svg></md-icon></md-input-container></div><div ng-cloak><md-tabs md-dynamic-height md-border-bottom><md-tab label=一覧><!--デバイス一覧--><ul><li ng-repeat=\"item in deviceList | filter:query\" on-finish-render=deviceInfoFinished><md-card><md-list-item class=md-list-item-2 ng-click=deviceDetail()><p class=md-body-5>{{::item.deviceName}}</p><buttondetail></buttondetail></md-list-item><md-card-content><!--職場責任者・連絡先--><div class=md-contentPaddingBottom><div class=md-body-1>職場責任者：{{::item.responsiblePerson}}</div><div class=md-body-1>連絡先：{{::item.telNo}}</div><div class=md-body-1 ng-if=\"item.status=='感知あり'\">発生日時：{{item.date}}</div></div><!--感知あり/なし--><div layout=row layout-wrap class=md-card-blank-top><span class=md-body-3>{{::item.status}}</span></div><!--地震の場合--><div layout=row class=md-contentPaddingBottom layout-wrap ng-if=\"item.type == 'EQ'\"><div flex=25><p flex class=md-body-1>傾き</p><p flex class=md-body-1>商用停電</p><p flex class=md-body-1>機器異常</p></div><div flex=40><p flex class=md-body-3 ng-if=item.slope>あり（{{::item.slope}}）</p><p flex class=md-body-3 ng-if=\"item.slope == 0\">なし</p><p flex class=md-body-3 ng-if=item.commercialBlackout>あり</p><p flex class=md-body-3 ng-if=!item.commercialBlackout>なし</p><p flex class=md-body-3 ng-if=item.equipmentAbnormality>あり</p><p flex class=md-body-3 ng-if=!item.equipmentAbnormality>なし</p></div><div><div flex class=md-body-1>震度</div><div flex class=md-body-6>{{item.seismicIntensity}}</div></div></div><!--雷の場合--><div layout=row class=md-contentPaddingBottom layout-wrap ng-if=\"item.type == 'FL'\"><div flex=25><p flex class=md-body-1>漏電</p><p flex class=md-body-1>商用停電</p><p flex class=md-body-1>機器異常</p></div><div flex=40><p flex class=md-body-3 ng-if=item.leakage>あり</p><p flex class=md-body-3 ng-if=!item.leakage>なし</p><p flex class=md-body-3 ng-if=item.commercialBlackout>あり</p><p flex class=md-body-3 ng-if=!item.commercialBlackout>なし</p><p flex class=md-body-3 ng-if=item.equipmentAbnormality>あり</p><p flex class=md-body-3 ng-if=!item.equipmentAbnormality>なし</p></div><div><div flex class=md-body-1>雷</div><div flex class=md-body-6>{{item.power}}</div></div></div><p class=md-body-1 ng-if=\"item.commentList != undefined\">コメント・連絡事項</p><ul ng-if=\"item.commentList != undefined\"><li ng-repeat=\"cl in item.commentList\"><p class=md-body-2 ng-if=!cl.importantFlg>{{::cl.comment}}　{{::cl.timestamp}}</p><p class=\"md-body-2 importantFlg\" ng-if=cl.importantFlg>{{::cl.comment}}　{{::cl.timestamp}}</p></li></ul></md-card-content><!--環境センサー--><md-card-content layout-wrap ng-if=\"env && item.envSensorFlg\"><div class=md-body-1>これからの天気</div><div layout=row ng-click=\"envLogData('temp')\"><div flex=25><dl class=text-center><dt class=md-body-1>現在</dt><dd class=nito-env-img><img src=/assets/images/icon_sunny.svg></dd><dd class=\"md-headline nito-env-temp\">{{::env.temperature}}<span class=\"md-subhead env-temp\">℃</span></dd><dd class=\"md-subhead md-main-text\">{{::env.humidity}}<span class=md-body-1>%</span></dd></dl></div><div flex=25><dl class=text-center><dt class=md-body-1>13時</dt><dd class=nito-env-img><img src=/assets/images/icon_cloud.svg></dd><dd class=\"md-headline nito-env-temp\">32<span class=md-subhead>℃</span></dd><dd class=\"md-subhead md-main-text\">50<span class=md-body-1>%</span></dd></dl></div><div flex=25><dl class=text-center><dt class=md-body-1>14時</dt><dd class=nito-env-img><img src=/assets/images/icon_rainy.svg></dd><dd class=\"md-headline nito-env-temp\">32<span class=md-subhead>℃</span></dd><dd class=\"md-subhead md-main-text\">50<span class=md-body-1>%</span></dd></dl></div><div flex=25><dl class=text-center><dt class=md-body-1>15時</dt><dd class=nito-env-img><img src=/assets/images/icon_sunny_cloudy.svg></dd><dd class=\"md-headline nito-env-temp\">32<span class=md-subhead>℃</span></dd><dd class=\"md-subhead md-main-text\">50<span class=md-body-1>%</span></dd></dl></div></div><div class=md-body-1>直近の気温・湿度・気圧の推移</div></md-card-content><md-card-content class=nito-env-data layout-wrap ng-if=\"env && item.envSensorFlg\"><div layout=row><div flex=25 class=\"nito-env-datas nito-env-ap\" ng-click=\"envLogData('pressure')\"><dl class=text-center><dt class=md-body-1>気圧</dt><dd class=md-body-2>{{::env.pressure}} <span class=md-body-1>hpa</span></dd></dl></div><div flex=25 class=\"nito-env-datas nito-env-uv\" ng-click=\"envLogData('uvi')\"><dl class=text-center><dt class=md-body-1>紫外線</dt><dd class=md-body-2>{{::env.uvi}}</dd></dl></div><div flex=25 class=\"nito-env-datas nito-env-di\" ng-click=\"envLogData('discomfortIndex')\"><dl class=text-center><dt class=md-body-1>不快指数</dt><dd class=md-body-2>{{::env.discomfortIndex}}</dd></dl></div><div flex=25 class=\"nito-env-datas nito-env-hi\" ng-click=\"envLogData('heatstroke')\"><dl class=text-center><dt class=md-body-1>熱中症指数</dt><dd class=md-body-2>{{::env.heatstroke}}</dd></dl></div></div></md-card-content><md-card-content ng-if=\"env && item.envSensorFlg\"><p class=md-body-1>環境汚染</p><md-list-item ng-click=\"envLogData('noise')\"><p class=md-body-2>騒音</p><span class=md-body-1>{{::env.noise}} dB</span><buttondetail></buttondetail></md-list-item><md-list-item ng-click=\"envLogData('pm25')\"><p class=md-body-2>PM2.5</p><span class=md-body-1>少ない</span><buttondetail></buttondetail></md-list-item><md-list-item ng-click=\"envLogData('pm10')\"><p class=md-body-2>花粉</p><span class=md-body-1>多い</span><buttondetail></buttondetail></md-list-item></md-card-content></md-card></li></ul></md-tab><!--グラフタブ---------------><md-tab label=グラフ><md-input-container class=md-block flex-gt-sm><label>グラフの表示期間を選択</label><md-select ng-change=changeItem ng-model=selectItem><md-option ng-repeat=\"item in selectItems\" value={{item.value}}>{{::item.label}}</md-option></md-select></md-input-container><ul><li ng-repeat=\"item in deviceList | filter:query\" on-finish-render=deviceListFinished><md-card><md-list-item class=md-list-item-2 ng-click=deviceDetail()><p class=md-body-5>{{::item.deviceName}}</p><buttondetail></buttondetail></md-list-item><!--デバイスカード　コンテンツ--><md-card-content><!--地震データ有りの場合 グラフを表示する--><div google-chart chart=charts id={{::item.deviceId}} class=google-chart><p flex class=md-body-1>地震データなし</p></div></md-card-content></md-card></li></ul></md-tab><!--マップタブ---------------><md-tab label=マップ><!--MAP--><div class=map><!-- <ui-gmap-google-map center=\"map.center\" zoom=\"map.zoom\" draggable=\"true\" bounds=\"map.bounds\">\n" +
    "                <ui-gmap-google-map zoom=\"map.zoom\" draggable=\"true\" bounds=\"map.bounds\">  --><!-- <ui-gmap-markers models=\"markers\" coords=\"'self'\" icon=\"'icon'\"></ui-gmap-markers>\n" +
    "              </ui-gmap-google-map> --><div id=map-deviceList></div></div></md-tab></md-tabs></div><!-- </script> --></div><!-- Modal for inProgress --><script type=text/ng-template id=T_inProgress><!-- <div class=\"modal-body\"> -->\n" +
    "  <md-progress-circular md-mode=\"indeterminate\"></md-progress-circular>\n" +
    "  <!-- </div> --></script><!-- Modal for inProgress--><footer class=footer></footer>"
  );


  $templateCache.put('app/deviceGroup/deviceGroup.html',
    "<div ng-controller=DeviceGroupCtrl ng-cloak=\"\" class=navBardemoBasicUsage><!--ヘッダー読み込み--><navitop></navitop><!--エラーメッセージ--><div ng-show=error class=\"alert alert-danger\">{{error}}</div><div ng-show=success class=\"alert alert-success\">{{success}}</div><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">基本情報</h3></div><md-card><md-card-content><!-- <md-card-title-text> --><span class=md-body-1>グループID</span><p class=md-body-3>{{groupId}}</p><!-- </md-card-title-text> --></md-card-content><md-card-content><div layout=row layout-align=\"start end\"><div flex=90 layout=column><span flex class=md-body-1>グループ名</span> <span flex class=md-body-3>{{groupName}}</span></div><md-button class=md-icon-button aria-label=More ng-if=isAdmin><md-icon ng-click=groupNameEdit()><buttonpen></buttonpen></md-icon></md-button></div></md-card-content></md-card><!--ツールバー---><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">管理</h3></div><div ng-cloak><md-tabs md-dynamic-height md-border-bottom><!--デバイスタブ--><md-tab label=デバイス><md-card><md-list-item class=md-secondary ng-repeat=\"item in deviceList\" ng-click=deviceDetail()><p class=md-body-4>{{item.name}}</p><buttondetail></buttondetail></md-list-item></md-card></md-tab><!--アラートタブ--><md-tab label=アラート通知 ng-if=isAdmin><md-card><md-list-item class=md-secondary ng-repeat=\"item in sendto\" ng-click=null><!-- <div layout> --><p class=md-body-4>{{item.name}}</p><p class=\"md-body-1 mailId\">{{item.mailid}}</p><md-menu><md-button class=md-icon-button ng-click=$mdOpenMenu($event) aria-label=More><i class=material-icons>more_vert</i></md-button><md-menu-content><md-menu-item><md-button ng-click=mailAddressEdit($event,false) aria-label=\"Do something\">編集</md-button></md-menu-item><md-menu-item><md-button ng-click=mailAddressDelete() aria-label=\"Do something\">削除</md-button></md-menu-item></md-menu-content></md-menu><!-- </div> --></md-list-item><!--ボタン--><div layout><md-button flex class=\"md-accent md-button md-ink-ripple md-text-button-1\" type=button ng-click=alertSetting() ng-transclude=\"\"><div class=\"md-ripple-container md-ripple-container-1\">通知設定</div></md-button><md-button flex class=\"md-accent md-button md-ink-ripple md-text-button-2\" type=button ng-click=mailAddressAdd($event,true) ng-transclude=\"\"><div class=\"md-ripple-container md-ripple-container-2\">追加</div></md-button></div></md-card></md-tab></md-tabs></div></div><footer class=footer></footer>"
  );


  $templateCache.put('app/deviceUnit/alertSetting.html',
    "<div ng-controller=AlertSettingCtrl ng-cloak=\"\" class=navBardemoBasicUsage><!--ヘッダー読み込み--><navitop></navitop><!--エラーメッセージ--><div ng-show=error class=\"alert alert-danger\">{{error}}</div><div ng-show=success class=\"alert alert-success\">{{success}}</div><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">通知闘値</h3></div><md-card><!--switch--><label class=nito-switch-label><span>震度</span><md-switch ng-model=switchSI ng-class=\"{'nito-default':switchSI==true}\" ng-change=switchIntensity(switchSI) style=float:left></md-switch><span class=nito-switch-label>SI値</span></label><md-card-content ng-hide=switchSI><md-card-title-text><md-switch ng-model=switch.seismicIntensity class=md-warn><div ng-if=!!switch.seismicIntensity>通知する</div><div ng-if=!switch.seismicIntensity>通知しない</div></md-switch><!--震度スライダー--><md-slider-container ng-if=!!switch.seismicIntensity><md-slider flex=\"\" min=3 max=7 ng-model=slider.seismicIntensity aria-label=red></md-slider><md-input-container><input flex=\"\" ng-model=slider.seismicIntensity aria-label=red aria-controls=red-slider type=number></md-input-container></md-slider-container></md-card-title-text></md-card-content><md-card-content ng-hide=!switchSI><!--switch--><md-switch ng-model=switch.si class=md-warn><div ng-if=!!switch.si>通知する</div><div ng-if=!switch.si>通知しない</div></md-switch><!--SI値スライダー--><md-slider-container ng-if=!!switch.si><md-slider flex=\"\" min=1 max=140 step=0.1 ng-model=slider.si aria-label=red></md-slider><md-input-container><input flex=\"\" ng-model=slider.si aria-label=red aria-controls=red-slider type=number></md-input-container></md-slider-container></md-card-content><md-card-content><md-card-title-text><!--switch--><label>長周期地震動:</label><md-switch ng-model=switch.longPeriodGroundMotion class=md-warn><div ng-if=!!switch.longPeriodGroundMotion>通知する</div><div ng-if=!switch.longPeriodGroundMotion>通知しない</div></md-switch><!--長周期地震動スライダ--><md-slider-container ng-if=!!switch.longPeriodGroundMotion><md-slider flex=\"\" min=1 max=4 ng-model=slider.longPeriodGroundMotion aria-label=red></md-slider><md-input-container><input flex=\"\" ng-model=slider.longPeriodGroundMotion aria-label=red aria-controls=red-slider type=number></md-input-container></md-slider-container></md-card-title-text></md-card-content><md-card-content><md-card-title-text><!--switch--><label>傾き:</label><md-switch ng-model=switch.slope class=md-warn><div ng-if=!!switch.slope>通知する</div><div ng-if=!switch.slope>通知しない</div></md-switch></md-card-title-text></md-card-content><md-card-content><md-card-title-text><!--switch--><label>雷サージ:</label><md-switch ng-model=switch.lightningSurge class=md-warn><div ng-if=!!switch.lightningSurge>通知する</div><div ng-if=!switch.lightningSurge>通知しない</div></md-switch></md-card-title-text></md-card-content><md-card-content><md-card-title-text><!--switch--><label>商用停電:</label><md-switch ng-model=switch.commercialBlackout class=md-warn><div ng-if=!!switch.commercialBlackout>通知する</div><div ng-if=!switch.commercialBlackout>通知しない</div></md-switch></md-card-title-text></md-card-content><md-card-content><md-card-title-text><!--switch--><label>機器異常:</label><md-switch ng-model=switch.equipmentAbnormality class=md-warn><div ng-if=!!switch.equipmentAbnormality>通知する</div><div ng-if=!switch.equipmentAbnormality>通知しない</div></md-switch></md-card-title-text></md-card-content><div layout><md-button flex class=\"md-accent md-button md-ink-ripple md-text-button-1\" type=button ng-click=cancel() ng-transclude=\"\"><div class=\"md-ripple-container md-ripple-container-1\">キャンセル</div></md-button><md-button flex class=\"md-accent md-button md-ink-ripple md-text-button-2\" type=button ng-click=regist($event,true) ng-transclude=\"\"><div class=\"md-ripple-container md-ripple-container-2\">登録</div></md-button></div></md-card></div><footer class=footer></footer>"
  );


  $templateCache.put('app/deviceUnit/deviceDetail.html',
    "<div ng-controller=DeviceDetailCtrl ng-cloak=\"\" class=navBardemoBasicUsage><!--ヘッダー読み込み--><navitop></navitop><!-- <md-content class=\"md-padding\"> --><!--基本情報--><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">基本情報</h3></div><md-card><md-card-content><md-card-title-text><span class=md-body-5>{{deviceDetail.deviceName}}</span></md-card-title-text></md-card-content><md-card-content><p class=md-subhead>職場責任者：{{deviceDetail.responsiblePerson}}</p><p class=md-subhead>連絡先：{{deviceDetail.telNo}}</p><p class=md-subhead>住所：{{deviceDetail.address}}</p><p class=md-subhead>メモ：{{deviceDetail.memo}}</p></md-card-content></md-card><!--地震--><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">地震</h3></div><md-card><!--現在のステータス--><md-list-item class=md-list-item-2 ng-click=\"deviceDetailData(earthquakeCurrentData.data.date_id,'EQ')\" ng-hide=!earthquakeCurrentData><p class=md-body-5>感知あり</p><buttondetail></buttondetail></md-list-item><md-list-item class=md-list-item-2 ng-hide=earthquakeCurrentData><p class=md-body-5>感知なし</p></md-list-item><!--デバイスカード　コンテンツ--><md-card-content ng-hide=!earthquakeCurrentData><!--地震の場合--><p flex class=md-body-1>発生日時：{{earthquakeCurrentData.data.date}}</p><div layout=row layout-wrap><div flex=25><p flex class=md-body-1>傾き</p><p flex class=md-body-1>商用停電</p><p flex class=md-body-1>機器異常</p></div><div flex=40><p flex class=md-body-3 ng-if=earthquakeCurrentData.data.datas.slope>あり（{{earthquakeCurrentData.datas.slope}}）</p><p flex class=md-body-3 ng-if=\"earthquakeCurrentData.data.datas.slope == 0\">なし</p><p flex class=md-body-3 ng-if=earthquakeCurrentData.data.datas.commercialBlackout>あり</p><p flex class=md-body-3 ng-if=!earthquakeCurrentData.data.datas.commercialBlackout>なし</p><p flex class=md-body-3 ng-if=earthquakeCurrentData.data.datas.equipmentAbnormality>あり</p><p flex class=md-body-3 ng-if=!earthquakeCurrentData.data.datas.equipmentAbnormality>なし</p></div><div><div flex class=md-body-1>震度</div><div flex class=md-body-6>{{earthquakeCurrentData.data.datas[0].seismicIntensity}}</div></div></div></md-card-content><md-card-content ng-hide=\"commentList.length == 0 || commentList == undefined\"><p class=md-body-1>コメント・連絡事項</p><div layout=row layout-wrap><ul><li ng-repeat=\"item in commentList\"><p class=md-body-2 ng-if=!item.value.importantFlg>{{item.value.comment}}　{{item.value.timestamp}}</p><p class=\"md-body-2 importantFlg\" ng-if=item.value.importantFlg>{{item.value.comment}}　{{item.value.timestamp}}</p></li></ul></div></md-card-content><!--TODO メディア速報表示させる---><md-card-content ng-hide=\"earthquakeCurrentData.datas.mediaNewsletter == undefined\"><p class=md-body-1>メディア速報</p><p class=md-body-2>気象庁公報：震度{{earthquakeCurrentData.datas.mediaNewsletter[0].japanMeteorologicalAgency}}</p><p class=md-body-2>長周期地震動階級：{{earthquakeCurrentData.datas.mediaNewsletter[0].longPeriodSeismicActivityClass}}</p></md-card-content><!--地震履歴--><md-card-content><p class=md-body-1>地震履歴</p><md-list-item class=md-secondary ng-repeat=\"item in earthquakeHistoryList | limitTo: earthquakeHistoryViews: 0\" ng-click=deviceDetailData()><p class=md-body-1>{{item.data.date}}</p><span class=md-body-1>{{item.data.datas[0].value}}</span> <span class=md-body-1 ng-if=\"item.data.datas[0].value == undefined\">{{item.data.sdata.S}}</span><buttondetail></buttondetail></md-list-item><p flex class=md-body-3 ng-if=\"earthquakeHistoryList.length == 0 || earthquakeHistoryList == undefined\">履歴なし</p><div layout layout-align=center><md-button class=\"md-accent md-button md-ink-ripple\" type=button ng-click=earthquakeHistoryMoreClick() ng-transclude=\"\" ng-hide=\"earthquakeHistoryViews >= earthquakeHistoryList.length  || earthquakeHistoryList == undefined\"><div class=md-ripple-container>さらに表示</div></md-button></div></md-card-content></md-card><!--雷--><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">雷</h3></div><md-card><!--現在のステータス--><md-list-item class=md-list-item-2 ng-click=\"deviceDetailData(thunderCurrentData.data.date_id,'FL')\" ng-hide=!deviceDetail.thunderCurrentData><p class=md-body-5>感知あり</p><buttondetail></buttondetail></md-list-item><md-list-item class=md-list-item-2 ng-hide=deviceDetail.thunderCurrentData><p class=md-body-5>感知なし</p></md-list-item><!--デバイスカード　コンテンツ--><md-card-content ng-hide=!deviceDetail.thunderCurrentData><p flex class=md-body-1>発生日時：{{deviceDetail.thunderCurrentData.date}}</p><div layout=row layout-wrap><div flex=25><p flex class=md-body-1>漏電</p><p flex class=md-body-1>商用停電</p><p flex class=md-body-1>機器異常</p></div><div flex=40><p flex class=md-body-3 ng-if=thunderCurrentData.datas.leakage>あり</p><p flex class=md-body-3 ng-if=!thunderCurrentData.datas.leakage>なし</p><p flex class=md-body-3 ng-if=thunderCurrentData.datas.commercialBlackout>あり</p><p flex class=md-body-3 ng-if=!thunderCurrentData.datas.commercialBlackout>なし</p><p flex class=md-body-3 ng-if=thunderCurrentData.datas.equipmentAbnormality>あり</p><p flex class=md-body-3 ng-if=!thunderCurrentData.datas.equipmentAbnormality>なし</p></div><div><div flex class=md-body-1>雷</div><div flex class=md-body-6>{{thunderCurrentData.power}}</div></div></div></md-card-content><md-card-content ng-hide=\"thunderCurrentData.datas.commentList == undefined\"><p class=md-body-1>コメント・連絡事項</p><div layout=row layout-wrap><ul><li ng-repeat=\"item in thunderCurrentData.commentList\"><p class=md-body-2>{{item.comment}}　{{item.commentDate}}</p></li></ul></div></md-card-content><md-card-content ng-hide=\"thunderCurrentData.datas.mediaNewsletter == undefined\"><!-- <div layout=\"row\" layout-wrap> --><p class=md-body-1>メディア速報</p><p class=md-body-2>気象庁公報：{{thunderCurrentData.mediaNewsletter[0].japanMeteorologicalAgency}}</p><p class=md-body-2>長周期地震動階級{{thunderCurrentData.mediaNewsletter[0].longPeriodSeismicActivityClass}}</p><!-- </div> --></md-card-content><!--雷履歴--><md-card-content><p class=md-body-1>雷履歴</p><md-list-item class=md-secondary ng-repeat=\"item in thunderHistoryList | limitTo: thunderHistoryViews: 0\" ng-click=deviceDetailData()><p class=md-body-1>{{item.date}}</p><span class=md-body-1 ng-if=\"item.datas[0].value == 1\">小</span> <span class=md-body-1 ng-if=\"item.datas[0].value == 2\">中</span> <span class=md-body-1 ng-if=\"item.datas[0].value == 3\">大</span> <span class=md-body-1 ng-if=\"item.datas[0].value == undefined\">-</span><buttondetail></buttondetail></md-list-item><p flex class=md-body-3 ng-if=\"thunderHistoryList.length == 0 || thunderHistoryList == undefined\">履歴なし</p><div layout layout-align=center><md-button class=\"md-accent md-button md-ink-ripple\" type=button ng-click=thunderHistoryMoreClick() ng-transclude=\"\" ng-hide=\"thunderHistoryViews >= thunderHistoryList.length || thunderHistoryList == undefined\"><div class=md-ripple-container>さらに表示</div></md-button></div></md-card-content></md-card><!-- </md-content> --></div><footer class=footer></footer>"
  );


  $templateCache.put('app/deviceUnit/deviceDetailData.html',
    "<div ng-controller=DeviceDetailDataCtrl ng-cloak=\"\" class=navBardemoBasicUsage><!--ヘッダー読み込み--><navitop></navitop><div ng-show=error class=\"alert alert-danger\">{{error}}</div><div ng-show=success class=\"alert alert-success\">{{success}}</div><!--地震または雷--><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\"><div ng-if=\"detailData.type == 'EQ'\">地震</div><div ng-if=\"detailData.type == 'FL'\"><a class=\"docs-anchor ng-scope\" ng-href=#basic-usage name=basic-usage href=#basic-usage>雷</a></div></h3></div><!--デバイスカード--><md-card><!--デバイスカード　タイトル（デバイス名）--><md-card-content><!--タイトル（デバイス名）--><md-card-title-text><span class=md-body-5>感知あり</span></md-card-title-text></md-card-content><!--デバイスカード　コンテンツ--><md-card-content><!--地震の場合--><div layout=row ng-if=\"detailData.type == 'EQ'\"><div flex=25><p flex class=md-body-1>傾き</p><p flex class=md-body-1>商用停電</p><p flex class=md-body-1>機器異常</p></div><div flex=40><p flex class=md-body-3>{{detailData.slope}}</p><p flex class=md-body-3>{{detailData.commercialBlackout}}</p><p flex class=md-body-3>{{detailData.equipmentAbnormality}}</p></div><div><div flex class=md-body-1>震度</div><div flex class=md-body-6>{{detailData.seismicIntensity}}</div></div></div><!--雷の場合--><div layout=row layout-wrap ng-if=\"detailData.type == 'FL'\"><div flex=25><p flex class=md-body-1>漏電</p><p flex class=md-body-1>商用停電</p><p flex class=md-body-1>機器異常</p></div><div flex=40><p flex class=md-body-3>{{detailData.leakage}}</p><p flex class=md-body-3>{{detailData.commercialBlackout}}</p><p flex class=md-body-3>{{detailData.equipmentAbnormality}}</p></div><div><div flex class=md-body-1>雷</div><div flex class=md-display-3>{{detailData.power}}</div></div></div></md-card-content><md-card-content><p class=md-body-1>コメント・連絡事項</p><div layout=row layout-wrap ng-hide=\"detailData.commentList == undefined\"><ul><li ng-repeat=\"item in detailData.commentList\"><p class=md-body-2 ng-if=!item.value.importantFlg>{{item.value.comment}}　{{item.value.timestamp}}</p><p class=\"md-body-2 importantFlg\" ng-if=item.value.importantFlg>{{item.value.comment}}　{{item.value.timestamp}}</p></li></ul></div><md-button class=\"md-accent md-button md-ink-ripple\" type=button ng-click=addComment() ng-transclude=\"\"><div class=md-ripple-container>コメント追加</div></md-button></md-card-content><md-card-content ng-hide=\"detailData.mediaNewsletter == undefined\"><div class=md-body-1>メディア速報</div><div class=md-body-2>気象庁公報：震度{{detailData.mediaNewsletter.japanMeteorologicalAgency}}</div><div class=md-body-2>長周期地震動階級：{{detailData.mediaNewsletter.longPeriodSeismicActivityClass}}</div></md-card-content></md-card><!--グラフ--><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">グラフ</h3></div><md-card><md-card-title><span class=md-body-3>合成加速度</span></md-card-title><img ng-src={{chart_acceleration}}></md-card><!--マップ--><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">マップ</h3></div><md-card><md-content class=md-padding><div id=map-detailData></div></md-content></md-card></div><footer class=footer></footer>"
  );


  $templateCache.put('app/deviceUnit/deviceInfoEdit.html',
    "<div ng-controller=DeviceInfoEditCtrl ng-cloak=\"\" class=navBardemoBasicUsage id=popupContainer><!--ヘッダー読み込み--><navitop></navitop><!--エラーメッセージ--><div ng-show=error class=\"alert alert-danger\">{{error}}</div><div ng-show=success class=\"alert alert-success\">{{success}}</div><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">基本情報</h3></div><md-card><md-card-content><div layout=row layout-align=\"start end\"><div flex=90 layout=column><span flex class=md-body-1>デバイスID</span> <span flex class=md-body-3>{{deviceGroupData.deviceId}}</span> <span flex class=md-body-3 ng-if=\"deviceGroupData.deviceId == undefined\">-</span></div></div></md-card-content><md-card-content><div layout=row layout-align=\"start end\"><div flex=90 layout=column><span flex class=md-body-1>デバイス名</span> <span flex class=md-body-3>{{deviceGroupData.deviceName}}</span> <span flex class=md-body-3 ng-if=\"deviceGroupData.deviceName == undefined\">-</span></div><md-button class=md-icon-button aria-label=More ng-click=deviceNameEdit($event)><md-icon><buttonpen></buttonpen></md-icon></md-button></div></md-card-content><md-card-content><div layout=row layout-align=\"start end\"><div flex=90 layout=column><span flex class=md-body-1>住所</span> <span flex class=md-body-3>{{deviceGroupData.address}}</span> <span flex class=md-body-3 ng-if=\"deviceGroupData.address == undefined\">-</span></div><md-button class=md-icon-button aria-label=More ng-click=addressEdit($event)><md-icon><buttonpen></buttonpen></md-icon></md-button></div></md-card-content><md-card-content><div layout=row layout-align=\"start end\"><div flex=90 layout=column><span flex class=md-body-1>緯度・経度</span> <span flex class=md-body-3>緯度 {{deviceGroupData.latitude}}</span> <span flex class=md-body-3 ng-if=\"deviceGroupData.latitude == undefined\">緯度 -</span> <span flex class=md-body-3>経度 {{deviceGroupData.longitude}}</span> <span flex class=md-body-3 ng-if=\"deviceGroupData.longitude == undefined\">経度 -</span></div><md-button class=md-icon-button aria-label=More ng-click=latlonEdit($event)><md-icon><buttonpen></buttonpen></md-icon></md-button></div></md-card-content><md-card-content><div layout=row layout-align=\"start end\"><div flex=90 layout=column><span flex class=md-body-1>メモ</span> <span flex class=md-body-3>{{deviceGroupData.memo}}</span> <span flex class=md-body-3 ng-if=\"deviceGroupData.memo == undefined\">-</span></div><md-button class=md-icon-button aria-label=More ng-click=memoEdit($event)><md-icon><buttonpen></buttonpen></md-icon></md-button></div></md-card-content><md-card-content><div layout=row layout-align=\"start end\"><div flex=90 layout=column><span flex class=md-body-1>責任者</span> <span flex class=md-body-3>{{deviceGroupData.responsiblePerson}}</span> <span flex class=md-body-3 ng-if=\"deviceGroupData.responsiblePerson == undefined\">-</span></div><md-button class=md-icon-button aria-label=More ng-click=responsiblePersonEdit($event)><md-icon><buttonpen></buttonpen></md-icon></md-button></div></md-card-content><md-card-content><div layout=row layout-align=\"start end\"><div flex=90 layout=column><span flex class=md-body-1>連絡先</span> <span flex class=md-body-3>{{deviceGroupData.telNo}}</span> <span flex class=md-body-3 ng-if=\"deviceGroupData.telNo == undefined\">-</span></div><md-button class=md-icon-button aria-label=More ng-click=telNoEdit($event)><md-icon><buttonpen></buttonpen></md-icon></md-button></div></md-card-content></md-card><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">アラート通知</h3></div><md-card><md-list-item class=md-secondary ng-repeat=\"item in sendto\" ng-click=false><p class=md-body-4>{{item.name}}</p><p class=\"md-body-1 mailId\">{{item.mailid}}</p><md-menu><md-button class=md-icon-button ng-click=$mdOpenMenu($event) aria-label=More><i class=material-icons>more_vert</i></md-button><md-menu-content><md-menu-item><md-button ng-click=mailAddressEdit($event,false) aria-label=\"Do something\">編集</md-button></md-menu-item><md-menu-item><md-button ng-click=mailAddressDelete() aria-label=\"Do something\">削除</md-button></md-menu-item></md-menu-content></md-menu></md-list-item><!--ボタン--><div layout><md-button flex class=\"md-accent md-button md-ink-ripple md-text-button-1\" type=button ng-click=alertSetting() ng-transclude=\"\"><div class=\"md-ripple-container md-ripple-container-1\">通知設定</div></md-button><md-button flex class=\"md-accent md-button md-ink-ripple md-text-button-2\" type=button ng-click=mailAddressAdd($event,true) ng-transclude=\"\"><div class=\"md-ripple-container md-ripple-container-2\">追加</div></md-button></div></md-card><footer class=footer></footer><script type=text/ng-template id=dialog1.tmpl.html><form name=\"dialog\">\n" +
    "  <md-dialog class=\"latlonEdit\">\n" +
    "    <md-dialog-content class=\"md-dialog-content\" role=\"document\" tabindex=\"-1\" id=\"dialogContent_2\">\n" +
    "      <h2 class=\"md-title ng-binding\">緯度・経度</h2>\n" +
    "      <div class=\"md-dialog-content-body ng-scope\">\n" +
    "       <p class=\"ng-binding\"></p>\n" +
    "     </div>\n" +
    "   <!--MAP-->\n" +
    "   <div class=\"map mapEdit\">\n" +
    "     <ui-gmap-google-map center=\"map.center\" zoom=\"map.zoom\" events=\"map.events\" draggable=\"true\" bounds=\"map.bounds\" control=\"map.control\">\n" +
    "       <ui-gmap-markers models=\"markers\" coords=\"'self'\" icon=\"'icon'\"></ui-gmap-markers>\n" +
    "     </ui-gmap-google-map>\n" +
    "   </div>\n" +
    "   <div class=\"md-body-1\">緯度 {{latitude}}</div>\n" +
    "   <div class=\"md-body-1\">経度 {{longitude}}</div>\n" +
    "   </md-dialog-content>\n" +
    "   <md-dialog-actions>\n" +
    "   <button class=\"md-primary md-cancel-button md-button ng-scope md-default-theme md-ink-ripple\" type=\"button\" ng-click=\"closeDialog()\" style=\"\">キャンセル</button>\n" +
    "   <button class=\"md-primary md-confirm-button md-button md-ink-ripple md-default-theme\" type=\"button\" ng-click=\"regist()\">登録</button>\n" +
    "   </md-dialog-actions>\n" +
    "   </md-dialog>\n" +
    "   </form></script></div>"
  );


  $templateCache.put('app/deviceUnit/envLog.html',
    "<div ng-controller=EnvLogCtrl ng-cloak=\"\" class=navBardemoBasicUsage><!--ヘッダー読み込み--><navitop></navitop><md-card><md-card-content><div ng-if=gType><img src=/assets/images/dummy_figure.png style=width:100%></div><div ng-if=!gType><img src=/assets/images/dummy_figure2.png style=width:100%></div><div layout layout-align=center><md-button class=\"md-accent md-button md-ink-ripple\" type=button ng-click=backtoList() ng-transclude=\"\"><div class=md-ripple-container>戻る</div></md-button></div></md-card-content></md-card></div><footer class=footer></footer>"
  );


  $templateCache.put('app/documents/documents.html',
    "<div ng-controller=DocumentsSettingCtrl ng-cloak=\"\" class=navBardemoBasicUsage><!--ヘッダー読み込み--><navitop></navitop><md-card><md-card-content><md-list-item ng-click=\"catalogDL('a')\"><p class=md-body-2>商品A　カタログ</p><buttondetail></buttondetail></md-list-item><md-list-item ng-click=\"catalogDL('b')\"><p class=md-body-2>商品B　カタログ</p><buttondetail></buttondetail></md-list-item></md-card-content></md-card></div><footer class=footer></footer>"
  );


  $templateCache.put('app/downloadCSV/downloadCsvItemSetting.html',
    "<div ng-controller=DownloadCsvItemSettingCtrl ng-cloak=\"\" class=navBardemoBasicUsage><!--ヘッダー読み込み--><navitop></navitop><!--エラーメッセージ--><div ng-show=error class=\"alert alert-danger\">{{error}}</div><div class=md-toolbar-tools><h3 class=\"ng-binding ng-isolate-scope\">CSVデータ設定</h3></div><md-card><!--開始期間--><md-card-content><md-input-container class=nito-datepicker><label>開始期間</label><md-datepicker ng-model=downloadStartDate></md-datepicker></md-input-container></md-card-content><!--終了期間--><md-card-content><md-input-container class=nito-datepicker><label>終了期間</label><md-datepicker ng-model=downloadEndDate></md-datepicker></md-input-container></md-card-content><!--デバイスセレクトボックス--><md-card-content><md-input-container class=md-block flex-gt-sm><label>デバイス</label><md-select ng-model=deviceList><md-option ng-repeat=\"item in deviceList\" value={{item.id}}>{{item.name}}</md-option></md-select></md-input-container></md-card-content><!--デバイスセレクトボックス--><!--ダウンロードデータセレクトボックス--><md-card-content><md-input-container class=md-block flex-gt-sm><label>ダウンロードデータ</label><md-select ng-model=selectItem><md-option ng-repeat=\"item in selectItems\" value={{item.value}}>{{item.label}}</md-option></md-select></md-input-container></md-card-content><md-card-content><!--ダウンロードボタン--><div layout layout-align=center><md-button class=\"md-accent md-button md-ink-ripple\" type=button ng-click=download() ng-transclude=\"\"><div class=md-ripple-container>ダウンロード</div></md-button></div></md-card-content></md-card></div><footer class=footer></footer>"
  );


  $templateCache.put('app/login/login.html',
    "<!--ログイン画面--><div ng-controller=LoginCtrl><div ng-show=error class=\"alert alert-danger\">{{error}}</div><md-card class=loginbar><div class=logoContent><img src=/assets/images/nito_logo.png><div class=md-body-8>ホームチェッカー</div></div></md-card><md-card class=loginContent><input type=hidden ng-value=user.query ng-init=\"user.query = getQuery()\"><div class=\"md-body-7 loginText\">Login</div><md-input-container class=md-block><label>ID</label><input ng-model=user.userId></md-input-container><md-input-container class=md-block><label>パスワード</label><input ng-model=user.password></md-input-container><div layout layout-align=center><md-button flex class=\"md-accent md-button md-ink-ripple md-text-button-2\" type=button ng-click=login() ng-transclude=\"\"><div class=\"md-ripple-container md-ripple-container-2\">ログイン</div></md-button></div></md-card><!-- <button class=\"btn btn-primary\" type=\"buttom\" ng-click=\"login()\">Login</button> --></div>"
  );


  $templateCache.put('components/modal/modal.html',
    "<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat=\"button in modal.buttons\" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>"
  );


  $templateCache.put('components/navbar/navbar.html',
    "<div class=\"navbar navbar-default navbar-static-top\" ng-controller=NavbarCtrl><!-- <div class=\"container\"> --><div><!-- <div class=\"navbar-header\">\n" +
    "      <div layout=\"colom\">\n" +
    "      <md-button class=\"md-icon-button md-primary humbergerMenu\" ng-click=\"toggleLeft()\" aria-label=\"Settings\">\n" +
    "        <i class=\"material-icons\">menu</i>\n" +
    "      </md-button>\n" +
    "      <div class=\"navbar-brand\">{{navtitle}}</div>\n" +
    "    </div>\n" +
    "    </div> --><md-toolbar class=md-hue-2><div class=\"md-toolbar-tools commonNavbar\"><!-- <md-button class=\"md-icon-button\" aria-label=\"Settings\" ng-disabled=\"true\">\n" +
    "          <md-icon md-svg-icon=\"img/icons/menu.svg\"></md-icon>\n" +
    "        </md-button> --><md-button class=\"md-icon-button md-primary humbergerMenu\" ng-click=toggleLeft() aria-label=Settings><!-- <i class=\"material-icons\">menu</i> --><svg width=24px height=24px viewbox=\"16 40 24 24\" version=1.1 xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink><!-- Generator: Sketch 42 (36781) - http://www.bohemiancoding.com/sketch --><desc>Created with Sketch.</desc><defs></defs><g id=Material/Icons-black/menu stroke=none fill=none opacity=0.54 transform=\"translate(16.000000, 40.000000)\" fill-rule=evenodd><path d=\"M3,18 L21,18 L21,16 L3,16 L3,18 L3,18 Z M3,13 L21,13 L21,11 L3,11 L3,13 L3,13 Z M3,6 L3,8 L21,8 L21,6 L3,6 L3,6 Z\" id=Shape fill=#000000></path></g></svg></md-button><h2 flex=\"\" md-truncate=\"\">{{navtitle}}</h2></div></md-toolbar></div></div><!---メニュー---><section layout=row flex=\"\"><md-sidenav class=md-sidenav-left md-component-id=left md-disable-backdrop=\"\" md-whiteframe=4><md-list-item class=md-3-line ng-repeat=\"item in menuItem\" ng-click=menuItemClick(item.url)><p class=md-body-4>{{item.label}}</p></md-list-item></md-sidenav></section>"
  );

}]);

