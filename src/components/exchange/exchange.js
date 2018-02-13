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
        $scope.exchangeContract = user.exchangeContract

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

        $scope.meta = {
            open: 0,
            high: 0,
            low: 0,
            close: 0,
            vol: 0
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

            user.exchangeContract.methods.balanceOf(token[0], addr).call(function (err, bal) {
                if (err) console.error(err)
                else {
                    var tokenBal = bal / token[1]
                    exchange.onExchange = tokenBal
                    if (!$scope.$$phase) $scope.$apply()
                }
            })
        })


        // Amounts to move (deposit/withdraw)
        exchange.baseMove = { Deposit: 0, Withdraw: 0 }
        exchange.quoteMove = { Deposit: 0, Withdraw: 0 }

        // Move assets (deposit/withdraw)
        exchange.assetsMove = function(isBase, direction, amnt)
        {
            var addr = isBase ? CONSTS.ZEROADDR : exchange.tokenInf[0]
            var amnt = parseInt(parseFloat(amnt) * (isBase ? 1000000000000000000 : exchange.tokenInf[1]))
            
            var call
            var args

            // TODO: how to handle this? we need validation on that input field
            if (isNaN(amnt)) return

            if (direction === 'Deposit') {
                call = user.exchangeContract.methods.deposit(addr, isBase ? 0 : amnt)
                args = { 
                    from: user.publicAddr,
                    value: isBase ? amnt : 0, 
                    gas: 130000, gasPrice: user.GAS_PRICE 
                }
            } else if (direction === 'Withdraw') {
                call = user.exchangeContract.methods.withdraw(addr, amnt)
                args = { from: user.publicAddr, gas: 100000, gasPrice: user.GAS_PRICE }
            }

            if (direction === 'Deposit' && !isBase) {
                // We have to set the allowance first
                exchange.token.methods.allowance(user.publicAddr, CONSTS.exchangeContract).call(function(err, resp) {
                    if (err) return onErr(err)

                    // @TODO: NOTE: should we err handle here? and how?

                    var sendArgs = { from: user.publicAddr, gas: 60000, gasPrice: user.GAS_PRICE }
                    if (resp == 0) {
                        // Directly approve
                        approveFinal()
                    } else {
                        // First zero, then approve
                        exchange.token.methods.approve(CONSTS.exchangeContract, 0).send(sendArgs, approveFinal)
                    }

                    function approveFinal() {
                        exchange.token.methods.approve(CONSTS.exchangeContract, amnt).send(sendArgs, function() {
                            wrapFinal(call.send(args))
                        })
                    }
                })
            } else {
                wrapFinal(call.send(args))
            }

            function wrapFinal(p)
            {
                return p
                .then(function(resp) {
                    console.log(resp)
                    // TX is mined; we can show a success message here
                })
                .catch(onErr)
            }

            function onErr(err) {
                // TODO
                console.error(err)
            }
        }

        exchange.isValidAmnt = function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n) && (n > 0)
        }

        //
        // Updating orderbook
        //
        exchange.loadOb = loadOb

        loadOb()

        function loadOb()
        {
            fetch(CONSTS.endpoint + "/orders?token=" + exchange.tokenInf[0])
            .then(function (res) { return res.json() })
            .then(function (ob) {
                exchange.orderbook = {
                    bids: (ob.bids || []).map(mapOrder),
                    asks: (ob.asks || []).map(mapOrder),
                }
                if (!$scope.$$phase) $scope.$digest()
            })
            .catch(function (err) {
                LxNotificationService.error('Error loading order book')
                console.error(err)
            })
        }

        function mapOrder(order, i)
        {
            var getAmnt = parseInt(order.get.amount)
            var giveAmnt = parseInt(order.give.amount)

            var tokenBase = exchange.tokenInf[1]

            var tokenAmount = (order.give.token === CONSTS.ZEROADDR ? getAmnt : giveAmnt)

            var ethAmount = (order.give.token === CONSTS.ZEROADDR ? giveAmnt : getAmnt)
            var ethBase = 1000000000000000000

            var price = (ethAmount/ethBase) / (tokenAmount/tokenBase)

            return {
                order: order,
                id: order.hash,
                rate: price,
                amount: tokenAmount / tokenBase,
                filled: 0, // TODO
            }
        }

        // 
        // Chart
        // TODO: clean this up and split it
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
            var rawOrder = toFill.order.order

            // WARNING: check if the order.exchange address is the same as what we're currently operating with
            // throw an error if not
            
            // addresses - user, tokenGive, tokenGet
            var addresses = [rawOrder.user, rawOrder.give.token, rawOrder.get.token]
            var values = [rawOrder.give.amount, rawOrder.get.amount, rawOrder.expires, rawOrder.nonce]
            var amnt = Math.floor(parseInt(rawOrder.get.amount) * toFill.portion/1000).toString()

            var sig = rawOrder.signature

            // TODO: call canTrade, remove order if invalid
            // NOTE: this has to be shown upon opening the dialog; so the things that getAddresses, values, and amount, should be functions
            user.exchangeContract.methods.canTrade(addresses, values, sig.v, sig.r, sig.s, amnt, sig.sig_mode)
            .call(function(err, resp)
            {
                console.log('canTrade', err, resp)
            })

            user.exchangeContract.methods.didSign(rawOrder.user, rawOrder.hash, sig.v, sig.r, sig.s, sig.sig_mode)
            .call(function(err, resp)
            {
                console.log('didSign', err, resp)
            })

            // function getVolume(uint amountGet, address tokenGive, uint amountGive, address user, bytes32 hash) public view returns (uint) {
            user.exchangeContract.methods.getVolume(rawOrder.get.amount, rawOrder.give.token, rawOrder.give.amount, rawOrder.user, rawOrder.hash)
            .call(function(err, resp)
            {
                console.log('getVolume', err, resp, amnt)
            })



            // NOTE: this has to be executed in the same tick as the click, otherwise trezor popups will be blocked
            var tx = user.exchangeContract.methods.trade(addresses, values, sig.v, sig.r, sig.s, amnt, sig.sig_mode)
            user.sendTx(tx, function(err, resp) {
                console.log(err, resp)
            })
        }
    }


    // HELPER: Fetch custom token
    // This fetches information about the custom token
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
