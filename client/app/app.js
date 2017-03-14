'use strict';

angular.module('nitoiotweb11App', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngMaterial',
  'ngRoute',
  'ngAnimate',
  'ngAria',
  'ngMessages',
  'ui.bootstrap',
  'uiGmapgoogle-maps',
  'googlechart'
  // "googlechart-docs"
  // 'material.svgAssetsCache'

])
  .config(function ($routeProvider, $locationProvider) {
    //$mdDialog
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
      };
  })
  .directive('editIcon', function () {
      return {
          priority: 0,
          template: '<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">'
                    +'<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>'
                    +'<path d="M0 0h24v24H0z" fill="none"/>'
                    +'</svg>',
          replace: false,
          transclude: false,
          restrict: 'E',
          scope: false//,
    //       controller: ['$scope', function($scope){ // Controller定義
    // }]
      };
  });
