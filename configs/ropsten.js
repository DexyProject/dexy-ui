module.exports = {
    exchangeContract: '0xc82448db0752b61c437804eef00faccaef4944cd',
    vaultContract: '0xe2d89219fbab5b09fee646a4c5efeb0b702c9630',
    endpoint: 'https://testnet.dexy.exchange',

    exchangeFee: 0.25,

    chainId: 3,
    ethUrl: 'https://ropsten.infura.io/W0a3PCAj1UfQZxo5AIrv',

    etherscan: 'https://ropsten.etherscan.io',

    warningMsg: 'Exchange is configured for Ropsten, please switch to Ropsten.',

    tokens: { 'TULIP': ['0xbebb2325ef529e4622761498f1f796d262100768', 100000000], 'MADX': ['0xd06632e3916776e781d66a7a08ffbb77271742f7', 10000] },
    markets: ['TULIP', 'MADX'],
}