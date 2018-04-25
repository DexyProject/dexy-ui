(function () {
    'use strict';

    angular
        .module('dexyApp')
        .service('user', UserService)

    UserService.$inject = ['$rootScope']

    // NOTE: regarding authentication, this helps a lot:
    // https://github.com/kvhnuke/etherwallet/blob/bd1bcb499f84dabecf133ef9f2e6c684d769ae23/app/scripts/controllers/decryptWalletCtrl.js

    var HDKey = require('hdkey')
    var Buffer = require('buffer').Buffer
    var wallet = require('ethereumjs-wallet')
    var ethTx = require('ethereumjs-tx')
    var rlp = require('rlp')

    function UserService($scope) {
        initWeb3()

        var user = this

        // MEW default, also from the trezor examples
        user.TREZOR_HD_PATH = "m/44'/60'/0'/0";
        user.LEDGER_HD_PATH = "44'/60'/0'";

        // How many addresses to list for a hardware wallet
        user.HWWALLET_ADDRESS_COUNT = 10;

        // Configurable things
        user.GAS_PRICE = 3000000000 // 3 gwei
        $scope.$watch(function() { return $scope.$root.gas }, function(gas) {
            if (!gas) return
            // $root.gas is one denomination below gwei
            user.GAS_PRICE = gas * 100000000
        })

        user.chainId = cfg.chainId

        // Exchange smart contract
        user.exchangeContract = new web3.eth.Contract(CONSTS.exchangeABI, cfg.exchangeContract)
        user.vaultContract = new web3.eth.Contract(CONSTS.vaultABI, cfg.vaultContract)

        // Default: try metamask
        user.setMetamask = function () {
            web3.eth.getAccounts(function (err, accounts) {
                if (err) {
                    user.handleWeb3Err(err)
                    return
                }

                user.mode = 'metamask'
                user.publicAddr = accounts[0]
                if (user.publicAddr) user.publicAddr = user.publicAddr.toLowerCase()

                if (!$scope.$$phase) $scope.$apply()
            })
        }
        user.setMetamask()

        // metamask ugly update interval
        // https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#ear-listening-for-selected-account-changes
        setInterval(function () {
            if (user.mode != 'metamask') return

            web3.eth.getAccounts(function (err, accounts) {
                if (user.mode != 'metamask') return

                if (err) {
                    console.error(err)
                    return
                }

                if (accounts[0] == user.publicAddr) return

                user.publicAddr = accounts[0]
                if (user.publicAddr) user.publicAddr = user.publicAddr.toLowerCase()

                if (!$scope.$$phase) $scope.$apply()
            })
        }, CONSTS.METAMASK_UPDATE_INTVL)

        // Nonce update
        user.nonce = 0

        function nonceUpdate() {
            if (!user.publicAddr) return
            web3.eth.getTransactionCount(user.publicAddr, function (err, count) {
                if (err) {
                    console.error(err)
                    return
                }

                user.nonce = Math.max(count, user.nonce)
            })
        }

        $scope.$watch(function () {
            return user.publicAddr
        }, function (addr) {
            if (!addr) return

            user.nonce = 0
            nonceUpdate()
        })
        setInterval(nonceUpdate, CONSTS.NONCE_UPDATE_INTVL)

        // Eth bal - on wallet and exchange
        user.ethBal = { onExchange: 0, onWallet: 0 }

        function fetchEthBal() {
            if (!user.publicAddr)
                return

            var addr = user.publicAddr

            console.log('Fetching ETH balances for ' + addr)

            web3.eth.getBalance(addr).then(function (bal) {
                user.ethBal.onWallet = bal / CONSTS.ETH_MUL
                if (!$scope.$$phase) $scope.$apply()
            })

            user.vaultContract.methods.balanceOf(CONSTS.ZEROADDR, addr).call(function (err, bal) {
                if (err) console.error(err)
                else {
                    user.ethBal.onExchange = bal / CONSTS.ETH_MUL
                    if (!$scope.$$phase) $scope.$apply()
                }
            })
        }

        $scope.$watch(function () {
            return user.publicAddr
        }, function (addr) {
            fetchEthBal()
        })
        setInterval(function () {
            fetchEthBal()
        }, CONSTS.ETHBAL_UPDATE_INTVL)

        // Chain ID
        web3.eth.net.getId(function (err, netId) {
            if (err) {
                user.handleWeb3Err(err)
                return
            }
            if (netId !== user.chainId) {
                toastr.warning('Warning: you are connected to an unsupported network. ' + cfg.warningMsg)
            }
            user.chainId = netId
        })
        // TODO: https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#best-practices-bowtie

        user.getTrezorAddresses = function (cb) {
            TrezorConnect.getXPubKey(user.TREZOR_HD_PATH, function (resp) {
                if (!resp.success) {
                    user.handleTrezorErr(resp)
                    return
                }

                cb(user.getAddrs(resp.publicKey, resp.chainCode))
            })
        }

        user.getLedgerAddresses = function (cb) {
            ledger.comm_u2f.create_async()
                .then(function (comm) {
                    var eth = new ledger.eth(comm)

                    eth.getAddress_async(user.LEDGER_HD_PATH, false, true)
                        .then(function (resp) {
                            cb(user.getAddrs(resp.publicKey, resp.chainCode))
                        })
                        .catch(user.handleLedgerError)
                })
                .catch(user.handleLedgerError)
        }

        user.getAddrs = function (publicKey, chainCode) {
            // we need resp.publicKey, resp.chainCode, user.HD_PATh
            var hdk = new HDKey()
            hdk.publicKey = new Buffer(publicKey, 'hex')
            hdk.chainCode = new Buffer(chainCode, 'hex')

            var all = []
            for (var i = 0; i != user.HWWALLET_ADDRESS_COUNT; i++) {
                var wlt = wallet.fromExtendedPublicKey(hdk.derive('m/' + i).publicExtendedKey)
                all.push('0x' + wlt.getAddress().toString('hex'))
            }
            return all
        }

        user.onHDWalletAddr = function (address, type, idx) {
            user.publicAddr = address
            user.mode = type
            user.hdWalletAddrIdx = idx

            if (!$scope.$$phase) $scope.$apply()
        }

        user.sendTx = function (tx, opts, cb) {

            // Do not do it on the Trezor, since it will try to open the popup in a
            // non-user-triggered tick, and the browser will block it
            // WARNING: this block of code cannot be used, because of the nonce thing when depositing/withdrawing
            // before the tx is actually confirmed, estimateGas will always think it will fail
            /*
            var shouldCalcGas = user.mode === 'ledger' || user.mode === 'metamask'
            if (shouldCalcGas && !opts.hasOwnProperty('calculatedGas')) {
                tx.estimateGas(function(err, resp) {
                    if (err) return cb(err)

                    opts.calculatedGas = resp
                    opts.gas = resp
                    user.sendTx(tx, opts, cb)
                })
                return
            }
            */

            // NOTE: The convention here is that if we get an err from a hardware wallet, we do 
            // user.handleTrezorError/user.handleLedgerError and we STILL call the cb with an err

            // will be used only with trezor/ledger
            var rawTx = {
                nonce: sanitizeHex(user.nonce.toString(16)),
                gasPrice: sanitizeHex(opts.gasPrice.toString(16)),
                gasLimit: sanitizeHex(opts.gas.toString(16)),
                to: tx._parent._address,
                value: sanitizeHex((opts.value || 0).toString(16)),
                data: tx.encodeABI(),
                chainId: user.chainId,
            }

            if (user.mode === 'trezor') {
                // WARNING: trezor pop-up will be blocked if we do web3.eth.getTransaction count too and not signTx in the same
                // tick as the click

                TrezorConnect.ethereumSignTx(
                    user.TREZOR_HD_PATH + '/' + user.hdWalletAddrIdx,
                    rawTx.nonce.slice(2),
                    rawTx.gasPrice.slice(2),
                    rawTx.gasLimit.slice(2),
                    rawTx.to.slice(2),
                    rawTx.value.slice(2),
                    rawTx.data.slice(2),
                    rawTx.chainId,
                    function (response) {
                        if (response.success) {

                            rawTx.v = '0x' + response.v.toString(16)
                            rawTx.r = '0x' + response.r
                            rawTx.s = '0x' + response.s
                            var eTx = new ethTx(rawTx);
                            var signedTx = '0x' + eTx.serialize().toString('hex')

                            console.log(rawTx)
                            console.log(signedTx)

                            web3.eth.sendSignedTransaction(signedTx, function (err, resp) {
                                if (resp) user.nonce++
                                cb(err, resp)
                            })
                        } else {
                            user.handleTrezorErr(response)
                            cb(response)
                        }

                    })
            } else if (user.mode === 'ledger') {
                var eTx = new ethTx(rawTx)
                eTx.raw[6] = Buffer.from([rawTx.chainId])
                eTx.raw[7] = eTx.raw[8] = 0
                var toHash = eTx.raw // old ? eTx.raw.slice(0, 6) : eTx.raw
                var txToSign = rlp.encode(toHash)

                ledger.comm_u2f.create_async()
                    .then(function (comm) {
                        var eth = new ledger.eth(comm)

                        var dPath = user.LEDGER_HD_PATH + '/' + user.hdWalletAddrIdx;

                        eth.signTransaction_async(dPath, txToSign.toString('hex')).then(function (result) {
                            console.log('from signtx', result)

                            rawTx.v = '0x' + result['v']
                            rawTx.r = '0x' + result['r']
                            rawTx.s = '0x' + result['s']

                            eTx = new ethTx(rawTx)
                            rawTx.rawTx = JSON.stringify(rawTx)

                            var signedTx = '0x' + eTx.serialize().toString('hex')

                            console.log(rawTx)
                            console.log(signedTx)

                            web3.eth.sendSignedTransaction(signedTx, function (err, resp) {
                                if (resp) user.nonce++
                                cb(err, resp)
                            })
                        }).catch(function (err) {
                            user.handleLedgerError(err)
                            cb(err)
                        })
                    })
            } else {
                tx.send(opts, cb)
            }

        }

        user.handleTrezorErr = function (resp) {
            toastr.error('Trezor Error: ' + resp.error);
            console.error('Trezor Error:', resp.error); // error message
        }

        user.handleLedgerError = function (err) {
            console.error(err)
            toastr.error('Ledger Error: ' + (err.message || u2f.getErrorByCode(err.errorCode)));
        }

        user.handleWeb3Err = function (err) {
            toastr.error('web3 error: ' + err);

            // TODO: make this visual
            console.error(err)
        }
    }

})();
