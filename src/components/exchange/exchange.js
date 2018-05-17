(function () {
    'use strict';

    // XXX NOTE
    // Using a directive for charts considered harmful
    // We will have to update the charts often, and often just a small portion (e.g. inserting a new bar)
    // Directives will require angular to re-render the whole page, which is not efficient
    var BigNumber = require('bignumber.js')

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

                if (cfg.tokens[symbol] && cfg.tokens[symbol][0].toLowerCase() === lastPart.toLowerCase()) {
                    $state.go('exchange', {pair: symbol}, {replace: true})
                } else {
                    $state.go('exchange', {pair: $stateParams.pair, token: token}, {replace: true})
                }
                // TODO warn user that they should be sure this is the token they should be trading
            })
            return
        }

        exchange.onOrders = { eth: new BigNumber(0), token: new BigNumber(0) }
        exchange.onExchangeTokenBaseUnit = new BigNumber(0)
        exchange.onWalletTokenBaseUnit = new BigNumber(0)

        var token = $stateParams.token || cfg.tokens[lastPart.toUpperCase()]

        if (!token) {
            toastr.error('Unrecognized token: "'+$stateParams.pair+'"')
            $state.go('markets')
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

        // This is a temporary measure to workaround the fact we need this in the header
        // The proper solution would be a router view (in the past, we had this for indicators)
        $scope.$root.symbol = exchange.symbol

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
                    exchange.onWalletTokenBaseUnit = new BigNumber(bal)
                    exchange.walletAddr = addr
                    if (!$scope.$$phase) $scope.$apply()
                }
            })

            exchange.token.methods.allowance(user.publicAddr, cfg.vaultContract).call(function (err, allowance) {
                if (err) console.error(err)
                else {
                    // used by wallet.js (assetsMove)
                    exchange.rawAllowance = new BigNumber(allowance)
                }
            })

            user.vaultContract.methods.balanceOf(token[0], addr).call(function (err, bal) {
                if (err) console.error(err)
                else {
                    exchange.onExchangeTokenBaseUnit = new BigNumber(bal)
                    if (!$scope.$$phase) $scope.$apply()
                }
            })
        }

        exchange.mapOrder = function (rawOrder, i) {
            // rawOrder - as it comes from the API; all numbers are strings

            var takeAmnt = new BigNumber(rawOrder.take.amount)
            var makeAmnt = new BigNumber(rawOrder.make.amount)

            // assert that rawOrder.make.token or order.take.token is ZEROADDR ?

            var tokenAmount = (rawOrder.make.token === CONSTS.ZEROADDR ? takeAmnt : makeAmnt)
            var tokenBase = exchange.tokenInf[1]

            var ethAmount = (rawOrder.make.token === CONSTS.ZEROADDR ? makeAmnt : takeAmnt)
            var ethBase = CONSTS.ETH_MUL

            // Essentially divide ETH/tokens, but divide by bases first in rawOrder to convert the integers to floats
            var price = (ethAmount.dividedBy(ethBase))
                .dividedBy(tokenAmount.dividedBy(tokenBase))

            var expires = new Date(parseInt(rawOrder.expires, 10) * 1000)


            // filled is in takeAmnt (taken)
            var takeFilled = new BigNumber(rawOrder.filled)

            // we take what % it is of the takeAmnt; essentially this is what % the order is filled at
            var proportion = takeFilled.dividedBy(takeAmnt)

            // this is the filled converted to the makeAmnt
            var makeFilled = proportion.multipliedBy(makeAmnt)

            //
            // since rawOrder.filled (from the back-end) always comes in takeAmnt, we need to convert it to eth and in token
            //
            // if the get token is ETH, that means we need to convert filled - we use the converted makeFilled value
            var filledInToken = rawOrder.take.token === CONSTS.ZEROADDR ? makeFilled : takeFilled

            // if the get token is in ETH, then there's no need to convert
            // otherwise, we use the converted value - makeFilled
            var filledInETH = rawOrder.take.token === CONSTS.ZEROADDR ? takeFilled : makeFilled

            // Divide the leftover amount by the bases
            var leftInEth = ethAmount.minus(filledInETH)
            var leftInToken = tokenAmount.minus(filledInToken)

            return {
                rawOrder: rawOrder,
                id: rawOrder.hash,
                rate: price,
                amount: leftInToken.dividedBy(tokenBase),
                filledInToken: filledInToken.dividedBy(tokenBase),
                leftInEth: leftInEth.dividedBy(ethBase),
                isMine: user.publicAddr && rawOrder.maker.toLowerCase() == user.publicAddr.toLowerCase(),
                type: rawOrder.take.token === CONSTS.ZEROADDR ? 'SELL' : 'BUY',
                expires: expires
            }
        }

        exchange.mapTransaction = function (tx, i) {

            var amount = Math.floor(tx.make.token === CONSTS.ZEROADDR ? tx.take.amount : tx.make.amount) / exchange.tokenInf[1];
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
        // This is only used for display purposes (in tx history), so no BigNumber for now
        function calculatePrice(o) {
            var takeAmnt = parseInt(o.take.amount, 10)
            var makeAmnt = parseInt(o.make.amount, 10)

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

        exchange.showOverlay = function (s) {
            var stage
            if (!user.publicAddr) stage = 'authenticate'
            else if (!exchange.isVaultApproved) stage = 'approval'
            else if (exchange.onExchangeTokenBaseUnit.eq(0) && user.ethBal.onExchangeBaseUnit.eq(0)) stage = 'deposit'
            
            if (s === 'any') return !!stage
            else return s === stage
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
                props.symbol = res.toUpperCase()
                cb(null, props)
            })
        })
    }
})();
