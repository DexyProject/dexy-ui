window.chartStyle = (function() {

    var chartStyle = {
        rangeSelector: {
            inputEnabled: false,
            selected: 0,
            buttonSpacing: -5,
            buttons: [
            {
                type: 'minute',
                count: 10,
                text: '10m',
            },
            {
                type: 'hour',
                count: 1,
                text: '1h'
            }, {
                type: 'day',
                count: 1,
                text: '1d'
            }],
            buttonPosition: {
                align: 'right',
                x: 0,
                y: 0
            },
            buttonTheme: {
                fill: 'none',
                stroke: 'none',
                'stroke-width': 0,
                style: {
                    color: '#b9b9b9',
                    textTransform: 'uppercase',
                    fontFamily: 'Arial',
                },
                states: {
                    hover: {
                        fill: 'none',
                        stroke: 'none',
                        'stroke-width': 0,
                        style: {
                            color: '',
                        }
                    },
                    select: {
                        fill: 'none',
                        stroke: 'none',
                        'stroke-width': 0,
                        style: {
                            color: '#6c54c9',
                        }
                    }
                }
            },
        },
        plotOptions: {
            candlestick: {
                color: '#e57373',
                lineColor: '#e57373',
                upColor: 'transparent',
                upLineColor: '#4db6ac'
            }
        },
        chart: {
            panning: true,
        },
        credits: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        title: {
            enabled: false
        },
        yAxis: [{
            crosshair: {
                dashStyle: 'Dot',
                snap: false,
                label: {
                    enabled: true,
                    format: '{value:.5f}',
                    backgroundColor: '#FFF',
                    borderColor: '#6c54c9',
                    borderWidth: '1',
                    style: {
                        "color": "#6c54c9",
                        "fontWeight": "normal",
                        "fontSize": "11px",
                        "textAlign": "center"
                    }
                }
            },
            height: '100%',
            lineWidth: 0,
            min: 0,
            gridLineWidth: 0,
            offset: 0,
            labels: {
                align: 'left',
                style: {
                    color: '#b9b9b9',
                    'min-width': '40px'
                }
            }
        }, {
            crosshair: {
                dashStyle: 'Dot',
                snap: false,
                label: {
                    enabled: false,
                }
            },
            top: '80%',
            height: '20%',
            lineWidth: 0,
            offset: 0,
            gridLineWidth: 0,
            labels: {
                enabled: false
            }
        }],
        xAxis: {
            dateTimeLabelFormats: {
                day: '%b %e',
                week: '%b %e',
                month: '%b \'%y',
            },
            crosshair: {
                dashStyle: 'Dot',
                snap: false,
                label: {
                    enabled: true,
                    backgroundColor: '#FFF',
                    borderColor: '#6c54c9',
                    borderWidth: '1',
                    style: {
                        "color": "#6c54c9",
                        "fontWeight": "normal",
                        "fontSize": "11px",
                        "textAlign": "center"
                    }
                }
            },
            lineColor: "#b9b9b9",
            tickColor: "#b9b9b9",
            ordinal: false,
            labels: {
                style: {
                    color: '#b9b9b9'
                }
            },
            minRange: 60 * 1000,
        },
        tooltip: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            hideDelay: 1,
            shadow: false,
            useHTML: true,
            shared: true,
            formatter: function () {
                // @TODO: @WARNING: performance
                var c = this.points[0] ? this.points[0].point : undefined;
                var v = this.points[1] ? this.points[1].point : undefined;
                var $scope = angular.element('[id=exchange]').scope();
                var volume = (v.y / CONSTS.ETH_MUL).toFixed(3) + ' ETH';
                $scope.meta.open = c.open.toFixed(8);
                $scope.meta.high = c.high.toFixed(8);
                $scope.meta.low = c.low.toFixed(8);
                $scope.meta.close = c.close.toFixed(8);
                $scope.meta.vol = volume;
                $scope.$apply()
                return ""
            }
        },
        series: [{
            type: 'candlestick',
            name: 'Price',
            zIndex: 2,
            dataGrouping: {
                enabled: true,
                forced: true,
                groupPixelWidth: 25,
            }
        },
        {
            type: 'column',
            name: 'Volume',
            pointWidth: 10,
            yAxis: 1,
            zIndex: 1,
            dataGrouping: {
                enabled: true,
                forced: true,
                groupPixelWidth: 25,
            },
            color: '#b9b9b9'
        }]
    }

    return chartStyle
})()
