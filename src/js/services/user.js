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

			user.publicAddr = accounts[0]
		})
	    // TODO: https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#best-practices-bowtie

		// On Trezor enabled
		user.onTrezorAddr = function(resp)
		{
			if (resp.success) {
				user.publicAddr = '0x'+resp.address
				if (!$scope.$$phase) $scope.$apply()
			} else {
				console.log(resp)
				// TODO; notification?
			}
		}
	

		return user
	}

})();