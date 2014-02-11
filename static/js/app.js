angular.module('loganApp', [
    'ngRoute',
    'loganControllers',
    'loganDirectives'
])

.config(['$locationProvider', function($location) {
    $location.html5Mode(true)
}])

.config(['$routeProvider', function($route) {
    $route
    .when('/', {
        templateUrl: '/static/templates/front.html',
        controller: 'loganFrontCtrl',
        action: 'front'
    })
    .when('/code', {
        templateUrl: '/static/templates/code.html',
        controller: 'loganCodeCtrl',
        action: 'code'
    })
    .when('/racing', {
        templateUrl: '/static/templates/racing.html',
        controller: 'loganRacingCtrl',
        action: 'racing'
    })
    .otherwise({
        redirectTo: '/'
    })
}])
