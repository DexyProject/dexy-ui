import angular from 'angular';

// Create the module where our functionality can attach to
let servicesModule = angular.module('app.services', []);

import MarketsService from './markets.service';
servicesModule.service('Markets', MarketsService);

import CoinMarketCap from './coinmarketcap.service';
servicesModule.service('CoinMarketCap', CoinMarketCap);

export default servicesModule;