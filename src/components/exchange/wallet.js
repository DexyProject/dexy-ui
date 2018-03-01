(function () {
    'use strict';

    // Wallet ctrl
    angular
        .module('dexyApp')
        .controller('walletCtrl', walletCtrl);

    walletCtrl.$inject = ['$scope', 'user'];

    function walletCtrl($scope, user) {
        var exchange = $scope.exchange

        // Amounts to move (deposit/withdraw)
        exchange.baseMove = {Deposit: 0, Withdraw: 0}
        exchange.quoteMove = {Deposit: 0, Withdraw: 0}

        // Move assets (deposit/withdraw)
        // TODO: moveAssets.js
        exchange.assetsMove = function (isBase, direction, amnt) {
            if (!user.publicAddr) {
                toastr.error('Please authenticate with Metamask, Trezor or Ledger')
                return
            }

            var addr = isBase ? CONSTS.ZEROADDR : exchange.tokenInf[0]
            var amnt = parseInt(parseFloat(amnt) * (isBase ? 1000000000000000000 : exchange.tokenInf[1]))

            var call
            var args

            // TODO: how to handle this? we need validation on that input field
            if (isNaN(amnt)) return

            if (direction === 'Deposit') {
                call = user.vaultContract.methods.deposit(addr, isBase ? 0 : amnt)
                args = {
                    from: user.publicAddr,
                    value: isBase ? amnt : 0,
                    gas: 130000, gasPrice: user.GAS_PRICE
                }
            } else if (direction === 'Withdraw') {
                call = user.vaultContract.methods.withdraw(addr, amnt)
                args = {from: user.publicAddr, gas: 100000, gasPrice: user.GAS_PRICE}
            }

            if (direction === 'Deposit' && !isBase) {
                // We have to set the allowance first

                var sendArgs = {from: user.publicAddr, gas: 60000, gasPrice: user.GAS_PRICE}
                if (exchange.rawAllowance == 0) {
                    // Directly approve
                    approveFinal()
                } else {
                    // First zero, then approve
                    user.sendTx(exchange.token.methods.approve(CONSTS.vaultContract, 0), sendArgs, approveFinal)
                }

                function approveFinal(err) {
                    if (err) return onErr(err)

                    user.sendTx(exchange.token.methods.approve(CONSTS.vaultContract, amnt), sendArgs, function () {
                        user.sendTx(call, args, finalCb)
                    })
                }
            } else {
                user.sendTx(call, args, finalCb)
            }

            function finalCb(err, txid) {
                if (err) return onErr(err)
                if (txid) toastr.success('Successfully submitted transaction: ' + txid)
            }

            function onErr(err) {
                // TODO
                console.error(err)
                toastr.error('Deposit/withdraw failed')
            }
        }

        exchange.isValidAmnt = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n) && (n > 0)
        }
    }
})();