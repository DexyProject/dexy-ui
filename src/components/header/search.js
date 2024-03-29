(function () {
    'use strict';

    angular
        .module('dexyApp')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['$scope', '$state', '$rootScope', '$filter', '$timeout'];

    // UX issues:
    // unable to navigate via keyboard
    // needs to disappear by itself
    function SearchCtrl($scope, $state, $root, $filter, $timeout) {
        $scope.searchKeyword = ''
        $scope.results = []

        $scope.showDropdown = false
        $scope.searchFocused = false

        var LIMIT = 10

        $scope.$watch(function() { return $root.searchKeyword }, function() {
            var isOkState = $state.current.name !== 'markets'

            if (web3.utils.isAddress($root.searchKeyword)) {
                $state.go('exchange', { pair: $root.searchKeyword })
                return
            }

            $scope.showDropdown = $root.searchKeyword && isOkState
            if ($scope.showDropdown) {
                $scope.results = $filter('filter')($root.markets, $root.searchKeyword)
                    .slice(0, LIMIT)
            }
        })

        $scope.clickedItem = function(item) {
            $state.go('exchange', { pair: item.symbol })
            $root.searchKeyword = ''
        }

        $scope.$on('$stateChangeSuccess', function() {
            $root.searchKeyword = ''
        })
    }
})();
