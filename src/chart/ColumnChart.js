/**
 * Column Chart
 * @type {*}
 */
zChart.ColumnChart = zChart.XYChart.extend({
    init: function (opts, theme) {
        this._super(opts, theme);
    }
});

// register chart
zChart.regChart("column", zChart.ColumnChart);
