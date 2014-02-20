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
    .when('/code/:project', {
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

.factory('loganProjects',
    function() {
        return [
            {   "title": "ibis",
                "summary": "cassandra/cql helper for go",
                "src": "github.com/logan/ibis" },

            {   "title": "tallier",
                "summary": "realtime stats collection",
                "src": "github.com/reddit/tallier" },

            {   "title": "sandblaster",
                "summary": "falling sand toy for android",
                "src": "github.com/logan/sandblaster" },

            {   "title": "iq",
                "summary": "online quote database",
                "src": "github.com/logan/iq" }
        ]
    })
