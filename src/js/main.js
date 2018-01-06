// needed for older browsers
require('babel-polyfill')

// Define the main angular module
var app = angular.module('dexyApp', ['lumx', 'ui.router'])

// Constants
app.run(['$rootScope', '$state', function($rootScope, $state) {
	var tabs = [
		{ name: 'Markets', route: 'markets' },
		//{ name: 'Transactions', route: 'transactions' }, // alternatively those will be shown on 'trans' 
		// OR 'order history'
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

	// Ugliness
	$rootScope.isFullscreen = function() {
		return document.webkitIsFullScreen || document.mozFullScreen || false
	}
	$rootScope.toggleFullscreen = function() {
		var element = document.documentElement

		var isFullscreen = $rootScope.isFullscreen()

		element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || function () { return false; };
		document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () { return false; };

		isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();

		if (! $rootScope.$$phase) $rootScope.$apply();
	}
}])


window.addEventListener('load', function() {
	var Web3 = require('web3')

	// Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof web3 !== 'undefined') {
		// Use Mist/MetaMask's provider
		window.web3 = new Web3(web3.currentProvider);
	} else {
		console.log('No web3? You should consider trying MetaMask!')
		// fallback - use your fallback strategy
		window.web3 = new Web3(new Web3.providers.HttpProvider(CONSTS.mainnetUrl));
	}

})