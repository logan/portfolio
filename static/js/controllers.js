angular.module('loganControllers', [])

.controller('loganFrontCtrl',
    function($scope, $window) {
        $scope.resume = function() { $window.location.href = "/resume.html" }
    })

.controller('loganCodeCtrl',
    function($scope) {
    })

.controller('loganRacingCtrl',
    function($scope) {
    })

.controller('loganResumeCtrl',
    function($scope) {
    })
