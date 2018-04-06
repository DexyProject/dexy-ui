(function () {
    'use strict';

    angular
        .module('dexyApp')
        .controller('GlobalIndicatorsCtrl', GlobalIndicatorsCtrl);

    GlobalIndicatorsCtrl.$inject = ['$scope', '$state'];

    function GlobalIndicatorsCtrl($scope, $state) {
        $scope.$on('$stateChangeSuccess', function() {
            // @TODO: currently pair is only the quote token, 
            $scope.symbol = $state.params.pair
        })
    }
})();
