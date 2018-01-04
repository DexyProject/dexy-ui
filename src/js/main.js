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
	$rootScope.$watch('activeTab', function(t, o) {
		if (t === o) return
		if (! tabs[t]) return
		$state.go(tabs[t].route)
	})
	$rootScope.$on('$stateChangeSuccess', function() {
		$rootScope.activeTab = routes.indexOf($state.current.name)
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