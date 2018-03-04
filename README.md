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

```
git checkout deploy
git merge master
 npm run build && git add -f dist/* && git commit -m 'update' && git subtree push --prefix dist origin gh-pages
 ```
