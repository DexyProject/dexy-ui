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


# TODO
* top bar indicators (price, etc.)
* components: obTable, services: orderbook ; start integrating API
* charting lib: order book depth?
* Metamask
* Hardware Wallets (Trezor, Ledger)
* Consider something more visual for day and night button: https://codepen.io/jsndks/pen/qEXzOQ


[LOGO][MARKETS | WALLETS | HELP]          ETH/USD  NIGHTMODE
(mybe make ETH/USD a dropdown and have ETH/EUR)

# mañana but important

* xss: check `ng-bind` ( esp `<a>` and `onclick`)
* xss: no third-party scripts
* xss: no third-party sources of data
* xss: custom (user) data cannot override existing symbols (e.g. mock some existing token)

# mañana
* localization
* service worker 
