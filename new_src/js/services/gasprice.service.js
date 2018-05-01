export default class GasPrice {
    constructor($http, $root) {
        'ngInject';
        this._$http = $http;
        this._$root = $root;
        this.prices = {};

        update();
    }

    update() {

        const URL = 'https://ethgasstation.info/json/ethgasAPI.json';

        return this._$http({
            url: URL,
            method: 'GET',
        }).then((resp) => {
            this.prices.fast = resp.data.fast;
            this.prices.safe = resp.data.safeLow;
            this.prices.average = resp.data.average;

            if (!this._$root.gas) this._$root.gas = gas.prices.average;
        })
    }
}
