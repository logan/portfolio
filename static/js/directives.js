angular.module('loganDirectives', [])

.directive('loganHeader',
    function($rootScope, $route) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: '/static/templates/header.html'
        }
    })

.directive('loganFooter',
    function($rootScope, $route) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: '/static/templates/footer.html'
        }
    })
