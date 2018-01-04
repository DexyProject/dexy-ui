(function()
{
    'use strict';

    angular
        .module('dexyApp')
        .controller('marketCtrl', marketCtrl);

    marketCtrl.$inject = ['$scope', '$stateParams'];

    function marketCtrl($scope, $stateParams)
    {
        var exchange = this;


        exchange.pair = $stateParams.pair
    }
})();