(function () {
    'use strict';

    // Wallet ctrl
    angular
        .module('dexyApp')
        .controller('tradeHistoryCtrl', tradeHistoryCtrl);

    tradeHistoryCtrl.$inject = ['$scope', 'user', '$window'];

    function tradeHistoryCtrl($scope, user, $window) {
        var exchange = $scope.exchange

        function loadHistory() {
            if (! exchange.tokenInf) return
            
            fetch(cfg.endpoint + '/trades?token=' + exchange.tokenInf[0])
                .then(function (res) {
                    return res.json()
                })
                .then(function (history) {
                    exchange.trades = (history || []).map(exchange.mapTransaction)
                    if (!$scope.$$phase) $scope.$digest()
                })
                .catch(function (err) {
                    toastr.error('Error loading history')
                    console.error(err)
                })
        }

        $scope.openTransaction = function (tx) {
            $window.open(cfg.etherscan + "/tx/" + tx, '_blank');
        }

        $scope.$on('reload-orders', function () {
            loadHistory()
        })
    }
})();