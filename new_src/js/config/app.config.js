function AppConfig($urlRouterProvider, $stateProvider) {
    'ngInject';
    $urlRouterProvider.when('', '/').when('/', '/markets').otherwise('/markets');

    $stateProvider
        .state('app', {
            abstract: true,
            templateUrl: 'js/layout/layout.html',
        });
}

export default AppConfig;
