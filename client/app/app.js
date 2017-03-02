'use strict';

angular.module('nitoiotweb11App', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngMaterial',
  'ngRoute',
  'ngAnimate',
  'ngAria',
  // 'angular',
  'ui.bootstrap'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when('/menu', {
      redirectTo: '/menu'
    })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  })
  .directive('navitop', function () {
      return {
          priority: 0,
          templateUrl: '../components/navbar/navbar.html',
          replace: false,
          transclude: false,
          restrict: 'E',
          scope: false,
          controller: 'NavbarCtrl'
          // ['$scope', '$route', '$location', function ($scope, $route, $location) {
          //     $scope.$on('$routeChangeSuccess', function () {
          //         var urlFlagments = $location.$$path.split("/");
          //         $scope.currentPage = urlFlagments[1];
          //     });
          // }]
      };
  });
