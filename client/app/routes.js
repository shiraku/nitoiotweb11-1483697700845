'use strict';

angular.module('nitoiotweb11App')
  .config(function ($routeProvider) {
    $routeProvider
      //UC000ログイン画面/Users/kazuysh/nitoiotweb11-1483697700845/client/app/routes.js
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



  });
