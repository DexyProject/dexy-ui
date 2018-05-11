(function () {
    'use strict';

    var Buffer = require('buffer').Buffer
    var ethutil = require('ethereumjs-util')
    var BigNumber = require('bignumber.js')

    // Take order ctrl

    angular
        .module('dexyApp')
        .controller('takeOrderCtrl', takeOrderCtrl);

    takeOrderCtrl.$inject = ['$scope', 'user'];

    function takeOrderCtrl($scope, user) {
        var exchange = $scope.exchange

        $scope.openTakeOrderDialog = function (side, order) {
            if (order.rawOrder.exchange !== cfg.exchangeContract) {
                toastr.error('Order exchange address different than ours')
                return
            }

            // max amount of token that the user can take with their funds
            var maxUserAmnt = side === 'SELL' ?
                (exchange.onExchange - exchange.onOrders.token)
                : (user.ethBal.onExchange - exchange.onOrders.eth) / order.rate

            if (maxUserAmnt <= 0) {
                toastr.error('Insufficient funds to take order')
                return
            }

            // order.amount is how much is left in token
            var tokenAmount = order.filledInToken.plus(order.amount)
            var maxCanFillInToken = BigNumber.min(maxUserAmnt, order.amount)

            $scope.exchange.toFill = {
                order: order,
                maxCanFillInToken: maxCanFillInToken,
                tokenAmount: tokenAmount,
                portion: 1000,
                side: side,
            }
            $('#takeOrder').modal('show')
        }   

        // @TODO: this does not belong here; as well as the splitting
        $scope.getSigBuf = function(sig) {
            var r = ethutil.toBuffer(sig.r)
            var s = ethutil.toBuffer(sig.s)
            var v = ethutil.toBuffer(sig.v)
            var mode = ethutil.toBuffer(sig.sig_mode)
            return '0x' + Buffer.concat([mode, v, r, s]).toString('hex')
        }

        $scope.getArgs = function (toFill) {
            var rawOrder = toFill.order.rawOrder

            // addresses - user, tokenGive, tokenGet
            var addresses = [rawOrder.maker, rawOrder.make.token, rawOrder.take.token]
            var values = [rawOrder.make.amount, rawOrder.take.amount, rawOrder.expires, rawOrder.nonce]

            // portion is calculated in terms of portion from what CAN be filled
            // maxCanFillInToken is used in the UI to calculate it

            // toFill.portion is always an integer from 0 to 1000
            var portion = toFill.portion / 1000

            var orderTakeAmount = new BigNumber(rawOrder.take.amount, 10)
            var totalCanTake = orderTakeAmount.multipliedBy(toFill.maxCanFillInToken).dividedBy(toFill.tokenAmount)
            var amnt = totalCanTake.multipliedBy(portion).integerValue()

            var sig = rawOrder.signature

            return [addresses, values, $scope.getSigBuf(rawOrder.signature), amnt]
        }

        $scope.takeOrder = function (toFill) {
            // NOTE: this has to be executed in the same tick as the click, otherwise trezor popups will be blocked
            var tx = user.exchangeContract.methods.trade.apply(null, $scope.getArgs(toFill))

            user.sendTx(tx, {from: user.publicAddr, gas: 150 * 1000, gasPrice: user.GAS_PRICE}, function (err, txid) {
                if (err) return $scope.exchange.txError('Error taking order', err)

                $('#takeOrder').modal('hide')
                if (txid) $scope.exchange.txSuccess(txid)
            })
        }

        // will only get triggered when the reference to the object changes
        var debouncedUpdate
        $scope.$watch(function() { 
            if (!$scope.exchange.toFill) return null
            return $scope.exchange.toFill 
        }, function() {
            $scope.updateCanTrade()
        })
        
        $scope.updateCanTrade = function() {
            if (!$scope.exchange.toFill) return

            // @TODO: call isApproved before that, and if it's not, make the user wait. or say "you cannot submit an order yet", same goes for filling
            // NOTE: this has to be shown upon opening the dialog; so the things that getAddresses, values, and amount, should be functions
            var args = $scope.getArgs($scope.exchange.toFill)
            user.exchangeContract.methods.canTrade.apply(null, [args[0], args[1], args[2]])
                .call(function (err, resp) {
                    if (!exchange.toFill) return

                    if (err) {
                        toastr.error('Error getting order canTrade status')
                        return
                    }
                    
                    exchange.toFill.canTrade = resp

                    !$scope.$$phase && $scope.$digest()

                    if (resp === false) {
                        console.log('Cannot trade order', $scope.exchange.toFill.order, args)

                        toastr.error('Cannot trade order: it is expired, filled or the signature is invalid')
                    }
                })

            user.exchangeContract.methods.availableAmount.apply(null, [args[0], args[1]])
                .call(function (err, resp) {
                    if (!exchange.toFill) return

                    var rawOrder = exchange.toFill.order.rawOrder
                    var tokenBase = exchange.tokenInf[1]

                    // divide by this to make it into a token amount
                    var divider = rawOrder.take.token == CONSTS.ZEROADDR ? exchange.toFill.order.rate : 1

                    var availableInToken = new BigNumber(resp).dividedBy(divider).dividedBy(tokenBase)
                    exchange.toFill.maxCanFillInToken = BigNumber.min(exchange.toFill.maxCanFillInToken, availableInToken)
                    !$scope.$$phase && $scope.$digest()
                })
        }

        $scope.getSummary = function()
        {
            if (!exchange.toFill) return

            var p = exchange.toFill.portion/1000
            var amnt = exchange.toFill.maxCanFillInToken.multipliedBy(p)
            var ethAmount  = amnt.multipliedBy(exchange.toFill.order.rate)

            var fee = new BigNumber(0)

            if (cfg.exchangeFee) {
                if (exchange.toFill.side === 'SELL') {
                    fee = ethAmount.multipliedBy(cfg.exchangeFee).dividedBy(100)
                    ethAmount = ethAmount.minus(fee)
                }
                else {
                    fee = amnt.multipliedBy(cfg.exchangeFee).dividedBy(100)
                    amnt = amnt.minus(fee)
                }
            }

            var summary = (exchange.toFill.side == 'SELL' ? 'Selling' : 'Buying') + ' ' 
            + amnt.toFixed(4) + ' ' 
            + exchange.symbol + ' for ' + ethAmount.toFixed(6) + ' ETH'
            + '\n(Fee: '+
                (exchange.toFill.side == 'SELL' 
                    ? fee.toFixed(12)+' ETH'
                    : fee.toFixed(6)+' '+exchange.symbol
                )+')'

            return summary
        }
    }

})();
