(function () {
    'use strict';

    // Place order ctrl

    angular
        .module('dexyApp')
        .controller('placeOrderCtrl', placeOrderCtrl);

    placeOrderCtrl.$inject = ['$scope', '$stateParams', 'user'];

    function placeOrderCtrl($scope, $stateParams, user) {
        // Orders
        var exchange = $scope.exchange

        $scope.orders = {
            SELL: {type: 'SELL'},
            BUY: {type: 'BUY'}
        }

        $scope.getBest = function() {
            // @TODO: @NOTE: should we assume asks/bids is sorted here

            return {
                ask: exchange.orderbook.asks[exchange.orderbook.asks.length - 1],
                bid:  exchange.orderbook.bids[0]
            }
        }

        $scope.setToBest = function (side, order) {
            var best = $scope.getBest()

            if (side === 'BUY' && best.ask) {
                order.rate = best.ask.rate
            }
            if (side === 'SELL' && best.bid) {
                order.rate = best.bid.rate
            }
        }

        $scope.setAmount = function (order, part) {
            var best = $scope.getBest()

            if (order.type === 'BUY') {
                order.rate = order.rate || (best.ask && best.ask.rate)
                order.amount = ((exchange.user.ethBal.onExchange - exchange.onOrders.eth) / order.rate) * part
            } else {
                order.rate = order.rate || (best.bid && best.bid.rate)
                order.amount = (exchange.onExchange - exchange.onOrders.token) * part
            }

            order.amount = parseInt(order.amount * 10000) / 10000
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
            if (order.valid) order.total = parseFloat((order.amount * order.rate).toFixed(6))
        }

        $scope.placeOrder = function (order, noConfirm) {
            if (!user.publicAddr) {
                toastr.error('Please use Metamask, Trezor or Ledger to interact with Ethereum');
                return
            }

            // Warn the user if the the order is not much in the user's benefit
            var best = $scope.getBest()
            var shouldWarnUser = 
                (order.type === 'SELL' && best.ask && order.rate/best.ask.rate < CONSTS.SELL_WARN_THRESHOLD)
                || (order.type === 'BUY' && best.bid && order.rate/best.bid.rate > CONSTS.BUY_WARN_THRESHOLD)

            if (shouldWarnUser && !noConfirm) {
                $('#placeOrderConfirm').modal('show')

                $scope.placeOrderConfirm = function() {
                    $('#placeOrderConfirm').modal('hide')
                    $scope.placeOrder(order, true)
                }
                return
            }

            // Calculate all the values needed to place the order
            var token = exchange.tokenInf

            var tokenUint = parseInt(order.amount * token[1])
            var weiUint = parseInt(order.rate * order.amount * Math.pow(10, 18))

            // hardcoded for now
            // 5 days
            var expires = Math.floor((Date.now() / 1000) + 432000)

            var userAddr = user.publicAddr

            var tokenGet, amountGet, tokenGive, amountGive, availableAmnt

            var nonce = Date.now()

            if (order.type === 'SELL') {
                tokenGive = token[0]
                tokenGet = CONSTS.ZEROADDR
                amountGive = tokenUint
                amountGet = weiUint
                availableAmnt = (exchange.onExchange - exchange.onOrders.token) * exchange.tokenInf[1]
            } else {
                tokenGive = CONSTS.ZEROADDR
                tokenGet = token[0]
                amountGive = weiUint
                amountGet = tokenUint
                availableAmnt = (user.ethBal.onExchange - exchange.onOrders.eth) * CONSTS.ETH_MUL
            }

            if (amountGive > availableAmnt) {
                toastr.error('Insufficient balance to place order')
                return
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
                {type: 'address', name: 'Exchange', value: cfg.exchangeContract}
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
                    exchange: cfg.exchangeContract,
                    user: user.publicAddr,
                    signature: {r: r, s: s, v: v, sig_mode: sigMode}
                }
                fetch(cfg.endpoint + '/orders', {
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
