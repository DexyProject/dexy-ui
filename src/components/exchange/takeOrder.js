(function () {
    'use strict';

    var Buffer = require('buffer').Buffer
    var ethutil = require('ethereumjs-util')

    // Take order ctrl

    angular
        .module('dexyApp')
        .controller('takeOrderCtrl', takeOrderCtrl);

    takeOrderCtrl.$inject = ['$scope', 'user'];

    function takeOrderCtrl($scope, user) {
        var exchange = $scope.exchange

        $scope.openTakeOrderDialog = function (side, order) {
            if (order.order.exchange !== cfg.exchangeContract) {
                toastr.error('Order exchange address different than ours')
                return
            }

            if (!user.publicAddr) {
                toastr.error('Please authenticate with Metamask/Trezor/Ledger before trading')
                return
            }
            
            if (!exchange.isVaultApproved) {
                toastr.error('Please approve the vault before trading')
                return
            }

            // max amount of token that the user can take with their funds
            // order.amount is how much is left in token
            var maxUserAmnt = side === 'SELL' ?
                (exchange.onExchange - exchange.onOrders.token)
                : (user.ethBal.onExchange - exchange.onOrders.eth) / order.rate

            if (maxUserAmnt <= 0) {
                toastr.error('Insufficient funds to take order')
                return
            }

            var tokenAmount = order.filledInToken + order.amount
            var maxCanFillInToken = Math.min(maxUserAmnt, order.amount)
            var maxPortion = Math.floor(maxCanFillInToken / tokenAmount * 1000)

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
            var rawOrder = toFill.order.order

            // addresses - user, tokenGive, tokenGet
            var addresses = [rawOrder.maker, rawOrder.make.token, rawOrder.take.token]
            var values = [rawOrder.make.amount, rawOrder.take.amount, rawOrder.expires, rawOrder.nonce]

            // portion is calculated in terms of portion from what CAN be filled
            // maxCanFillInToken is used in the UI to calculate it
            var portion = toFill.portion / 1000

            var totalCanTake = parseInt(rawOrder.take.amount, 10) * toFill.maxCanFillInToken / toFill.tokenAmount
            var amnt = Math.floor(portion * totalCanTake).toString()

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

                    var rawOrder = exchange.toFill.order.order
                    var tokenBase = exchange.tokenInf[1]

                    // divide by this to make it into a token amount
                    var divider = rawOrder.take.token == CONSTS.ZEROADDR ? exchange.toFill.order.rate : 1

                    var availableInToken = (parseInt(resp, 10) / divider) / tokenBase
                    exchange.toFill.maxCanFillInToken = Math.min(exchange.toFill.maxCanFillInToken, availableInToken)
                    !$scope.$$phase && $scope.$digest()
                })
        }

        $scope.getSummary = function()
        {
            if (!exchange.toFill) return

            var p = exchange.toFill.portion/1000
            var amnt = exchange.toFill.maxCanFillInToken * p
            var ethAmount  = amnt * exchange.toFill.order.rate
            var feePortion = cfg.exchangeFee/100

            if (feePortion) {
                if (exchange.toFill.side === 'SELL') ethAmount -= ethAmount * feePortion
                else amnt -= amnt * feePortion
            }

            var summary = (exchange.toFill.side == 'SELL' ? 'Selling' : 'Buying') + ' ' 
            + amnt.toFixed(4) + ' ' 
            + exchange.symbol + ' for ' + ethAmount.toFixed(6) + ' ETH'
            + '\n(Fee: '+
                (exchange.toFill.side == 'SELL' 
                    ? (ethAmount*feePortion.toFixed(12))+' ETH'
                    : (amnt * feePortion).toFixed(6)+' '+exchange.symbol
                )+')'

            return summary
        }
    }

})();
