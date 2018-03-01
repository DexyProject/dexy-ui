(function () {
    'use strict';

    // Place order ctrl

    angular
        .module('dexyApp')
        .controller('placeOrderCtrl', placeOrderCtrl);

    placeOrderCtrl.$inject = ['$scope', '$stateParams', 'user'];

    function placeOrderCtrl($scope, $stateParams, user) {
        // Orders
        $scope.orders = {
            SELL: {type: 'SELL'},
            BUY: {type: 'BUY'}
        }

        $scope.setAmount = function (order, part) {
            console.log(order, part)
            if (!order.rate) order.rate = 0.002; // TEMP, todo set to best ask/best bid
            if (order.type === 'BUY') order.amount = $scope.exchange.user.ethBal.onExchange * order.rate * part // TODO decimals
            else {
                // TODO
            }
        }

        $scope.$watch(function () {
            return $scope.orders
        }, function (orders) {
            $scope.orders.SELL.valid = isValidNumber(orders.SELL.rate) && isValidNumber(orders.SELL.amount) // && sufficient tokens
            $scope.orders.BUY.valid = isValidNumber(orders.BUY.rate) && isValidNumber(orders.BUY.amount) // && sufficient eth
        }, true)

        function isValidNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n) && (n > 0)
        }

        $scope.$watch(function () {
            return $scope.orders.SELL
        }, refreshTotal, true)

        $scope.$watch(function () {
            return $scope.orders.BUY
        }, refreshTotal, true)

        function refreshTotal(order) {
            if (order.valid) order.total = order.amount * order.rate
        }

        $scope.placeOrder = function (order, type, symbol) {
            if (!user.publicAddr) {
                toastr.error('Please use Metamask, Trezor or Ledger to interact with Ethereum');
                return
            }

            var token = $scope.exchange.tokenInf

            var tokenUint = parseInt(order.amount * token[1])
            var weiUint = parseInt(order.rate * order.amount * Math.pow(10, 18))

            // hardcoded for now
            var expires = Math.floor((Date.now() / 1000) + 432000)

            var userAddr = user.publicAddr

            var tokenGet, amountGet, tokenGive, amountGive

            var nonce = Date.now()

            if (type === 'SELL') {
                tokenGive = token[0]
                tokenGet = CONSTS.ZEROADDR
                amountGive = tokenUint
                amountGet = weiUint
            } else {
                tokenGive = CONSTS.ZEROADDR
                tokenGet = token[0]
                amountGive = weiUint
                amountGet = tokenUint
            }

            // keccak256(order.tokenGet, order.amountGet, order.tokenGive, order.amountGive, order.expires, order.nonce, order.user, this)
            var typed = [
                {type: 'address', name: 'Token Get', value: tokenGet},
                {type: 'uint', name: 'Amount Get', value: amountGet.toString()},
                {type: 'address', name: 'Token Give', value: tokenGive},
                {type: 'uint', name: 'Amount Give', value: amountGive.toString()},  // fails on this line

                {type: 'uint', name: 'Expires', value: expires},
                {type: 'uint', name: 'Nonce', value: nonce},
                {type: 'address', name: 'User', value: userAddr},
                {type: 'address', name: 'Exchange', value: $scope.exchangeAddr}
            ]

            user.signOrder(typed, userAddr, function (err, sig, sigMode) {
                if (err) {
                    console.error(err)
                    toastr.error('Signing failed')
                    return
                }

                // strip the 0x
                sig = sig.slice(2)

                var r = '0x' + sig.substring(0, 64)
                var s = '0x' + sig.substring(64, 128)
                var v = parseInt(sig.substring(128, 130), 16)

                var body = {
                    get: {
                        token: tokenGet,
                        amount: amountGet,
                    },
                    give: {
                        token: tokenGive,
                        amount: amountGive,
                    },
                    expires: expires,
                    nonce: nonce,
                    exchange: $scope.exchangeAddr,
                    user: user.publicAddr,
                    signature: {r: r, s: s, v: v, sig_mode: sigMode}
                }
                fetch(CONSTS.endpoint + '/orders', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                })
                .then(function () {
                    // re-load order book
                    $scope.$root.$broadcast('reload-orders')
                })
                .catch(function (err) {
                    console.error(err)
                    toastr.error('Error placing order')
                })

            })

        }
    }

})();
