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
		user.TREZOR_HD_PATH = "m/44'/60'/0'/0";
		user.LEDGER_HD_PATH = "44'/60'/0'";

		// How many addresses to list for a hardware wallet
		user.HWWALLET_ADDRESS_COUNT = 10;

		// Configurable things
		user.GAS_PRICE = 30099515020 // 30 gwei

		// Mainnet by default
		user.chainId = 1

		// Default: try metamask
		$scope.setMetamask = function() {
			web3.eth.getAccounts(function(err, accounts) {
				if (err) {
					user.handleWeb3Err(err)
					return
				}

				user.mode = 'metamask'
				user.publicAddr = accounts[0]

				if (!$scope.$$phase) $scope.$apply()
			})
		}
		$scope.setMetamask()

		// Eth bal
		user.ethBal = { }
		$scope.$watch(function() { return user.publicAddr }, function(addr) {
			if (!addr) return

			console.log('Fetching ETH balances for '+addr)

			web3.eth.getBalance(addr).then(function(bal) {
				user.ethBal.onWallet = bal / 1000000000000000000
				if (! $scope.$$phase) $scope.$apply()
			})

			// TODO: get from exchange SC too
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
			TrezorConnect.getXPubKey(user.TREZOR_HD_PATH, function(resp) {
				if (! resp.success) {
					user.handleTrezorErr(resp)
					return
				}

				cb(user.getAddrs(resp.publicKey, resp.chainCode))
			})	
		}
		
		user.getLedgerAddresses = function(cb)
		{
			ledger.comm_u2f.create_async()
			.then(function(comm) {
				var eth = new ledger.eth(comm)

				eth.getAddress_async(user.LEDGER_HD_PATH, false, true)
				.then(function(resp) { 
					cb(user.getAddrs(resp.publicKey, resp.chainCode))
				})
				.catch($scope.handleLedgerError)
			})
			.catch($scope.handleLedgerError)
		}
		
		user.getAddrs = function(publicKey, chainCode)
		{
			// we need resp.publicKey, resp.chainCode, user.HD_PATh
			var hdk = new HDKey()
			hdk.publicKey = new Buffer(publicKey, 'hex')
			hdk.chainCode = new Buffer(chainCode, 'hex')

			var all = []
			for (var i = 0; i!=user.HWWALLET_ADDRESS_COUNT; i++) {
				var wlt = wallet.fromExtendedPublicKey(hdk.derive('m/'+i).publicExtendedKey)
				all.push('0x'+wlt.getAddress().toString('hex'))
			}
			return all
		}
		user.onHDWalletAddr = function(address, type, idx)
		{
			LxNotificationService.success(( type === 'trezor' ? 'Trezor' : 'Ledger' ) + ': imported address');

			user.publicAddr = address
			user.mode = type
			user.hdWalletAddrIdx = idx

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
					user.TREZOR_HD_PATH,
					'0'+count.toString(16),
					'0'+user.GAS_PRICE.toString(16), // gas price
					'0'+GAS_LIM.toString(16), // gas limit
					user.publicAddr.slice(2), // to, w/o the 0x prefix TODO
					'00', // value TODO
					tx.encodeABI(), // data TODO
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
			} else if (user.mode === 'ledger') {

				ledger.comm_u2f.create_async()
				.then(function(comm) {
					var eth = new ledger.eth(comm)

					var dPath = user.LEDGER_HD_PATH+'/'+user.hdWalletAddrIdx;
					console.log(dPath)
					eth.signTransaction_async(dPath, tx.encodeABI()).then(function(result) {
							console.log('from signtx', result);

							eth.signPersonalMessage_async(dPath, Buffer.from("order pls").toString("hex")).then(function(result) {
								var v = result['v'] - 27;
								v = v.toString(16);
								if (v.length < 2) {
								v = "0" + v;
								}
								console.log("Signature 0x" + result['r'] + result['s'] + v);

							}).catch(function(ex) {console.log(ex);})
					}).catch(function(ex) {console.log(ex);});

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

		user.handleLedgerError = function(err)
		{
			console.error(err)
			LxNotificationService.error('Ledger Error: '+(err.message || u2f.getErrorByCode(err.errorCode)));
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