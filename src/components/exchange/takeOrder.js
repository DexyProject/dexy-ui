(function () {
    'use strict';

    // Take order ctrl

    angular
        .module('dexyApp')
        .controller('takeOrderCtrl', takeOrderCtrl);

    takeOrderCtrl.$inject = ['$scope', 'user'];

    function takeOrderCtrl($scope, user) {
        var exchange = $scope.exchange

        $scope.openTakeOrderDialog = function (side, order) {
            var maxAmnt = side === 'SELL' ?
                (exchange.onExchange - exchange.onOrders.token)
                : (user.ethBal.onExchange - exchange.onOrders.eth) / order.rate

            var maxPortion = Math.floor(maxAmnt / order.amount * 1000)

            $scope.exchange.toFill = {
                order: order,
                maxPortion: maxPortion,
                portion: Math.min(maxPortion, 1000),
                side: side,
            }
            $('#takeOrder').modal('show')
        }
        $scope.takeOrder = function (toFill) {
            var rawOrder = toFill.order.order

            // WARNING: check !the order.exchange address is the same as what we're currently operating with
            // throw an error if not

            // addresses - user, tokenGive, tokenGet
            var addresses = [rawOrder.user, rawOrder.give.token, rawOrder.get.token]
            var values = [rawOrder.give.amount, rawOrder.get.amount, rawOrder.expires, rawOrder.nonce]
            var portion = toFill.portion / 1000

            var amnt = Math.floor(parseInt(rawOrder.get.amount) * portion).toString()

            var sig = rawOrder.signature

            // NOTE: this has to be executed in the same tick as the click, otherwise trezor popups will be blocked
            var tx = user.exchangeContract.methods.trade(addresses, values, sig.v, sig.r, sig.s, amnt, sig.sig_mode)
            user.sendTx(tx, {from: user.publicAddr, gas: 150 * 1000, gasPrice: user.GAS_PRICE}, function (err, txid) {
                if (err) return $scope.exchange.txError('Error taking order', err)

                $('#takeOrder').modal('hide')
                if (txid) $scope.exchange.txSuccess(txid)
            })
        }

        // will only get triggered when the reference to the object changes
        // which essentially means it won't double-trigger once we set toFill.canTrade
        /*
        $scope.$watch(function() { return $scope.exchange.toFill }, function(toFill) {
            if (! toFill) return
            if (! toFill.order) return
            var rawOrder = toFill.order.order

            var addresses = [rawOrder.user, rawOrder.give.token, rawOrder.get.token]
            var values = [rawOrder.give.amount, rawOrder.get.amount, rawOrder.expires, rawOrder.nonce]
            var portion = toFill.portion / 1000
            var amnt = Math.floor(parseInt(rawOrder.get.amount) * portion).toString()

            var sig = rawOrder.signature

            // @TODO: call canTrade, remove order if invalid
            // @TODO: call isApproved before that, and if it's not, make the user wait. or say "you cannot submit an order yet"
            //   same goes for filling
            // NOTE: this has to be shown upon opening the dialog; so the things that getAddresses, values, and amount, should be functions
            console.log(amnt)
            user.exchangeContract.methods.canTrade(addresses, values, sig.v, sig.r, sig.s, amnt, sig.sig_mode)
                .call(function (err, resp) {
                    if (err) toastr.err('Error getting order canTrade status')
                    else $scope.exchange.toFill.canTrade = resp

                    console.log(resp)

                    !$scope.$$phase && $scope.$digest()
                })

            // For debugging purposes
            // user.exchangeContract.methods.didSign(rawOrder.user, rawOrder.hash, sig.v, sig.r, sig.s, sig.sig_mode)
            //     .call(function (err, resp) {
            //         console.log('didSign', err, resp)
            //     })
        })
        */   
    }

})();
