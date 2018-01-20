(function()
{
    'use strict';

    angular
        .module('dexyApp')
        .controller('MarketsController', MarketsController);

    MarketsController.$inject = ['$filter', '$scope', '$state', 'cmc', 'user'];

    function MarketsController($filter, $scope, $state, cmc, user)
    {
        var vm = this;

        vm.dataTableThead = [
        {
            name: 'symbol',
            label: 'Market',
            sortable: true
        },
        {
            name: 'name',
            label: 'Name',
            sortable: true
        },
        {
            name: 'balance',
            label: 'Balance',
            sortable: true,
        },
        {
            name: 'price',
            label: 'Price',
            //icon: 'comment-text',
            format: formatRowWithFIAT.bind(null, 'price'),
            sortable: true
        },
        {
            name: 'change',
            label: '% Change',
            format: function(row) {
                return '<div class="'+(row.change >= 0 ? 'positive' : 'negative')+'"">'
                    +(row.change*100).toFixed(2)
                    +'%</div>'
            },
            sortable: true,
        },
        {
            // default sort
            name: 'vol',
            label: '24h Volume',
            format: formatRowWithFIAT.bind(null, 'vol'),
            sortable: true,
            sort: 'desc'
        },
        {
            name: 'high',
            label: '24h High',
            format: formatRowWithFIAT.bind(null, 'high'),
            sortable: true,
        },
        {
            name: 'low',
            label: '24h Low',
            format: formatRowWithFIAT.bind(null, 'low'),
            sortable: true,
        },

        ];
        vm.advancedDataTableThead = angular.copy(vm.dataTableThead);
        vm.advancedDataTableThead.unshift(
        {
            name: 'image',
            format: function(row)
            {
                return '<img src="img/markets/'+row.symbol+'-ETH.png" height=30></a>';
            }
        });

        // Persistent props
        $scope.hideZeroBal = false
        $scope.persistingProp($scope, 'hideZeroBal')

        // Fill in vol, price_eth, price_fiat
        //vm.dataTableTbody = angular.copy(CONSTS.markets);
        // ugly but works
        var markets = angular.copy(CONSTS.markets)
        markets.forEach(function(x) {
            // TEMP TMP TEMP 
            x.price = Math.random()
            x.high = x.price + Math.random()*0.2
            x.low = x.price - Math.random()*0.2
            x.vol = 200 * Math.random()
            x.change = 0.4*(Math.random()-0.5)
            x.balance = 0
            
            var token = CONSTS.tokens[x.symbol]
            if (token) {
                x.token = token
                x.tokenContract = new web3.eth.Contract(CONSTS.erc20ABI, token[0])
            }
        })

        // NOTE: this is very similar to the code in exchange.js, maybe make it more abstract 
        // once we have to get from the contract too
        $scope.$watch(function () {
            return user.publicAddr
        }, function (addr) {
            if (!addr) return

            markets.forEach(function(x) {
                if (!x.token) return

                console.log('Fetching ' + x.symbol + ' balances for ' + addr)

                x.tokenContract.methods.balanceOf(addr).call(function (err, bal) {
                    if (err) console.error(err)
                    else {
                        x.balance = (bal / x.token[1]).toFixed(2)
                        if (!$scope.$$phase) $scope.$apply()
                    }
                })
            })

        })

        // debounce the search?
        $scope.$watch('hideZeroBal', updateItems)
        $scope.$watch('vm.search', updateItems)

        function updateItems() {
            vm.dataTableTbody = [].concat(markets)
            
            if ($scope.hideZeroBal) vm.dataTableTbody = vm.dataTableTbody.filter(function(x) {
                return x.balance > 0
            })

            if (vm.search) vm.dataTableTbody = $filter('filter')(vm.dataTableTbody, vm.search)
        }

        $scope.$on('lx-data-table__selected', updateActions);
        $scope.$on('lx-data-table__unselected', updateActions);
        $scope.$on('lx-data-table__sorted', updateSort);

        ////////////

        function updateActions(_event, _dataTableId, _selectedRows)
        {
            $state.go('exchange', { pair: _selectedRows[0].symbol })

        }

        function updateSort(_event, _dataTableId, _column)
        {
            vm.dataTableTbody = $filter('orderBy')
                (vm.dataTableTbody, _column.name, _column.sort === 'desc' ? true : false)
        }

        function formatRowWithFIAT(prop, row)
        {
            // TODO: use angular number format 

            var fiatAmnt = $scope.useEUR
            ? '€'+(row[prop] * cmc.pairs.ETHEUR).toFixed(2)
            : '$'+(row[prop] * cmc.pairs.ETHUSD).toFixed(2)

            return '<div>'+row[prop].toFixed(8)+'</div><div class="label">'+fiatAmnt+'</div>'
        }
    }
})();
