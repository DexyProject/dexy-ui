(function () {
    'use strict';

    // My orders ctrl
    angular
        .module('dexyApp')
        .controller('myOrdersCtrl', myOrdersCtrl);

    myOrdersCtrl.$inject = ['$scope', 'user'];

    function myOrdersCtrl($scope, user) {
        var exchange = $scope.exchange

        $scope.$watch(function () {
            return user.publicAddr
        }, fetchOrders)
        $scope.$on('reload-orders', fetchOrders)

        function fetchOrders() {
            if (!user.publicAddr) return

            fetch(cfg.endpoint + '/orders?token=' + exchange.tokenInf[0] + '&user=' + user.publicAddr)
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

        $scope.cancel = function (order) {
            var addresses = [order.user, order.make.token, order.take.token]
            var values = [order.make.amount, order.take.amount, order.expires, order.nonce]

            var sig = order.signature

            var tx = user.exchangeContract.methods.cancel(addresses, values, sig.v, sig.r, sig.s, sig.sig_mode)
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
                var givingEth = x.order.make.token === CONSTS.ZEROADDR
                return ethOrToken ? givingEth : !givingEth
            })
            .map(function (x) {
                return ethOrToken ? x.leftInEth : x.amount
            })
            .reduce(function (a, b) {
                return a + b
            }, 0)

            return total
        }
    }
})();