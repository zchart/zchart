/**
 * XY Coordinate Chart
 * @type {*}
 */
zChart.XYChart = zChart.Chart.extend({
    init: function (opts, theme) {
        this._super(opts, theme);

        this._createUI();
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
        this._layoutItems(false);
        this._draw();
    },
    /**
     * Get max value
     * @param serials
     * @param stacked
     * @returns {Object}
     * @private
     */
    _getValueRange: function (serials, stacked) {
        var data = this.data;
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

        return {min: min, max: max, top: top, bottom: bottom, step: s, grid: (top - bottom) / s};
    },
    /**
     * Layout chart
     * @private
     */
    _layout: function () {
        this._super();
        var config = this.config.pie;

        this.radius = Math.min(this.canvasEl.width(), this.canvasEl.height()) / 2;
        this.radius = this.radius - config.depth - config.expandOffset - config.margin;
        if (config.label.radius > -8) {
            this.radius -= config.label.radius + 8
        }
        this.cx = this.canvasEl.width() / 2;
        this.cy = this.canvasEl.height() / 2;
    },
    _createUI: function () {
        this._super();

//        this.xAxis = new zChart.
    }
});
