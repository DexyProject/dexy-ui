angular.module('dexyApp')
.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
	$urlRouterProvider.when('', '/').when('/', '/markets');

	$stateProvider.state({
		name: 'markets',
		url: '/markets',
		views: {
			main: { templateUrl: 'marketsTpl' },
			indicators: { templateUrl: 'globalIndicatorsTpl' }
		}
	})

	$stateProvider.state({
		name: 'exchange',
		url: '/exchange/:pair',
		params:{
			pair: null,
		},
		views: {
			main: { templateUrl: 'exchangeTpl' },
			indicators: { templateUrl: 'exchangeIndicatorsTpl' }
		}
	});


	$stateProvider.state({
		name: 'help',
		url: '/help',

	})
}]);
