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
			TrezorConnect.ethereumGetAddress(
				user.HD_PATH+'/'+(parseInt(accountIdx) || 0), 
				user.onTrezorAddr
			)
		}
    }
})();