window.chartStyle = {
    rangeSelector: {
        inputEnabled: false,
        selected: 1,
        buttons: [{
            type: 'hour',
            count: 1,
            text: '1h'
        }, {
            type: 'day',
            count: 1,
            text: '1d'
        }, {
            type: 'week',
            count: 1,
            text: '1w'
        }, {
            type: 'month',
            count: 1,
            text: '1m'
        }],
        buttonTheme: {
            fill: 'none',
            stroke: 'none',
            'stroke-width': 0,
            style: {
                color: '#b9b9b9',
                textTransform: 'uppercase',
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
        height: '44%',
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
    xAxis: [{
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
        }
    }],
    tooltip: {
        enabled: false
    },
    series: [{
        type: 'candlestick',
        name: 'Price',
        zIndex: 2,
        dataGrouping: {
            enabled: true,
            forced: true,
            groupPixelWidth: 25,

            units: [
                ['hour', [1, 2, 3, 4, 6, 8, 12, 24, 48]]
            ]
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

            units: [
                ['hour', [1, 2, 3, 4, 6, 8, 12, 24, 48]]
            ]
        },
        color: '#b9b9b9'
    }]
}