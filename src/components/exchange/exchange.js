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

        // exchange page: loading state and error (404) state

        var lastPart = $stateParams.pair.split('/').pop()

        if (lastPart.match(/^0x[a-fA-F0-9]{40}$/) && !$stateParams.token) 
        {
            fetchCustomToken(lastPart, function(err, props) {
                if (err) {
                    LxNotificationService.error('Invalid ERC20 token address')
                    console.error(err)
                }

                // TODO validate data?
                var token = [lastPart, Math.pow(10, parseInt(props.decimals)), props.symbol]
                
                if (CONSTS.tokens[props.symbol] && CONSTS.tokens[props.symbol][0] === lastPart) {
                    $state.go('exchange', { pair: props.symbol }, { replace: true })
                } else {
                    $state.go('exchange', { pair: $stateParams.pair, token: token }, { replace: true })
                }
                // TODO warn user that they should be sure this is the token they should be trading
            })
            return
        }

        var token = $stateParams.token || CONSTS.tokens[lastPart]

        if (! token) {
            // TODO 404
            return
        }

        exchange.pair = $stateParams.pair
        exchange.symbol = token[2] || lastPart
        exchange.user = user

        // Get wallet balance
        exchange.token = new web3.eth.Contract(CONSTS.erc20ABI, token[0])
        $scope.$watch(function () {
            return user.publicAddr
        }, function (addr) {
            if (!addr) return

            console.log('Fetching ' + exchange.symbol + ' balances for ' + addr)

            exchange.token.methods.balanceOf(addr).call(function (err, bal) {
                if (err) console.error(err)
                else {
                    exchange.onWallet = (bal / token[1]).toFixed(2)
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
        // TEMP until we hook up API
        exchange.orderbook = [
            [0.0002323, 23],
            [0.0002324, 1000],
            [0.0002410, 3244],
            [0.0002501, 99],
            [0.0002802, 222],
        ].map(function (x, i) {
            return {idx: i, rate: parseFloat(x[0].toFixed(8)), amount: x[1], filled: 0}
        })

        // Chart
        Highcharts.setOptions({
            lang: {
                rangeSelectorZoom: ''
            }
        });

        var chartStyle = angular.copy(window.chartStyle)
        chartStyle.chart.events = { load: function() {
            var chart = this 

            $.getJSON('https://ingress.api.radarrelay.com/v1/info/chart/0x2956356cd2a2bf3202f771f50d3d14a367b48070/0xe41d2489571d322189246dafa5ebde1f4699f498', function (data) {
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
        } }
        Highcharts.stockChart('mainChart', chartStyle);


        // Orders
        exchange.orders = {
            SELL: {},
            BUY: {}
        }


        $scope.fillForOrder = function (side, order) {
            console.log(side)
            exchange.orders[side] = order
        }

        $scope.$watch(function () {
            return exchange.orders
        }, function (orders) {
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

    placeOrderCtrl.$inject = ['$scope', '$stateParams', 'user', 'LxNotificationService'];

    function placeOrderCtrl($scope, $stateParams, user, LxNotificationService) {
        var Buffer = require('buffer').Buffer

        $scope.placeOrder = function (order, type, symbol) {
            if (!user.publicAddr) {
                LxNotificationService.error('Please use Metamask, Trezor or Ledger to interact with Ethereum');
                return
            }

            var token = CONSTS.tokens[symbol]

            var amntUint = order.amount * token[1]
            var totalUint = order.rate * order.amount * Math.pow(10, 18)

            // hardcoded for now
            var expires = 20160

            var userAddr = user.publicAddr

            var tokenGet = 0
            var amountGet = 0
            var tokenGive = 0
            var amountGive = 0

            var nonce = parseInt(Math.random() * 1000000000000000000)

            if (type === 'SELL') {
                tokenGive = amntUint
                amountGet = totalUint
            } else {
                tokenGet = amntUint
                amountGive = totalUint
            }

            // TODO
            var scAddr = '0x0000000000000000000000000000000000000000'

            //bytes32 hash = keccak256(tokenGet, amountGet, tokenGive, amountGive, expires, nonce, user, this);
            var hash = web3.utils.soliditySha3(tokenGet, amountGet, tokenGive, amountGive, expires, nonce, userAddr, scAddr)


            console.log(hash, web3.utils.toAscii(hash).length)
            // https://github.com/ethereum/web3.js/issues/392
            // https://github.com/MetaMask/metamask-extension/issues/1530
            // https://github.com/0xProject/0x.js/issues/162
            //  personal_sign
            var msg = "\x19Ethereum Signed Message:\n32" + web3.utils.toAscii(hash)
            web3.eth.personal.sign(msg, userAddr, function (err, sig) {
                // NOTE: TODO: shim fetch()?? safari?

                // strip the 0x
                sig = sig.slice(2)

                var r = new Buffer(sig.substring(0, 64), 'hex')
                var s = new Buffer(sig.substring(64, 128), 'hex')
                var v = new Buffer((parseInt(sig.substring(128, 130)) + 27).toString())

                console.log(r,s,v)


                /*
                fetch('http://127.0.0.1:12312/orders', {
                    get: {
                        token:,
                        amount: 
                    },
                    give: {
                        same
                    },
                    expires: someBlock,
                    nonce: nonce,
                    exchange: scAddr,
                    signature: {
                        ...
                    }
                })
                */
            })

        }
    }

    // Fetch custom token
    function fetchCustomToken(addr, cb)
    {
        var pending = 0
        var props = { }
        var error

        var token = new web3.eth.Contract(CONSTS.erc20ABI, addr)
        var batch = new web3.eth.BatchRequest()
        batch.add(doFetchProp('symbol'))
        batch.add(doFetchProp('decimals'))
        batch.execute()

        function doFetchProp(prop)
        {
            pending++

            return token.methods[prop]().call.request(function(err, res) {
                if (err) error = err
                if (res) props[prop] = res
                if (--pending === 0) cb(error, props)
            })
        }
    }

    // Orderbook ctrl
    angular
        .module('dexyApp')
        .controller('orderbookCtrl', orderbookCtrl);

    orderbookCtrl.$inject = ['$scope', '$stateParams'];

    function orderbookCtrl($scope, $stateParams) {
    }


    // Indicators ctrl
    angular
        .module('dexyApp')
        .controller('exchangeIndicatorsCtrl', exchangeIndicatorsCtrl);

    exchangeIndicatorsCtrl.$inject = ['$scope', '$stateParams'];

    function exchangeIndicatorsCtrl($scope, $stateParams) {
        var exchange = this

        var symbol = $scope.exchange.symbol

        exchange.pair = $stateParams.pair
        exchange.symbol = symbol

    }
})();