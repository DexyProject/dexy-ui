(function () {
    'use strict';

    angular
        .module('dexyApp')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['$scope', '$state', '$rootScope'];

    function SearchCtrl($scope, $state, $root) {
        $scope.searchKeyword = ''

        $scope.$watch('searchKeyword', function(val) {
            if ($state.current.name === 'markets') 
                $root.$broadcast('search-markets', val)
        })
        
    }
})();
