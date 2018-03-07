(function () {
    'use strict';

    // My orders ctrl
    angular
        .module('dexyApp')
        .controller('myOrdersCtrl', myOrdersCtrl);

    myOrdersCtrl.$inject = ['$scope', 'user'];

    function myOrdersCtrl($scope, user) {
        var exchange = $scope.exchange

        $scope.$watch(function() { return user.publicAddr }, fetchOrders)
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
                    eth: exchange.calculateOnOrders(exchange.orders, true),
                    token: exchange.calculateOnOrders(exchange.orders, false)
                }
                if (!$scope.$$phase) $scope.$digest()
            })
            .catch(function (err) {
                console.error(err)
            })
        }

        $scope.cancel = function (order) {
            var addresses = [order.user, order.give.token, order.get.token]
            var values = [order.give.amount, order.get.amount, order.expires, order.nonce]

            var sig = order.signature

            var tx = user.exchangeContract.methods.cancel(addresses, values, sig.v, sig.r, sig.s, sig.sig_mode)
            user.sendTx(tx, { from: user.publicAddr, gas: 70 * 1000, gasPrice: user.GAS_PRICE }, function (err, txid) {
                if (err) return $scope.exchange.txError('Error canceling order', err)

                if (txid) $scope.exchange.txSuccess(txid)
            })
        }
    }
})();