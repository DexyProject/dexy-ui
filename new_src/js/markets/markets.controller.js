class MarketsCtrl {
    constructor($state, $scope, Markets) {
        'ngInject';

        $scope.fields = [
            { name: 'Market', field: 'symbol' },
            { name: 'Balance On Wallet', field: 'balanceWallet' },
            { name: 'Balance On Exchange', field: 'balanceExchange' },
            { name: 'Bid', field: 'bid' },
            { name: 'Ask', field: 'ask' },
            { name: 'Last Price', field: 'last' },
            { name: '24h Volume', field: 'volume' },
        ];

        // @todo clean this up into nice functions
        // @todo user proper tokens
        Markets.getMarkets(["0xbebb2325ef529e4622761498f1f796d262100768"])
            .then((result) => {
                let allByToken = {};

                result.data.forEach(function (m) {
                    allByToken[m.token.toLowerCase()] = m
                });

                $scope.markets.forEach(function (x) {
                    let info = allByToken[x.token[0].toLowerCase()];

                    if (!info) return;

                    x.bid = info.bid;
                    x.ask = info.ask;
                    x.last = info.last;
                    x.volume = info.volume
                });

                $scope.delayedApply();
            })
            .catch(function (err) {
                toastr.error('Error loading markets data');
                console.error(err)
            });

        let t;
        $scope.delayedApply = function() {
            clearTimeout(t);
            t = setTimeout(function() { !$scope.$$phase && $scope.$digest() }, 150)
        }
    }
}

export default MarketsCtrl;