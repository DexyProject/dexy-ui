(function()
{
	'use strict';

	angular
		.module('dexyApp')
		.controller('UserCtrl', UserCtrl);

	UserCtrl.$inject = ['$scope', 'user'];

	function UserCtrl($scope, user)
	{
		$scope.user = user


		$scope.enableTrezor = function(accountIdx)
		{
			// TODO show modal 

			// NOTE: this callback will only be called on success
			// Errors will be reported through the user service
			user.getTrezorAddresses(function(addresses) {
				// TODO show modal

				console.log(addresses)

				// user.setAccount() ? or just user.publicAddr = ...
				user.onTrezorAddr(addresses[0])
			})
		}
	}
})();