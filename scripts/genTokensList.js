#!/usr/bin/env node

var fetch = require('node-fetch')
var fs = require('fs')

var tokens = { }

var all = []
fetch('https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/tokens/tokens-eth.json')
.then(function(res) { return res.json() })
.then(function(res) {
	res.forEach(function(token) {
		
		if (token.symbol == 'EOS' || token.symbol == 'TRX') {
			return;
		}
		
		tokens[token.symbol] = [token.address, Math.pow(10, parseInt(token.decimals, 10))]
	})

	console.log(JSON.stringify(tokens))
})
