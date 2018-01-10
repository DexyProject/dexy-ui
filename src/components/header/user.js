(function()
{
	'use strict';

	angular
		.module('dexyApp')
		.controller('UserCtrl', UserCtrl);

	UserCtrl.$inject = ['$scope', 'user', 'LxDialogService'];

	function UserCtrl($scope, user, LxDialogService)
	{
		$scope.user = user

		$scope.selected = { 
			address: 0,
			hdWallet: '' // trezor or ledger
		}


		$scope.enableTrezor = function(accountIdx)
		{
			// NOTE: this callback will only be called on success
			// Errors will be reported through the user service
			user.getTrezorAddresses($scope.onAddresses, 'trezor')
		}

		
		// basically should follow the same logic as enableTrezor
		// ledger-eth and ledger3 need to be imported
		$scope.enableLedger = function() 
		{
			user.getLedgerAddresses($scope.onAddresses, 'ledger')
		}

		$scope.onAddresses = function(addresses, hdWallet) {
			$scope.selected.hdWallet = hdWallet

			$scope.addresses = addresses.map(function(x) {
				return { addr: x, bal: '...' }
			})

			// refresh balances
			$scope.addresses.forEach(function(addr) {
				web3.eth.getBalance(addr.addr).then(function(bal) {
					addr.bal = (bal/Math.pow(10,18)).toFixed(6)
					if (!$scope.$$phase) $scope.$digest()
				})
			})

			LxDialogService.open('trezorAccPick')
		}
		
	}
})();