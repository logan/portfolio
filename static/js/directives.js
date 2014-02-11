angular.module('loganDirectives', [])

.directive('loganHeader',
    function($rootScope, $route, $window) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: '/static/templates/header.html',
            controller: function($scope, $rootScope) {
                $rootScope.$on('$routeChangeSuccess', function() {
                    var section = $route.current.templateUrl
                    $scope.isFront = (section == "/static/templates/front.html")
                    $scope.isCode = (section == "/static/templates/code.html")
                    $scope.isRacing = (section == "/static/templates/racing.html")
                    $scope.resume = function() { $window.location.href = "/resume.html" }
                })
            }
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
