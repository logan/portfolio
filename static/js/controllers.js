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
    function($scope, $anchorScroll, loganProjects) {
        $scope.projects = loganProjects
        $anchorScroll()
    })
