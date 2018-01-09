(function()
{
	'use strict';

	angular
		.module('dexyApp')
		.service('user', UserService)

	UserService.$inject = ['$rootScope', 'LxNotificationService']

	// NOTE: regarding authentication, this helps a lot:
	// https://github.com/kvhnuke/etherwallet/blob/bd1bcb499f84dabecf133ef9f2e6c684d769ae23/app/scripts/controllers/decryptWalletCtrl.js

	var HDKey = require('hdkey')
	var Buffer = require('buffer').Buffer
	var wallet = require('ethereumjs-wallet')

	function UserService($scope, LxNotificationService)
	{
		initWeb3()

		var user = this
		
		// MEW default, also from the trezor examples
		user.HD_PATH = "m/44'/60'/0'/0";

		// Configurable things
		user.GAS_PRICE = 30099515020 // 30 gwei

		// Mainnet by default
		user.chainId = 1

		// Default: try metamask
		web3.eth.getAccounts(function(err, accounts) {
			if (err) {
				user.handleWeb3Err(err)
				return
			}

			user.mode = 'metamask'
			user.publicAddr = accounts[0]

		})
		web3.eth.net.getId(function(err, netId) {
			if (err) {
				user.handleWeb3Err(err)
				return
			}
			user.chainId = netId
		})
		// TODO: https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#best-practices-bowtie

		user.getTrezorAddresses = function(cb)
		{
			TrezorConnect.getXPubKey(user.HD_PATH, function(resp) {
				if (! resp.success) {
					user.handleTrezorErr(resp)
					return
				}

				cb(user.getAddrs(resp.publicKey, resp.chainCode))
			})	
		}
		/*
		user.getLedgerAddresses = function(cb)
		{
			var ledger = new ledger3('w0w')
			var app = new ledgerEth(ledger)
			app.getAddress(user.HD_PATH, function(resp, err) {
				if (err) {
					console.log(err)
					LxNotificationService.error('Ledger Error: '+(err.message || u2f.getErrorByCode(err.errorCode)));
					return
				}

				cb(user.getAddrs(resp.publicKey, resp.chainCode))
			}, false, true)
		}
		*/
		user.getAddrs = function(publicKey, chainCode)
		{
			// we need resp.publicKey, resp.chainCode, user.HD_PATh
			var hdk = new HDKey()
			hdk.publicKey = new Buffer(publicKey, 'hex')
			hdk.chainCode = new Buffer(chainCode, 'hex')

			var all = []
			for (var i = 0; i!=8; i++) {
				var wlt = wallet.fromExtendedPublicKey(hdk.derive('m/'+i).publicExtendedKey)
				all.push('0x'+wlt.getAddress().toString('hex'))
			}
			return all
		}
		user.onTrezorAddr = function(address)
		{
			LxNotificationService.success('Trezor: imported address');

			user.mode = 'trezor'
			user.publicAddr = address
			if (!$scope.$$phase) $scope.$apply()
		}

		user.sendTx = function(tx)
		{
			// TODO
			var GAS_LIM = 100 * 1000 

			if (user.mode === 'trezor') {
				web3.eth.getTransactionCount(user.publicAddr, function(err, count) {
					// TODO: handle err
					console.log(count)

					// TODO; estimate gas
					TrezorConnect.ethereumSignTx(
					user.HD_PATH,
					'0'+count.toString(16),
					'0'+user.GAS_PRICE.toString(16), // gas price
					'0'+GAS_LIM.toString(16), // gas limit
					user.publicAddr.slice(2), // to, w/o the 0x prefix TODO
					'00', // value TODO
					null, // data TODO
					user.chainId,
					function (response) {
						if (response.success) {
							console.log('Signature V (recovery parameter):', response.v); // number
							console.log('Signature R component:', response.r); // bytes
							console.log('Signature S component:', response.s); // bytes
						} else {
							user.handleTrezorErr(response)
						}

					})
				})

			} else {
				// normal mode
				tx.send({ from: user.publicAddr, gas: GAS_LIM, gasPrice: user.GAS_PRICE })
				// TODO handle resuls
			}

		}

		user.handleTrezorErr = function(resp)
		{
			LxNotificationService.error('Trezor Error: '+resp.error);
			console.error('Trezor Error:', resp.error); // error message
		}

		user.handleWeb3Err = function(err)
		{
			LxNotificationService.error('web3 error: '+err);

			// TODO: make this visual
			console.error(err)
		}

		// Init web3
		function initWeb3()
		{
			var Web3 = require('web3')

			// Checking if Web3 has been injected by the browser (Mist/MetaMask)
			if (typeof web3 !== 'undefined') {
				// Use Mist/MetaMask's provider
				window.web3 = new Web3(web3.currentProvider);
			} else {
				console.log('No web3? You should consider trying MetaMask!')
				// fallback - use your fallback strategy
				window.web3 = new Web3(new Web3.providers.HttpProvider(CONSTS.mainnetUrl));
			}
		}

		return user
	}

})();