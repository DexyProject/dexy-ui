(function()
{
	'use strict';

	angular
		.module('dexyApp')
		.service('user', UserService)

	UserService.$inject = ['$rootScope']

	function UserService($scope)
	{
		var user = this
		
		// MEW default, also from the trezor examples
		user.HD_PATH = "m/44'/60'/0'/0";

		// Default: try metamask
		web3.eth.getAccounts(function(err, accounts) {
			if (err) {
				console.error(err)
				return
			}

			user.mode = 'metamask'
			user.publicAddr = accounts[0]
		})
	    // TODO: https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#best-practices-bowtie

		// On Trezor enabled
		user.onTrezorAddr = function(resp)
		{
			if (resp.success) {
				user.mode = 'trezor'
				user.publicAddr = '0x'+resp.address
				if (!$scope.$$phase) $scope.$apply()
			} else {
				console.log(resp)
				// TODO; notification?
			}
		}

		// maybe this can be sendTx instead of sign?
		// makes more sense with the web3 API
		user.sign = function(tx)
		{
			if (user.mode === 'trezor') {
				web3.eth.getTransactionCount(user.publicAddr, function(err, count) {
					// TODO: handle err
					console.log(count)

					// TODO; estimate gas
					TrezorConnect.ethereumSignTx(
					user.HD_PATH,
					'0'+count.toString(16),
					'0'+(4299515020).toString(16), // gas price
					'0'+(100*1000).toString(16), // gas limit
					user.publicAddr.slice(2), // to, w/o the 0x prefix TODO
					'00', // value TODO
					null, // data TODO
					1, // ETH
					function (response) {
						if (response.success) {
							console.log('Signature V (recovery parameter):', response.v); // number
							console.log('Signature R component:', response.r); // bytes
							console.log('Signature S component:', response.s); // bytes
						} else {
							console.error('Error:', response.error); // error message
						}

					})
				})

			} else {
				// normal mode
			}

		}
	

		return user
	}

})();