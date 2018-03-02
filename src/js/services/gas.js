(function () {
    'use strict';

    angular
        .module('dexyApp')
        .service('gas', gasService)

    gasService.$inject = ['$http', '$interval', '$rootScope']

    function gasService($http, $interval, $root) {
        var gas = this;
        var URL = 'https://ethgasstation.info/json/ethgasAPI.json';

        gas.prices = {}

        function update() {
            $http.get(URL)
                .then(function (resp) {
                    gas.prices.fast = (resp.data.fast / 10).toFixed(0)
                    gas.prices.safe = (resp.data.safeLow / 10).toFixed(0)
                    gas.prices.average = (resp.data.average / 10).toFixed(0)

                    if (!$root.gas) $root.gas = gas.prices.average
                })
        }

        update()
        // $interval(update, REFRESH_INTVL)


        return gas
    }

})();
