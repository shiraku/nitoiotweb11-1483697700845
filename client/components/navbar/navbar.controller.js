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

    // $rootScope.$on('userInfo', function(event, args) {
    //         $scope.userId = args[0];
    //       });
      // $scope.userId = UserInfo.id;

      //TODO userIdを取得する
    $scope.menuItem = [
      {
        label : "デバイスグループ",
        url : "/user_u000/group"//"/user_"+$routeParams.USER_ID+"/device_"+this.item.deviceId
      },
      {
        label : "デバイス一覧",
        url : "/user_u000"//"/user_"+$routeParams.USER_ID+"/device_"+this.item.deviceId
      },
      {
        label : "CSVダウンロード",
        url : "/user_u000/data/download"//"/user_"+$routeParams.USER_ID+"/device_"+this.item.deviceId
      }
    ]


  }]);
