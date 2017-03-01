'use strict';

angular.module('nitoiotweb11App')
  .controller('NavbarCtrl',['$rootScope','$scope','$location','$mdSidenav',function ($rootScope,$scope, $location,$mdSidenav) {



    $scope.toggleLeft = buildToggler('left');

function buildToggler(componentId) {
  return function() {
    $mdSidenav(componentId).toggle();
  };
}





    // $scope.menu = [
    //   {'title': 'デバイス一覧画面',
    //    'link': '/'},
    //    {'title': 'デバイスグループ画面',
    //     'link': '/'},
    //     {'title': 'ダウンロードCSV',
    //      'link': '/'}
    //  ];

    // $scope.isCollapsed = true;

    // $scope.item.title = $rootScope.item.tile;
    // $scope.$on("navtitle", function (event, args) {
    //   cosole.log(args);
    //   $scope.navtitle = args;
    // });

    // $scope.isActive = function(route) {
    //   return route === $location.path();
    // };
  }]);
