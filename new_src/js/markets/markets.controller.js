import fields from './config/fields';
import currencies from './config/currencies';

class MarketsCtrl {
    constructor($state, $scope, $interval, Markets, CoinMarketCap) {
        'ngInject';

        this._$scope = $scope;
        this._Markets = Markets;
        this._CoinMarketCap = CoinMarketCap;

        this._$scope.fields = fields;

        this._$scope.orderByField = 'volume';
        this._$scope.reverseSort = true;

        this._$scope.hideZeroBal = false;
        this._$scope.persistingProp(this._$scope, 'hideZeroBal');

        this._$scope.currency = 'USD';
        this._$scope.persistingProp(this._$scope, 'currency');

        this._$scope.openExchange = function (symbol) {
            $state.go('exchange', {pair: symbol})
        };

        // @todo consts
        self = this;
        let interval = $interval(function () {
            self.updateMarkets()
        }, 30 * 1000);

        this._$scope.$on('$destroy', function () {
            $interval.cancel(interval)
        });

        self.updateMarkets();

        // @todo add in once we have user
        // this._$scope.$watch(function () {
        //     return user.publicAddr
        // }, function () {
        //     self.updateMarkets()
        // });
    }

    updateMarkets() {

        // @todo move this into a service
        // var addr = user.publicAddr
        //
        // console.log('Markets: updating')
        //
        // if (addr) {
        //     console.log('Markets: fetching all balances for ' + addr)
        //
        //     var batch = new web3.eth.BatchRequest()
        //
        //     $scope.markets.forEach(function (x) {
        //         if (!x.token) return
        //
        //         //console.log('Fetching ' + x.symbol + ' balances for ' + addr)
        //         var contract = new web3.eth.Contract(CONSTS.erc20ABI, x.token[0])
        //         batch.add(contract.methods.balanceOf(addr).call.request(function (err, bal) {
        //             if (err) console.error(err)
        //             else {
        //                 x.balanceWallet = bal / x.token[1]
        //                 $scope.delayedApply()
        //             }
        //         }))
        //
        //         batch.add(user.vaultContract.methods.balanceOf(x.token[0], addr).call.request(function(err, bal) {
        //             if (err) console.error(err)
        //             else {
        //                 x.balanceExchange = bal / x.token[1]
        //                 $scope.delayedApply()
        //             }
        //         }))
        //     })
        //
        //     batch.execute()
        // }

        // @todo user proper tokens
        this._Markets.getMarkets(["0xbebb2325ef529e4622761498f1f796d262100768"])
            .then((result) => {
                let allByToken = {};

                result.data.forEach(function (m) {
                    allByToken[m.token.toLowerCase()] = m
                });

                this._$scope.markets.forEach(function (x) {
                    let info = allByToken[x.token[0].toLowerCase()];

                    if (!info) return;

                    x.bid = info.bid;
                    x.ask = info.ask;
                    x.last = info.last;
                    x.volume = info.volume
                });

                this._$scope.delayedApply();
            })
            .catch(function (err) {
                toastr.error('Error loading markets data');
                console.error(err)
            });

        let t;

        this._$scope.delayedApply = function () {
            clearTimeout(t);
            t = setTimeout(function () {!this._$scope.$$phase && this._$scope.$digest()}, 150)
        }
    }

    fiatValue(value) {
        return currencies[this._$scope.currency] + (value * this._CoinMarketCap.rate(this._$scope.currency)).toFixed(2);
    }

    setOrderBy(keyName) {
        if (this._$scope.orderByField === keyName) {
            this._$scope.reverseSort = !this._$scope.reverseSort;
            return
        }

        this._$scope.orderByField = keyName
    }
}

export default MarketsCtrl;
