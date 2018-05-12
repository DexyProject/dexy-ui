module.exports = {
    exchangeContract: '0xbdf08896a74a1d02b06a4e9bacc2f1cff1537f1d',
    vaultContract: '0x301700d86fc22befdf71ed7bb87425bf4e9dea65',
    endpoint: 'https://ropsten.dexy.exchange/v1',

    exchangeFee: 0.25,

    chainId: 3,
    ethUrl: 'https://ropsten.infura.io/W0a3PCAj1UfQZxo5AIrv',

    etherscan: 'https://ropsten.etherscan.io',

    warningMsg: 'Exchange is configured for Ropsten, please switch to Ropsten.',

    tokens: { 'TULIP': ['0xbebb2325ef529e4622761498f1f796d262100768', 100000000], 'MADX': ['0xd06632e3916776e781d66a7a08ffbb77271742f7', 10000] },
    markets: ['TULIP', 'MADX'],
}
