
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DownloadCsvItemSettingCtrl',['$rootScope','$routeParams','$scope','$http','$location', function ($rootScope,$routeParams,$scope, $http, $location) {

      //ヘッダータイトル
      $scope.navtitle="データダウンロード";

      //デバイスグループデータ
      $scope.selectItems = [
                { 'value':1,
                  'label':'地震発生データ',
                },
                { 'value':2,
                  'label':'AQデータ',
                },
                { 'value':3,
                  'label':'ALデータ',
                },
                { 'value':4,
                  'label':'AFデータ',
                },
                { 'value':5,
                  'label':'雷発生データ',
                },
                { 'value':6,
                  'label':'ユーザー一覧(デバイス一覧)',
                }
            ];

      $scope.selectItem = 1;


      //TODO APIでCSVダウンロードできるように変更
      //ダウンロードボタンアクション
     $scope.download = function(){


     }



    }]);
