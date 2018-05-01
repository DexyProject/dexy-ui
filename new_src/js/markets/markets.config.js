function MarketsConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.markets', {
            url: '/markets',
            controller: 'MarketsCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'js/markets/markets.html',
            title: 'Markets',
        });
};

export default MarketsConfig;
