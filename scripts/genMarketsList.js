#!/usr/bin/env node

var fetch = require('node-fetch')
var fs = require('fs')

var tokens = require('../configs/tokens')

var excludes = { BTC: true, ETH: true, TRX: true, EOS: true }
var all = []
fetch('https://api.coinmarketcap.com/v1/ticker/?limit=200')
.then(function(res) { return res.json() })
.then(function(res) {
    res.forEach(function(x) {
        if (excludes[x.symbol]) return
        if (!tokens[x.symbol]) return


        all.push(x.symbol)

        var p = './img/markets/'+x.symbol+'-ETH.png'
        if (!fs.existsSync(p)) {
            var url = 'https://files.coinmarketcap.com/static/widget/coins_legacy/64x64/'+x.id+'.png'
            fetch(url)
            .then(function(res) {
                if (res.status !== 200) {
                    console.log('WARNING: no icon for '+url+' '+res.status)
                    return
                }
                res.body.pipe(fs.createWriteStream(p))
            })
        }

    })

    console.log(JSON.stringify(all))

    setTimeout(function() {
        process.exit()
    }, 10000)
})
