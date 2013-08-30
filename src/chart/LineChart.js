/**
 * Line Chart
 * @type {*}
 */
zChart.LineChart = zChart.ColumnChart.extend({
    init: function (opts, theme) {
        this._super(opts, theme);

        this.chartConfig = this.config.serial;
        this.chartTheme = this.theme.serial;
    },
    /**
     * Layout items
     * @returns {*}
     * @private
     */
    _layoutItems: function () {
        this._super();
    },
    /**
     * Draw chart onto canvas
     * @private
     */
    _draw: function () {
        this._super();
    },
    /**
     * Draw background
     * @private
     */
    _drawPlotBackground: function () {
        this._super();
    },
    /**
     * Draw items
     * @private
     */
    _drawItems: function () {
        var i, item;
        var points = [];
        var x, y;
        var serial;

        for (i = 0; i < this.items.length; i++) {
            item = this.items[i];

            serial = item.serialIndex;
            x = item.left + item.width / 2;
            y = item.top;

            if (typeof points[serial] !== "undefined") {
//                this._drawLine(this.context, points[serial].x, points[serial].y, x, y, item, false);
//                this._drawLine(this.contextMask, points[serial].x, points[serial].y, x, y, item, true);
                this._drawBzLine(this.context, points[serial].x, points[serial].y, x, y, item, false);
                this._drawBzLine(this.contextMask, points[serial].x, points[serial].y, x, y, item, true);

                this._drawMarker(this.context, points[serial].x, points[serial].y, item, false);
                this._drawMarker(this.contextMask, points[serial].x, points[serial].y, item, true);
            }

            if (item.categoryIndex >= this.data.length - 1) {
                this._drawMarker(this.context, x, y, item, false);
                this._drawMarker(this.contextMask, x, y, item, true);
            }

            points[serial] = {x: x, y: y};
        }
    },
    _drawLine: function (c, x1, y1, x2, y2, item, mask) {
        var color, width = 2;

        if (mask) {
            color = item.maskColor;
            width += 1;
        }
        else {
            color = item.color;
            if (item.brightness !== 1) {
                color = zChart.adjustLuminance(color, item.brightness - 1);
                width = 2;
            }
        }

        c.save().strokeStyle(color).lineWidth(width)
            .beginPath().moveTo(x1, y1).lineTo(x2, y2).stroke()
            .restore();
    },
    _drawBzLine: function (c, x1, y1, x2, y2, item, mask) {
        var color, width = 2;
        var cp1x, cp1y, cp2x, cp2y;

        c.save();

        // calc control point
        cp1x = cp2x = (x1 + x2) / 2;
        cp1y = y1;
        cp2y = y2;

        if (mask) {
            color = item.maskColor;
            width += 1;
        }
        else {
            color = item.color;
            if (item.brightness !== 1) {
                color = zChart.adjustLuminance(color, item.brightness - 1);
                width = 2;
            }
        }

        if (this.activeSerial === item.serialIndex) {
            width += 1;
        }

        c.strokeStyle(color).lineWidth(width)
            .beginPath().moveTo(x1, y1)
            .bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2)
            .stroke()
            .restore();
    },
    _drawMarker: function (c, x, y, item, mask) {
        var color, width;

        if (mask) {
            color = item.maskColor;
            width = 8;
        }
        else {
            color = item.color;
            width = 6;
            if (item.brightness !== 1) {
                color = zChart.adjustLuminance(color, item.brightness - 1);
                width = 8;
            }
        }

        c.save().fillStyle(color).strokeStyle("#ffffff").lineWidth(1)
            .fillRect(x - width / 2, y - width / 2, width, width)
//            .strokeRect(x - width / 2, y - width / 2, width, width)
            .restore();
    }
});

// register chart
zChart.regChart("line", zChart.LineChart);
