angular.module('dexyApp')
.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
	$urlRouterProvider.when('', '/').when('/', '/markets');

	$stateProvider.state({
		name: 'markets',
		url: '/markets',
		templateUrl: 'marketsTpl'
	})

	$stateProvider.state({
		name: 'exchange',
		url: '/exchange/:pair',
		params:{
			pair: null,
		},
		templateUrl: 'exchangeTpl'
	});


	$stateProvider.state({
		name: 'help',
		url: '/help',

	})
}]);
