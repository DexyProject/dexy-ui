(function()
{
    'use strict';

    angular
        .module('dexyApp')
        .controller('DemoDataTableController', DemoDataTableController);

    DemoDataTableController.$inject = ['$filter', '$scope', '$state'];

    function DemoDataTableController($filter, $scope, $state)
    {
        var vm = this;

        vm.dataTableThead = [
        {
            name: 'symbol',
            label: 'Market',
            sortable: true
        },
        {
            name: 'calories',
            label: 'Calories',
            sortable: true
        },
        {
            name: 'fat',
            label: 'Fat (g)',
            sortable: true,
            sort: 'asc'
        },
        {
            name: 'comments',
            label: 'Comments',
            icon: 'comment-text',
            sortable: false
        }];
        vm.advancedDataTableThead = angular.copy(vm.dataTableThead);
        vm.advancedDataTableThead.unshift(
        {
            name: 'image',
            format: function(row)
            {
                return '<a href="/#/exchange/ETH-ADX"><img src="https://files.coinmarketcap.com/static/img/coins/32x32/adx-net.png" width="40" height="40"></a>';
            }
        });
        vm.dataTableTbody = [
        {
            id: 1,
            image: '/images/placeholder/1-square.jpg',
            symbol: 'ETH-BNB',
            calories: 159,
            fat: 6.0,
            comments: 'Lorem ipsum'
        },
        {
            id: 2,
            image: '/images/placeholder/2-square.jpg',
            symbol: 'ETH-OMG',
            calories: 237,
            fat: 9.0,
            comments: 'Lorem ipsum',
            //lxDataTableDisabled: true
        },
        {
            id: 3,
            image: '/images/placeholder/3-square.jpg',
            symbol: 'ETH-ADX',
            calories: 262,
            fat: 16.0,
            comments: 'Lorem ipsum'
        }];

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