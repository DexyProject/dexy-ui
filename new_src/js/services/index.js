import angular from 'angular';

let servicesModule = angular.module('app.services', []);

import MarketsService from './markets.service';
servicesModule.service('Markets', MarketsService);

import CoinMarketCap from './coinmarketcap.service';
servicesModule.service('CoinMarketCap', CoinMarketCap);

import GasPrice from './gasprice.service';
servicesModule.service('GasPrice', GasPrice);

export default servicesModule;
