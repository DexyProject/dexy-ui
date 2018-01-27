(function()
{
    'use strict';

    angular
        .module('dexyApp')
        .service('cmc', cmcService)

    cmcService.$inject = ['$rootScope', '$http', '$interval']

    function cmcService($scope, $http, $interval)
    {
        var cmc = this
        var URL = 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR' // ?limit=150
        var REFRESH_INTVL = 20*1000

        cmc.pairs = {  }

        function update() {
            $http.get(URL)
            .then(function(resp) {
                Object.keys(resp.data).forEach(function(second) {
                    cmc.pairs['ETH'+second] = resp.data[second]
                })
            })

            // NOTE: because we use $http, scope will auto digest after we get the response
            // we actually don't want that in the long run, as we need to keep global digests to a minimum
            //$scope.$broadcast('cmcRefreshed')
        }

        update()
        $interval(update, REFRESH_INTVL)


        return cmc
    }

})();