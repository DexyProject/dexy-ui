const HDKey = require('hdkey');
const Buffer = require('buffer').Buffer;
const wallet = require('ethereumjs-wallet');
const ethTx = require('ethereumjs-tx');
const rlp = require('rlp');

export default class User {
    constructor($scope) {
        'ngInject';
        this._$scope = $scope;

        this.initWeb3();
    }

    initWeb3() {
        const Web3 = require('web3');

        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
            window.web3 = new Web3(web3.currentProvider);
        } else {
            console.log('No web3? You should consider trying MetaMask!');
            // fallback - use your fallback strategy
            window.web3 = new Web3(new Web3.providers.HttpProvider(cfg.ethUrl));
        }
    }

    sanitizeHex(hex) {
        hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
        if (hex === "") return undefined;
        return '0x' + User.padLeftEven(hex)
    }

    static padLeftEven(hex) {
        hex = hex.length % 2 !== 0 ? '0' + hex : hex;
        return hex;
    }

    signOrder = function (typed, userAddr, cb) {
        let valuesHash = web3.utils.soliditySha3.apply(null, typed.map(function (entry) {
            return entry.value
        }));

        let schema = typed.map(function (entry) {
            return entry.type + ' ' + entry.name
        });

        let schemaHash = web3.utils.soliditySha3.apply(null, schema);
        let hash = web3.utils.soliditySha3(schemaHash, valuesHash);

        // https://github.com/ethereum/web3.js/issues/392
        // https://github.com/MetaMask/metamask-extension/issues/1530
        // https://github.com/0xProject/0x.js/issues/162
        //  personal_sign

        /*  web3.eth.signTypedData not yet implemented!!!
        *  We're going to have to assemble the tx manually!
        *  This is what it would probably look like, though:
        web3.eth.signTypedData(msg, from) function (err, result) {
          if (err) return console.error(err)
          console.log('PERSONAL SIGNED:' + result)
        })
        */

        // @todo mode enum
        switch (this.mode) {
            case 'metamask':
                break;
            case 'trezor':
                break;
            case 'ledger':
                break;
            default:
                break;
        }

        // if (user.mode === 'metamask') {
        //     web3.currentProvider.sendAsync({
        //         method: 'eth_signTypedData',
        //         params: [typed, userAddr],
        //         from: userAddr
        //     }, function (err, resp) {
        //         if (err) return cb(err)
        //         if (resp.error) return cb(resp.error)
        //         cb(null, resp.result, CONSTS.SIGMODES.TYPED)
        //     })
        //     return
        // }
        //
        // if (user.mode === 'trezor') {
        //     var buf = Buffer.from(hash.slice(2), 'hex')
        //     TrezorConnect.ethereumSignMessage(user.TREZOR_HD_PATH + '/' + user.hdWalletAddrIdx, buf, function (resp) {
        //         if (resp.success) cb(null, '0x' + resp.signature, CONSTS.SIGMODES.TREZOR)
        //         else cb(resp)
        //     })
        //     return
        // }
        //
        // if (user.mode === 'ledger') {
        //     ledger.comm_u2f.create_async()
        //         .then(function (comm) {
        //             var eth = new ledger.eth(comm)
        //
        //             var dPath = user.LEDGER_HD_PATH + '/' + user.hdWalletAddrIdx;
        //             var buf = Buffer.from(hash.slice(2), 'hex')
        //
        //             eth.signPersonalMessage_async(dPath, buf.toString('hex')).then(function (result) {
        //                 var v = result['v']
        //                 v = v.toString(16)
        //                 if (v.length < 2) {
        //                     v = '0' + v
        //                 } // pad v
        //
        //                 cb(null, '0x' + result['r'] + result['s'] + v, CONSTS.SIGMODES.GETH)
        //             }).catch(function (ex) {
        //                 cb(ex)
        //             })
        //         })
        //     return
        // }
        //
        // web3.eth.personal.sign(hash, userAddr, function (err, res) {
        //     cb(err, res, CONSTS.SIGMODES.GETH)
        // })
    }

}
