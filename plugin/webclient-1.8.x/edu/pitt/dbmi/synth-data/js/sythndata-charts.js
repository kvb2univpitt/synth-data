if (typeof i2b2.sythndata === 'undefined') {
    i2b2.sythndata = {};
}

i2b2.sythndata.boxAndWhiskerPlot = function (divname, statDict, xlabel, title, cind) {
    const c = [
        ['#1f77b4', '#7cc2f2'],
        ['#ff7f0e', '#f7c192']
    ];
    const chart = c3.generate({
        bindto: '#' + divname,
        size: {
            height: 150,
            width: 600
        },
        data: {
            xs: {
                y_u: 'x',
                y_d: 'x',
                y_max: 'x_max',
                y_min: 'x_min'
            },
            columns: [
                ['x', statDict['Q1'], statDict['median'], statDict['Q3']],
                ['y_u', .5, .5, .5],
                ['y_d', -.5, -.5, -.5],
                ['x_max', statDict['max']],
                ['x_min', statDict['min']],
                ['y_max', 0],
                ['y_min', 0]
            ],
            types: {
                y_u: 'area-spline',
                y_d: 'area-spline',
                y_max: 'scatter',
                y_min: 'scatter'
            },
            colors: {
                y_u: c[cind][0],
                y_d: c[cind][0]
            }
        },
        axis: {
            // rotated: true,
            x: {
                label: xlabel,
                // inverted: true
                min: 0,
                max: 100,
                center: 0
            },
            y: {
                // tick: {
                //     format: function (d) { return Math.abs(d); }
                // },
                min: -1,
                max: 1,
                show: false,
                center: 0
            },
        },
        grid: {
            x: {
                lines: [
                    {value: statDict['median'], class: 'gridBW', text: 'median'},
                    {value: statDict['Q1'], class: 'gridBW', text: 'Q1'},
                    {value: statDict['Q3'], class: 'gridBW', text: 'Q3'},
                    {value: statDict['min'], class: 'gridBW', text: 'min'},
                    {value: statDict['max'], class: 'gridBW', text: 'max'}
                ]
            },
            y: {lines: [{value: 0}]}
        },
        point: {show: false},
        legend: {
            show: false,
            hide: ['y_u', 'y_d']
        }
    });
};