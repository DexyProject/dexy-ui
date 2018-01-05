(function()
{
    'use strict';

    angular
        .module('dexyApp')
        .controller('WalletsController', WalletsController);

    WalletsController.$inject = ['$filter', '$scope', '$state'];

    function WalletsController($filter, $scope, $state)
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
            label: 'In Wallet',
            sortable: true,
        },
        {
            name: 'balance_exchange',
            label: 'On Exchange (available)',
            sortable: true,
        },
        {
            name: 'balance_orders',
            label: 'On Orders',
            sortable: true,
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
        vm.advancedDataTableThead.push({
            name: 'deposit',
            format: function(row) {
                return '<lx-button name="deposit">Deposit</lx-button>'
            }
        })

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