(function () {
    'use strict';

    // Chart ctrl
    angular
        .module('dexyApp')
        .controller('chartCtrl', chartCtrl);

    chartCtrl.$inject = ['$scope', 'user'];

    function chartCtrl($scope, user) {

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

                $.getJSON('https://ingress.api.radarrelay.com/v1/info/chart/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/0xe41d2489571d322189246dafa5ebde1f4699f498', function (data) {
                    // Create the chart

                    var prices = [];
                    var volume = [];
                    data.forEach(function (data) {
                        prices.push([
                            data.startBlockTimestamp * 1000,
                            Number(data.open),
                            Number(data.high),
                            Number(data.low),
                            Number(data.close)
                        ])

                        volume.push([
                            data.startBlockTimestamp * 1000,
                            Number(data.takerTokenVolume)
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