(function () {
    'use strict';

    angular
        .module('dexyApp')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['$scope', '$state', '$rootScope', '$filter'];

    function SearchCtrl($scope, $state, $root, $filter) {
        $scope.searchKeyword = ''
        $scope.results = []

        var LIMIT = 10

        $scope.$watch(function() { return $root.searchKeyword }, function() {
            var isOkState = $state.current.name !== 'markets'

            $scope.showDropdown = $root.searchKeyword && isOkState
            if ($scope.showDropdown) {
                $scope.results = $filter('filter')($root.markets, $root.searchKeyword)
                    .slice(0, LIMIT)
            }
        })
        
    }
})();
