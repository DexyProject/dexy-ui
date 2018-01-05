#!/usr/bin/env node

var fetch = require('node-fetch')
var tokens = require('./tokens')

var excludes = { BTC: true, ETH: true }
var all = []
fetch('https://api.coinmarketcap.com/v1/ticker/?limit=150')
.then(function(res) { return res.json() })
.then(function(res) {
	res.forEach(function(x) {
		if (excludes[x.symbol]) return
		if (tokens[x.symbol]) all.push({
			name: x.name, 
			symbol: x.symbol,
			erc20: tokens[x.symbol]
		})
	})
	console.log(JSON.stringify(all))
})