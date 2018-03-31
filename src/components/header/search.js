(function () {
    'use strict';

    angular
        .module('dexyApp')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['$scope', '$state', '$rootScope'];

    function SearchCtrl($scope, $state, $root) {
        $scope.searchKeyword = ''

        $scope.$watch(function() { return $root.searchKeyword }, function(val) {
            if (!val) return
            
            if ($state.current.name !== 'markets') 
                console.log('@TODO do dropdown with '+val)
        })
        
    }
})();
