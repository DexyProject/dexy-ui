var app = angular.module('dexyApp', ['lumx', 'ui.router'])

// Constants
app.run(['$rootScope', '$state', function($rootScope, $state) {
	var tabs = [
		{ name: 'Markets', route: 'markets' },
		{ name: 'Wallets', route: 'wallets' }, // this will show the active balances, and deposits/withdraws 
		//{ name: 'Transactions', route: 'transactions' }, // alternatively those will be shown on 'trans'
		{ name: 'Help', route: 'help' },

	]
	var routes = tabs.map(function(x) { return x.route })

	$rootScope.tabs = tabs

	// Ugly sync between lx-tabs and ui-router
	$rootScope.updateRoute = function(t) {
		if (! tabs[t]) return
		$state.go(tabs[t].route)
	}
	$rootScope.$on('$stateChangeSuccess', function() {
		var idx = routes.indexOf($state.current.name === 'exchange' ? 'markets' : $state.current.name)
		if (idx > -1) $rootScope.activeTab = idx
	})

}])

// TODO split in routes.js
.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
	$urlRouterProvider.when('', '/').when('/', '/markets');

	$stateProvider.state({
		name: 'markets',
		url: '/markets',
		sticky: true,
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
		name: 'wallets',
		url: '/wallets',

	})


	$stateProvider.state({
		name: 'help',
		url: '/help',

	})
}]);

// ...