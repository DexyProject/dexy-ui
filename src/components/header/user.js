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
                return { addr: x, idx: i, bal: '...' }
            })

            // refresh balances
            var multiplier = CONSTS.ETH_MUL

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

        $scope.onHDWalletAddr = function (address, type, idx) {
            $('#hwWalletChooseAcc').modal('hide')
            toastr.success((type === 'trezor' ? 'Trezor' : 'Ledger') + ': imported address')

            user.onHDWalletAddr(address, type, idx)
        }

        // https://github.com/kvhnuke/etherwallet/blob/904d7a0e702c756bbbd8594381c8980f05ed3d5d/app/scripts/nodes.js
        $scope.getNetworkName = function (chainId) {
            if (chainId == 1) return 'Ethereum Mainnet'
            if (chainId == 61) return 'Ethereum Classic'
            if (chainId === 3) return 'Ethereum Ropsten'
            if (chainId == 42) return 'Ethereum Kovan'
            if (chainId == 4) return 'Ethereum Rinkeby'
            if (chainId == 2) return 'Expanse'
            if (chainId == 8) return 'Ubiq'
            // no RSK
        }
    }
})();
