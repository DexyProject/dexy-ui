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

            user.vaultContract.methods.isApproved(user.publicAddr, CONSTS.exchangeContract)
            .call(function (err, isApproved) {
                if (err) console.error(err)

                if (isApproved === false) $('#approveExchangeByVault').modal('show')
            })
        }

        exchange.approveExchangeByVault = function () {
            var tx = user.vaultContract.methods.approve(CONSTS.exchangeContract)

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