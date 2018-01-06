(function()
{
	'use strict';

	angular
		.module('dexyApp')
		.service('cmc', cmcService)

	cmcService.$inject = ['$rootScope', '$http', '$interval']

	function cmcService($scope, $http, $interval)
	{
		var cmc = this
		var URL = 'https://api.coinmarketcap.com/v1/ticker/ethereum' // ?limit=150
		var REFRESH_INTVL = 30*1000

		function update() {

			$http.get(URL)
			.then(function(resp) {
				console.log(resp)
			})
		}

		update()
		$interval(update, REFRESH_INTVL)


		return cmc
	}

})();