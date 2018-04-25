function AppRun(AppConstants, $rootScope, $state) {
    'ngInject';

    $rootScope.persistingProp = persistingProp;
    $rootScope.nightMode = false;
    persistingProp($rootScope, 'nightMode');

    $rootScope.isFullscreen = function () {
        return document.webkitIsFullScreen || document.mozFullScreen || false
    };

    $rootScope.toggleFullscreen = function () {
        var element = document.documentElement;

        var isFullscreen = $rootScope.isFullscreen();

        element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || function () {
            return false;
        };
        document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () {
            return false;
        };

        isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();

        if (!$rootScope.$$phase) $rootScope.$apply();
    };

    // Initialize markets
    $rootScope.markets = cfg.markets.map(function (x) {
        var m = { name: x, symbol: x };

        m.ask = 0;
        m.bid = 0;
        m.last = 0;
        m.volume = 0;

        m.balanceWallet = 0;
        m.balanceExchange = 0;

        m.token = cfg.tokens[m.symbol];

        if (!m.token)
            console.log('WARNING: no token for ' + m.symbol);

        return m
    })

}

export default AppRun;

function persistingProp(scope, prop) {
    let prp = localStorage['persist_' + prop];
    if (prp) {
        try {
            scope[prop] = JSON.parse(prp)
        } catch (e) {
        }
    }

    scope.$watch(prop, function (newVal, o) {
        if (o === undefined) return;

        try {
            if (newVal !== o) localStorage['persist_' + prop] = JSON.stringify(newVal)
        } catch(e) {
            toastr.error('Error persisting property: '+prop)
        }
    })
}
