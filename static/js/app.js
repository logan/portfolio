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
        controller: 'loganFrontCtrl'
    })
    .when('/resume.html', {
        templateUrl: '/static/templates/resume.html',
        controller: 'loganResumeCtrl'
    })
    .otherwise({
        redirectTo: '/'
    })
}])
