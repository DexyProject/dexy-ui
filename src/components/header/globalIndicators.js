(function () {
    'use strict';

    angular
        .module('dexyApp')
        .controller('GlobalIndicatorsCtrl', GlobalIndicatorsCtrl);

    GlobalIndicatorsCtrl.$inject = ['$scope', '$state'];

    function GlobalIndicatorsCtrl($scope, $state) {
        // @TODO: volume, price, 24hr high, 24hr low
    }
})();
