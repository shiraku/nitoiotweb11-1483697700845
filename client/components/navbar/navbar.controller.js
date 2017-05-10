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
    var userID = document.cookie.split( '; ' )[ 1 ].split( '=' )[ 1 ];


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
