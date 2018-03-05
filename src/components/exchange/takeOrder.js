(function () {
    'use strict';

    // Take order ctrl

    angular
        .module('dexyApp')
        .controller('takeOrderCtrl', takeOrderCtrl);

    takeOrderCtrl.$inject = ['$scope', 'user'];

    function takeOrderCtrl($scope, user) {

        $scope.openTakeOrderDialog = function (side, order) {
            console.log('openTakeOrderDialog ' + side)
            $scope.exchange.toFill = {
                order: order,
                portion: 1000,
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
            var amnt = Math.floor(parseInt(rawOrder.get.amount) * toFill.portion / 1000).toString()

            var sig = rawOrder.signature

            // @TODO: call canTrade, remove order if invalid
            // @TODO: call isApproved before that, and if it's not, make the user wait. or say "you cannot submit an order yet"
            //   same goes for filling
            // NOTE: this has to be shown upon opening the dialog; so the things that getAddresses, values, and amount, should be functions
            user.exchangeContract.methods.canTrade(addresses, values, sig.v, sig.r, sig.s, amnt, sig.sig_mode)
            .call(function (err, resp) {
                console.log('canTrade', err, resp)
            })

            user.exchangeContract.methods.didSign(rawOrder.user, rawOrder.hash, sig.v, sig.r, sig.s, sig.sig_mode)
            .call(function (err, resp) {
                console.log('didSign', err, resp)
            })

            /*
            // function getVolume(uint amountGet, address tokenGive, uint amountGive, address user, bytes32 hash) public view returns (uint) {
            user.exchangeContract.methods.getVolume(rawOrder.get.amount, rawOrder.give.token, rawOrder.give.amount, rawOrder.user, rawOrder.hash)
            .call(function(err, resp)
            {
                console.log('getVolume', err, resp, amnt)
            })
            */

            // NOTE: this has to be executed in the same tick as the click, otherwise trezor popups will be blocked
            var tx = user.exchangeContract.methods.trade(addresses, values, sig.v, sig.r, sig.s, amnt, sig.sig_mode)
            user.sendTx(tx, {from: user.publicAddr, gas: 150 * 1000, gasPrice: user.GAS_PRICE}, function (err, txid) {
                if (err) return $scope.exchange.txError('Error taking order', err)

                $('#takeOrder').modal('hide')
                if (txid) toastr.success('Successfully submitted transaction: ' + txid)
            })
        }
    }

})();
