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
* Allow custom urls by using address in url eg: /exchange/0x107c4504cd79c5d2696ea0030a8dd4e92601b82e. Data should be read from the contract, it will be treated automatically as ERC20, if the contract is not erc20 show some error. All values should be escaped to mitigate XSS injections
* issue: orderbookCtrl 3 times?
* split code a bit
* issue: custom tokens do not have elegant err handling
* ability to go to a token by addr
* fix the controllers dynamic on orderbook, placeorder (no need for separate controllers)
* dialog to confirm placing order (or filling order)
* open dialog to fill order when you click on order
* eth addresses to be clickable and take to etherscan
* slider+input on fill dialog
* add header to orderbook and tradehistory
* fix binding on dialog
* new typed signing EIP
* service for the API, orderbook state and price history
* gas price controls in the UI (get data from https://ethgasstation.info/) https://ethgasstation.info/json/ethgasAPI.json
* place order: 25%/50%..., calculate total amount, show available amnt
* place order: input number vs text; TEXT: kucoin, binance, bittrex, radar, bitstamp ;  NUMBER: IDEX
* auth (user) dialog should highlight the current auth type 

# TODO



* integrate https://github.com/MyEtherWallet/ethereum-lists/blob/master/tokens/tokens-eth.json or/and https://github.com/forkdelta/tokenbase 

* sign a tx calling trade()

* placing orders: validate (sufficient funds, etc)

* place order: make the 25/50/etc buttons work

* signing orders with trezor & ledger

* get price history from API

* deposit/withdraw to call the sc funcs

* Last Trades UI
* My Orders UI

* order book: show which orders are yours and which are pending

* Spificator (or similar 'in progress'): include to improve TX UX

* sortable table row icons
* Remove lumx for popup handling (https://github.com/Ivshti/dexy-ui/blob/master/src/components/exchange/fillOrderDialog.pug#L1) Can be done with bootstrap and angular alone


## mañana but important

* xss: check `ng-bind` ( esp `<a>` and `onclick`)
* xss: no third-party scripts
* xss: no third-party sources of data
* xss: custom (user) data cannot override existing symbols (e.g. mock some existing token)
* authentication: save last mode, prompt for re-authentication upon refresh (trezor/ledger)
* TradingView license: also check if we can host `tv.js` on our servers
* component for the top indicators that would flash green/red
* Proper night mode

## mañana
* User Trades UI with filters (whether you're maker/taker, token, date) with CSV export 
* graph should be zoomable by clicking price axis and zooming. See bittrex, bitfenix etc. (https://jsfiddle.net/highcharts/6etwu5b4/) Can be done with mapNavigation, has ugly functionality however
* localization
* consider DAI pairs
* service worker 
* modal dialog explaining you should use Metamask or Trezor - show on buy/sell attempt
* order book depth
* optimize angular watchers: https://medium.com/@kentcdodds/counting-angularjs-watchers-11c5134dc2ef
