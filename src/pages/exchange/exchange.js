(function()
{
    'use strict';

    var web3 = require('web3')

    console.log(web3)
    // XXX NOTE
    // Using a directive for charts considered harmful
    // We will have to update the charts often, and often just a small portion (e.g. inserting a new bar)
    // Directives will require angular to re-render the whole page, which is not efficient

    angular
        .module('dexyApp')
        .controller('marketCtrl', marketCtrl);

    marketCtrl.$inject = ['$scope', '$stateParams'];

    function marketCtrl($scope, $stateParams)
    {
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