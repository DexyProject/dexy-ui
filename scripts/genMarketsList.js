#!/usr/bin/env node

var fetch = require('node-fetch')
var fs = require('fs')

var tokens = require('../configs/tokens')

var excludes = { BTC: true, ETH: true }
var all = []
fetch('https://api.coinmarketcap.com/v1/ticker/?limit=200')
.then(function(res) { return res.json() })
.then(function(res) {
    res.forEach(function(x) {
        if (excludes[x.symbol]) return
        if (!tokens[x.symbol]) return


        all.push(x.symbol)

        /*
        fetch('https://files.coinmarketcap.com/static/img/coins/64x64/'+x.id+'.png')
        .then(function(res) {
            var p = './img/markets/'+x.symbol+'-ETH.png'
            if (res.statusCode === 200 && ! fs.existsSync(p))
                res.body.pipe(fs.createWriteStream(p))
        })*/
        //does not work as of 04.03.2018
    })

    console.log(JSON.stringify(all))

    setTimeout(function() {
        process.exit()
    }, 10000)
})