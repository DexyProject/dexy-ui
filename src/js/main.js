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

	persistingProp($rootScope, 'nightMode')
}])


function persistingProp(scope, prop)
{
	var prp = localStorage['persist_'+prop]
	if (prp) {
		try { 
			scope[prop] = JSON.parse(prp)
		} catch(e) { }
	}

	scope.$watch(prop, function(newVal, o) {
		if (o === undefined) return
		if (newVal != o) localStorage['persist_'+prop] = JSON.stringify(newVal)
	})
}
