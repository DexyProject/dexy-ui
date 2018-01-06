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

		// Configurable things
		user.GAS_PRICE = 30099515020 // 30 gwei

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
				user.handleTrezorErr(resp)
			}
		}

		user.sendTx = function(tx)
		{
			// TODO
			var GAS_LIM = 100 * 1000 

			if (user.mode === 'trezor') {
				web3.eth.getTransactionCount(user.publicAddr, function(err, count) {
					// TODO: handle err
					console.log(count)

					// TODO; estimate gas
					TrezorConnect.ethereumSignTx(
					user.HD_PATH,
					'0'+count.toString(16),
					'0'+user.GAS_PRICE.toString(16), // gas price
					'0'+GAS_LIM.toString(16), // gas limit
					user.publicAddr.slice(2), // to, w/o the 0x prefix TODO
					'00', // value TODO
					null, // data TODO
					1, // ETH chain
					function (response) {
						if (response.success) {
							console.log('Signature V (recovery parameter):', response.v); // number
							console.log('Signature R component:', response.r); // bytes
							console.log('Signature S component:', response.s); // bytes
						} else {
							user.handleTrezorErr(response)
						}

					})
				})

			} else {
				// normal mode
				tx.send({ from: user.publicAddr, gas: GAS_LIM, gasPrice: user.GAS_PRICE })
				// TODO handle resuls
			}

		}

		user.handleTrezorErr = function(resp)
		{
			// TODO  make this visual
			console.error('Error:', resp.error); // error message
		}
	

		return user
	}

})();