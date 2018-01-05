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
            label: 'Volume (24hr)',
            sortable: true,
            sort: 'desc'
        },
        {
            name: 'price_eth',
            label: 'Price ETH',
            //icon: 'comment-text',
            sortable: true
        },
        {
            name: 'price_fiat',
            label: 'Price USD', // TODO: multiple currencies
            //icon: 'comment-text',
            sortable: true
        },
        ];
        vm.advancedDataTableThead = angular.copy(vm.dataTableThead);
        vm.advancedDataTableThead.unshift(
        {
            name: 'image',
            format: function(row)
            {
                return '<img src="/img/markets/'+row.symbol+'-ETH.png" height="40"></a>';
            }
        });

        // Fill in vol, price_eth, price_fiat
        vm.dataTableTbody = angular.copy(CONSTS.markets);

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
            vm.dataTableTbody = $filter('orderBy')(vm.dataTableTbody, _column.name, _column.sort === 'desc' ? true : false);
        }
    }
})();