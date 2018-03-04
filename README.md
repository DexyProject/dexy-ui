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

`QmWTcmUG3cjBqvQ9bhZQDPeg8qyYSpYeKNA6zaBzx4evuL` - commit hash `d4f4c99f046a2ee784e274a1b288ce7821d9a702`