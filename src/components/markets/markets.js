(function () {
    'use strict';

    angular
        .module('dexyApp')
        .controller('MarketsController', MarketsController);

    MarketsController.$inject = ['$scope', '$state', '$interval', 'cmc', 'user'];

    // Pagination: we can keep the global 'markets' and just change the '$scope.markets'
    // that means that data like balances and etc. will be cached

    // @TODO: clear balanceWallet/balanaceExchange for all markets immediately on change user

    function MarketsController($scope, $state, $interval, cmc, user) {
        $scope.orderByField = 'volume';
        $scope.reverseSort = true;

        $scope.hideZeroBal = false;
        $scope.persistingProp($scope, 'hideZeroBal');

        $scope.useEUR = false
        $scope.persistingProp($scope, 'useEUR')

        $scope.openExchange = function (symbol) {
            $state.go('exchange', { pair: symbol })
        }

        var intvl = $interval(function () {
            updateMarkets()
        }, CONSTS.UPDATE_MARKETS_INTVL)
        $scope.$on('$destroy', function () {
            $interval.cancel(intvl)
        })
        $scope.$watch(function () {
            return user.publicAddr
        }, function() {
            updateMarkets()
        })

        function updateMarkets() {
            var addr = user.publicAddr
            if (!addr) return

            console.log('Markets: fetching all balances for ' + addr)

            var batch = new web3.eth.BatchRequest()

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
                var allByToken = {}

                all.forEach(function(m) {
                    allByToken[m.token.toLowerCase()] = m
                })

                $scope.markets.forEach(function (x) {
                    var info = allByToken[x.token[0].toLowerCase()]

                    if (! info) return
                    
                    x.bid = info.bid
                    x.ask = info.ask
                    x.last = info.last
                    x.volume = info.volume
                })

                $scope.delayedApply()
            })
            .catch(function (err) {
                toastr.error('Error loading markets data')
                console.error(err)
            })
        }

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
