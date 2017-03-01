'use strict';

angular.module('nitoiotweb11App')
  .config(function ($routeProvider) {
    $routeProvider
      //UC000ログイン画面
      .when('/', {
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'
      })
      //UC000ログイン画面
      .when('/login', {
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'
      })
      // //UC001	メニュー画面
      // .when('/menu', {
      //   templateUrl: 'app/menu/menu.html',
      //   controller: 'MenuCtrl'
      // })
      // //UC002	デバイス一覧画面
      // // .when('/device', {
      // //   templateUrl: 'app/device/deviceList.html',
      // //   controller: 'DeviceListCtrl'
      // // })
      // //UC003	一覧グラフ画面
      // .when('/device/deviceGraph', {
      //   templateUrl: 'app/device/deviceGraph.html',
      //   controller: 'DeviceGraphListCtrl'
      // })
      // //UC004	一覧マップ画面
      // .when('/device/deviceMap', {
      //   templateUrl: 'app/device/deviceMap.html',
      //   controller: 'DeviceMapCtrl'
      // })
      // //UC005	デバイス詳細画面
      // .when('/device/deviceDetail', {
      //   templateUrl: 'app/device/deviceDetail.html',
      //   controller: 'DeviceDetailCtrl'
      // })
      // //UC006	デバイスマップ
      // .when('/device/deviceDetail/deviceDetailMap', {
      //   templateUrl: 'app/device/deviceDetailMap.html',
      //   controller: 'DeviceDetailMapCtrl'
      // })
      // //UC007	デバイスグラフ
      // .when('/device/deviceDetail/deviceDetailGraph', {
      //   templateUrl: 'app/device/deviceDetailGraph.html',
      //   controller: 'DeviceDetailGraphCtrl'
      // })
      // //UC009	デバイスグループ画面
      // .when('/deviceManagement', {
      //   templateUrl: 'app/device/deviceGroup.html',
      //   controller: 'DeviceGroupCtrl'
      // })
      // //UC010	グループ名編集画面
      // .when('/deviceManagement/deviceNameEdit', {
      //   templateUrl: 'app/deviceManagement/deviceNameEdit.html',
      //   controller: 'DeviceNameEditCtrl'
      // })
      // // //UC011	デバイス情報編集画面
      // // .when('/deviceManagement/deviceInfoEdit', {
      // //   templateUrl: 'app/deviceManagement/deviceInfoEdit.html',
      // //   controller: 'DeviceInfroEditCtrl'
      // // })
      // //UC012	緯度経度入力補完マップ（モーダル）
      // .when('/deviceManagement/latLonInputMap', {
      //   templateUrl: 'app/deviceManagement/latLonInputMap.html',
      //   controller: 'LatLonInputMapCtrl'
      // })
      // //UC015	メール送信者追加画面
      // .when('/deviceManagement/mailSenderAdd', {
      //   templateUrl: 'app/deviceManagement/mailSenderAdd.html',
      //   controller: 'MailSenderAddCtrl'
      // })
      // //UC016	メール送信者編集画面
      // .when('/deviceManagement/mailSenderEdit', {
      //   templateUrl: 'app/deviceManagement/mailSenderEdit.html',
      //   controller: 'MailSenderEditCtrl'
      // })
      // //UC017	メール送信者削除（モーダル）
      // .when('/deviceManagement/mailSenderDelete', {
      //   templateUrl: 'app/deviceManagement/mailSenderDelete.html',
      //   controller: 'MailSenderDeleteCtrl'
      // })
      // //UC018	アラート設定画面
      // .when('/deviceManagement/alertSetting', {
      //   templateUrl: 'app/deviceManagement/alertSetting.html',
      //   controller: 'MailSenderDeleteCtrl'
      // })
      // //UC019	ダウンロードCSV項目設定画面
      // .when('/downloadCSV', {
      //   templateUrl: 'app/downloadCSV/downloadCsvItemSetting.html',
      //   controller: 'DownloadCsvItemSettingCtrl'
      // })



//  UC001	デバイス一覧画面				/user_:USER_ID
.when('/user_:USER_ID', {
  templateUrl: 'app/device/deviceList.html',
  controller: 'DeviceListCtrl'
})
//  UC002	デバイス詳細					/user_:USER_ID/device_:DEVICE_ID
.when('/user_:USER_ID/device_:DEVICE_ID', {
  templateUrl: 'app/device/deviceDetail.html',
  controller: 'DeviceDetailCtrl'
})
//  UC003	デバイス詳細　データ				/user_:USER_ID/device_:DEVICE_ID/:YYYYMMDDHHMM
.when('/user_:USER_ID/device_:DEVICE_ID/:YYYYMMDDHHMM', {
  templateUrl: 'app/device/deviceDetailData.html',
  controller: 'DeviceDetailDataCtrl'
})
//  UC005	デバイスグループ画面				/user_:USER_ID/group_:GROUP_ID
.when('/user_:USER_ID/group_:GROUP_ID', {
  templateUrl: 'app/deviceManagement/deviceGroup.html',
  controller: 'DeviceGroupCtrl'
})
//  UC006	デバイス情報編集画面				/user_:USER_ID/device_:DEVICE_ID/edit
.when('/user_:USER_ID/device_:DEVICE_ID/edit', {
  templateUrl: 'app/deviceManagement/deviceInfoEdit.html',
  controller: 'DeviceInfoEditCtrl'
})
//  UC007	アラート設定画面(デバイスごと）	/user_:USER_ID/device_:DEVICE_ID/alert
.when('/user_:USER_ID/device_:DEVICE_ID/alert', {
  templateUrl: 'app/deviceManagement/alertSettingForDevice.html',
  controller: 'AlertSettingForDeviceCtrl'
})
//  UC007	アラート設定画面（グループ）		/user_:USER_ID/group_:GROUP_ID/alert
.when('/user_:USER_ID/group_:GROUP_ID/alert', {
  templateUrl: 'app/deviceManagement/alertSettingForGroup.html',
  controller: 'AlertSettingForGroupCtrl'
})
//  UC008	ダウンロードCSV項目設定画面		/user_:USER_ID/data/download
.when('/user_:USER_ID/data/download', {
  templateUrl: 'app/downloadCSV/downloadCsvItemSetting.html',
  controller: 'DownloadCsvItemSettingCtrl'
})



  });
