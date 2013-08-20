/**
 * XY Coordinate Chart
 * @type {*}
 */
zChart.XYChart = zChart.Chart.extend({
    init: function (opts, theme) {
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
        this._layoutItems(false);
        this._draw();
    },
    /**
     * Get max value
     * @param serial
     * @param trim
     * @returns {Object}
     * @private
     */
    _getValueRange: function (serial, trim) {
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
            if (!serial) {
                for (j = 0; j < this.config.column.serials.length; j++) {
                    value = data[i][this.config.column.serials[j].field];
                    check(value);
                }
            }
            else {
                value = data[i][serial];
                check(value);
            }
        }

        // trim to integer

        return {min: min, max: max};
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
    }
});
