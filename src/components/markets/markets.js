(function () {
    'use strict';

    angular
        .module('dexyApp')
        .controller('MarketsController', MarketsController);

    MarketsController.$inject = ['$scope', '$state', 'cmc', 'user'];

    function MarketsController($scope, $state, cmc, user) {
        $scope.orderByField = 'vol';
        $scope.reverseSort = true;
        $scope.searchKeyword = '';
        $scope.hideZeroBal = false;
        $scope.persistingProp($scope, 'hideZeroBal');

        $scope.openExchange = function (symbol) {
            $state.go('exchange', {pair: symbol})
        };


        // Fill in vol, price_eth, price_fiat
        //vm.dataTableTbody = angular.copy(CONSTS.markets);
        // ugly but works
        $scope.markets = angular.copy(CONSTS.markets)
        $scope.markets.forEach(function (x) {
            // TEMP TMP TEMP
            x.price = Math.random()
            x.high = x.price + Math.random() * 0.2
            x.low = x.price - Math.random() * 0.2
            x.vol = 200 * Math.random()
            x.change = 0.4 * (Math.random() - 0.5)
            x.balance = 0

            x.token = CONSTS.tokens[x.symbol]
        })

        // NOTE: this is very similar to the code in exchange.js, maybe make it more abstract
        // once we have to get from the contract too
        $scope.$watch(function () {
            return user.publicAddr
        }, function (addr) {
            if (!addr) return

            var batch = new web3.eth.BatchRequest()

            console.log('Fetching all balances for ' + addr)

            $scope.markets.forEach(function (x) {
                if (!x.token) return

                //console.log('Fetching ' + x.symbol + ' balances for ' + addr)
                var contract = new web3.eth.Contract(CONSTS.erc20ABI, x.token[0])
                batch.add(contract.methods.balanceOf(addr).call.request(function (err, bal) {
                    if (err) console.error(err)
                    else {
                        x.balance = bal / x.token[1]
                        if (!$scope.$$phase) $scope.$apply(function () {
                        })
                    }
                }))
            })

            batch.execute()
        })

        $scope.fiatValue = function (value) {
            return $scope.useEUR ? '€' + (value * cmc.pairs.ETHEUR).toFixed(2) : '$' + (value * cmc.pairs.ETHUSD).toFixed(2)
        }
    }
})();
