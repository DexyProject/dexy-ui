(function () {
    'use strict';

    angular
        .module('dexyApp')
        .controller('UserCtrl', UserCtrl);

    UserCtrl.$inject = ['$scope', 'user'];

    function UserCtrl($scope, user) {
        $scope.user = user

        $scope.selected = {
            idx: 0,
            hdWallet: '' // trezor or ledger
        }

        $scope.enableMetamask = function () {
            user.setMetamask()
        }

        $scope.enableTrezor = function (accountIdx) {
            // NOTE: this callback will only be called on success
            // Errors will be reported through the user service
            user.getTrezorAddresses($scope.onAddresses.bind(null, 'trezor'))
        }


        // basically should follow the same logic as enableTrezor
        // ledger-eth and ledger3 need to be imported
        $scope.enableLedger = function () {
            user.getLedgerAddresses($scope.onAddresses.bind(null, 'ledger'))
        }

        $scope.onAddresses = function (hdWallet, addresses) {
            $scope.selected.hdWallet = hdWallet

            $scope.addresses = addresses.map(function (x, i) {
                return {addr: x, idx: i, bal: '...'}
            })

            // refresh balances
            var multiplier = 1000000000000000000 // 10**18

            var batch = new web3.eth.BatchRequest()

            $scope.addresses.forEach(function (addr) {
                batch.add(web3.eth.getBalance.request(addr.addr, function (err, bal) {
                    addr.bal = bal / multiplier
                    if (!$scope.$$phase) $scope.$digest()
                }))
            })

            batch.execute()

            $('#hwWalletChooseAcc').modal('show')
        }

    }
})();
