(function () {
    'use strict';

    // Orderbook ctrl
    angular
        .module('dexyApp')
        .controller('orderbookCtrl', orderbookCtrl);

    orderbookCtrl.$inject = ['$scope', '$stateParams'];

    function orderbookCtrl($scope, $stateParams) {
        // @TODO: update tick

        var exchange = $scope.exchange

        function loadOb() {
            fetch(cfg.endpoint + "/orderbook?token=" + exchange.tokenInf[0])
            .then(function (res) {
                return res.json()
            })
            .then(function (ob) {
                exchange.orderbook = {
                    bids: (ob.bids || []).map(exchange.mapOrder),
                    asks: (ob.asks || []).map(exchange.mapOrder),
                }
                if (!$scope.$$phase) $scope.$digest()
            })
            .catch(function (err) {
                toastr.error('Error loading order book')
                console.error(err)
            })
        }

        $scope.$on('reload-orders', function() {
            loadOb()
        })
    }
})();