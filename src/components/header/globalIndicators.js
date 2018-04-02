(function () {
    'use strict';

    angular
        .module('dexyApp')
        .controller('GlobalIndicatorsCtrl', GlobalIndicatorsCtrl);

    GlobalIndicatorsCtrl.$inject = ['$scope', '$state'];

    function GlobalIndicatorsCtrl($scope, $state) {
        $scope.$on('$stateChangeSuccess', function() {
            $scope.pair = $state.params.pair + ' / ETH'
        })
    }
})();
