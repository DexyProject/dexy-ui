(function (getConsts) {
    window.CONSTS = getConsts()
})(function () {
    'use strict';

    var consts = {}

    consts.erc20ABI = require('dexy-abi-erc20')
    consts.exchangeABI = require('dexy-abi-exchange')
    consts.vaultABI = require('dexy-abi-vault')

    consts.SIGMODES = {
        TYPED: 0,
        GETH: 1,
        TREZOR: 2
    }

    consts.ZEROADDR = '0x0000000000000000000000000000000000000000'

    consts.ETH_MUL = 1000000000000000000

    // Intervals
    consts.METAMASK_UPDATE_INTVL = 1500
    consts.ETHBAL_UPDATE_INTVL = 14 * 1000
    consts.FETCH_BALANCES_INTVL = 14 * 1000
    consts.NONCE_UPDATE_INTVL = 15 * 1000

    return consts
})
