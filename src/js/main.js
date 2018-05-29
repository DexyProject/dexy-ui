// needed for older browsers
require('babel-polyfill');

// By default this is set to the same origin if we're opening from localhost; doesn't make sense for us
window.TREZOR_POPUP_ORIGIN = 'https://connect.trezor.io';

window.cfg = require('dexy-config')

// Important sanitization
toastr.options.escapeHtml = true

// Define the main angular module
var app = angular.module('dexyApp', ['ui.router'])

// Constants
app.run(['$rootScope', '$state', 'user', function ($rootScope, $state, user) {
    $rootScope.persistingProp = persistingProp

    // Persistant properties
    //$rootScope.nightMode = false
    //persistingProp($rootScope, 'nightMode')

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

    // Initialize markets
    $rootScope.markets = cfg.markets.map(function (x) {
        var m = { name: x, symbol: x }

        m.ask = 0
        m.bid = 0
        m.last = 0
        m.volume = 0
        m.depth = 0

        m.balanceWallet = 0
        m.balanceExchange = 0

        m.token = cfg.tokens[m.symbol]

        if (!m.token)
            console.log('WARNING: no token for ' + m.symbol)
        
        return m
    })
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

        try {
            if (newVal != o) localStorage['persist_' + prop] = JSON.stringify(newVal)
        } catch(e) {
            toastr.error('Error persisting property: '+prop)
        }
    })
}
