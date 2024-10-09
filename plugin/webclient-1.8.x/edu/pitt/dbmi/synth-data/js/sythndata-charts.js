if (typeof i2b2 === 'undefined') {
    i2b2 = {};
}
if (typeof i2b2.sythndata === 'undefined') {
    i2b2.sythndata = {};
}

const blue_patterns = ['#144D75', '#16537E', '#175987', '#195F90', '#1A6599', '#1C6BA2', '#1D71AB', '#2A7EB8', '#3585BC', '#418BBF', '#4C92C3', '#5799C7', '#62A0CB'];
const orange_patterns = ['#A65309', '#B3590A', '#BF5F0B', '#CC660B', '#D96C0C', '#E6720D', '#F2790D', '#FF851A', '#FF8C26', '#FF9232', '#FF993E', '#FF9F4A'];

i2b2.sythndata.addTitleToPlot = function (divname, title, yattr) {
    d3.select('#' + divname + ' svg').append('text')
            .attr('x', d3.select('#' + divname + ' svg').node().getBoundingClientRect().width / 2)
            .attr('y', yattr)
            .attr('text-anchor', 'middle')
            .style('font-size', '1.4em')
            .text(title);
};

i2b2.sythndata.getMultiRowsColumns = function (fielda, fieldb, namea, nameb) {
    const keysa = Object.keys(fielda);
    const keysb = Object.keys(fieldb);
    const valuesa = [];
    const valuesb = [];

    var allkeys = keysa.concat(keysb);
    var keys = allkeys.filter((item, pos) => allkeys.indexOf(item) === pos);

    for (let i = 0; i < keys.length; i++) {
        if (keysa.includes(keys[i])) {
            valuesa.push(Number(fielda[keys[i]]));
        } else {
            valuesa.push(0.0);
        }
        if (keysb.includes(keys[i])) {
            valuesb.push(Number(fieldb[keys[i]]));
        } else {
            valuesb.push(0.0);
        }
    }

    const labels = ['x'].concat(keys);

    const rows = [[namea].concat(valuesa), [nameb].concat(valuesb)];
    return {labels, rows};
};

i2b2.sythndata.violinChart = function (divname, rows, statDict, xlabel, ylabel) {
    const chart = c3.generate({
        bindto: '#' + divname,
        size: {
            height: 350,
            width: 700
        },
        data: {
            x: 'x',
            columns: rows,
            types: {
                'Source': 'area-spline',
                'Synth': 'area-spline'
            }
        },
        axis: {
            // rotated: true,
            x: {
                label: xlabel
                        // inverted: true
            },
            y: {
                label: ylabel,
                tick: {
                    format: function (d) {
                        return Math.abs(d);
                    }
                }
            }
        },
        grid: {
            x: {
                lines: [
                    {value: statDict['median']['Source'], class: 'gridSource'},
                    {value: statDict['median']['Synth'], class: 'gridSynth', text: 'median'},
                    {value: statDict['Q1']['Source'], class: 'gridQSource'},
                    {value: statDict['Q1']['Synth'], class: 'gridQSynth', text: 'Q1'},
                    {value: statDict['Q3']['Source'], class: 'gridQSource'},
                    {value: statDict['Q3']['Synth'], class: 'gridQSynth', text: 'Q3'}
                ]
            }
        },
        point: {
            show: false
        },
        legend: {
            position: 'right'
        }
    });
};

i2b2.sythndata.donutChart = function (divname, rows, title, cind, height = 350, width = 500) {
    if (rows.length > 0) {
        const patterns = (cind === 0) ? blue_patterns : orange_patterns;

        const chart = c3.generate({
            bindto: '#' + divname,
            size: {
                height: height,
                width: width
            },
            data: {
                // iris data from R
                columns: rows,
                type: 'donut'
            },
            color: {
                pattern: patterns
            },
            legend: {
                position: 'right'
            },
            donut: {
                title: title,
                label: {
                    format: function (value, ratio, id) {
                        return id;
                    }
                }
            }
        });
    }
};

i2b2.sythndata.barChart = function (divname, labels, rows, title, ylabel) {
    const columns = [labels].concat(rows);

    const chart = c3.generate({
        bindto: '#' + divname,
        size: {
            height: 250,
            width: 500
        },
        data: {
            x: 'x',
            columns: columns,
            type: 'bar'
        },
        axis: {
            x: {
                type: 'category'
            },
            y: {
                label: ylabel
            }
        },
        bar: {
            width: {
                ratio: 0.2
            }
        },
        legend: {
            position: 'right'
        }
    });
    i2b2.sythndata.addTitleToPlot(divname, title, 20);
};

i2b2.sythndata.multiBarChartPlot = function (fielda, fieldb, namea, nameb, title, ylabel, divname) {
    const {labels, rows} = i2b2.sythndata.getMultiRowsColumns(fielda, fieldb, namea, nameb);

    i2b2.sythndata.barChart(divname, labels, rows, title, ylabel);
};

i2b2.sythndata.demographicPyramidCombined = function (divname, labels, rows, title, xlabel) {
    // cind is the color index
    const ylabel = 'Age Range';
    const d11 = rows[0][0];
    const d12 = rows[1][0];
    const d21 = rows[2][0];
    const d22 = rows[3][0];
    const groups = [[d11, d12], [d21, d22]];
    const c = [
        ['#1f77b4', '#7cc2f2'],
        ['#ff7f0e', '#f7c192']
    ];

    const columns = [labels].concat(rows);
    const chart = c3.generate({
        bindto: '#' + divname,
        size: {
            height: 350,
            width: 700
        },
        data: {
            x: 'x',
            columns: columns,
            type: 'bar',
            groups: groups,
            colors: {
                'Male - Source': c[0][0],
                'Female - Source': c[0][1],
                'Male - Synth': c[1][0],
                'Female - Synth': c[1][1]
            }
        },
        axis: {
            rotated: true,
            x: {
                type: 'category',
                label: ylabel
            },
            y: {
                label: xlabel,
                tick: {
                    format: function (d) {
                        return Math.abs(d);
                    }
                }
            },
            x2: {
                show: true,
                center: 0
            }
        },
        bar: {
            width: {
                ratio: 0.6
            }
        },
        legend: {
            position: 'right'
        }
    });
    i2b2.sythndata.addTitleToPlot(divname, title, 10);
};

i2b2.sythndata.demographicPyramidCombinedPlot = function (fielda1, fieldb1, namea1, nameb1, fielda2, fieldb2, namea2, nameb2, title, xlabel, divname) {
    let out1 = i2b2.sythndata.getMultiRowsColumns(fielda1, fieldb1, namea1, nameb1);
    let out2 = i2b2.sythndata.getMultiRowsColumns(fielda2, fieldb2, namea2, nameb2);
    var labels = out1.labels;
    var rows1 = out1.rows;
    var rows2 = out2.rows;
    var rows = rows1.concat(rows2);
    i2b2.sythndata.demographicPyramidCombined(divname, labels, rows, title, xlabel);
};

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
            }
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