(function(getConsts) {
    window.CONSTS = getConsts()
})(function() {
    'use strict';

    var consts = { }

    consts.erc20ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_initialAmount","type":"uint256"},{"name":"_tokenName","type":"string"},{"name":"_decimalUnits","type":"uint8"},{"name":"_tokenSymbol","type":"string"}],"type":"constructor"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];
    consts.exchangeABI = [{"constant":true,"inputs":[{"name":"addresses","type":"address[3]"},{"name":"values","type":"uint256[4]"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"amount","type":"uint256"},{"name":"mode","type":"uint256"}],"name":"canTrade","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"HASH_SCHEME","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"},{"name":"hash","type":"bytes32"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"mode","type":"uint8"}],"name":"didSign","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_takerFee","type":"uint256"}],"name":"setFees","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_feeAccount","type":"address"}],"name":"setFeeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addresses","type":"address[3]"},{"name":"values","type":"uint256[4]"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"amount","type":"uint256"},{"name":"mode","type":"uint256"}],"name":"trade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ETH","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addresses","type":"address[3]"},{"name":"values","type":"uint256[4]"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"mode","type":"uint256"}],"name":"cancel","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"hash","type":"bytes32"}],"name":"filled","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"user","type":"address"},{"name":"hash","type":"bytes32"}],"name":"getVolume","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"},{"name":"user","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_takerFee","type":"uint256"},{"name":"_feeAccount","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"user","type":"address"},{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"user","type":"address"},{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"}],"name":"Cancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"tokenGive","type":"address"},{"indexed":false,"name":"amountGive","type":"uint256"},{"indexed":false,"name":"tokenGet","type":"address"},{"indexed":false,"name":"amountGet","type":"uint256"},{"indexed":false,"name":"maker","type":"address"},{"indexed":false,"name":"taker","type":"address"}],"name":"Traded","type":"event"}]
    
    consts.ethUrl = 'https://mainnet.infura.io/W0a3PCAj1UfQZxo5AIrv'

    consts.markets = [{"name":"EOS","symbol":"EOS","erc20":["0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0",1000000000000000000]},{"name":"OmiseGO","symbol":"OMG","erc20":["0xd26114cd6ee289accf82350c8d8487fedb8a0c07",1000000000000000000]},{"name":"Status","symbol":"SNT","erc20":["0x744d70fdbe2ba4cf95131626614a1763df805b9e",1000000000000000000]},{"name":"Populous","symbol":"PPT","erc20":["0xd4fa1460f537bb9085d22c7bccb5dd450ef28e3a",100000000]},{"name":"VeChain","symbol":"VEN","erc20":["0xd850942ef8811f2a866692a623011bde52a462c1",1000000000000000000]},{"name":"Golem","symbol":"GNT","erc20":["0xa74476443119a942de498590fe1f2454d7d4ac0d",1000000000000000000]},{"name":"Binance Coin","symbol":"BNB","erc20":["0xB8c77482e45F1F44dE1745F52C74426C631bDD52",1000000000000000000]},{"name":"Augur","symbol":"REP","erc20":["0xe94327d07fc17907b4db788e5adf2ed424addff6",1000000000000000000]},{"name":"FunFair","symbol":"FUN","erc20":["0x419d0d8bdd9af5e606ae2232ed285aff190e711b",100000000]},{"name":"Basic Attention Token","symbol":"BAT","erc20":["0x0d8775f648430679a709e98d2b0cb6250d2887ef",1000000000000000000]},{"name":"Bytom","symbol":"BTM","erc20":["0xcb97e65f07da24d46bcdd078ebebd7c6e6e3d750",100000000]},{"name":"0x","symbol":"ZRX","erc20":["0xe41d2489571d322189246dafa5ebde1f4699f498",1000000000000000000]},{"name":"Santiment Network Token","symbol":"SAN","erc20":["0x7c5a0ce9267ed19b22f8cae653f198e3e8daf098",1000000000000000000]},{"name":"Po.et","symbol":"POE","erc20":["0x0e0989b1f9b8a38983c2ba8053269ca62ec9b195",100000000]},{"name":"Civic","symbol":"CVC","erc20":["0x41e5560054824ea6b0732e656e3ad64e20e94e45",100000000]},{"name":"Iconomi","symbol":"ICN","erc20":["0x888666ca69e0f178ded6d75b5726cee99a87d698",1000000000000000000]},{"name":"DigixDAO","symbol":"DGD","erc20":["0xe0b7927c4af23765cb51314a0e0521a9645f0e2a",1000000000]},{"name":"Gnosis","symbol":"GNO","erc20":["0x6810e776880c02933d47db1b9fc05908e5386b96",1000000000000000000]},{"name":"Bancor","symbol":"BNT","erc20":["0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c",1000000000000000000]},{"name":"Centra","symbol":"CTR","erc20":["0x96a65609a7b84e8842732deb08f56c3e21ac6f8a",1000000000000000000]},{"name":"Walton","symbol":"WTC","erc20":["0xb7cb1c96db6b22b0d3d9536e0108d062bd488f74",1000000000000000000]},{"name":"Metal","symbol":"MTL","erc20":["0xf433089366899d83a9f26a773d59ec7ecf30355e",100000000]},{"name":"Monaco","symbol":"MCO","erc20":["0xb04cfa8a26d602fb50232cee0daf29060264e04b",100000000]},{"name":"Aragon","symbol":"ANT","erc20":["0x960b236a07cf122663c4303350609a66a7b288c0",1000000000000000000]},{"name":"iExec RLC","symbol":"RLC","erc20":["0x607f4c5bb672230e8672085532f7e901544a7375",1000000000]},{"name":"PayPie","symbol":"PPP","erc20":["0xbbf0e972b9b005de15fa3ec05bf09bb389154a91",1000000]},{"name":"SONM","symbol":"SNM","erc20":["0x983f6d60db79ea8ca4eb9968c6aff8cfa04b3c63",1000000000000000000]},{"name":"AdEx","symbol":"ADX","erc20":["0x4470bb87d77b963a013db939be332f927f2b992e",10000]},{"name":"AirSwap","symbol":"AST","erc20":["0x27054b13b1b798b345b591a4d22e6562d47ea75a",10000]},{"name":"Melon","symbol":"MLN","erc20":["0xbeb9ef514a379b997e0798fdcc901ee474b6d9a1",1000000000000000000]},{"name":"FirstBlood","symbol":"1ST","erc20":["0xaf30d2a7e90d7dc361c8c4585e9bb7d2f6f15bc7",1000000000000000000]},{"name":"Cofound.it","symbol":"CFI","erc20":["0x12fef5e57bf45873cd9b62e9dbd7bfb99e32d73e",1000000000000000000]}]

    // Ropsten addr
    consts.exchangeContract = '0x3db7a4c4c30eaec1ac7301c3f95920afbe6719e3'
    
    // Ropsten test
    consts.markets = [{name: "TULIPS", symbol: "TULIP", "erc20": ["0xbebb2325ef529e4622761498f1f796d262100768", 100000000]},{name:"MADX", symbol: "MADX", "erc20": ["0xd06632e3916776e781d66a7a08ffbb77271742f7", 10000]}]

    // Ropsten eth
    consts.ethUrl = 'https://ropsten.infura.io/W0a3PCAj1UfQZxo5AIrv'

    // warning needs to be updated
    consts.tokens = {"TULIP": ["0xbebb2325ef529e4622761498f1f796d262100768", 100000000], "MADX": ["0xd06632e3916776e781d66a7a08ffbb77271742f7", 10000], "401":["0xbb136e2ddcc1afb1c9341b55b745f11e86fa0dfd",1000000000],"408":["0x7d44f234c7df1d9ffd06839773a1257a6a89bb92",1000000000],"666":["0x0305a2630a324f7807759e210391c054f45d7c76",1000000],"888":["0x87d9bf506b434e9973cb0e6183da7a50a16796b2",1000000000000000000],"DGD":["0xe0b7927c4af23765cb51314a0e0521a9645f0e2a",1000000000],"USD":["0x01a7018e6d1fde8a68d12f59b6532fb523b6259d",100000000],"EUR":["0xdd239298e512427ba98b6602e4c8050c3e21f58b",100000000],"GBP":["0x45901fa08636c31b647c363fc01a8d4de2a551a1",100000000],"MKR":["0xc66ea802717bfb9833400264dd12c2bceaa34a6d",1000000000000000000],"NXC":["0x45e42d659d9f9466cd5df622506033145a9b89bc",1000],"PLU":["0xd8912c10681d8b21fd3742244f44658dba12264e",1000000000000000000],"XAU":["0x4df812f6064def1e5e029f1ca858777cc98d2d81",100000000],"ICN":["0x888666ca69e0f178ded6d75b5726cee99a87d698",1000000000000000000],"ARC":["0xac709fcb44a43c35f0da4e3163b117a17f3770f5",1000000000000000000],"DAO":["0xbb9bc244d798123fde783fcc1c72d3bb8c189413",10000000000000000],"LON":["0x61f17f02205d81bd875d2f767ed84c741e5cfb44",1000000000],"1ST":["0xaf30d2a7e90d7dc361c8c4585e9bb7d2f6f15bc7",1000000000000000000],"DGX":["0x55b9a11c2e8351b4ffc7b11561148bfac9977855",1000000000],"GNT":["0xa74476443119a942de498590fe1f2454d7d4ac0d",1000000000000000000],"NYC":["0xae49b8e744b919e380b46410ea2a0fe31205a80f",1000000],"GNW":["0x936f78b9852d12f5cb93177c1f84fb8513d06263",1000000000000000000],"GTK":["0x9b8eb09a59a180e7798fbe7e099c8c351ac56af0",10000000],"BIP":["0xf3d29fb98d2dc5e78c87198deef99377345fd6f1",100000000],"THB":["0xff71cb760666ab06aa73f34995b42dd4b85ea07b",10000],"LDR":["0xf780550dbc9ec7a6927cf6dc75a71fd99461f58a",1000000],"VAC":["0x86ffd96b012681e379911a221a2fad690f1c4673",1000],"PRC":["0xfc20aadbecdb31bd4b9b028930d09963342b5e6d",1000000],"TRP":["0xe2cb64a0f688be76484afec577e26bef19a717a0",1048576],"CMC":["0x5b9d2b43ba8a64523c233f1fc4929c1148e2f7ed",1000000],"MCG":["0x4a5295b308bb004d047b9b6fc01b1c332127a01c",1000000],"ILC":["0xc57fd11f7ae912853292430af119af17ef3cb4ab",1000000],"DTC":["0xf807d512f0601f59710dcf89f3856c2542b4cb8f",1000000],"BCD":["0x1e797ce986c3cff4472f7d38d5c4aba55dfefe40",1000000000000000],"GCR":["0xa686de8df4029cc736d124ddba695dd2c67c279b",1000000000000000000],"SJC":["0x042a7035b10cec4dce51a2cad2513d95bf3d178b",1000000],"VUC":["0x818d86af7e4958d879673da2ce9cf55515166336",1000000],"INR":["0x23bf0408ec1dee24c71614bfdfaf06c7b98eadff",100],"DXF":["0x72a68fb6d91ed8dc47b564e088e518c6d4a6ff44",1000000000000000000],"EQA":["0xe9436e4cb00f38215a941c7141ee98348fdcce6d",100000000],"TLA":["0x347510e7df3b87b74bf27d0991e0d05fa1352177",1000000],"HKG":["0x14f37b574242d366558db61f3335289a5035c506",1000],"CHF":["0x5a90e3a84398da65c376284b579a32bf1a67719b",1000000000000000000],"QCH":["0xe9101ff156f3e65cde087c18e6dc5a5878af5657",1000000000000000000],"QAT":["0x6c0dd7f4166e3d0c1789313b4615a2f23ec5c256",1000000],"QAR":["0x0a7850466c84ebd5cedb0262c6e268e2206fcea6",1000000],"MLN":["0xbeb9ef514a379b997e0798fdcc901ee474b6d9a1",1000000000000000000],"WTF":["0x4df3d3c977f3f7c8a3572ff20e93570b4e9716b7",1000000000000],"ROL":["0x2e071d2966aa7d8decb1005885ba1977d6038a65",10000000000000000],"SEX":["0x39619a9122205148a022a0cef805f5187d9cd1fa",1000000],"TIM":["0x6531f133e6deebe7f2dce5a0441aa7ef330b4e53",100000000],"IND":["0x80822493fc792641c9f6b4f14a71b0cd486b4a7d",1000000000000000000],"STV":["0x20675220a99d40f5f55868d6d687f66584c2c502",1000000000000000000],"TIG":["0x059d4329078dca62c521779c0ce98eb9329349e6",1000000000000000000],"RBX":["0x74aca0f1a40f7e0f3845dadf52c65060de7749af",100000000],"WCT":["0x9453be6fd512c7d4c97658f856c863bdc88496f3",100],"CRB":["0xaef38fbfbf932d1aef3b808bc8fbd8cd8e1f8bc5",100000000],"INC":["0x3ff8c78e266395d08f41ef1631391f0050d48081",100000000],"WAV":["0xe57a41170f18fab3248d623f06bd92b32260fae2",100000000],"WBC":["0x6f4024e5549bfda253d0997adb228bfeaac9b204",100000000],"BOP":["0xa043c2ccdd0c3ea0a3620a171edcaa0569f5ddd9",1000000],"MME":["0x873a1fb9183ae0c7144a2cb7ed755943cd300325",1000],"THL":["0xbb82de908bbc55cb2e003a8dfdc5c306a5c8f65a",1000000000000000000],"GP2":["0xd5818fbce6f25138a325a07a2e697ad160475e2f",100000000],"LTL":["0xa5ebb5c386971bef903a439428d2fccd3c6107b7",1000000000000000000],"BIT":["0x0e4d729d2715725855d9383d0da693010befa20c",1000000],"JET":["0xc1e6c6c681b286fb503b36a9dd6c1dbff85e73cf",1000000000000000000],"FLC":["0x551552999bb3d3080b4039b5bd733391982ca36a",1000000000000000000],"NCN":["0xe1f2d12d3ed0fab0ed05b1800d8e3e93b9b2089a",100000000000],"EQR":["0xa1d5daeabf7b090a8b38c7e52afc74de562d25d2",100],"CRT":["0x53e556356d2d87563fa79bf2ac33ea74c02cd551",10000],"VSL":["0x5c543e7ae0a1104f78406c340e9c64fd9fce5170",1000000000000000000],"AIG":["0x666f33215a133555a2e12a617f6575385b1d89bb",10],"DNN":["0x3b9ce2da81d679447c5e22f9e998699762d8cbc9",100],"RLC":["0x607f4c5bb672230e8672085532f7e901544a7375",1000000000],"TRS":["0xcb94be6f13a1182e4a4b6140cb7bf2025d28e41b",1000000],"OZG":["0x27758e9e1a5bdfdd2726304409d6a2b5ee0c81c3",1000000],"NC2":["0x24ca6dff3f02037811e768de67177124c3a8fec3",10000000000],"WNG":["0x667088b212ce3d06a1b553a7221e1fd19000d9af",1000000000000000000],"TSF":["0xe7775a6e9bcf904eb39da2b68c5efb4f9360e08c",1000000],"GUP":["0xf7b098298f7c69fc14610bf71d5e02c60792894c",1000],"GNO":["0x6810e776880c02933d47db1b9fc05908e5386b96",1000000000000000000],"TEH":["0xb04a5cc23cfc8b9a2804ba4034dea6df003a0195",1000000000000000000],"TKN":["0xaaaf91d9b90df800df4f55c205fd6989c977e73a",100000000],"HMQ":["0xcbcc0f036ed4788f63fc0fee32873d6a7487b908",100000000],"XRK":["0xfe3fb7977e30793318de3758a9f9866a091f4280",1000000000000000000],"SRC":["0x1dce4fa03639b7f0c38ee5bb6065045edcf9819a",100000000],"DOM":["0x5a096c19470379f3e66f1e6d664a2112fb285287",1000000000],"MTK":["0xfb178222fecccaad0f26bf8ba1fc9f12b961f6b0",1000000],"CPU":["0x05278f4c0474716493f09feb3b988598a19b37f6",1000000000000000000],"ANT":["0x960b236a07cf122663c4303350609a66a7b288c0",1000000000000000000],"APL":["0xd36b4553e94748e079d35e9d0f536f041e16edb4",1000000],"XXX":["0xf807104368244e2bfd26833b086344a12cbf1283",1000000000],"COM":["0x8e3a129e21ba6ca33c82e6471b36744e65736c7d",1000000000],"ORG":["0xdc6729371ca1ebce950cbd3d936a5c646cbdac43",1000000000],"ADS":["0x3af8d5b6edb69ad18c0ee42b305e2633e76ec948",1000000000],"APP":["0xb0ed42596943a5dfaabc4c19d35da3bd5b8e2a4b",1000000000],"BIZ":["0xb0b86321a8562baaec9d79bf363e55ecb489a8da",1000000000000000000],"CFD":["0xdb13e5599169fcaa72b6defaf2edb2f7d35103f7",1000000000],"DEV":["0xe51089eddfad2b7d02efcfd677f0946437801ffd",1000000000],"EDU":["0xdf391d0ed627227b992200229ae9ee838421e354",1000000000],"BID":["0xbbe19bbbd45904b3f7875da08a4ef73610e5e6d4",1000000000],"BUY":["0x80559208bbdd7f7291b030d7ed0846eeb104b410",1000000000],"CNY":["0x98c102629f8f595b0a9571264d6226a1926c085a",1000000000],"YEN":["0x021101ebd5b600e084efd9ecae02f793ba7c90f5",100000000],"ESQ":["0x3413bc5157c5c09837f7300d1fbcb78cb9885c01",1000000000],"LTD":["0x7979f75c7670306b2df20ee4aa6cef0a803f0d42",1000000000],"EAT":["0x1c0c494e4ee8f6c21cdd4fc38e640d721dd447e2",1000000000],"SEC":["0x2f2523db41faa491c4edb3eac5ffaea89bcc96b6",1000000000000],"IPO":["0x144d8af3ee7ab77b9e38d7af03bed8204112d092",1000000000],"ETF":["0x76351fb9cd443c6109b0b39ac6b9832bda6f994c",1000000000],"ETB":["0x807b9487aaf00629b674bd6d02e4917453bc5939",1000000000000],"CDS":["0x9daf4733c823cdb1ef16e7c52f3bbde18e143e17",1000000000],"INT":["0x164b9beaba5670de919dba107af943965e20b885",1000000000],"ADR":["0xabde7cc02e75d28f818fa8eb95e5682bf801a020",1000000000],"ABS":["0x1da5a394ddfd3e801cb11deffd7f5a889242abc7",1000000000],"CDO":["0xc17bfb36eab842286eaa1851045176900e6ff7ee",1000000000000],"FLY":["0x313f2494d7f10385adb54b6cc834d2cf3e77270d",1000000000],"LAW":["0x29890e864be73f5a570e939aa81df088fc8ead3e",1000000000],"PET":["0x3cfadb55689ed325ea3260cad0262054ad0c08b2",1000000000],"AAA":["0xfe1cdd814d38d62362bd753a474e572eeecc3737",1000000000],"OIL":["0x1e59705c9274626fe76c9944da36ba6a16b0e418",1000000000],"WWW":["0x634c104b145450684d3b107463fea3768ff04412",1000000000],"AHU":["0x3a2c344bb6ef345020acf514d56e87e817070949",1000000000000000],"GLD":["0xf569c77edb991c9f2e50f84545a46ba5f35ce0bb",10000],"ART":["0xc53e16ded5141d38f7a8ed4eed8999d20ab62088",1000000000000000000],"ORB":["0xe9519bd77751a57363a0708756857666410a78e0",1000000000000000000],"THS":["0x2a2e95be80085a011b75871494692ae6b3ac524e",1000000],"RLT":["0xcced5b8288086be8c38e23567e684c3740be4d48",10000000000],"BAT":["0x0d8775f648430679a709e98d2b0cb6250d2887ef",1000000000000000000],"MCO":["0xb04cfa8a26d602fb50232cee0daf29060264e04b",100000000],"REC":["0xe64cc257897b44db3ea7b95611afc5cb35380fba",100000000],"ION":["0x09d05a9f1edd8c3396fcb7cf03dac4eaf29d1fcb",1000000000],"CRY":["0xafa20a64949595862d17cd5ff00e74e8916456ae",1000000000000],"DAN":["0xb2161969f907550e3e7221abbef2be7df2c93d85",100000000],"MYS":["0xa645264c5603e96c3b0b078cdab68733794b0a71",100000000],"B4T":["0x37a0479ce2a93f7aed62d9a2b7b4147725a62cac",1000000000000000000],"QAU":["0x671abbe5ce652491985342e85428eb1b07bc6c64",100000000],"EMV":["0xb802b24e0637c2b87d2e8b7784c055bbe921011a",100],"MGO":["0x40395044ac3c0c57051906da938b54bd6557f212",100000000],"DOR":["0x2a777d4d5fdd8b929fd854c5f3b69d24058e016c",10000],"ROM":["0x9626f91715a0d49d1ee21558dc4a6c193ed433a7",10000000000],"LIT":["0x74a6928d53e486ee9ed71d34ba2bf7eae254260c",1000000],"ETT":["0xe0c72452740414d861606a44ccd5ea7f96488278",100000000],"QRL":["0x697beac28b09e122c4332d163985e8a73121b97f",100000000],"CFI":["0x12fef5e57bf45873cd9b62e9dbd7bfb99e32d73e",1000000000000000000],"PIP":["0x051db47643bde2717bfc4d34cec57b355401e8f9",10000000000],"21X":["0xf2ad9887ea029dd77128294f784cfb2c5248c51d",1000000],"NDC":["0xa54ddc7b3cce7fc8b1e3fa0256d0db80d2c10970",1000000000000000000],"BNT":["0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c",1000000000000000000],"CBR":["0xd15e58c41604055912e112e374350c1b264622af",1000000],"LNT":["0xda8ca94a875217692165a0b0c244496c8896ba96",1000000],"BTN":["0xe119af48ff8f3594eea7d9e5558e0ea56f358ddd",1000000000000000000],"MNE":["0x1a95b271b0535d15fa49932daba31ba612b52946",100000000],"NGR":["0x380c85e820909fe39190ec90471f70823aaa84e6",1000000000000000000],"SET":["0x2a5b7ec5996be222f5a87e6c8f06337b80ab594c",10000000000],"XYZ":["0x83921e1d6948c7e4818964e957d786a9a6c28790",10000000000],"SPT":["0xc8e3aa7718cf72f927b845d834be0b93c66b34e1",1000000000000000000],"SK8":["0xe388b740459170d7b2363dd9f5ceb1b221604cd7",100000000],"SNM":["0x983f6d60db79ea8ca4eb9968c6aff8cfa04b3c63",1000000000000000000],"CAD":["0x7d4fcea8fc17df325ed56ebf4bdfc32de8706cf5",10000000000],"TST":["0x29df438580c9363582becde65d49b9b742e4d7b3",100],"EB2":["0x4fe6ea636abe664e0268af373a10ca3621a0b95b",1000000000000],"SNT":["0x744d70fdbe2ba4cf95131626614a1763df805b9e",1000000000000000000],"ICE":["0x5a84969bb663fb64f6d015dcf9f622aedc796750",1000000000000000000],"STJ":["0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac",100000000],"ROC":["0x168296bb09e24a88805cb9c33356536b980d3fc5",100000000],"GDK":["0xae616e72d3d89e847f74e8ace41ca68bbf56af79",1000000],"DJB":["0xf63a029abcdbfd7a6382740fac45f5a01c4df098",1000000000000000000],"SHT":["0xb409384f6b59dec379d61d19978da4a6b82eb723",1000000000000000000],"NMR":["0x1776e1f26f98b1a5df9cd347953a26dd3cb46671",1000000000000000000],"XJB":["0xd097d6ca0fc563533cbfac84027703fc437c3f0f",1000000000],"FAM":["0x190e569be071f40c704e15825f285481cb74b6cc",1000000000000],"AUS":["0x6b68689a3c1012350d29ea3a5635f647ff14a910",1000000],"SES":["0xa3f29d7e325a99ee973833a6a02cbe80efcdab6c",100000000],"BNC":["0xdd6bf56ca2ada24c683fac50e37783e55b57af9f",1000000000000],"E4O":["0xce5c603c78d047ef43032e96b5b785324f753a4f",100],"OAX":["0x701c244b988a513c945973defa05de933b23fe1d",1000000000000000000],"FUX":["0xf7034409ee4c40c4cc56c0f364da45bc4e12e2ea",100000000],"CBF":["0x5c06e30146cb55819e914894fa2d7514b418651b",100000000],"GUN":["0x2ca72c9699b92b47272c9716c664cad6167c80b0",1000000000000000000],"VOK":["0x2f24f3c16504533bca386876eee1a87771fe9757",1000000],"EOS":["0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0",1000000000000000000],"CTL":["0xbf4cfd7d1edeeea5f6600827411b41a21eb08abd",100],"SNC":["0xf4134146af2d511dd5ea8cdb1c4ac88c57d60404",1000000000000000000],"ADT":["0xd0d6d6c5fe4a677d343cc433536bb717bae167dd",1000000000],"BBB":["0x725803315519de78d232265a8f1040f054e70b98",1000000000000000000],"SK1":["0x4994e81897a920c0fea235eb8cedeed3c6fff697",1000000000000000000],"ADX":["0x4470bb87d77b963a013db939be332f927f2b992e",10000],"KPY":["0xe7fe5a74c25c7b91cc1cdd603b973f113c36a0b1",1000000000000000000],"DRX":["0x620541c3283a145e8f3b5924fbbb0d3bbf817fc7",1000000000000000000],"GGS":["0x68db10ecc599d9f5e657acdafdbf6449d658bb2d",1000000000000000000],"TOK":["0xdd44ef2ab1eda0454d040a7a1d6e33c7d0b77497",1000000000000000],"KTN":["0xdc0c22285b61405aae01cba2530b6dd5cd328da7",1000000],"OMG":["0xd26114cd6ee289accf82350c8d8487fedb8a0c07",1000000000000000000],"SAN":["0x7c5a0ce9267ed19b22f8cae653f198e3e8daf098",1000000000000000000],"DDF":["0xcc4ef9eeaf656ac1a2ab886743e98e97e090ed38",1000000000000000000],"PBL":["0x0affa06e7fbe5bc9a764c979aa66e8256a631f02",1000000],"XRL":["0xb24754be79281553dc1adc160ddf5cd9b74361a4",1000000000],"JAK":["0x60a653579153afa69624c5e003d6271639d61ee0",100000000],"MSP":["0x68aa3f232da9bdc2343465545794ef3eea5209bd",1000000000000000000],"OBC":["0x1a96d30474a1453209f0110bac6c41fdb7340951",1000000000000000000],"BCT":["0xefe687072c5e1bcf0310cab3387b286401c60c18",1000000],"DRP":["0x621d78f2ef2fd937bfca696cabaf9a779f59b3ed",100],"PHP":["0xb6ec24441349606662ddcd4818bc5f02d8753b81",1000000000000000000],"URB":["0x7a83db2d2737c240c77c7c5d8be8c2ad68f6ff23",1000000000000000000],"?!#":["0x8d82f964bceb866fe70812ce39a86840ef608a8f",1000000000000000000],"EXC":["0xb6784a8b0d0b09d7096ba43d4001be61b6c675f2",100000000],"IXT":["0xfca47962d45adfdfd1ab2d972315db4ce7ccf094",100000000],"CMR":["0xca7818d67c0697738c60960001712dcfc4c52601",100000000],"BTC":["0x15b3307594ef54c8da80e7f3516ba2ae287adf7a",100000000],"BTE":["0x0d4568eb5bd69d081aa663f60d4ace72e45e8b7c",100000000],"|X|":["0x9a4fe70bb7b39127f4772acaf0d000578644b39d",100000000],"NET":["0xcfb98637bcae43c13323eaa1731ced2b716962fd",1000000000000000000],"MTL":["0xf433089366899d83a9f26a773d59ec7ecf30355e",100000000],"LUN":["0xfa05a73ffe78ef8f1a739473e462c54bae6567d9",1000000000000000000],"AV0":["0xf92cb29e36f45da1f5cc166a3b099b7769ada4ca",1000000000000000000],"GGC":["0xddf832e47eaca911bb56a3d8bea4b696afe3ae83",100000000],"QTU":["0x9a642d6b3368ddc662ca244badf32cda716005bc",1000000000000000000],"FLU":["0x708a3c5c84bd981fd410c7e2c28e6322da8885ac",1000000000],"EOB":["0x579c8d7bd561af017aca481d0c85a520e2c121ce",1000000000000],"KNG":["0x891d5c54105d0690ced545c073e71f5c840bb3ea",1000000],"CAT":["0x56ba2ee7890461f463f7be02aac3099f6d5811a8",1000000000000000000],"CVC":["0x41e5560054824ea6b0732e656e3ad64e20e94e45",100000000],"JWT":["0x56baab0514dc737a519b897c148b3febfbbcf25d",1000000],"PLR":["0xe3818504c1b32bf1557b16c238b2e01fd3149c17",1000000000000000000],"BQX":["0x5af2be193a6abca9c8817001f45744777db30756",100000000],"FYN":["0x88fcfbc22c6d3dbaa25af478c578978339bde77a",1000000000000000000],"ZAR":["0x526a81414c1b7e0b5d5c000213d577aa6144e6ef",1000000000000000000],"RTS":["0x0474b6eb2edd8bd8d538ea1db68ce5df855264e7",1000000000000],"VER":["0x8f3470a7388c05ee4e7af3d01d8c722b0ff52374",1000000000000000000],"SWT":["0xb9e7f8568e08d5659f5d29c4997173d84cdf2607",1000000000000000000],"IC0":["0x1551ae31e2263ea72118a55789fc75cde478c592",1000000],"AGC":["0x02de55572237ca2ea74bc5a46bad50a3e94471e4",10000000],"MYB":["0x94298f1e0ab2dfad6eeffb1426846a3c29d98090",100000000],"ETX":["0x3f20d057fc9fbd1af338bef32d296abf5b48bb26",1000000000000000000],"FUN":["0x419d0d8bdd9af5e606ae2232ed285aff190e711b",100000000],"DNT":["0x3597bfd533a99c9aa083587b074434e61eb0a258",100000000],"GGA":["0x4f7689b0c050c4f70ccd7f3a84ab4b6c4faab13b",1000000000000000000],"PPP":["0xbbf0e972b9b005de15fa3ec05bf09bb389154a91",1000000],"CDB":["0x2fe6ab85ebbf7776fee46d191ee4cea322cecf51",1000000000000000000],"TGT":["0xac3da587eac229c9896d919abc235ca4fd7f72c1",10],"GGL":["0x483b59664292c80b2557d25005b3a5e216c7814c",1000000000000000000],"MRV":["0xab6cf87a50f17d7f5e1feaf81b6fe9ffbe8ebf84",1000000000000000000],"GOT":["0x0d2428478127aa34662c271b8c91ca656e5a984e",100000000],"TIP":["0x7af4452817cd71b4533aa47bd734f23818b216b9",100000000],"TIK":["0x0ac1bb32973cd7767cbbd334e61ddfc6903b0758",1000000000000000000],"DCD":["0x24318e7e075fe24546ca7a176fdf5d5a2163a124",10000000000000000],"TFL":["0xa7f976c360ebbed4465c2855684d1aae5271efa9",100000000],"CDT":["0x177d39ac676ed1c67a2b268ad7f1e58826e5b0af",1000000000000000000],"ITT":["0xde817ff9d5fd2b419e6f2a826b32582307e5c2ba",100000000],"SNA":["0xbfb825269532e1b94d62f83ad2aee2a81305af9f",100000000],"SAP":["0x6939713ed35dbf66c642cc9891f1529872ded38e",100000000],"TDR":["0xfb6ee7ca12e4008001eaef2ae4a027350b36ed60",1000000],"BET":["0x8aa33a7899fcc8ea5fbe6a608a109c3893a1b8b2",1000000000000000000],"PPT":["0xd4fa1460f537bb9085d22c7bccb5dd450ef28e3a",100000000],"PTO":["0x8ae4bf2c33a8e667de34b54938b0ccd03eb8cc06",100000000],"GNG":["0x6984a3454f320030b17ae3ac09dda0cbc91af22c",10],"0CZ":["0xd26e3bfe0325566a795a269391abd8597c26e47a",100000000],"FOE":["0xfac16092dd1d459461d1e5caae87d4292d510e7c",100000000],"DEL":["0x346c3be6aebebaf5cb766a75adc9827efbb7e41a",1000000000000000000],"STR":["0x46492473755e8df960f8034877f61732d718ce96",100000000],"EST":["0x937796ffc578bed2ac37f5c7d12bcf9ece42268f",10000],"ATC":["0xb2306bccef0eea657e3854dc651d06b049fcefb2",10000],"D0X":["0x0abdace70d3790235af448c88547603b945604ea",1000000000000000000],"TSL":["0x03806ce5ef69bd9780edfb04c29da1f23db96294",1000000000000000000],"STX":["0x006bea43baa3f7a6f765f14f10a1a1b08334ef45",1000000000000000000],"MC0":["0xb63b606ac810a52cca15e44bb630fd42d8d1d83d",100000000],"VCB":["0xba29802701f0c88c54ea8b6820ca06ed84a7ed86",1000000000000000000],"TIX":["0xea1f346faf023f974eb5adaf088bbcdf02d761f4",1000000000000000000],"RE2":["0xf05a9382a4c3f29e2784502754293d88b835109c",1000000000000000000],"CCE":["0x4547ac8088abcc671d73bd8dc31ca39d435a2c08",100000000],"MYD":["0xf7e983781609012307f2514f63d526d83d24f466",10000000000000000],"GNR":["0xbb13e608888e5d30c09b13f89d27631056161b9f",1000000000],"EES":["0xa18e11869351d23b6dd8b46d31252d9ba0ff1feb",1000000000000000000],"DVY":["0x34e14f46042eb8982c4b4c8118e0434dd1798c94",100000000],"BPT":["0x9cb9eb4bb7800bdbb017be2a4ffbeccb67454ea9",100000000],"EUN":["0x4e8d979271cc2739d2bbd13b291faa3eb6df1504",1000000000000000000],"CHN":["0x9b54153d20041cb5d39d754c793330df8233558d",1000000000000000000],"GLN":["0x3819e3a13ea024d76549a1eed3158b4efbf2af75",1000000000000000000],"IFT":["0x7654915a1b82d6d2d0afc37c52af556ea8983c7e",1000000000000000000],"JOJ":["0xf05a615b7092510c279ddbb06534fee5fc95c548",100000000],"ETI":["0x2cdaa8a351dfc17657c69cd79024a0d2ad504d39",100],"WTR":["0x6e7626a47c1c5a92e76e1a86464089d329155e99",1000000000000],"ZRX":["0xe41d2489571d322189246dafa5ebde1f4699f498",1000000000000000000],"UAH":["0xb5964b9858d556e44cde07ee784d0384dadfa528",1000000000000000000],"ETH":["0x2956356cd2a2bf3202f771f50d3d14a367b48070",1000000000000000000],"TLM":["0xfd48735bfbe8fa777a557061f09e3aaba41ad6bd",10000000000],"FML":["0xdb614a076be7289d90a28617a84638aa56af979c",1000000000000000000],"M74":["0x4ffc1ee5b6d3e1704bd88792e3c6d6ac9c4773cd",10000000000],"FPT":["0xccadc21564e5c44032b7f44494de425c1066219c",1000000000000000000],"CFX":["0x6eeb3b371914dbc9e27b1032dc5880db3364f5e5",100000],"VEN":["0xd850942ef8811f2a866692a623011bde52a462c1",1000000000000000000],"ATT":["0x887834d3b8d450b6bab109c252df3da286d73ce4",1000000000000000000],"RAR":["0x5ddab66da218fb05dfeda07f1afc4ea0738ee234",100000000],"MAG":["0x3103138f2f6044d48306980e3e5ec10b00c2652c",1000000],"ASU":["0x60d8f14db1b7d41e139a24169ee44688df2c1adc",1000000000],"PST":["0xe3fedaecd47aa8eab6b23227b0ee56f092c967a9",1000000000000000000],"USC":["0xb862da770164d9963475403a72603b5a92b8f287",1000000000000000000],"RBC":["0x6c13e7cb5f1d1df54657715bdeec85d303c1f903",1000000000000000000],"WBT":["0x87429dd4a67c08f623ead8b700df1371420e218a",1000000000000000000],"CHC":["0x89d29ec4be71889036af53071e75d98168bcb42f",1000000000000000000],"EDC":["0xf952b0f8388449fe84483a3f915dcca2635e5417",1000000000000000000],"TRC":["0x2bf5e97e7180286544d97bb2f8bcdcf7a29f4003",1000000000000000000],"BLC":["0xc16080aea48ab0cfc934d91c72238b14eb7180b8",1000000000000000000],"BLX":["0xe5a7c12972f3bbfe70ed29521c8949b8af6a0970",1000000000000000000],"MST":["0xcedaea5e4907eaee789e584e95a6ef7495fcbfb0",1000000000000000000],"REP":["0xe94327d07fc17907b4db788e5adf2ed424addff6",1000000000000000000],"FLW":["0x92b13fd9130f0c771183fbba0b9f9f7898a51f5d",1000000000000000000],"XUC":["0xc324a2f6b05880503444451b8b27e6f9e63287cb",1000000000000000000],"PRO":["0x226bb599a12c826476e3a771454697ea52e9e220",100000000],"FCC":["0x06d3c687d94a6b15076fbbaff1ca73e3a674b402",1000000000000000000],"REE":["0x88b7969dcf03063fecc022bbf008b1cd1c374f4d",100000000],"LWB":["0x0d57a3d2f3168812f6504dad461043af1407d668",1000000],"SIG":["0x64340ed116881e2b435b7240b3a60cf224630e01",1000000000000000000],"ADG":["0xe3bb8ca3500568b92d25cba6c48fbb0b8e520b32",10000000000],"HGT":["0xba2184520a1cc49a6159c57e61e1844e085615b6",100000000],"IDS":["0xf8e386eda857484f5a12e4b5daa9984e06e73705",1000000000000000000],"DAT":["0x0cf0ee63788a0849fe5297f3407f701e122cc023",1000000000000000000],"TNY":["0x08f5a9235b08173b7569f83645d2c7fb55e8ccd8",100000000],"UMC":["0x190fb342aa6a15eb82903323ae78066ff8616746",1000000],"XCN":["0x4238c2e2e9e387b6feb23acbb81b3b6dea648b8d",1000000],"DAB":["0x1493960a83a992552609ff1eee9cb37f42700d60",100000000],"MDA":["0x51db5ad35c671a87207d88fc11d593ac0c8415bd",1000000000000000000],"IMC":["0xe3831c5a982b279a198456d577cfb90424cb6340",1000000],"POE":["0x0e0989b1f9b8a38983c2ba8053269ca62ec9b195",100000000],"CCU":["0xcb679c69c9146dd1104603b64db5b200689bf2b0",1000000000000000000],"CAR":["0xee3bbdc884c07ae52bffc9913741c1c4a1b16660",100000000],"BTM":["0xcb97e65f07da24d46bcdd078ebebd7c6e6e3d750",100000000],"CTR":["0x96a65609a7b84e8842732deb08f56c3e21ac6f8a",1000000000000000000],"MCI":["0x138a8752093f4f9a79aaedf48d4b9248fab93c9c",1000000000000000000],"MGC":["0x36151de56c3a07acffc65362c57d892c9e0918c4",100],"PCC":["0x40dd9039d167852a5ee7d850bd99dd88b1b5128a",1000000],"STE":["0xae5652ea226bfae00b8d542e58231362af836fda",100000000],"LRC":["0xef68e7c694f40c8202821edf525de3782458639f",1000000000000000000],"MCP":["0x93e682107d1e9defb0b5ee701c71707a4b2e46bc",100000000],"AET":["0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d",1000000000000000000],"UIP":["0x4290563c2d7c255b5eec87f2d3bd10389f991d68",1000000000000000000],"LLT":["0x6d5cac36c1ae39f41d52393b7a425d0a610ad9f2",100000000],"HMC":["0xaa0bb10cec1fa372eb3abc17c933fc6ba863dd9e",1000000000000000000],"CCC":["0xc2221b777857f4a862a8c528d24b35cc995dd8b1",1000000000000000000],"BEX":["0x5dbd23a64ee5b80dabde8e0b8474f901b4d0b5ae",1000000000000000000],"BTT":["0x716cf69d7ccb2d842e2fe2151447ef0149639a2b",1000000000000000000],"SEO":["0x56706d2f98649156888b8358a1f8924d5947feda",100000],"PPC":["0x3eba549207e793886fc915e6944f5e16e72b8e69",100000],"AMO":["0x42cfc0239b0887eaf3fba5dd0bb88a57fecb6ae0",100000],"ALI":["0xea610b1153477720748dc13ed378003941d84fab",1000000000000000000],"HVN":["0xc0eb85285d83217cd7c891702bcbc0fc401e2d9d",100000000],"VIB":["0x2c974b2d0ba1716e644c1fc59982a89ddd2ff724",1000000000000000000],"AUA":["0xb29678a4805a7d787dc9589e179d27f7575bb9f7",100000],"SIP":["0xa71d4ac24724398504b8f93e4667c54aa9721157",1000000000000000000],"AVT":["0x0d88ed6e74bbfd96b831231638b66c05571e824f",1000000000000000000],"DLT":["0x07e3c70653548b04f0a75970c1f81b4cbbfb606f",1000000000000000000],"WTC":["0xb7cb1c96db6b22b0d3d9536e0108d062bd488f74",1000000000000000000],"DOC":["0x079437c92267510c28cf9ba7d5fc030eddfaa9fb",1000000000000000000],"PJC":["0x3760a7b5b08c32eeab46e9d1facab1c4eca789c3",10000],"HBT":["0xdd6c68bb32462e01705011a4e2ad1a60740f217f",1000000000000000],"E11":["0x4805f9568bca23bef099c2a317346b42146384a1",1000000000000000000],"RPL":["0xb4efd85c19999d84251304bda99e90b92300bd93",1000000000000000000],"RVT":["0x3d1ba9be9f66b8ee101911bc36d3fb562eac2244",1000000000000000000],"LAT":["0xbb31037f997553bec50510a635d231a35f8ec640",10000000000000000],"MMR":["0x1c3bed5bd4b0e6a8389efd0d2876f948a907ab5b",18],"OWN":["0x08da80f28b960bdfab798c172ff20619540b9ce5",1000000000000000000],"LDN":["0xc2921ea1c150405ef952f73952f37fa2746168d8",1000000000000000000],"DAG":["0x32615e82829af1b5c75010d358d905c1315ef78d",1000000000000000000],"VRC":["0x18e60754a8bed1d7a8c549e3a0adef78e7f87988",10000],"KAI":["0xf49840306936a631d25be259de1702083090daca",1000000000000000000],"CAG":["0x7d4b8cce0591c9044a22ee543533b72e976e36c3",1000000000000000000],"CCO":["0xc27c3affe227dc5d822b85f99484aaf015dc262e",1000000000000000000],"TBC":["0xaf012c7569bf6748da62a6ecf5a145b9e18b0cb2",1000000000000000000],"LNC":["0x63e634330a20150dbb61b15648bc73855d6ccf07",1000000000000000000],"AR2":["0xfec0cf7fe078a500abf15f1284958f22049c2c7e",1000000000000000000],"OPT":["0x4355fc160f74328f9b383df2ec589bb3dfd82ba0",1000000000000000000],"AST":["0x27054b13b1b798b345b591a4d22e6562d47ea75a",10000],"BNB":["0xB8c77482e45F1F44dE1745F52C74426C631bDD52",1000000000000000000],"WINGS":["0x667088b212ce3d06a1b553a7221e1fd19000d9af",1000000000000000000]}

    consts.SIGMODES = {
        TYPED: 0,
        GETH: 1,
        TREZOR: 2
    }

    consts.ZEROADDR = '0x0000000000000000000000000000000000000000'

    // TEMP
    consts.endpoint = 'http://127.0.0.1:12312'


    // mainnet id 1
    consts.mainnet = {
        exchangeContract: '0x3db7a4c4c30eaec1ac7301c3f95920afbe6719e3',
        endpoint: '',
    }

    // ropsten id 3
    consts.ropsten = {
        exchangeContract: '0xa8a1ce35c36a33d9033c7030531f0701cbf54c0c',
        endpoint: '',
        // markets
    }

    // Intervals
    consts.METAMASK_UPDATE_INTVL = 1000;
    consts.ETHBAL_UPDATE_INTVL = 14 * 1000;
    consts.FETCH_BALANCES_INTVL = 14 * 1000;
    consts.NONCE_UPDATE_INTVL = 15 * 1000;

    return consts
})