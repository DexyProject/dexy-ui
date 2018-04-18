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

                if (cfg.tokens[symbol] && cfg.tokens[symbol][0] === lastPart) {
                    $state.go('exchange', {pair: symbol}, {replace: true})
                } else {
                    $state.go('exchange', {pair: $stateParams.pair, token: token}, {replace: true})
                }
                // TODO warn user that they should be sure this is the token they should be trading
            })
            return
        }

        var token = $stateParams.token || cfg.tokens[lastPart]

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

        exchange.onOrders = { eth: 0, token: 0 }
        exchange.onExchange = 0
        exchange.onWallet = 0

        exchange.tokenInf = token
        exchange.token = new web3.eth.Contract(CONSTS.erc20ABI, token[0])

        var intvl = $interval(function () {
            fetchBalances()
            $scope.$root.$broadcast('reload-orders')
        }, CONSTS.FETCH_BALANCES_INTVL)
        $scope.$on('$destroy', function () {
            $interval.cancel(intvl)
        })

        $scope.$watch(function () {
            return user.publicAddr
        }, function () {
            fetchBalances()
            $scope.$root.$broadcast('reload-orders')
        })

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

            exchange.token.methods.allowance(user.publicAddr, cfg.vaultContract).call(function (err, allowance) {
                if (err) console.error(err)
                else {
                    // used by placeOrder
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

        exchange.mapOrder = function (order, i) {
            var takeAmnt = parseInt(order.take.amount)
            var makeAmnt = parseInt(order.make.amount)

            // assert that order.make.token or order.take.token is ZEROADDR ?

            var tokenAmount = (order.make.token === CONSTS.ZEROADDR ? takeAmnt : makeAmnt)
            var tokenBase = exchange.tokenInf[1]

            var ethAmount = (order.make.token === CONSTS.ZEROADDR ? makeAmnt : takeAmnt)
            var ethBase = CONSTS.ETH_MUL

            // Essentially divide ETH/tokens, but divide by bases first in order to convert the uints to floats
            var price = (ethAmount / ethBase) / (tokenAmount / tokenBase)

            var expires = new Date(order.expires * 1000)

            var left = takeAmnt - parseInt(order.filled, 10)

            // filled is in takeAmnt (taken)
            var takeFilled = order.filled

            //
            // since order.filled (from the back-end) always comes in takeAmnt, we need to convert it to eth and in token
            //
            // we take what % it is of the takeAmnt; essentially this is what % the order is filled at
            var proportion = takeFilled / takeAmnt

            // this is the filled converted to the makeAmnt
            var makeFilled = proportion * makeAmnt

            // if the get token is ETH, that means we need to convert filled - we use the converted makeFilled value
            var filledInToken = order.take.token === CONSTS.ZEROADDR ? makeFilled : takeFilled

            // if the get token is in ETH, then there's no need to convert
            // otherwise, we use the converted value - makeFilled
            var filledInETH = order.take.token === CONSTS.ZEROADDR ? takeFilled : makeFilled

            // Divide the leftover amount by the bases
            var leftInEth = ethAmount - filledInETH
            var leftInToken = tokenAmount - filledInToken

            return {
                order: order,
                id: order.hash,
                rate: price,
                amount: leftInToken / tokenBase,
                filledInToken: filledInToken / tokenBase,
                leftInEth: leftInEth / ethBase,
                isMine: user.publicAddr && order.user.toLowerCase() == user.publicAddr.toLowerCase(),
                type: order.take.token === CONSTS.ZEROADDR ? 'SELL' : 'BUY',
                expires: expires
            }
        }

        exchange.mapTransaction = function (tx, i) {

            var amount = parseInt(tx.make.token === CONSTS.ZEROADDR ? tx.take.amount : tx.make.amount) / exchange.tokenInf[1];
            var side = (tx.make.token === CONSTS.ZEROADDR ? 'buy' : 'sell');

            var time = new Date(tx.timestamp * 1000)

            var pad = function (x) {
                return ('00' + x).slice(-2)
            }
            return {
                idx: i,
                tx: tx.tx,
                time: time.getDate() + '/' + (time.getMonth() + 1) + ' ' + pad(time.getHours()) + ':' + pad(time.getMinutes()),
                side: side,
                amount: amount,
                price: calculatePrice(tx)
            }
        }

        // NOTE: similar math is used for the orderbook
        function calculatePrice(o) {
            var takeAmnt = parseInt(o.take.amount)
            var makeAmnt = parseInt(o.make.amount)

            var tokenAmount = (o.make.token === CONSTS.ZEROADDR ? takeAmnt : makeAmnt)
            var tokenBase = exchange.tokenInf[1]

            var ethAmount = (o.make.token === CONSTS.ZEROADDR ? makeAmnt : takeAmnt)
            var ethBase = CONSTS.ETH_MUL

            return (ethAmount / ethBase) / (tokenAmount / tokenBase)
        }

        exchange.txError = function (msg, err) {
            console.error(err)
            // @TODO: show the error itself?

            var append = typeof(err.message) === 'string' ? ': ' + err.message.split('\n')[0] : ''
            toastr.error(msg + append)
        }

        exchange.txSuccess = function (txid) {
            toastr.success(
                '<a style="color: white; text-decoration: underline;" href="' + cfg.etherscan + '/tx/' + txid + '" target="_blank">' + txid + '</a>',
                'Successfully submitted transaction',
                {escapeHtml: false}
            )
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
