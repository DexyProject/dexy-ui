(function()
{
    'use strict';

    var Web3 = require('web3')

    var erc20ABI = [{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]

    var web3 = new Web3()
    web3.setProvider(new Web3.providers.HttpProvider('https://mainnet.infura.io/W0a3PCAj1UfQZxo5AIrv'))

    // TEST
    // Works wow
    //var contract = new web3.eth.Contract(erc20ABI, '0x4470BB87d77b963A013DB939BE332f927f2b992e')
    //contract.methods.balanceOf(/* SOMEONE */).call(function(err, bal) { console.log(err, bal) })
    // END TEST




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