(function () {
    'use strict';

    // Wallet ctrl
    angular
        .module('dexyApp')
        .controller('vaultApprovalCtrl', vaultApprovalCtrl);

    vaultApprovalCtrl.$inject = ['$scope', 'user'];

    function vaultApprovalCtrl($scope, user) {
        $scope.$watch(function () { return user.publicAddr }, checkVaultApproval)

        function checkVaultApproval() {
            if (!user.publicAddr) return

            console.log(user.publicAddr, cfg.exchangeContract)
            user.vaultContract.methods.isApproved(user.publicAddr, cfg.exchangeContract)
            .call(function (err, isApproved) {
                if (err) console.error(err)

                if (isApproved === false) $('#approveExchangeByVault').modal('show')
            })
        }

        exchange.approveExchangeByVault = function () {
            var tx = user.vaultContract.methods.approve(cfg.exchangeContract)

            // @TODO: saner gas limit
            user.sendTx(tx, {from: user.publicAddr, gas: 100 * 1000, gasPrice: user.GAS_PRICE}, function (err, txid) {
                // @OTODO: handle errors
                console.log(err, txid)

                if (txid) toastr.success('Successfully submitted transaction: ' + txid)

                $('#approveExchangeByVault').modal('hide')
            })
        }
    }
})();