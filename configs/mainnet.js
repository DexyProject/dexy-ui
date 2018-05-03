module.exports = {
    exchangeContract: '0x1d150cfcd9bfa01e754e034442341ba85b85f1bb',
    vaultContract: '0x3956925d7d5199a6db1f42347fedbcd35312ae82',
    endpoint: 'https://api.dexy.exchange/v1',

    exchangeFee: 0.0,

    chainId: 1,
    ethUrl: 'https://mainnet.infura.io/W0a3PCAj1UfQZxo5AIrv',

    etherscan: 'https://etherscan.io',

    warningMsg: 'Exchange is configured for Ethereum mainnet, please switch to mainnet.',

    tokens: require('./tokens/index'),
    markets: ["EOS","TRX","USDT","QTUM","OMG","ICX","BNB","DGD","PPT","MKR","SNT","AE","REP","ZRX","VERI","BTM","DRGN","BAT","GNT","ZIL","LRC","AION","ELF","FUN","KNC","SALT","KIN","DENT","POWR","PAY","DCN","CND","BNT","PLR","ICN","REQ","POLY","SMART","AGI","GNO","WAX","QSP","GVT","ENJ","STORJ","RDN","SAN","MCO","CVC","POE","MANA","SUB","STORM","ANT","RLC","VEE","PPP","DTR","MTL","ADX","PRL","TEL","ITC","OST","AMB","NULS","EDG","WPR","SPANK","QRL","C20","EDO","SNM","MLN","WINGS","JNT","AST","APPC","SNGLS","FUEL","CMT","COB","INS","SRN","MGO","UTK"],
}
