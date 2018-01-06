# Done

* basic scaffold
* ngRoute
* tables
* separate `js` dir
* naming: `markets` and `exchange`
* evaluate highcharts
* split/architect source code properly
* put logo on left of tabs, clear UI separators, margins, font
* binance-like exchange layout
* building with gulp
* browserifying deps, web3
* script to get top eth markets from cmc
* Proper table for markets
* fullscreen button
* consider if markets/walelts should be merged: no. because just [wallet balance] vs [exchange balance] or however we want to call it is enough cognitive load to also put at markets
* order book depth: canceled for now, not important
* wallets tab
* split: header, header/{tabs, indicators, night-mode} (components: ...)
* top bar indicators (price, etc.)
* remove wallets tab and shift wallet part in the exchange view
* orderbook component
* tradeview chart
* Metamask
* service for user
* Hardware Wallets: Trezor

# TODO
* re-visit charts
* service for CMC
* service for getting user's balances for tokens
* fiat amounts showing in market table
* markets: ETH balance, hide zero balances
* service for the API
* orderbook service
* Spificator: include to improve TX UX
* Consider something more visual for day and night button: https://codepen.io/jsndks/pen/qEXzOQ


[LOGO][MARKETS | WALLETS | HELP]          ETH/USD  NIGHTMODE
(mybe make ETH/USD a dropdown and have ETH/EUR)

# mañana but important

* xss: check `ng-bind` ( esp `<a>` and `onclick`)
* xss: no third-party scripts
* xss: no third-party sources of data
* xss: custom (user) data cannot override existing symbols (e.g. mock some existing token)
* TradingView license: also check if we can host `tv.js` on our servers
* Hardware wallets: Ledger

# mañana
* trade history (perhaps this can go under the main chart: [Last Trades | My Trades] tabs)
* localization
* service worker 
* modal dialog explaining you should use Metamask or Trezor - show on buy/sell attempt
* order book depth
* optimize angular watchers: https://medium.com/@kentcdodds/counting-angularjs-watchers-11c5134dc2ef