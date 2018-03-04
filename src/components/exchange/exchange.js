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

        exchange.tokenInf = token
        exchange.token = new web3.eth.Contract(CONSTS.erc20ABI, token[0])

        // @TODO: tick/pulse that would propagate down to all sub-controllers
        var intvl = $interval(function() {
            fetchBalances()
            // consider firing reload-orders
        }, CONSTS.FETCH_BALANCES_INTVL)
        $scope.$on('$destroy', function () {
            $interval.cancel(intvl)
        })

        $scope.$watch(function() { return user.publicAddr }, function() {
            fetchBalances()
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

       exchange.mapOrder = function(order, i) {
            var getAmnt = parseInt(order.get.amount)
            var giveAmnt = parseInt(order.give.amount)

            // assert that order.give.token or order.get.token is ZEROADDR ?

            var tokenAmount = (order.give.token === CONSTS.ZEROADDR ? getAmnt : giveAmnt)
            var tokenBase = exchange.tokenInf[1]

            var ethAmount = (order.give.token === CONSTS.ZEROADDR ? giveAmnt : getAmnt)
            var ethBase = 1000000000000000000

            var price = (ethAmount / ethBase) / (tokenAmount / tokenBase)

            var expires = new Date(1970, 0, 1);
            expires.setSeconds(order.expires);

            var left = getAmnt - parseInt(order.filled, 10)

            // alternative way to write that logic: get.token == ZEROADDR ? convert(left) : left
            var filledInToken = order.give.token === CONSTS.ZEROADDR ? order.filled : order.filled / price
            var filledInETH = order.give.token === CONSTS.ZEROADDR ? order.filled * price : order.filled

            var leftInEth = (ethAmount - filledInETH) / ethBase
            var leftInToken = (tokenAmount /*- filledInToken*/) / tokenBase

            return {
                order: order,
                id: order.hash,
                rate: price,
                amount: leftInToken,
                leftInEth: leftInEth,
                expires: expires
            }
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
