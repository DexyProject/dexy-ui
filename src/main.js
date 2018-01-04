var app = angular.module('dexyApp', ['lumx'])

// Constants
app.run(['$rootScope', function($rootScope) {
	$rootScope.tabs = [
		{ name: 'Markets', go: 'markets' },
		{ name: 'Wallets', go: 'wallets' }
	]


}])

// ...