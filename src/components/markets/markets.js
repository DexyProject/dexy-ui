(function () {
    'use strict';

    angular
        .module('dexyApp')
        .controller('MarketsController', MarketsController);

    MarketsController.$inject = ['$scope', '$state', 'cmc', 'user'];

    var markets = cfg.markets.map(function (x) {
        var m = { name: x, symbol: x }

        m.ask = 0
        m.bid = 0

        m.balanceWallet = 0
        m.balanceExchange = 0

        m.token = cfg.tokens[m.symbol]

        if (!m.token)
            console.log('WARNING: no token for ' + m.symbol)
        
        return m
    })

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


        $scope.markets = markets

        // NOTE: this is very similar to the code in exchange.js, maybe make it more abstract
        // once we have to get from the contract too
        $scope.$watch(function () {
            return user.publicAddr
        }, function (addr) {
            if (!addr) return

            var batch = new web3.eth.BatchRequest()

            console.log('Markets: fetching all balances for ' + addr)

            $scope.markets.forEach(function (x) {
                if (!x.token) return

                //console.log('Fetching ' + x.symbol + ' balances for ' + addr)
                var contract = new web3.eth.Contract(CONSTS.erc20ABI, x.token[0])
                batch.add(contract.methods.balanceOf(addr).call.request(function (err, bal) {
                    if (err) console.error(err)
                    else {
                        x.balanceWallet = bal / x.token[1]
                        $scope.delayedApply()
                    }
                }))

                batch.add(user.vaultContract.methods.balanceOf(x.token[0], addr).call.request(function(err, bal) {
                    if (err) console.error(err)
                    else {
                        x.balanceExchange = bal / x.token[1]
                        $scope.delayedApply()
                    }
                }))
            })

            batch.execute()

            var addrs = $scope.markets.map(function(x) { return x.token[0] })
            fetch(cfg.endpoint + '/markets?tokens=' + encodeURIComponent(JSON.stringify(addrs)))
            .then(function(res) { return res.json() })
            .then(function(all) {
                $scope.markets.forEach(function (x) {
                    var info = all[x.token[0]]

                    if (! info) return

                    x.bid = info.bid ? (parseInt(info.bid.base) / parseInt(info.bid.quote) / x.token[1]) : 0
                    x.ask = info.ask ? (parseInt(info.ask.base) / parseInt(info.ask.quote) / x.token[1]) : 0
                })
                $scope.delayedApply()
            })
            .catch(function (err) {
                toastr.error('Error loading markets data')
                console.error(err)
            })
        })

        var t
        $scope.delayedApply = function() {
            clearTimeout(t)
            t = setTimeout(function() { !$scope.$$phase && $scope.$digest() }, CONSTS.MARKETS_SCOPE_UPDATE_DEBOUNCE)
        }

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
