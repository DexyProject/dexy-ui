export default class CoinMarketCap {
    constructor($http, $interval) {
        'ngInject';
        this._$http = $http;

        this.pairs = {};

        const REFRESH_INTVL = 20 * 1000;
        this.update();
        $interval(this.update, REFRESH_INTVL)
    }

    update() {

        const URL = 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR';

        return this._$http({
            url: URL,
            method: 'GET',
        }).then((resp) => {
            self = this;
            Object.keys(resp.data).forEach(function (second) {
                self.pairs['ETH' + second] = resp.data[second]
            })
        })
    }

    rate(second) {
        return this.pairs['ETH' + second];
    }
}
