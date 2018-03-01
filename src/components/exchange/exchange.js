(function () {
    'use strict';

    // XXX NOTE
    // Using a directive for charts considered harmful
    // We will have to update the charts often, and often just a small portion (e.g. inserting a new bar)
    // Directives will require angular to re-render the whole page, which is not efficient

    angular
        .module('dexyApp')
        .controller('exchangeCtrl', exchangeCtrl);

    exchangeCtrl.$inject = ['$scope', '$stateParams', '$state', '$interval', 'user'];

    function exchangeCtrl($scope, $stateParams, $state, $interval, user) {
        var exchange = this;

        $scope.exchangeAddr = CONSTS.exchangeContract
        $scope.exchangeContract = user.exchangeContract

        // exchange page: loading state and error (404) state

        var lastPart = $stateParams.pair.split('/').pop()

        // Handle custom tokens
        if (web3.utils.isAddress(lastPart) && !$stateParams.token) {
            fetchCustomToken(lastPart, function (err, props) {
                if (err) {
                    toastr.error('Invalid ERC20 token address')
                    console.error(err)
                    return
                }

                var multiplier = Math.pow(10, props.decimals)
                var symbol = props.symbol
                var token = [lastPart, multiplier, symbol]

                if (CONSTS.tokens[symbol] && CONSTS.tokens[symbol][0] === lastPart) {
                    $state.go('exchange', {pair: symbol}, {replace: true})
                } else {
                    $state.go('exchange', {pair: $stateParams.pair, token: token}, {replace: true})
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

        $scope.$watch(function () { return user.publicAddr }, function() {
            fetchBalances()
            fetchOrders()
        })

        // @TODO: tick/pulse that would propagate down to all sub-controllers
        var intvl = $interval(fetchBalances, CONSTS.FETCH_BALANCES_INTVL)
        $scope.$on('$destroy', function () {
            $interval.cancel(intvl)
        })

        function fetchOrders() {
            if (!user.publicAddr) return

            fetch(CONSTS.endpoint + "/orders?token=" + exchange.tokenInf[0] + "&user=" + user.publicAddr)
            .then(function (res) {
                return res.json()
            })
            .then(function (ob) {
                exchange.orders = (ob || []).map(exchange.mapOrder)
                if (!$scope.$$phase) $scope.$digest()
            })
            .catch(function (err) {
                console.error(err)
            })
        }

        function fetchBalances() {
            var addr = user.publicAddr
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

            exchange.token.methods.allowance(user.publicAddr, CONSTS.vaultContract).call(function (err, allowance) {
                if (err) console.error(err)
                else {
                    // used by placeeOrder
                    exchange.rawAllowance = parseInt(allowance)
                }
            })

            user.vaultContract.methods.balanceOf(token[0], addr).call(function (err, bal) {
                if (err) console.error(err)
                else {
                    var tokenBal = bal / token[1]
                    exchange.onExchange = tokenBal
                    if (!$scope.$$phase) $scope.$apply()
                }
            })
        }

        loadHistory()

        function loadHistory() {
            fetch(CONSTS.endpoint + "/trades?token=" + exchange.tokenInf[0])
                .then(function (res) {
                    return res.json()
                })
                .then(function (history) {
                    exchange.trades = (history || []).map(mapTransaction)
                    if (!$scope.$$phase) $scope.$digest()
                })
                .catch(function (err) {
                    LxNotificationService.error('Error loading history')
                    console.error(err)
                })
        }

       exchange.mapOrder = function(order, i) {
            var getAmnt = parseInt(order.get.amount)
            var giveAmnt = parseInt(order.give.amount)

            var tokenBase = exchange.tokenInf[1]

            var tokenAmount = (order.give.token === CONSTS.ZEROADDR ? getAmnt : giveAmnt)

            var ethAmount = (order.give.token === CONSTS.ZEROADDR ? giveAmnt : getAmnt)
            var ethBase = 1000000000000000000

            var price = (ethAmount / ethBase) / (tokenAmount / tokenBase)

            var expires = new Date(1970, 0, 1);
            expires.setSeconds(order.expires);

            var left = (ethAmount - order.filled) / ethBase

            return {
                order: order,
                id: order.hash,
                rate: price,
                amount: tokenAmount / tokenBase,
                left: left,
                filled: order.filled,
                expires: expires
            }
        }

        function mapTransaction(tx, i) {

            var amount = parseInt(tx.give.token === CONSTS.ZEROADDR ? tx.get.amount : tx.give.amount) / exchange.tokenInf[1];
            var side = (tx.give.token === CONSTS.ZEROADDR ? 'buy' : 'sell');

            var time = new Date(1970, 0, 1);
            time.setSeconds(tx.timestamp);

            return {
                idx: i,
                tx: tx.tx,
                time: time.getDate() + '/' + (time.getMonth()+1) + ' ' + time.getHours() + ':' + time.getMinutes(),
                side: side,
                amount: amount,
                price: calculatePrice(tx)
            }
        }

        function calculatePrice(o) {
            var getAmnt = parseInt(o.get.amount)
            var giveAmnt = parseInt(o.give.amount)

            var tokenBase = exchange.tokenInf[1]

            var tokenAmount = (o.give.token === CONSTS.ZEROADDR ? getAmnt : giveAmnt)

            var ethAmount = (o.give.token === CONSTS.ZEROADDR ? giveAmnt : getAmnt)
            var ethBase = 1000000000000000000

            return (ethAmount / ethBase) / (tokenAmount / tokenBase)
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

        $scope.cancel = function (order) {
            var addresses = [order.user, order.give.token, order.get.token]
            var values = [order.give.amount, order.get.amount, order.expires, order.nonce]

            var sig = order.signature

            var tx = user.exchangeContract.methods.cancel(addresses, values, sig.v, sig.r, sig.s, sig.sig_mode)
            user.sendTx(tx, { from: user.publicAddr, gas: 200 * 1000, gasPrice: user.GAS_PRICE }, function (err, txid) {
                console.log(err, txid)

                if (txid) LxNotificationService.success('Successfully submitted transaction: ' + txid)
            })
        }

        // Vault approval (@TODO: vaultApproval.js)
        $scope.$watch(function () {
            return user.publicAddr
        }, checkVaultApproval)

        function checkVaultApproval() {
            if (!user.publicAddr) return

            user.vaultContract.methods.isApproved(user.publicAddr, CONSTS.exchangeContract)
            .call(function (err, isApproved) {
                if (err) console.error(err)

                if (isApproved === false) $('#approveExchangeByVault').modal('show')
            })

        }

        exchange.approveExchangeByVault = function () {
            var tx = user.vaultContract.methods.approve(CONSTS.exchangeContract)

            // @TODO: saner gas limit
            user.sendTx(tx, {from: user.publicAddr, gas: 100 * 1000, gasPrice: user.GAS_PRICE}, function (err, txid) {
                // @OTODO: handle errors
                console.log(err, txid)

                if (txid) toastr.success('Successfully submitted transaction: ' + txid)

                $('#approveExchangeByVault').modal('hide')
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
})();
