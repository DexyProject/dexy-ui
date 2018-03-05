// needed for older browsers
require('babel-polyfill');

// By default this is set to the same origin if we're opening from localhost; doesn't make sense for us
window.TREZOR_POPUP_ORIGIN = 'https://connect.trezor.io';

window.cfg = require('dexy-config')

// Define the main angular module
var app = angular.module('dexyApp', ['ui.router'])

// Constants
app.run(['$rootScope', '$state', 'user', function ($rootScope, $state, user) {
    var tabs = [
        {name: 'Markets', route: 'markets'},
        //{ name: 'Transactions', route: 'transactions' }, // alternatively those will be shown on 'trans'
        // OR 'order history'
        {name: 'Help', route: 'help'},
    ]

    var routes = tabs.map(function (x) {
        return x.route
    })

    $rootScope.tabs = tabs
    $rootScope.persistingProp = persistingProp

    // Persistant properties
    $rootScope.nightMode = false
    $rootScope.useEUR = false
    persistingProp($rootScope, 'nightMode')
    persistingProp($rootScope, 'useEUR')

    // Ugly sync between lx-tabs and ui-router
    $rootScope.updateRoute = function (t) {
        if (!tabs[t]) return
        $state.go(tabs[t].route)
    }

    // Ugliness
    $rootScope.isFullscreen = function () {
        return document.webkitIsFullScreen || document.mozFullScreen || false
    }

    $rootScope.toggleFullscreen = function () {
        var element = document.documentElement

        var isFullscreen = $rootScope.isFullscreen()

        element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || function () {
            return false;
        };
        document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () {
            return false;
        };

        isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();

        if (!$rootScope.$$phase) $rootScope.$apply();
    }
}])


function persistingProp(scope, prop) {
    var prp = localStorage['persist_' + prop]
    if (prp) {
        try {
            scope[prop] = JSON.parse(prp)
        } catch (e) {
        }
    }

    scope.$watch(prop, function (newVal, o) {
        if (o === undefined) return
        if (newVal != o) localStorage['persist_' + prop] = JSON.stringify(newVal)
    })
}
