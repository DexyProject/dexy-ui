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
                        asks: (ob.asks || []).map(exchange.mapOrder).sort(lowestToHighest),
                        bids: (ob.bids || []).map(exchange.mapOrder).sort(highestToLowest),
                    }
                    if (!$scope.$$phase) $scope.$digest()
                })
                .catch(function (err) {
                    toastr.error('Error loading order book')
                    console.error(err)
                })
        }

        function lowestToHighest(a, b){
            return a.rate.minus(b.rate).toNumber()
        }

        function highestToLowest(a, b) 
        {
            return b.rate.minus(a.rate).toNumber()
        }

        $scope.$on('reload-orders', function () {
            loadOb()
        })
    }
})();