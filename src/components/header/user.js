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

		$scope.selected = { address: 0 }


		$scope.enableTrezor = function(accountIdx)
		{
			// NOTE: this callback will only be called on success
			// Errors will be reported through the user service
			user.getTrezorAddresses(function(addresses) {
				$scope.addresses = addresses
				LxDialogService.open('trezorAccPick')
			})
		}
	}
})();