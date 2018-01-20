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
* consider if markets/wallets should be merged: no. because just [wallet balance] vs [exchange balance] or however we want to call it is enough cognitive load to also put at markets
* order book depth: canceled for now, not important
* wallets tab
* split: header, header/{tabs, indicators, night-mode} (components: ...)
* top bar indicators (price, etc.)
* remove wallets tab and shift wallet part in the exchange view
* orderbook component
* Consider something more visual for day and night button: https://codepen.io/jsndks/pen/qEXzOQ
* tradeview chart
* Metamask
* service for user
* Hardware Wallets: Trezor
* fix double-loading bug on FF
* markets: hide zero balances
* service for CMC
* UI: fiat amounts showing in market table
* UI: user dropdown: ethereum network, addr, login with trezor
* Order form fields should only allow the input of numbers and decimals
* merge validation
* Auth: ability to use more than one trezor addr
* colors in order book
* re-visit charts (highcharts: orderbook.io, coinmarketcap, radar, yobit, iconomi, cryptopia, coincube, bitstamp (depth chart); tradingview: liqui, idex, bitfinex, hitbtc, gatecoin, huobi, big.one, kucoin); decided on highcharts temporarily
* Ledger signing
* Proper Ledger errors (e.g. when it's locked)
* make all third party scripts NOT load from third party domains
* service for submitting ordeers, keccak256
* chart size
* service for getting user's balances for tokens; ensure hide zero balances works

# TODO
* service for the API
* service for the orderbook state
* split code a bit
* place order: input number vs text; TEXT: kucoin, binance, bittrex, radar, bitstamp ;  NUMBER: IDEX
* order book: show which orders are yours and which are pending 
* summarize '24h' on the top indicators rather than writing it separately
* auth (user) dialog should show ETH balance, highlight the current auth type 
* authentication: save last mode, prompt for re-authentication upon refresh (trezor/ledger)
* ability to go to a token by addr
* gas price controls in the UI (get data from https://ethgasstation.info/) https://ethgasstation.info/json/ethgasAPI.json
* buy/sell controls: slider, calculate total amount, show available amnt
* Last Trades UI
* My Orders UI
* Spificator (or similar 'in progress'): include to improve TX UX


## mañana but important

* xss: check `ng-bind` ( esp `<a>` and `onclick`)
* xss: no third-party scripts
* xss: no third-party sources of data
* xss: custom (user) data cannot override existing symbols (e.g. mock some existing token)
* TradingView license: also check if we can host `tv.js` on our servers
* component for the top indicators that would flash green/red
* Proper night mode

## mañana

* localization
* service worker 
* modal dialog explaining you should use Metamask or Trezor - show on buy/sell attempt
* order book depth
* optimize angular watchers: https://medium.com/@kentcdodds/counting-angularjs-watchers-11c5134dc2ef
