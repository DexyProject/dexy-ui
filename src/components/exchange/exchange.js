(function () {
    'use strict';

    // XXX NOTE
    // Using a directive for charts considered harmful
    // We will have to update the charts often, and often just a small portion (e.g. inserting a new bar)
    // Directives will require angular to re-render the whole page, which is not efficient

    angular
        .module('dexyApp')
        .controller('exchangeCtrl', exchangeCtrl);

    exchangeCtrl.$inject = ['$scope', '$stateParams', '$state', 'user', 'LxNotificationService'];

    function exchangeCtrl($scope, $stateParams, $state, user, LxNotificationService) {
        var exchange = this;

        $scope.exchangeAddr = CONSTS.exchangeContract
        $scope.exchangeContract = new web3.eth.Contract(CONSTS.exchangeABI, CONSTS.exchangeContract)

        // exchange page: loading state and error (404) state

        var lastPart = $stateParams.pair.split('/').pop()

        // Handle custom tokens
        if (web3.utils.isAddress(lastPart) && !$stateParams.token) {
            fetchCustomToken(lastPart, function (err, props) {
                if (err) {
                    LxNotificationService.error('Invalid ERC20 token address')
                    console.error(err)
                    return
                }

                var multiplier = Math.pow(10, props.decimals)
                var symbol = props.symbol
                var token = [lastPart, multiplier, symbol]

                if (CONSTS.tokens[symbol] && CONSTS.tokens[symbol][0] === lastPart) {
                    $state.go('exchange', { pair: symbol }, {replace: true})
                } else {
                    $state.go('exchange', { pair: $stateParams.pair, token: token }, {replace: true})
                }
                // TODO warn user that they should be sure this is the token they should be trading
            })
            return
        }

        var token = $stateParams.token || CONSTS.tokens[lastPart]

        if (!token) {
            // TODO 404
            return
        }

        exchange.pair = $stateParams.pair
        exchange.symbol = token[2] || lastPart
        exchange.user = user

        // Get wallet balance
        exchange.tokenInf = token
        exchange.token = new web3.eth.Contract(CONSTS.erc20ABI, token[0])
        $scope.$watch(function () {
            return user.publicAddr
        }, function (addr) {
            if (!addr) return

            console.log('Fetching ' + exchange.symbol + ' balances for ' + addr)

            exchange.token.methods.balanceOf(addr).call(function (err, bal) {
                if (err) console.error(err)
                else {
                    var tokenBal = bal / token[1]
                    exchange.onWallet = tokenBal
                    exchange.walletAddr = addr
                    if (!$scope.$$phase) $scope.$apply()
                }
            })
            // TODO: get from exchange SC too
        })


        // How to test signing tx
        // var user = angular.element(document).injector().get('user'); var exchange = angular.element('.exchangeLayout').scope().exchange;
        // user.sendTx(exchange.token.methods.transfer('0x7a15866aFfD2149189Aa52EB8B40a8F9166441D9', 10000))


        // TEMP test data
        // Updating orderbook
        // TEMP
        var endpoint = 'http://127.0.0.1:12312'
        fetch(endpoint + "/orders?token=" + exchange.tokenInf[0])
        .then(function (res) { return res.json() })
        .then(function (ob) {
            exchange.orderbook = {
                bids: ob.bids.map(mapOrder),
                asks: ob.asks.map(mapOrder),
            }
            if (!$scope.$$phase) $scope.$digest()
        })
        .catch(function (err) {
            LxNotificationService.error('Error loading order book')
            console.error(err)
        })

        function mapOrder(order, i)
        {
            // TODO: calc price from .give/.get, check whether it's the same as .price 
            return {
                order: order,
                idx: i,
                rate: parseFloat(order.price)/1000000000000000000,
                amount: (order.give.token === '0x0000000000000000000000000000000000000000' ? order.get : order.give).amount / exchange.tokenInf[1],
                filled: 0, // TODO
            }
        }

        // Chart
        Highcharts.setOptions({
            lang: {
                rangeSelectorZoom: ''
            }
        });

        var chartStyle = angular.copy(window.chartStyle)
        chartStyle.chart.events = {
            load: function () {
                var chart = this

                $.getJSON('https://ingress.api.radarrelay.com/v1/info/chart/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/0xe41d2489571d322189246dafa5ebde1f4699f498', function (data) {
                    // Create the chart

                    var prices = [];
                    var volume = [];
                    data.forEach(function (data) {
                        prices.push([
                            data.startBlockTimestamp * 1000,
                            Number(data.open),
                            Number(data.high),
                            Number(data.low),
                            Number(data.close)
                        ])

                        volume.push([
                            data.startBlockTimestamp * 1000,
                            Number(data.takerTokenVolume)
                        ])
                    });

                    prices.reverse()
                    volume.reverse()

                    chart.series[0].setData(prices)
                    chart.series[1].setData(volume)
                });
            }
        }
        Highcharts.stockChart('mainChart', chartStyle);

        $scope.takeOrder = function(toFill)
        {
            console.log(toFill)
        }
    }


    // Fetch custom token
    function fetchCustomToken(addr, cb) {
        var props = {}
        web3.eth.call({to: addr, data: web3.utils.sha3('decimals()')}, function (err, res) {
            if (err) return cb(err)
            if (res == '0x') return cb(new Error('unable to read decimals'))

            props.decimals = web3.utils.hexToNumber(res)

            var token = new web3.eth.Contract(CONSTS.erc20ABI, addr)
            token.methods.symbol().call(function (err, res) {
                if (err) return cb(err)
                props.symbol = res
                cb(null, props)
            })
        })
    }

    // Indicators ctrl
    angular
        .module('dexyApp')
        .controller('exchangeIndicatorsCtrl', exchangeIndicatorsCtrl);

    exchangeIndicatorsCtrl.$inject = ['$scope', '$stateParams'];

    function exchangeIndicatorsCtrl($scope, $stateParams) {
        var exchange = this

        exchange.pair = $stateParams.pair

        var lastPart = $stateParams.pair.split('/').pop()
        exchange.symbol = ($stateParams.token ? $stateParams.token[2] : null) || lastPart
    }
})();
