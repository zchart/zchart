/**
 * XY Coordinate Chart
 * @type {*}
 */
zChart.XYChart = zChart.Chart.extend({
    init: function (opts, theme) {
        this.plotX = 0;
        this.plotY = 0;
        this.plotWidth = 0;
        this.plotHeight = 0;

        this.yAxisLeft = null;
        this.yAxisRight = null;
        this.xAxis = null;

        this.rangeLeft = null;
        this.rangeRight = null;

        this._super(opts, theme);
    },
    /**
     * Destroy chart instance
     */
    destroy: function () {
        this._super();
    },
    /**
     * Set new data
     * @param data
     */
    setData: function (data) {
        this._super(data);
        var config = this.chartConfig;

        this.rangeLeft = this._getValueRange("left", config.stack);
        this.yAxisLeft.setRange(this.rangeLeft.bottom, this.rangeLeft.top, this.rangeLeft.grid);

        if (this.yAxisRight) {
            this.rangeRight = this._getValueRange("right", config.stack);
            this.yAxisRight.setRange(this.rangeRight.bottom, this.rangeRight.top, this.rangeRight.grid);
        }

        // TODO: set category axis info

        this._layout();
        this._draw();
    },
    /**
     * Get max value
     * @param side
     * @param stacked
     * @returns {Object}
     * @private
     */
    _getValueRange: function (side, stacked) {
        var data = this.data;
        var serials = this.chartConfig.serials;
        var min = Number.MAX_VALUE;
        var max = Number.MIN_VALUE;
        var i, j, value;

        if (!data || data.length === 0) {
            return {min: 0, max: 0};
        }

        var check = function (v) {
            if (v > max) {
                max = v;
            }
            if (v < min) {
                min = v;
            }
        };

        // get range
        for (i = 0; i < data.length; i++) {
            value = 0;
            for (j = 0; j < serials.length; j++) {
                if (stacked) {
                    value += data[i][serials[j].field];
                }
                else {
                    value = data[i][serials[j].field];
                    check(value);
                }
            }

            if (stacked) {
                check(value);
            }
        }

        // trim to integer
        var n = max > 0 ? max : min * -1;
        var x, m, s;

        if (n >= 0 && n <= 1) {
            m = 1;
            s = 0.2;
        }
        else if (n > 1 && n <= 10) {
            m = 2 * (((n + 1) / 2) >> 0);
            s = 2;
        }
        else {
            i = 0;
            x = (n / 10) >> 0;
            while (x > 0) {
                i++;
                x = (x / 10) >> 0;
            }

            s = Math.pow(10, i) / 2;
            m = (((n / s) >> 0) + 1) * s;
        }

        var bottom, top;
        if (max < 0) {
            bottom = m * -1;
            top = (((max * -1 / s) >> 0) - 1) * s * -1;
        }
        else {
            top = m;
            if (min > 0) {
                bottom = 0;
            }
            else {
                bottom = (((min * -1 / s) >> 0) + 1) * s * -1;
            }
        }

//        console.log({min: min, max: max, top: top, bottom: bottom, step: s, grid: (top - bottom) / s});
        return {min: min, max: max, top: top, bottom: bottom, step: s, grid: (top - bottom) / s};
    },
    /**
     * Layout chart
     * @private
     */
    _layout: function () {
        this._super();

        var width = this.canvasEl.width();
        var height = this.canvasEl.height();
        var w = 0, h = 0;

        if (!this.rotate) {
            this.yAxisLeft.setHeight(height - this.xAxis.getHeight());
            this.yAxisLeft.setPosition(0, 0);
            w = this.yAxisLeft.getWidth();

            if (this.yAxisRight) {
                this.yAxisRight.setHeight(height - this.xAxis.getHeight());
                this.yAxisRight.setPosition(width - this.yAxisRight.getWidth(), 0);
                w += this.yAxisRight.getWidth();
            }

            this.xAxis.setWidth(width - w);
            this.xAxis.setPosition(this.yAxisLeft.getWidth(), this.yAxisLeft.getHeight());

            this.plotX = this.yAxisLeft.getWidth();
            this.plotY = 0;
            this.plotWidth = width - w;
            this.plotHeight = height - this.xAxis.getHeight();
        }
        else {
            this.yAxisLeft.setWidth(width - this.xAxis.getWidth());
            this.yAxisLeft.setPosition(this.xAxis.getWidth(), height - this.yAxisLeft.getHeight());
            h = this.yAxisLeft.getHeight();

            this.xAxis.setHeight(height - h);
            this.xAxis.setPosition(0, 0);

            this.plotX = this.xAxis.getWidth();
            this.plotY = 0;
            this.plotWidth = width - this.xAxis.getWidth();
            this.plotHeight = height - this.yAxisLeft.getHeight();
        }

        this._layoutItems();
    },
    /**
     * Layout items
     * @private
     */
    _layoutItems: function () {
        // subclass
    },
    /**
     * Create axises
     * @private
     */
    _createUI: function () {
        var config = this.config;
        this._super();

        // create axises
        this.yAxisLeft = new zChart.ValueAxis(
            this.context,
            this.config.yAxis.left,
            this.theme.yAxis.left,
            this.rotate
        );

        // right value axis. rotate chart only support one value axis
        if (!this.rotate && config.yAxis.right && config.yAxis.right.enabled === true) {
            this.yAxisRight = new zChart.ValueAxis(
                this.context,
                this.config.yAxis.right,
                this.theme.yAxis.right,
                this.rotate
            );
        }

        // category axis
        this.xAxis = new zChart.CategoryAxis(
            this.context,
            this.config.xAxis,
            this.theme.xAxis,
            this.rotate
        );
    }
});
