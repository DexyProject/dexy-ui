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
* deposit/withdraw - ether
* wallet balances validation as number
* deposit/withdraw - token
* sign a tx calling trade()
* make trade() work
* BUG: deposits/withdraws: when chaining two functions, `.send()` waits for the tx to be mined, which is wrong
* sign transactions/deposit/withdraw with trezor
* get last allowance in advance so as to avoid Trezor window getting blocked
* consider refresh balances event; figure out tokens refresh balances
* BUG: Dialog shows 'Buying...' no matter which side you're on 
* sign transactions/deposit/withdraw with ledger
* vault
* cancel order
* bootstrap-based modals
* remove lxnotificationservice
* grep the source code for lx-, remove lumx
* test trezor popup
* split directory dialogs/
* fix fonts/icons/images in prod
* split exchange.js
* fillOrder should not be in placeOrder controller
* My Orders UI
* Remove lumx for popup handling (https://github.com/Ivshti/dexy-ui/blob/master/src/components/exchange/fillOrderDialog.pug#L1) Can be done with bootstrap and angular alone
* Sometimes it can't import a trezor addr (if doing it too quickly?); seems like a race (presumed fixed with `7820ed4f1e92bd61e6eb6c140e56acc7c3a29e17`)
* properly split configs
* warning in the UI if connected to the wrong net
* deploy to ipfs, deploy scripts, different build modes; figure out cache invalidation
* integrate https://github.com/MyEtherWallet/ethereum-lists/blob/master/tokens/tokens-eth.json or/and https://github.com/forkdelta/tokenbase 
* merge filled and clean-up math in exchange.js
* take filled into account when displaying the amount. Users should only be able to take amount - filled
* refresh order book properly (time interval; also after user addr change)
* implement 'On Orders'
* fix/remove global indicators
* universal handling of sendTx errors all over exchange.js; consider moving hw wallet errors to just errors from sendTx
* fullscreen icon
* `.estimateGas()` 
* toastr `toastr.options.escapeHtml = true;` sanitization
* show success notifications, and go to etherscan when clicked; etherscan url in config
* find a token DB with icons and integrate that: back to using CMC
* place order: make the 25/50/etc buttons work
* xss: no third-party scripts
* Last Trades UI
* placing orders: validate (sufficient funds, etc)
* filling orders: close modal once a tx is submitted
* filling orders: cap to the maximum of what you have (e.g. cant sell more tokens than you have)
* filling orders: validate whether canTrade, show notification if not
* show a warning if you try to place an order that's away from the spread
* Bug: order book is not properly sorted
* Fee calculator should be working
* get price history from API
* expiration: should it be 5 days?
* charts need to refresh
* terraform: basics - go, nginx, etc.
* terraform: firewall
* new canTrade/trade arg order
* UX: in the top dropdown, addr and network should not be selectable
* UX: errors in order form to stand out
* markets to load proper data
* UX: show total available balance in "Place order"

# TODO

* Balance check when deposit/withdraw

* Markets: pagination

* UX: your orders to be more understandable visually

* UX: asset name to be obvious (probably in the header)


## mañana but important

* search bar in header, this should allow users to search for a symbol. If an address is inserted, it should show a dropdown go to blah blah. When clicked a user goes on the trading page for said address, this is to allow custom tokens. Consider using typeahead.js

* Spificator (or similar 'in progress'): include to improve TX UX; we can just set an inProgress[] map when sendTx is completed

* order book: show which orders are yours and which are pending
* sortable table row icons
* xss: check `ng-bind` ( esp `<a>` and `onclick`)
* xss: no third-party sources of data
* xss: custom (user) data cannot override existing symbols (e.g. mock some existing token)
* authentication: save last mode, prompt for re-authentication upon refresh (trezor/ledger)
* TradingView license: also check if we can host `tv.js` on our servers
* component for the top indicators that would flash green/red
* Proper night mode
* Optimize updating /trades, /orders and etc. - it's called too many times
* Optimize by making a debounced scope update function
* Optimize by ensuring one-time binding is used
* css: disable user-select

## mañana
* User Trades UI with filters (whether you're maker/taker, token, date) with CSV export 
* graph should be zoomable by clicking price axis and zooming. See bittrex, bitfenix etc. (https://jsfiddle.net/highcharts/6etwu5b4/) Can be done with mapNavigation, has ugly functionality however
* localization
* consider DAI pairs
* service worker 
* modal dialog explaining you should use Metamask or Trezor - show on buy/sell attempt
* order book depth graph
* optimize angular watchers: https://medium.com/@kentcdodds/counting-angularjs-watchers-11c5134dc2ef


## Potential issues

* solution for trezor popups getting blocked: before every trezor operation, show a UI popup if its not a direct result of user action (collect user feedback here; may be easier for people to just allow the popup)

* to avoid the trezor issue as much as possible, we don't do `estimateGas()` before Trezor transactions and just use a hardcoded limit; this may cause out of gas or unnecessarily expensive tx fees when using Trezor
