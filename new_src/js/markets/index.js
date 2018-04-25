import angular from 'angular';

let marketsModule = angular.module('app.markets', []);

import MarketsConfig from './markets.config';
marketsModule.config(MarketsConfig);

import MarketsCtrl from './markets.controller';
marketsModule.controller('MarketsCtrl', MarketsCtrl);

export default marketsModule;