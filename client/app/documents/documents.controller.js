
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
