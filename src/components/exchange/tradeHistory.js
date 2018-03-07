(function () {
    'use strict';

    // Wallet ctrl
    angular
        .module('dexyApp')
        .controller('tradeHistoryCtrl', tradeHistoryCtrl);

    tradeHistoryCtrl.$inject = ['$scope', 'user', '$window'];

    function tradeHistoryCtrl($scope, user, $window) {
        var exchange = $scope.exchange

        loadHistory()

        function loadHistory() {
            fetch(cfg.endpoint + '/trades?token=' + exchange.tokenInf[0])
                .then(function (res) {
                    return res.json()
                })
                .then(function (history) {
                    exchange.trades = (history || []).map(mapTransaction)
                    if (!$scope.$$phase) $scope.$digest()
                })
                .catch(function (err) {
                    toastr.error('Error loading history')
                    console.error(err)
                })
        }

        function mapTransaction(tx, i) {

            var amount = parseInt(tx.give.token === CONSTS.ZEROADDR ? tx.get.amount : tx.give.amount) / exchange.tokenInf[1];
            var side = (tx.give.token === CONSTS.ZEROADDR ? 'buy' : 'sell');

            var time = new Date(tx.timestamp * 1000)

            var pad = function (x) {
                return ('00' + x).slice(-2)
            }
            return {
                idx: i,
                tx: tx.tx,
                time: time.getDate() + '/' + (time.getMonth() + 1) + ' ' + pad(time.getHours()) + ':' + pad(time.getMinutes()),
                side: side,
                amount: amount,
                price: calculatePrice(tx)
            }
        }

        // NOTE: similar math is used for the orderbook
        function calculatePrice(o) {
            var getAmnt = parseInt(o.get.amount)
            var giveAmnt = parseInt(o.give.amount)

            var tokenAmount = (o.give.token === CONSTS.ZEROADDR ? getAmnt : giveAmnt)
            var tokenBase = exchange.tokenInf[1]

            var ethAmount = (o.give.token === CONSTS.ZEROADDR ? giveAmnt : getAmnt)
            var ethBase = 1000000000000000000

            return (ethAmount / ethBase) / (tokenAmount / tokenBase)
        }

        $scope.openTransaction = function (tx) {
            $window.open(cfg.etherscan + "/tx/" + tx, '_blank');
        }

        $scope.$on('reload-orders', function () {
            loadHistory()
        })
    }
})();