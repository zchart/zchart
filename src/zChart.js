var global = this;
if (typeof global.zChart === 'undefined') {
    global.zChart = {};
    zChart.chartType = {};
}

/**
 * Chart factory function
 * @param opts
 * @param theme
 * @constructor
 */
zChart.create = function (opts, theme) {
    if (!opts) {
        return null;
    }

    var type = opts.chart.type;
    if (!zChart.chartType[type]) {
        return;
    }

    return new zChart.chartType[type](opts, theme);
};

/**
 * Register chart constructor
 * @param type
 * @param chart
 */
zChart.regChart = function (type, chart) {
    zChart.chartType[type] = chart;
};