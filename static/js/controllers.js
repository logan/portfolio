angular.module('loganControllers', [])

.controller('loganFrontCtrl',
    function($scope, $window, $templateCache, loganProjects) {
        // TODO: remove
        $templateCache.removeAll()

        $scope.resume = function() { $window.location.href = "/resume.html" }

        $scope.projects = loganProjects
    })

.controller('loganRacingCtrl',
    function($scope) {
    })

.controller('loganResumeCtrl',
    function($scope) {
    })

.controller('loganCodeCtrl',
    function($scope, $routeParams, loganProjects) {
        $scope.projects = loganProjects
        /*
        for (var i = 0; i < loganProjects.length; i++) {
            var proj = loganProjects[i]
            if (proj.title == $routeParams.project) {
                // TODO: scroll to this project
            }
        }
        */
    })
