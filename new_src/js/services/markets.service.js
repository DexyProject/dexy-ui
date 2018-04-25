export default class Markets {
    constructor(AppConstants, $http) {
        'ngInject';

        this._AppConstants = AppConstants;
        this._$http = $http;
    }

    getMarkets(tokens) {
        return this._$http({
            url: `${this._AppConstants.api}/markets?tokens=${encodeURIComponent(JSON.stringify(tokens))}`,
            method: 'GET',
        })
    }
}
