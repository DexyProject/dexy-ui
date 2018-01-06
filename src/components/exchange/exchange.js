(function()
{
    'use strict';

    var Web3 = require('web3')

    var web3 = new Web3()
    web3.setProvider(new Web3.providers.HttpProvider(CONSTS.mainnetUrl))

    // XXX NOTE
    // Using a directive for charts considered harmful
    // We will have to update the charts often, and often just a small portion (e.g. inserting a new bar)
    // Directives will require angular to re-render the whole page, which is not efficient

    angular
        .module('dexyApp')
        .controller('exchangeCtrl', exchangeCtrl);

    exchangeCtrl.$inject = ['$scope', '$stateParams'];

    function exchangeCtrl($scope, $stateParams)
    {

        var exchange = this;

        var symbol = $stateParams.pair.split('/').pop()
        var token = CONSTS.tokens[symbol]
        // TEST
        // Works wow
        var addr = '0xa3B83839ae676DF0A92788DF1D545c3bB96B5ffC' // should be user addr
        var contract = new web3.eth.Contract(CONSTS.erc20ABI, token[0])
        contract.methods.balanceOf(addr).call(function(err, bal) {
            if (err) console.error(err)
            else {
                exchange.onWallet = bal/token[1]
                if (! $scope.$$phase) $scope.$apply()
            }
        })

        exchange.pair = $stateParams.pair

        // Chart
        // move from here?
        /*
        new TradingView.widget({
            "container_id": '#mainChart',
            "autosize": false,
            "symbol": symbol,

            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "hide_top_toolbar": false,
            "hide_side_toolbar": true,
            "show_popup_button": false,

        });
        */

        // TEMP test data
        // TEMP until we hook up API
        exchange.orderbook = [
            [0.00002323, 23],
            [0.00002324, 1000],
            [0.00002410, 3244],
            [0.00002501, 99],
        ].map(function(x, i) { return { idx: i, rate: x[0].toFixed(8), amount: x[1], filled: 0 } })

        // model skeleton
        exchange.orders = {
            SELL: { },
            BUY: { }
        }

        $scope.fillForOrder = function(side, order)
        {
            exchange.orders[side] = order
        }
    }


    // Place order ctrl

    angular
        .module('dexyApp')
        .controller('placeOrderCtrl', placeOrderCtrl);

    placeOrderCtrl.$inject = ['$scope', '$stateParams'];

    function placeOrderCtrl($scope, $stateParams)
    {
    }
})();