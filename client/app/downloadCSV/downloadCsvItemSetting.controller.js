
'use strict';

    angular.module('nitoiotweb11App')
    .controller('DownloadCsvItemSettingCtrl',['$rootScope','$routeParams','$scope','$http','$location','$window', function ($rootScope,$routeParams,$scope, $http, $location,$window) {

      //ヘッダータイトル
      $scope.navtitle="データダウンロード";

      //ダウンロードデータ
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
         }else{
           console.log(res);
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
    .config(function($mdDateLocaleProvider) {
  $mdDateLocaleProvider.formatDate = function(date) {
    return moment(date).format('YYYY/M/D');
  };
});;
