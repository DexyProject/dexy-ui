(function () {
    'use strict';

    // Place order ctrl

    var Buffer = require('buffer').Buffer

    // TEMP
    var endpoint = 'http://127.0.0.1:12312'

    angular
        .module('dexyApp')
        .controller('placeOrderCtrl', placeOrderCtrl);

    placeOrderCtrl.$inject = ['$scope', '$stateParams', 'user', 'LxNotificationService'];

    function placeOrderCtrl($scope, $stateParams, user, LxNotificationService) {
        // Orders
        $scope.orders = {
            SELL: {},
            BUY: {}
        }

        $scope.exchange.fillForOrder = function (side, order) {
            $scope.orders[side] = order
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

        $scope.$watch(function () { return $scope.orders.SELL }, refreshTotal, true)
        $scope.$watch(function () { return $scope.orders.BUY }, refreshTotal, true)

        function refreshTotal(order) {
            if (order.valid) order.total = order.amount * order.rate
        }

        $scope.placeOrder = function (order, type, symbol) {
            if (!user.publicAddr) {
                LxNotificationService.error('Please use Metamask, Trezor or Ledger to interact with Ethereum');
                return
            }

            var token = CONSTS.tokens[symbol]

            var amntUint = order.amount * token[1]
            var totalUint = order.rate * order.amount * Math.pow(10, 18)

            // hardcoded for now
            var expires = 20160

            var userAddr = user.publicAddr

            var tokenGet = 0
            var amountGet = 0
            var tokenGive = 0
            var amountGive = 0

            var nonce = Date.now()

            if (type === 'SELL') {
                tokenGive = amntUint
                amountGet = totalUint
            } else {
                tokenGet = amntUint
                amountGive = totalUint
            }

            // TODO
            var scAddr = '0x0000000000000000000000000000000000000000'

            //bytes32 hash = keccak256(tokenGet, amountGet, tokenGive, amountGive, expires, nonce, user, this);
            var hash = web3.utils.soliditySha3(tokenGet, amountGet, tokenGive, amountGive, expires, nonce, userAddr, scAddr)


            console.log(hash, web3.utils.toAscii(hash).length)
            // https://github.com/ethereum/web3.js/issues/392
            // https://github.com/MetaMask/metamask-extension/issues/1530
            // https://github.com/0xProject/0x.js/issues/162
            //  personal_sign
            var msg = "\x19Ethereum Signed Message:\n32" + web3.utils.toAscii(hash)
            web3.eth.personal.sign(msg, userAddr, function (err, sig) {
                // NOTE: TODO: shim fetch()?? safari?

                // strip the 0x
                sig = sig.slice(2)

                var r = '0x'+sig.substring(0, 64)
                var s = '0x'+sig.substring(64, 128)
                var v = parseInt(sig.substring(128, 130)) + 27

                console.log(r,s,v)


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
                    exchange: scAddr,
                    signature: { r: r, s: s, v: v }
                }
                fetch(endpoint+'/orders?token='+token[0], {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                })
                
            })

        }
    }

})();