'use strict';

var staticWebsite;

angular.module('nitoiotweb11App')
    .controller('SampleCtrl', function ($scope, $http) {
        $scope.awesomeThings = [];

        $http.get('/api/things').success(function (livedata) {
            $scope.livedata = livedata;
        });

        $scope.features = staticWebsite.features;
        $scope.heading = staticWebsite.heading;
        $scope.tagline = staticWebsite.tagline;

        /* to be used later
         $scope.addThing = function() {
         if($scope.newThing === '') {
         return;
         }
         $http.post('/api/things', { name: $scope.newThing });
         $scope.newThing = '';
         };

         $scope.deleteThing = function(thing) {
         $http.delete('/api/things/' + thing._id);
         };*/
    })
    .controller('AppCtrl', ['$scope', '$mdSidenav', function ($scope, $mdSidenav) {
        $scope.toggleSidenav = function (menuId) {
            $mdSidenav(menuId).toggle();
        };
    }]);

staticWebsite = {
    'heading': 'generate',
    'tagline': 'Kick-start a materialized Angular app, with  Bluemix runtime and services',
    'features': [
        {
            'key': '0',
            'name': 'Scaffold Bluemix services',
            'info': 'Single-sign-on, Cloudant, BigData, are scaffolded to Express framework, via generators. '
        }, {
            'key': '1',
            'name': 'Built with Angular, Node, Express',
            'info': 'Built with a fullstack: Cloudant, Express, AngularJS, and NodeJS; along Karma unit test.'
        }, {
            'key': '2',
            'name': 'Optimized responsive design',
            'info': 'Built with mobile-first/responsive web design, Bootstrap; added with Material Design.'
        }, {
            'key': '3',
            'name': 'Modular structure',
            'info': 'Best practice client and server structures, with scaffolding api; ideal for complex project.'
        }, {
            'key': '4',
            'name': 'Optimized production build',
            'info': 'Automated build process optimizes, minimizes & cdnifies your scripts/css/icon/images.'
        }, {
            'key': '5',
            'name': 'Deployment ready for Bluemix',
            'info': 'Create a small-size, production-grade, and deployment-ready build for IBM Bluemix.'
        }
    ]
};
