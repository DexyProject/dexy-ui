(function () {
    'use strict';

    angular
        .module('dexyApp')
        .service('gas', gasService)

    gasService.$inject = ['$rootScope', '$http', '$interval']

    function gasService($scope, $http, $interval) {
        var gas = this;
        var URL = 'https://ethgasstation.info/json/ethgasAPI.json';

        gas.prices = {}

        function update() {
            $http.get(URL)
                .then(function (resp) {

                    console.log(resp.data)
                    gas.prices.fast = (resp.data.fast / 10).toFixed(0)
                    gas.prices.safeLow = (resp.data.safeLow / 10).toFixed(0)
                    gas.prices.average = (resp.data.average / 10).toFixed(0)

                })

            // NOTE: because we use $http, scope will auto digest after we get the response
            // we actually don't want that in the long run, as we need to keep global digests to a minimum
            //$scope.$broadcast('cmcRefreshed')
        }

        update()
        // $interval(update, REFRESH_INTVL)


        return gas
    }

})();
