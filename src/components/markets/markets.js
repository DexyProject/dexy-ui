(function()
{
    'use strict';

    angular
        .module('dexyApp')
        .controller('MarketsController', MarketsController);

    MarketsController.$inject = ['$filter', '$scope', '$state'];

    function MarketsController($filter, $scope, $state)
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
            // default sort
            name: 'vol',
            label: '24hr Volume',
            sortable: true,
            sort: 'desc'
        },
        {
            name: '24hr_high',
            label: '24hr High',
            sortable: true,
            sort: 'desc',
        },
        {
            name: '24hr_low',
            label: '24hr Low',
            sortable: true,
            sort: 'desc',
        },
        {
            name: 'price',
            label: 'Price',
            //icon: 'comment-text',
            sortable: true
        },
        {
            name: 'added',
            label: 'Added',
            sortable: true,
            sort: 'desc',
        }
        ];
        vm.advancedDataTableThead = angular.copy(vm.dataTableThead);
        vm.advancedDataTableThead.unshift(
        {
            name: 'image',
            format: function(row)
            {
                return '<img src="/img/markets/'+row.symbol+'-ETH.png" height=40></a>';
            }
        });

        // Fill in vol, price_eth, price_fiat
        //vm.dataTableTbody = angular.copy(CONSTS.markets);
        // ugly but works
        var markets = angular.copy(CONSTS.markets)

        $scope.$watch('hideZeroBal', function(hide, o) {
            vm.dataTableTbody = [].concat(markets)
            
            if (hide) vm.dataTableTbody = vm.dataTableTbody.filter(function(x) {
                return x.balance > 0
            })
        })

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
    }
})();