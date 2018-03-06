var argv = require('minimist')(process.argv.slice(2))

if (argv.mainnet) {
    console.log('Using mainnet config (./configs/mainnet.js)')
    configPath = './configs/mainnet.js'
} else {
    console.log('Using ropsten config (./configs/ropsten.js)')
    configPath = './configs/ropsten.js'
}

module.exports = configPath