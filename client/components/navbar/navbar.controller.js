'use strict';

angular.module('nitoiotweb11App')
  .controller('NavbarCtrl',['$rootScope','$scope','$location','$mdSidenav',function ($rootScope,$scope, $location,$mdSidenav) {



    $scope.toggleLeft = buildToggler('left');

    //UC001
    //TODO USERID取れるようにする
    $scope.deviceList = function(){
       $location.path("/user_USER_ID");
     }

    //UC005
    //TODO USERID+deviceGroup取れるようにする
    $scope.deviceGroup = function(){
       $location.path("/user_USER_ID/group_GROUPID");
     }

     //UC002
     //TODO USERID+deviceGroup取れるようにする
     $scope.deviceDetail = function(){
        $location.path("/user_USER_ID/device_DEVICE_ID/");
      }

     //UC003
     //TODO USERID+deviceGroup取れるようにする
     $scope.deviceDetailData = function(){
        $location.path("/user_USER_ID/device_DEVICE_ID/YYYYMMDDHHMM");
      }

     //UC006
     //TODO USERID取れるようにする
     $scope.deviceEdit = function(){
        $location.path("/user_USER_ID/device_DEVICE_ID/edit/");
      }


     //UC007
     //TODO USERID取れるようにする
     $scope.alertSettingbyDevice = function(){
        $location.path("/user_USER_ID/device_DEVICE_ID/alert/");
      }

     //UC007
     //TODO USERID取れるようにする
     $scope.alertSettingbyGroup = function(){
        $location.path("/user_USER_ID/group_GROUP_ID/alert/");
      }


    //UC008
    //TODO USERID取れるようにする
    $scope.downloadCSV = function(){
       $location.path("/user_USER_ID/data/download/");
     }

     //ハンバーガメニューの押下でメニューを表示する。
    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

  }]);
