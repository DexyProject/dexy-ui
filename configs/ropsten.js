module.exports = {
    exchangeContract: '0x0584d28d5f9f28356fc93c6732c69ef6aef716f6',
    vaultContract: '0xbad42fee6a0518f2a7d33c02969475f2dcdb7283',
    endpoint: 'https://testnet.dexy.exchange',

    exchangeFee: 0.25,

    chainId: 3,
    ethUrl: 'https://ropsten.infura.io/W0a3PCAj1UfQZxo5AIrv',

    etherscan: 'https://ropsten.etherscan.io',

    warningMsg: 'Exchange is configured for Ropsten, please switch to Ropsten.',

    tokens: { 'TULIP': ['0xbebb2325ef529e4622761498f1f796d262100768', 100000000], 'MADX': ['0xd06632e3916776e781d66a7a08ffbb77271742f7', 10000] },
    markets: ['TULIP', 'MADX'],
}