var app = angular.module('dexyApp', ['lumx', 'ui.router'])

// Constants
app.run(['$rootScope', '$state', function($rootScope, $state) {
	$rootScope.tabs = [
		{ name: 'Markets', route: 'markets' },
		{ name: 'Wallets', route: 'wallets' }
	]

}])
// TODO split in routes.js
.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
	$urlRouterProvider.when('', '/').when('/', '/markets');

	$stateProvider.state({
		name: 'markets',
		url: '/markets',
		sticky: true,
		views: {
			'view': { templateUrl: 'marketsTpl' }
		}
	});

	$stateProvider.state({
		name: 'wallets',
		url: '/wallets',

	})
}]);

// ...