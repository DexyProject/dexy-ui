(function () {
    'use strict';

    // My trades ctrl
    angular
        .module('dexyApp')
        .controller('myTradesCtrl', myTradesCtrl);

    myTradesCtrl.$inject = ['$scope', 'user'];

    function myTradesCtrl($scope, user) {

        var exchange = $scope.exchange

        $scope.$watch(function () {
            return user.publicAddr
        }, fetchTrades)
        $scope.$on('reload-orders', fetchTrades)

        function fetchTrades() {
            if (!user.publicAddr) return

            fetch(cfg.endpoint + '/trades?token=' + exchange.tokenInf[0] + '&user=' + user.publicAddr)
                .then(function (res) {
                    return res.json()
                })
                .then(function (ob) {
                    exchange.myTrades = (ob || []).map(exchange.mapTransaction)
                    if (!$scope.$$phase) $scope.$digest()
                })
                .catch(function (err) {
                    console.error(err)
                })
        }

    }
})();