angular.module('loganDirectives', [])

.directive('loganHeader',
    function($rootScope, $route, $routeParams, loganProjects) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: '/static/templates/header.html',
            controller: function($scope) {
                $rootScope.$on('$routeChangeSuccess', function() {
                    var section = $route.current.templateUrl
                    $scope.isFront = (section == "/static/templates/front.html")
                    $scope.isCode = (section == "/static/templates/code.html")
                    $scope.isRacing = (section == "/static/templates/racing.html")
                    for (var i = 0; i < loganProjects.length; i++) {
                        var pName = loganProjects[i].title
                        pName = pName[0].toUpperCase() + pName.slice(1)
                        $scope['isCode' + pName] = loganProjects[i].title == $routeParams.project
                    }
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
    function($window, $rootScope) {
        return {
            scope: {},
            restrict: 'A',
            link: function(scope, elems, attrs) {
                if ($rootScope.loganScrollWatchers === undefined) {
                    var windowElem = angular.element($window)
                    $rootScope.loganScrollWatchers = []
                    windowElem.bind("scroll", function() {
                        for (var i = 0; i < $rootScope.loganScrollWatchers.length; i++) {
                            $rootScope.loganScrollWatchers[i]($window.scrollY)
                        }
                    })
                }

                scope.fixedAt = null
                $rootScope.loganScrollWatchers.push(function(spos) {
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

.directive('loganProject',
    function($location) {
        return {
            restrict: 'E',
            scope: {
                'project': '=',
                'collapsed': '=',
            },
            transclude: true,
            templateUrl: '/static/templates/project.html',
            controller: function($scope) {
                var proj = $scope.project

                $scope.title = proj.title
                $scope.icon = proj.title + ".svg"
                $scope.summary = proj.summary
                $scope.src = proj.src
                $scope.site = proj.site

                $scope.load = function() {
                    if (!$scope.collapsed) {
                        return
                    }
                    $location.path('/code/' + $scope.title)
                }
            }
        }
    })
