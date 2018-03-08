(function () {
    'use strict';

    // Chart ctrl
    angular
        .module('dexyApp')
        .controller('chartCtrl', chartCtrl);

    chartCtrl.$inject = ['$scope', 'user', '$interval'];

    function chartCtrl($scope, user, $interval) {

        // 
        // Chart
        Highcharts.setOptions({
            lang: {
                rangeSelectorZoom: ''
            }
        });

        var chartStyle = angular.copy(window.chartStyle)
        chartStyle.chart.events = {
            load: function () {
                var chart = this

                var exchange = $scope.exchange

                $.getJSON(cfg.endpoint + '/ticks?token=' + exchange.tokenInf[0], function (data) {
                    // Create the chart

                    var prices = [];
                    var volume = [];
                    data.forEach(function (data) {
                        prices.push([
                            data.timestamp * 1000,
                            Number(data.open),
                            Number(data.high),
                            Number(data.low),
                            Number(data.close)
                        ])

                        volume.push([
                            data.timestamp * 1000,
                            Number(data.volume)
                        ])
                    });

                    prices.reverse()
                    volume.reverse()

                    chart.series[0].setData(prices)
                    chart.series[1].setData(volume)
                });
            }
        }
        Highcharts.stockChart('mainChart', chartStyle);
    }
})();