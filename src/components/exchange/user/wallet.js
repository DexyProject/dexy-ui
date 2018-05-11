(function () {
    'use strict';

    // Wallet ctrl
    angular
        .module('dexyApp')
        .controller('walletCtrl', walletCtrl);

    walletCtrl.$inject = ['$scope', 'user'];

    var BigNumber = require('bignumber.js')

    var GAS_ON_DEPOSIT = 200 * 1000

    function walletCtrl($scope, user) {
        var exchange = $scope.exchange

        // Amounts to move (deposit/withdraw)
        exchange.baseMove = {Deposit: 0, Withdraw: 0}
        exchange.quoteMove = {Deposit: 0, Withdraw: 0}

        // Move assets (deposit/withdraw)
        $scope.assetsMove = function (isBase, direction, floatAmount) {
            if (!user.publicAddr) {
                toastr.error('Please authenticate with Metamask, Trezor or Ledger')
                return
            }

            var addr = isBase ? CONSTS.ZEROADDR : exchange.tokenInf[0]

            // floatAmount is currently coming in as a String of the floating point amount
            var amnt = new BigNumber(floatAmount)

            // TODO: how to handle this? we need validation on that input field
            if (amnt.isNaN()) return

            amnt = amnt.multipliedBy(isBase ? CONSTS.ETH_MUL : exchange.tokenInf[1])

            var call
            var args

            if (direction === 'Deposit') {
                call = user.vaultContract.methods.deposit(addr, isBase ? 0 : amnt)
                args = {
                    from: user.publicAddr,
                    value: isBase ? amnt : 0,
                    gas: GAS_ON_DEPOSIT,
                    gasPrice: user.GAS_PRICE
                }
            } else if (direction === 'Withdraw') {
                call = user.vaultContract.methods.withdraw(addr, amnt)
                args = {from: user.publicAddr, gas: 160 * 1000, gasPrice: user.GAS_PRICE}
            }

            if (direction === 'Deposit' && !isBase) {
                // We have to set the allowance first

                var sendArgs = {from: user.publicAddr, gas: 100 * 1000, gasPrice: user.GAS_PRICE}
                
                if (exchange.rawAllowance.eq(amnt)) {
                    // Approved amount is already right
                    user.sendTx(call, args, finalCb)                    
                } else if (exchange.rawAllowance.eq(0)) {
                    // Directly approve
                    approveFinal()
                } else {
                    // First zero, then approve
                    user.sendTx(exchange.token.methods.approve(cfg.vaultContract, 0), sendArgs, approveFinal)
                }

                function approveFinal(err, txid) {
                    if (err) return onErr(err)
                    if (txid) exchange.txSuccess(txid)

                    user.sendTx(exchange.token.methods.approve(cfg.vaultContract, amnt), sendArgs, function (err, txid) {
                        if (err) return onErr(err)
                        if (txid) exchange.txSuccess(txid)
                        user.sendTx(call, args, finalCb)
                    })
                }
            } else {
                user.sendTx(call, args, finalCb)
            }

            function finalCb(err, txid) {
                if (err) return onErr(err)
                if (txid) exchange.txSuccess(txid)
            }

            function onErr(err) {
                exchange.txError('Deposit/withdraw failed', err)
            }
        }

        $scope.isValidAmnt = function (n, action, isBase) {
            var max = $scope.calcMax(action, isBase)
            return !isNaN(parseFloat(n)) && isFinite(n) && (n > 0) && n <= max
        }

        $scope.calcMax = function (action, isBase) {
            var max = 0
            
            if (!exchange.user) return 0

            if (action == 'Withdraw') {
                max = isBase ? exchange.user.ethBal.onExchange : exchange.onExchange
            }
            if (action == 'Deposit') {
                max = isBase ? exchange.user.ethBal.onWallet : exchange.onWallet
                
                // if in ETH, reduce the ETH fee
                if (isBase) max -= (user.GAS_PRICE * (GAS_ON_DEPOSIT+21000)) / CONSTS.ETH_MUL

                // because of the previous reduction, this can go under 0
                max = Math.max(0, max)
            }
            return max
        }

        $scope.calcMaxLabel = function (action, isBase) {
            return $scope.calcMax(action, isBase).toFixed(isBase ? 6 : 4) + ' ' + (isBase ? 'ETH' : exchange.symbol)
        }
    }
})();
