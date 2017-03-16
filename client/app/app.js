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
  .directive('buttonpen', function() {
  return {
    scope: true,
    restrict: 'E',
    template: '<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">'
              +'<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>'
              +'<path d="M0 0h24v24H0z" fill="none"/>'
              +'</svg>',
  };
})
.directive('buttontrashbox', function() {
return {
  scope: true,
  restrict: 'E',
  template: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'
            +'<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>'
            +'<path d="M0 0h24v24H0z" fill="none"/>'
            +'</svg>',
};
})
.directive('buttondetail', function() {
return {
  scope: true,
  restrict: 'E',
  template: '<defs></defs><svg width="24px" height="24px" viewBox="315 15 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
            +'<g id="Material/Icons-black/chevron-right" stroke="none" fill="none" transform="translate(315.000000, 15.000000)" fill-rule="evenodd">'
            +'<polygon id="Shape" fill="#D8001A" points="8.59997559 7.4 9.99997559 6 15.9999756 12 9.99997559 18 8.59997559 16.6 13.1999756 12"></polygon></g>'
            +'</svg>',
};
});
