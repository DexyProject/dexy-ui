(function (getConsts) {
    window.CONSTS = getConsts()
})(function () {
    'use strict';

    var consts = {}

    consts.erc20ABI = [{
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
        "name": "approve",
        "outputs": [{"name": "success", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {
            "name": "_value",
            "type": "uint256"
        }],
        "name": "transferFrom",
        "outputs": [{"name": "success", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "version",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
        "name": "transfer",
        "outputs": [{"name": "success", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_spender", "type": "address"}, {
            "name": "_value",
            "type": "uint256"
        }, {"name": "_extraData", "type": "bytes"}],
        "name": "approveAndCall",
        "outputs": [{"name": "success", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}],
        "name": "allowance",
        "outputs": [{"name": "remaining", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "inputs": [{"name": "_initialAmount", "type": "uint256"}, {
            "name": "_tokenName",
            "type": "string"
        }, {"name": "_decimalUnits", "type": "uint8"}, {"name": "_tokenSymbol", "type": "string"}],
        "type": "constructor"
    }, {"payable": false, "type": "fallback"}, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "_from", "type": "address"}, {
            "indexed": true,
            "name": "_to",
            "type": "address"
        }, {"indexed": false, "name": "_value", "type": "uint256"}],
        "name": "Transfer",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "_owner", "type": "address"}, {
            "indexed": true,
            "name": "_spender",
            "type": "address"
        }, {"indexed": false, "name": "_value", "type": "uint256"}],
        "name": "Approval",
        "type": "event"
    }];
    consts.exchangeABI = [{
        "constant": true,
        "inputs": [{"name": "addresses", "type": "address[3]"}, {"name": "values", "type": "uint256[4]"}, {
            "name": "v",
            "type": "uint8"
        }, {"name": "r", "type": "bytes32"}, {"name": "s", "type": "bytes32"}, {
            "name": "amount",
            "type": "uint256"
        }, {"name": "mode", "type": "uint256"}],
        "name": "canTrade",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "HASH_SCHEME",
        "outputs": [{"name": "", "type": "bytes32"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "_address", "type": "address"}],
        "name": "isOwner",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "addr", "type": "address"}, {"name": "hash", "type": "bytes32"}, {
            "name": "v",
            "type": "uint8"
        }, {"name": "r", "type": "bytes32"}, {"name": "s", "type": "bytes32"}, {"name": "mode", "type": "uint8"}],
        "name": "didSign",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_takerFee", "type": "uint256"}],
        "name": "setFees",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_feeAccount", "type": "address"}],
        "name": "setFeeAccount",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "addresses", "type": "address[3]"}, {"name": "values", "type": "uint256[4]"}, {
            "name": "v",
            "type": "uint8"
        }, {"name": "r", "type": "bytes32"}, {"name": "s", "type": "bytes32"}, {
            "name": "amount",
            "type": "uint256"
        }, {"name": "mode", "type": "uint256"}],
        "name": "trade",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "addresses", "type": "address[3]"}, {"name": "values", "type": "uint256[4]"}, {
            "name": "v",
            "type": "uint8"
        }, {"name": "r", "type": "bytes32"}, {"name": "s", "type": "bytes32"}, {"name": "mode", "type": "uint256"}],
        "name": "cancel",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "user", "type": "address"}, {"name": "hash", "type": "bytes32"}],
        "name": "filled",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "amountGet", "type": "uint256"}, {
            "name": "tokenGive",
            "type": "address"
        }, {"name": "amountGive", "type": "uint256"}, {"name": "user", "type": "address"}, {
            "name": "hash",
            "type": "bytes32"
        }],
        "name": "getVolume",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_newOwner", "type": "address"}],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "vault",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"name": "_takerFee", "type": "uint256"}, {
            "name": "_feeAccount",
            "type": "address"
        }, {"name": "_vault", "type": "address"}],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    }, {"payable": true, "stateMutability": "payable", "type": "fallback"}, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "hash", "type": "bytes32"}],
        "name": "Cancelled",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "hash", "type": "bytes32"}, {
            "indexed": false,
            "name": "tokenGive",
            "type": "address"
        }, {"indexed": false, "name": "amountGive", "type": "uint256"}, {
            "indexed": false,
            "name": "tokenGet",
            "type": "address"
        }, {"indexed": false, "name": "amountGet", "type": "uint256"}, {
            "indexed": false,
            "name": "maker",
            "type": "address"
        }, {"indexed": false, "name": "taker", "type": "address"}],
        "name": "Traded",
        "type": "event"
    }]
    consts.vaultABI = [{
        "constant": true,
        "inputs": [{"name": "_address", "type": "address"}],
        "name": "isOwner",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "token", "type": "address"}, {"name": "amount", "type": "uint256"}],
        "name": "deposit",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_exchange", "type": "address"}],
        "name": "setExchange",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "ETH",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "user", "type": "address"}, {"name": "exchange", "type": "address"}],
        "name": "isApproved",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "from", "type": "address"}, {"name": "value", "type": "uint256"}, {
            "name": "data",
            "type": "bytes"
        }],
        "name": "tokenFallback",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_exchange", "type": "address"}],
        "name": "approve",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "token", "type": "address"}, {"name": "from", "type": "address"}, {
            "name": "to",
            "type": "address"
        }, {"name": "amount", "type": "uint256"}],
        "name": "transfer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_newOwner", "type": "address"}],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "token", "type": "address"}, {"name": "amount", "type": "uint256"}],
        "name": "withdraw",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "token", "type": "address"}, {"name": "user", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "exchange", "type": "address"}],
        "name": "unapprove",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "user", "type": "address"}, {
            "indexed": false,
            "name": "token",
            "type": "address"
        }, {"indexed": false, "name": "amount", "type": "uint256"}],
        "name": "Deposited",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "user", "type": "address"}, {
            "indexed": false,
            "name": "token",
            "type": "address"
        }, {"indexed": false, "name": "amount", "type": "uint256"}],
        "name": "Withdrawn",
        "type": "event"
    }]

    consts.SIGMODES = {
        TYPED: 0,
        GETH: 1,
        TREZOR: 2
    }

    consts.ZEROADDR = '0x0000000000000000000000000000000000000000'

    // Intervals
    consts.METAMASK_UPDATE_INTVL = 1500
    consts.ETHBAL_UPDATE_INTVL = 14 * 1000
    consts.FETCH_BALANCES_INTVL = 14 * 1000
    consts.NONCE_UPDATE_INTVL = 15 * 1000

    return consts
})
