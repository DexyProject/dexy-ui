(function () {
    'use strict';

    // Wallet ctrl
    angular
        .module('dexyApp')
        .controller('vaultApprovalCtrl', vaultApprovalCtrl);

    vaultApprovalCtrl.$inject = ['$scope', 'user'];

    function vaultApprovalCtrl($scope, user) {
        // This variable will be false when we're sure it's not approved
        // It will become true either if it's approved (checkVaultApproval), or the tx to approve is sent
        $scope.exchange.isVaultApproved = true

        $scope.$watch(function () {
            return user.publicAddr
        }, checkVaultApproval)

        function checkVaultApproval() {
            if (!user.publicAddr) return

            user.vaultContract.methods.isApproved(user.publicAddr, cfg.exchangeContract)
                .call(function (err, isApproved) {
                    if (err) console.error(err)

                    $scope.exchange.isVaultApproved = isApproved
                })
        }

        $scope.getExchangeContract = function() {
            return cfg.exchangeContract
        }

        $scope.getExchangeContractUrl = function() {
            return cfg.etherscan + '/address/' + cfg.exchangeContract
        }

        $scope.approveExchangeByVault = function () {
            var tx = user.vaultContract.methods.approve(cfg.exchangeContract)

            $('#approveExchangeByVault').modal('hide')
            
            // @TODO: saner gas limit
            user.sendTx(tx, {from: user.publicAddr, gas: 60 * 1000, gasPrice: user.GAS_PRICE}, function (err, txid) {
                if (err) return $scope.exchange.txError('Vault approval failed', err)

                if (txid) {
                    $scope.exchange.isVaultApproved = true
                    $scope.exchange.txSuccess(txid)
                }
            })
        }
    }
})();