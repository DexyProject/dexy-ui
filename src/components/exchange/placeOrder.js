(function () {
    'use strict';

    // Place order ctrl

    var BigNumber = require('bignumber.js')

    angular
        .module('dexyApp')
        .controller('placeOrderCtrl', placeOrderCtrl);

    placeOrderCtrl.$inject = ['$scope', '$stateParams', 'user'];

    function placeOrderCtrl($scope, $stateParams, user) {
        // @TODO: consider BigNumber every time order.amount or order.rate is set

        var exchange = $scope.exchange

        $scope.orders = {
            SELL: {type: 'SELL'},
            BUY: {type: 'BUY'}
        }

        $scope.getBest = function() {
            return {
                ask: exchange.orderbook.asks[0],
                bid:  exchange.orderbook.bids[0]
            }
        }

        $scope.setToBest = function (side, order) {
            var best = $scope.getBest()

            if (side === 'BUY' && best.ask) {
                order.rate = best.ask.rate.toString(10)
            }
            if (side === 'SELL' && best.bid) {
                order.rate = best.bid.rate.toString(10)
            }
        }

        $scope.setAmount = function (order, part) {
            var best = $scope.getBest()

            var rate = new BigNumber(order.rate)
            if (rate.isNaN() || rate.comparedTo(0) === 0) {
                var bestOrder = best.bid || best.ask
                
                // no price or market price, can't do anything
                if (! bestOrder) return

                order.rate = bestOrder.rate.toString(10)
                rate = bestOrder.rate
            }

            if (order.type === 'BUY') {
                order.amount = user.ethBal.onExchangeBaseUnit.dividedBy(CONSTS.ETH_MUL)
                    .minus(exchange.onOrders.eth)
                    .dividedBy(rate)
                    .multipliedBy(part)
                order.amount = order.amount.decimalPlaces(4).toString(10)
            } 

            if (order.type === 'SELL') {
                order.amount = exchange.onExchangeTokenBaseUnit.dividedBy(exchange.tokenInf[1])
                    .minus(exchange.onOrders.token)
                    .multipliedBy(part)
                order.amount = order.amount.decimalPlaces(4).toString(10)
            }

        }

        $scope.showAvail = function (order) {
            if (!order) return
            if (!exchange.user) return
            
            var avail
            if (order.type === 'BUY') {
                avail = user.ethBal.onExchangeBaseUnit.dividedBy(CONSTS.ETH_MUL).minus(exchange.onOrders.eth)
                return 'Available: ' + avail.toFixed(6) + ' ETH'
            } else {
                avail = exchange.onExchangeTokenBaseUnit.dividedBy(exchange.tokenInf[1]).minus(exchange.onOrders.token)
                return 'Available: ' + avail.toFixed(3) + ' ' + exchange.symbol
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
            var amount = new BigNumber(order.amount)
            var rate = new BigNumber(order.rate)
            if (order.valid) order.total = amount.multipliedBy(rate).toFixed(6)
        }

        $scope.placeOrder = function (order, noConfirm) {
            if (!user.publicAddr) {
                toastr.error('Please use Metamask, Trezor or Ledger to interact with Ethereum');
                return
            }

            var rate = new BigNumber(order.rate)
            var amount = new BigNumber(order.amount)

            // Warn the user if the the order is not much in the user's benefit
            var best = $scope.getBest()
            var shouldWarnUser = 
                (order.type === 'SELL' && best.ask && rate.dividedBy(best.ask.rate).comparedTo(CONSTS.SELL_WARN_THRESHOLD) === -1)
                || (order.type === 'BUY' && best.bid && rate.dividedBy(best.bid.rate).comparedTo(CONSTS.BUY_WARN_THRESHOLD) === 1)

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

            var tokenUint = amount.multipliedBy(token[1]).integerValue()
            var weiUint = rate.multipliedBy(amount).multipliedBy(CONSTS.ETH_MUL).integerValue()

            // hardcoded for now
            var expires = Math.floor((Date.now() / 1000) + CONSTS.DEFAULT_ORDER_LIFETIME)

            var userAddr = user.publicAddr

            var takerToken, takerTokenAmount, makerToken, makerTokenAmount, availableAmnt

            var nonce = Date.now()

            if (order.type === 'SELL') {
                makerToken = token[0]
                takerToken = CONSTS.ZEROADDR
                makerTokenAmount = tokenUint
                takerTokenAmount = weiUint
                availableAmnt = exchange.onExchangeTokenBaseUnit.minus(exchange.onOrders.token.multipliedBy(exchange.tokenInf[1]))
            } else {
                makerToken = CONSTS.ZEROADDR
                takerToken = token[0]
                makerTokenAmount = weiUint
                takerTokenAmount = tokenUint
                availableAmnt = user.ethBal.onExchangeBaseUnit.minus(exchange.onOrders.eth.multipliedBy(CONSTS.ETH_MUL))
            }

            if (makerTokenAmount.comparedTo(availableAmnt) === 1) {
                toastr.error('Insufficient funds to place order')
                return
            }

            // keccak256(order.takerToken, order.takerTokenAmount, order.makerToken, order.makerTokenAmount, order.expires, order.nonce, order.maker, this)
            var typed = [
                {type: 'address', name: 'Taker Token', value: takerToken},
                {type: 'uint', name: 'Taker Token Amount', value: takerTokenAmount.toString(10)},
                {type: 'address', name: 'Maker Token', value: makerToken},
                {type: 'uint', name: 'Maker Token Amount', value: makerTokenAmount.toString(10)},

                {type: 'uint', name: 'Expires', value: expires},
                {type: 'uint', name: 'Nonce', value: nonce},
                {type: 'address', name: 'Maker', value: userAddr},
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
                    make: {
                        token: makerToken,
                        amount: makerTokenAmount.toString(10),
                    },
                    take: {
                        token: takerToken,
                        amount: takerTokenAmount.toString(10),
                    },
                    expires: expires,
                    nonce: nonce,
                    exchange: cfg.exchangeContract,
                    maker: user.publicAddr,
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
