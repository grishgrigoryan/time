/**
 * Created by Grigor on 11/5/15.
 */
angular
    .module('starterApp', ['ngMaterial','md.data.table', 'ngRoute','users','controllers'])
    .config(["$mdThemingProvider","$mdIconProvider","$routeProvider",function($mdThemingProvider, $mdIconProvider,$routeProvider){
        $mdThemingProvider.theme('default')
            .primaryPalette('light-blue')
            .accentPalette('red');
        $routeProvider.
            when('/active', {
                templateUrl: 'public/js/view/about.html',
                controller: 'AboutController'
            }).
            when('/dashboard', {
            templateUrl: 'public/js/view/dashboard.html',
                controller: 'DashboardController'
            }).
            otherwise({
                redirectTo: '/active'
            });

    }]);