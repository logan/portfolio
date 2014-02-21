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

.directive('loganImage',
    function() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                'src': '@'
            },
            templateUrl: '/static/templates/image.html',
            controller: function($scope) {
                $scope.loaded = false
                $scope.loading = false
                $scope.fetch = function() {
                    $scope.loading = true
                    var img = new Image()
                    img.src = $scope.src
                    img.onload = function() {
                        $scope.loaded = true
                        $scope.loading = false
                        $scope.$apply()
                    }
                }
            }
        }
    })

.directive('loganCarousel',
    function($window) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                autocycle: '=',
                href: '@',
            },
            transclude: true,
            templateUrl: '/static/templates/carousel.html',
            link: function(scope, elems, attr) {
                var elem = elems[0]
                elem.style.position = 'relative'
                var width = elem.style.offsetWidth

                var divs = elems.find('div')
                var images = []
                var scopes = []
                for (var i = 0; i < divs.length; i++) {
                    var e = angular.element(divs[i])
                    if (e.hasClass('image')) {
                        images.push(divs[i])
                        var img = e.find('img')
                        scopes.push(img.scope())
                    }
                }

                // start fetching the first image
                scopes[0].fetch()

                for (var i = 0; i < images.length; i++) {
                    angular.element(images[i]).addClass('hidden')
                }

                var current = -1
                function cycleTo(idx) {
                    angular.element(images[idx]).removeClass('hidden')
                    if (current >= 0) {
                        var e = angular.element(images[current])
                        e.addClass('hidden-transit')
                        $window.setTimeout(function() {
                                e.addClass('hidden')
                                e.removeClass('hidden-transit')
                            }, 1000)
                    }
                    current = idx
                }

                function autocycle() {
                    var idx = current + 1
                    if (idx >= images.length) {
                        idx = 0
                    }
                    // TODO: wait for image to be loaded
                    cycleTo(idx)
                    // TODO: make delay configurable
                    $window.setTimeout(autocycle, 5000)

                    var next = (idx + 1) % images.length
                    if (!scopes[next].loaded && !scopes[next].loading) {
                        scopes[next].fetch()
                    }
                }
                
                autocycle()

                scope.click = function() {
                    if (scope.href) {
                        $window.location.href = scope.href
                    }
                }
            }
        }
    })
