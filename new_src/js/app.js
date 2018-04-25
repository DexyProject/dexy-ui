import angular from 'angular';
import 'angular-ui-router';
import 'toastr';

import appRun from './config/app.run';
import appConfig from './config/app.config';
import constants from './config/app.constants';

import './layout';
import './services';
import './markets';

window.cfg = require('../../configs/ropsten.js');

const requires = [
    'ui.router',
    'app.layout',
    'app.markets',
    'app.services'
];

window.app = angular.module('app', requires);

angular.module('app').constant('AppConstants', constants);
angular.module('app').config(appConfig);
angular.module('app').run(appRun);

angular.bootstrap(document, ['app'], {
    strictDi: true
});
