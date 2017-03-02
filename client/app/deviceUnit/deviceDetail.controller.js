
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DeviceDetailCtrl',['$rootScope','$routeParams','$scope','$http','$location', function ($rootScope,$routeParams,$scope, $http, $location) {


      //TODO APIでデータ取得をする
      $scope.deviceDetail = [
        {
          'deviceName':'デバイス１',
          'responsiblePerson':'小林　武',
          'telNo':'000-0000-0000',
          'address':'愛知県長久手市蟹原2201番地',
          'memo':'本社横の倉庫',
          'earthquakeCurrentData':[      {
                     'deviceId':'dev002',
                     'deviceName': 'デバイス２',
                     'responsiblePerson': '',
                     'telNo': '111-1111-1111',
                     'statusFlg':'1',
                     'status':'????',
                     'type':'earthquake',
                     'seismicIntensity':'5.4',
                     'slope':'倒壊',
                     'leakage':'なし',
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
                     'JapanMeteorologicalAgency':'4',
                     'LongPeriodSeismicActivityClass':'3'
               }],
            'thunderCurrentData':[
                 {
                      'deviceId':'dev002',
                      'deviceName': 'デバイス２',
                      'responsiblePerson': '',
                      'telNo': '111-1111-1111',
                      'statusFlg':'1',
                      'status':'????',
                      'type':'earthquake',
                      'seismicIntensity':'5.4',
                      'slope':'倒壊',
                      'leakage':'なし',
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
                      'JapanMeteorologicalAgency':'4',
                      'LongPeriodSeismicActivityClass':'3'
                }
            ],
            'earthquakeHistoryList':[
              {
                "device_id":"00000",
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
            'thunderHistoryList':[
              {
                "device_id":"00000",
                "data":[
                  {"date_id":"20161025160205",
                  "date":"2016/10/25 16:02:05",
                  "datas":[{
                    "value":2,
                    "name":"雷レベル"
                  }]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
                  {"date_id":"20160830030221","date":"2016/08/30 03:02:21","datas":[{"value":3,"name":"雷レベル"}]}]}

            ]
      }
      ];

        //ヘッダータイトル
        $scope.navtitle=$scope.deviceDetail[0].deviceName;


        $scope.earthquakeHistoryViews = 10; // 地震情報表示する件数(初期表示件数を指定)
        $scope.thunderHistoryViews = 10; //　雷情報表示する件数(初期表示件数を指定)
        $scope.nextView = 10; // 地震&雷情報もっと見るをクリックしたときに表示する数

        // 地震情報もっと見るクリック時
        $scope.earthquakeHistoryMoreClick = function () {
            $scope.moreCount++;
            $scope.earthquakeHistoryViews = $scope.earthquakeHistoryViews + $scope.nextView;
        };

        // 雷情報もっと見るクリック時
        $scope.thunderHistoryMoreClick = function () {
            $scope.moreCount++;
            $scope.thunderHistoryViews = $scope.thunderHistoryViews + $scope.nextView;
        };

       $scope.deviceDetailData = function(){
         $location.path("/user_"+$routeParams.USER_ID+"/device_"+$routeParams.DEVICE_ID+"/"+this.item.date_id);
       }

    }]);
