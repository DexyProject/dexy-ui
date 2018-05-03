module.exports = {
    exchangeContract: '0xeea40bf84bd146ec53063b6aacfec250e23e200b',
    vaultContract: '0xbac2d30ecf6e22080ad8d11c892456c569a2f4dd',
    endpoint: 'https://testnet.dexy.exchange/v1',

    exchangeFee: 0.25,

    chainId: 3,
    ethUrl: 'https://ropsten.infura.io/W0a3PCAj1UfQZxo5AIrv',

    etherscan: 'https://ropsten.etherscan.io',

    warningMsg: 'Exchange is configured for Ropsten, please switch to Ropsten.',

    tokens: { 'TULIP': ['0xbebb2325ef529e4622761498f1f796d262100768', 100000000], 'MADX': ['0xd06632e3916776e781d66a7a08ffbb77271742f7', 10000] },
    markets: ['TULIP', 'MADX'],
}
