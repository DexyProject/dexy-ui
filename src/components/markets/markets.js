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

        $scope.useEUR = false
        $scope.persistingProp($scope, 'useEUR')

        $scope.openExchange = function (symbol) {
            $state.go('exchange', { pair: symbol })
        };


        // omWallet, onExchange, bid, ask, vol

        // Fill in vol, price_eth, price_fiat
        // ugly but works
        $scope.markets = cfg.markets.map(function (x) {
            // TEMP
            return { name: x, symbol: x }
        })
        $scope.markets.forEach(function (x) {
            x.ask = x.price + Math.random() * 0.2
            x.bid = x.price - Math.random() * 0.2
            x.vol = 200 * Math.random()
            x.balanceWallet = 0
            x.balanceExchange = 0

            x.token = cfg.tokens[x.symbol]

            if (!x.token)
                console.log('WARNING: no token for ' + x.symbol)
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
                        x.balanceWallet = bal / x.token[1]
                        if (!$scope.$$phase) $scope.$apply()
                    }
                }))

                batch.add(user.vaultContract.methods.balanceOf(x.token[0], addr).call.request(function(err, bal) {
                    if (err) console.error(err)
                    else {
                        x.balanceExchange = bal / x.token[1]
                        if (!$scope.$$phase) $scope.$apply()
                    }
                }))
            })

            batch.execute()
        })

        $scope.fiatValue = function (value) {
            return $scope.useEUR ? '€' + (value * cmc.pairs.ETHEUR).toFixed(2) : '$' + (value * cmc.pairs.ETHUSD).toFixed(2)
        }

        $scope.setOrderBy = function (keyName) {
            if ($scope.orderByField === keyName) {
                $scope.reverseSort = !$scope.reverseSort
                return
            }
            $scope.orderByField = keyName
        }
    }
})();
