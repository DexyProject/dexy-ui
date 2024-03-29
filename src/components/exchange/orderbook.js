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
                    
                    // temporary hack because of the way ng-repeat works (even with 'track by')
                    exchange.orderbook.asksHighestToLowest = exchange.orderbook.asks.reverse()

                    if (!$scope.$$phase) $scope.$digest()
                })
                .catch(function (err) {
                    toastr.error('Error loading order book')
                    console.error(err)
                })
        }

        function lowestToHighest(a, b){
            return a.rate.comparedTo(b.rate)
        }

        function highestToLowest(a, b) 
        {
            return b.rate.comparedTo(a.rate)
        }

        $scope.$on('reload-orders', function () {
            loadOb()
        })
    }
})();