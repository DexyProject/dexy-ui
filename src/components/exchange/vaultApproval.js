(function () {
    'use strict';

    // Wallet ctrl
    angular
        .module('dexyApp')
        .controller('vaultApprovalCtrl', vaultApprovalCtrl);

    vaultApprovalCtrl.$inject = ['$scope', 'user'];

    function vaultApprovalCtrl($scope, user) {
        $scope.$watch(function () {
            return user.publicAddr
        }, checkVaultApproval)

        function checkVaultApproval() {
            if (!user.publicAddr) return

            user.vaultContract.methods.isApproved(user.publicAddr, cfg.exchangeContract)
                .call(function (err, isApproved) {
                    if (err) console.error(err)

                    if (isApproved === false) $('#approveExchangeByVault').modal('show')
                    if (isApproved === true) $('#approveExchangeByVault').modal('hide')
                })
        }

        exchange.approveExchangeByVault = function () {
            var tx = user.vaultContract.methods.approve(cfg.exchangeContract)

            // @TODO: saner gas limit
            user.sendTx(tx, {from: user.publicAddr, gas: 60 * 1000, gasPrice: user.GAS_PRICE}, function (err, txid) {
                if (err) return $scope.exchange.txError('Vault approval failed', err)

                if (txid) $scope.exchange.txSuccess(txid)

                $('#approveExchangeByVault').modal('hide')
            })
        }
    }
})();