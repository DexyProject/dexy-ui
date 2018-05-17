(function () {
    'use strict';

    var Buffer = require('buffer').Buffer
    var ethutil = require('ethereumjs-util')
    var BigNumber = require('bignumber.js')

    // constants
    var TOKEN_AMNT_DECIMALS = 6
    var ETH_AMNT_DECIMALS = 12

    // Take order ctrl

    angular
        .module('dexyApp')
        .controller('takeOrderCtrl', takeOrderCtrl);

    takeOrderCtrl.$inject = ['$scope', 'user'];

    function takeOrderCtrl($scope, user) {
        var exchange = $scope.exchange

        $scope.openTakeOrderDialog = function (side, order) {
            var rawOrder = order.rawOrder

            if (rawOrder.exchange !== cfg.exchangeContract) {
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
            var maxUserTokenAmnt = side === 'SELL' ?
                exchange.onExchangeTokenBaseUnit.dividedBy(exchange.tokenInf[1]).minus(exchange.onOrders.token)
                : user.ethBal.onExchangeBaseUnit.dividedBy(CONSTS.ETH_MUL).minus(exchange.onOrders.eth).dividedBy(order.rate)

            if (maxUserTokenAmnt.comparedTo(0) < 1) {
                toastr.error('Insufficient funds to take order')
                return
            }

            // order.amount is how much is left in token
            var tokenAmount = order.filledInToken.plus(order.amount)
            var maxCanFillInToken = BigNumber.min(maxUserTokenAmnt, order.amount)

            $scope.exchange.toFill = {
                order: order,
                side: side,
                maxCanFillInToken: maxCanFillInToken,
                tokenAmount: tokenAmount,

                // Mutable stuff
                portion: 1000,
            }
            // this will set tokenAmountStr and ethAmountStr
            $scope.recalcStrValues()

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

            var amnt = (rawOrder.take.token == CONSTS.ZEROADDR) ?
                new BigNumber(toFill.ethAmountStr).multipliedBy(CONSTS.ETH_MUL).integerValue()
                : new BigNumber(toFill.tokenAmountStr).multipliedBy(exchange.tokenInf[1]).integerValue()

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
                    var maxCanFillInToken = BigNumber.min(exchange.toFill.maxCanFillInToken, availableInToken)
                    exchange.toFill.maxCanFillInToken = maxCanFillInToken
                    $scope.recalcStrValues()
                    !$scope.$$phase && $scope.$digest()
                })
        }

        $scope.onPortionChanged = function() {
            $scope.recalcStrValues()
        }

        $scope.recalcStrValues = function() {
            var toFill = exchange.toFill
            var p = toFill.portion / 1000
            var maxCanFillInToken = toFill.maxCanFillInToken
            toFill.tokenAmountStr = maxCanFillInToken.multipliedBy(p).toFixed(TOKEN_AMNT_DECIMALS)
            toFill.ethAmountStr = maxCanFillInToken.multipliedBy(p).multipliedBy(toFill.order.rate).toFixed(ETH_AMNT_DECIMALS)
        }

        $scope.getSummary = function()
        {
            if (!exchange.toFill) return

            var p = exchange.toFill.portion / 1000
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
            + amnt.toFixed(TOKEN_AMNT_DECIMALS) + ' ' 
            + exchange.symbol + ' for ' + ethAmount.toFixed(ETH_AMNT_DECIMALS) + ' ETH'
            + '\n(Fee: '+
                (exchange.toFill.side == 'SELL' 
                    ? fee.toFixed(ETH_AMNT_DECIMALS)+' ETH'
                    : fee.toFixed(TOKEN_AMNT_DECIMALS)+' '+exchange.symbol
                )+')'

            return summary
        }
    }

})();
