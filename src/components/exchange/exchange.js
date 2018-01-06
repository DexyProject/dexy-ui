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
        // TEST
        // Works wow
        var contract = new web3.eth.Contract(CONSTS.erc20ABI, '0x4470BB87d77b963A013DB939BE332f927f2b992e')
        contract.methods.balanceOf('0xa3B83839ae676DF0A92788DF1D545c3bB96B5ffC').call(function(err, bal) { console.log(err, bal/10000) })
        // END TEST

        var exchange = this;

        exchange.pair = $stateParams.pair

        $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?a=e&filename=aapl-ohlc.json&callback=?', function (data) {

            // create the chart
            Highcharts.stockChart('candleChart', {
                rangeSelector: {
                    selected: 1
                },

                title: {
                    text: 'AAPL Stock Price'
                },

                series: [{
                    type: 'candlestick',
                    name: 'AAPL Stock Price',
                    data: data,
                    dataGrouping: {
                        units: [
                            [
                                'week', // unit name
                                [1] // allowed multiples
                            ], [
                                'month',
                                [1, 2, 3, 4, 6]
                            ]
                        ]
                    }
                }]
            });
        });

    }
})();