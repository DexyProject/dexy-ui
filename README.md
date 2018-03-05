# dexy-ui

## Running

### Running in development

`npm start`: this will run `build/dev-server.js`, which is a basic script that compiles Pug, Stylus and JS deps (browserify)

To run with the mainnet config, do `node build/dev-server.js --mainnet`

### Running in production

TODO


## Deploying

Before deploying, please ensure

* To bump the version
* Make sure you're deploying the right configuration (Mainnet vs ropsten)
* Ensure you configure the NGINX proxy with a working ipfs hash to the right network (mainnet vs ropsten)

#### Mainnet

```
gulp --mainnet
ipfs add -r dist
 ```

#### Ropsten

```
gulp --ropsten
ipfs add -r dist
```


#### Latest deployments

Ropsten:

`QmQsuFoxmCnoTraVse4WkUhzgDgSVenSX2uT7tuqSEzxAG` - commit hash `ca03a49b848271ff1f0db6b7e64f35a9d8291e58`


## Regular Maintenance

Update tokens list:

```
./scripts/genTokensList.js > ./configs/tokens/index.json
```


## Development help

### Adding routes

TODO

basically add them to `src/js/routing` and add a template/controller



### Note about deps size

As of commit hash `49a3ccf9fe716d63f955795941a76bda9f19bed3` the size of all dependencies, minified, is 1.8M - that contains a number of node modules (e.g. `buffer`) and `web3`, `hdkey`, `ethereumjs-wallet`


### Balances and data updating

Currently, the way we update data is pretty messy

`src/js/services/user`: deals with `user.ethBal`, which is split in `onWallet` and `onExchange` - respectively how much ETH we have on our wallet and on the exchange's vault

`src/components/exchange/exchange.js`: deals with `exchange.onWallet` and `exchange.onExchange`, which is the current selected token balance on wallet and on the exchange's vault

Also emits the event `reload-orders`, which triggers a reload of `orderbook`, `myOrders` and `tradeHistory` controllers

`src/components/exchange/myOrders`: loads user's orders and updates `exchange.onOrders`, which are the ETH/token balances reserved on orders

`src/components/exchange/orderbook`: loads the entire orderbook

`src/components/exchange/tradeHistory`: loads the entire trade history