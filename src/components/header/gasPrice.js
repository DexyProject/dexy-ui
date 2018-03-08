(function () {
    'use strict';

    angular
        .module('dexyApp')
        .controller('GasPriceCtrl', GasPriceCtrl);

    GasPriceCtrl.$inject = ['$scope', 'gas'];

    function GasPriceCtrl($scope, gas) {
        $scope.gas = gas

        $scope.isSelected = function (level) {
            return $scope.$root.gas == gas.prices[level]
                && !(level != 'average' && gas.prices[level] == gas.prices['average'])
        }
    }
})();
