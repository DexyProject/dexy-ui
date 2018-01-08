(function() 
{
    'use strict';


    // XXX NOTE
    // Using a directive for charts considered harmful
    // We will have to update the charts often, and often just a small portion (e.g. inserting a new bar)
    // Directives will require angular to re-render the whole page, which is not efficient

    angular
        .module('dexyApp')
        .controller('exchangeCtrl', exchangeCtrl);

    exchangeCtrl.$inject = ['$scope', '$stateParams', 'user'];

    function exchangeCtrl($scope, $stateParams, user)
    {
        var exchange = this;

        var symbol = $stateParams.pair.split('/').pop()
        var token = CONSTS.tokens[symbol]

        exchange.pair = $stateParams.pair
        exchange.symbol = symbol

        // Get wallet balance
        exchange.token = new web3.eth.Contract(CONSTS.erc20ABI, token[0])
        $scope.$watch(function() { return user.publicAddr }, function(addr) {
            exchange.token.methods.balanceOf(addr).call(function(err, bal) {
                if (err) console.error(err)
                else {
                    exchange.onWallet = (bal/token[1]).toFixed(2)
                    exchange.walletAddr = addr
                    if (! $scope.$$phase) $scope.$apply()
                }
            })

            // TODO: get from exchange SC too
        })



        // How to test signing tx
        // var user = angular.element(document).injector().get('user'); var exchange = angular.element('.exchangeLayout').scope().exchange; 
        // user.sendTx(exchange.token.methods.transfer('0x7a15866aFfD2149189Aa52EB8B40a8F9166441D9', 10000))


        // TEMP test data
        // TEMP until we hook up API
        exchange.orderbook = [
            [0.0002323, 23],
            [0.0002324, 1000],
            [0.0002410, 3244],
            [0.0002501, 99],
            [0.0002802, 222],
        ].map(function(x, i) { return { idx: i, rate: x[0].toFixed(8), amount: x[1], filled: 0 } })

        // chart
        $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?a=e&filename=aapl-ohlc.json&callback=?', function (data) {

            // create the chart
            Highcharts.stockChart('mainChart', {
                rangeSelector: {
                    selected: 1
                },

                chart: {
                    height: '44%'
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

        // Orders
        exchange.orders = {
            SELL: { },
            BUY: { }
        }


        $scope.fillForOrder = function(side, order)
        {
            console.log(side)
            exchange.orders[side] = order
        }

        $scope.$watch(function () { return exchange.orders }, function (orders) {
            exchange.orders.SELL.valid = isValidNumber(orders.SELL.rate) && isValidNumber(orders.SELL.amount) // && sufficient tokens
            exchange.orders.BUY.valid = isValidNumber(orders.BUY.rate) && isValidNumber(orders.BUY.amount) // && sufficient eth
        }, true)

        function isValidNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n) && (n > 0)
        }

        $scope.$watch(function () { return exchange.orders.SELL }, refreshTotal, true)
        $scope.$watch(function () { return exchange.orders.BUY }, refreshTotal, true)
        function refreshTotal(order) {
            if (order.valid) order.total = order.amount * order.rate
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

    // Orderbook ctrl
    angular
        .module('dexyApp')
        .controller('orderbookCtrl', orderbookCtrl);

    orderbookCtrl.$inject = ['$scope', '$stateParams'];

    function orderbookCtrl($scope, $stateParams)
    {
    }
})();