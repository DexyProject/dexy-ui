#!/usr/bin/env node

var fetch = require('node-fetch')
var fs = require('fs')

var tokens = require('../configs/tokens')

var excludes = { BTC: true, ETH: true }
var all = []
fetch('https://api.coinmarketcap.com/v1/ticker/?limit=150')
.then(function(res) { return res.json() })
.then(function(res) {
    res.forEach(function(x) {
        if (excludes[x.symbol]) return
        if (!tokens[x.symbol]) return


        all.push({
            name: x.name,
            symbol: x.symbol,
            erc20: tokens[x.symbol]
        })


        fetch('https://files.coinmarketcap.com/static/img/coins/64x64/'+x.id+'.png')
        .then(function(res) {
            res.body.pipe(fs.createWriteStream('./img/markets/'+x.symbol+'-ETH.png'))
        })
    })

    console.log(JSON.stringify(all))
})