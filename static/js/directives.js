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

.directive('loganFixedAfterScroll',
    function($window) {
        return {
            restrict: 'A',
            link: function(scope, elems, attrs) {
                var windowElem = angular.element($window)
                scope.fixedAt = null
                windowElem.bind("scroll", function() {
                    var spos = $window.scrollY
                    if (scope.fixedAt == null) {
                        var pos = elems[0].getBoundingClientRect()
                        if (pos.top <= 0) {
                            scope.fixedAt = spos
                            angular.element(elems).addClass("fixed")
                        }
                    } else {
                        if (spos < scope.fixedAt) {
                            scope.fixedAt = null
                            angular.element(elems).removeClass("fixed")
                        }
                    }
                })
            }
        }
    })
