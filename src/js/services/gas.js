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
                    gas.prices.fast = resp.data.fast
                    gas.prices.safe = resp.data.safeLow
                    gas.prices.average = resp.data.average

                    if (!$root.gas) $root.gas = gas.prices.average
                })
        }

        update()
        // $interval(update, REFRESH_INTVL)


        return gas
    }

})();
