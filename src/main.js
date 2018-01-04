var app = angular.module('dexyApp', ['lumx', 'ui.router'])

// Constants
app.run(['$rootScope', '$state', function($rootScope, $state) {
	var tabs = [
		{ name: 'Markets', route: 'markets' },
		{ name: 'Wallets', route: 'wallets' },
		{ name: 'Help', route: 'help' }
	]
	var routes = tabs.map(function(x) { return x.route })

	$rootScope.tabs = tabs

	// Ugly sync between lx-tabs and ui-router
	$rootScope.$watch('activeTab', function(t, o) {
		if (t === o) return
		if (! tabs[t]) return
		$state.go(tabs[t].route)
	})
	$rootScope.$on('$stateChangeSuccess', function() {
		$rootScope.activeTab = Math.max(0, routes.indexOf($state.current.name))
	})

}])
// TODO split in routes.js
.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
	$urlRouterProvider.when('', '/').when('/', '/markets');

	$stateProvider.state({
		name: 'markets',
		url: '/markets',
		sticky: true,
		views: {
			'view': { templateUrl: 'marketsListTpl' }
		}
	})

	$stateProvider.state({
		name: 'market',
		url: '/market/:pair',
		params:{
			pair: null,
		},
		views: {
			'market': { templateUrl: 'marketTpl' }
		}
	});

	$stateProvider.state({
		name: 'wallets',
		url: '/wallets',

	})


	$stateProvider.state({
		name: 'help',
		url: '/help',

	})
}]);

// ...