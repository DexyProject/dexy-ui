# dexy-ui

## Running in development

`npm start`: this will run `build/dev-server.js`, which is a basic script that compiles Pug, Stylus and JS deps (browserify)

To run with the mainnet config, do `node build/dev-server.js --mainnet`

## Running in production

TODO


## Development help

### Adding routes

TODO



### Note about deps size

As of commit hash `49a3ccf9fe716d63f955795941a76bda9f19bed3` the size of all dependencies, minified, is 1.8M - that contains a number of node modules (e.g. `buffer`) and `web3`, `hdkey`, `ethereumjs-wallet`



### Deploying

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


### Regular Maintenance

Update tokens list:

```
./scripts/genTokensList.js > ./configs/tokens/index.json
```