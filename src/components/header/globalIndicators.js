(function () {
    'use strict';

    angular
        .module('dexyApp')
        .controller('GlobalIndicatorsCtrl', GlobalIndicatorsCtrl);

    GlobalIndicatorsCtrl.$inject = ['$scope', '$state', 'cmc', 'gas'];

    function GlobalIndicatorsCtrl($scope, $state, cmc, gas) {
        $scope.cmc = cmc
        $scope.gas = gas
    }
})();
