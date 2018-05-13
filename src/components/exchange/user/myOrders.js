(function () {
    'use strict';

    var BigNumber = require('bignumber.js')

    // My orders ctrl
    angular
        .module('dexyApp')
        .controller('myOrdersCtrl', myOrdersCtrl);

    myOrdersCtrl.$inject = ['$scope', 'user'];

    function myOrdersCtrl($scope, user) {
        var exchange = $scope.exchange

        $scope.$on('reload-orders', fetchOrders)

        function fetchOrders() {
            if (!user.publicAddr) return
            if (!exchange.tokenInf) return

            fetch(cfg.endpoint + '/orders?token=' + exchange.tokenInf[0] + '&maker=' + user.publicAddr)
                .then(function (res) {
                    return res.json()
                })
                .then(function (ob) {
                    exchange.orders = (ob || []).map(exchange.mapOrder)
                    exchange.onOrders = {
                        eth: $scope.calculateOnOrders(exchange.orders, true),
                        token: $scope.calculateOnOrders(exchange.orders, false)
                    }
                    if (!$scope.$$phase) $scope.$digest()
                })
                .catch(function (err) {
                    console.error(err)
                })
        }

        $scope.cancel = function (rawOrder) {
            var addresses = [rawOrder.maker, rawOrder.make.token, rawOrder.take.token]
            var values = [rawOrder.make.amount, rawOrder.take.amount, rawOrder.expires, rawOrder.nonce]

            var tx = user.exchangeContract.methods.cancel(addresses, values)
            user.sendTx(tx, {from: user.publicAddr, gas: 70 * 1000, gasPrice: user.GAS_PRICE}, function (err, txid) {
                if (err) return $scope.exchange.txError('Error canceling order', err)

                if (txid) $scope.exchange.txSuccess(txid)
            })
        }

        // orders is usually exchange.orders, which is populated in myorders.js
        $scope.calculateOnOrders = function (orders, ethOrToken) {
            if (!Array.isArray(orders))
                return

            var total = orders.filter(function (x) {
                var givingEth = x.rawOrder.make.token === CONSTS.ZEROADDR
                return ethOrToken ? givingEth : !givingEth
            })
            .map(function (x) {
                return ethOrToken ? x.leftInEth : x.amount
            })
            .reduce(function (a, b) {
                return a.plus(b)
            }, new BigNumber(0))

            return total
        }
    }
})();