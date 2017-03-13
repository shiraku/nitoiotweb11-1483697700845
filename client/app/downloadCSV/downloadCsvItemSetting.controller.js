
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DownloadCsvItemSettingCtrl',['$rootScope','$routeParams','$scope','$http','$location', function ($rootScope,$routeParams,$scope, $http, $location) {

      //ヘッダータイトル
      $scope.navtitle="データダウンロード";

      //デバイスグループデータ
      $scope.selectItem = [
                { 'id':'001',
                  'label':'地震発生データ',
                },
                { 'id':'002',
                  'label':'AQデータ',
                },
                { 'id':'001',
                  'label':'ALデータ',
                },
                { 'id':'002',
                  'label':'AFデータ',
                },
                { 'id':'002',
                  'label':'雷発生データ',
                },
                { 'id':'001',
                  'label':'ユーザー一覧(デバイス一覧)',
                }
            ];


      //TODO APIでCSVダウンロードできるように変更
      //ダウンロードボタンアクション
     $scope.download = function(){


     }



    }]);
