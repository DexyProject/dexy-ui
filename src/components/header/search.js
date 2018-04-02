(function () {
    'use strict';

    angular
        .module('dexyApp')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['$scope', '$state', '$rootScope', '$filter', '$timeout'];

    function SearchCtrl($scope, $state, $root, $filter, $timeout) {
        $scope.searchKeyword = ''
        $scope.results = []

        $scope.showDropdown = false
        $scope.searchFocused = false

        var LIMIT = 10

        $scope.$watch(function() { return $root.searchKeyword }, function() {
            var isOkState = $state.current.name !== 'markets'

            $scope.showDropdown = $root.searchKeyword && isOkState
            if ($scope.showDropdown) {
                $scope.results = $filter('filter')($root.markets, $root.searchKeyword)
                    .slice(0, LIMIT)
            }
        })

        // This is horrible, but unfortunately we need it because otherwise 
        // ui-sref would not register the onclick since we will hide the bar before
        $scope.onBlur = function() {
            $timeout(function() {
                $scope.searchFocused = false
            }, 200)
        }

        $scope.$on('$stateChangeSuccess', function() {
            $root.searchKeyword = ''
        })
    }
})();
