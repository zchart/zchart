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
        var config = this.chartConfig;
        var count = 0;

        // calc visible serials
        for (i = 0; i < config.serials.length; i++) {
            if (config.serials[i].visible !== false) {
                count++;
            }
        }
        if (count === 0) {
            return;
        }

        // draw lines
        for (i = 0; i < count; i++) {
            if (config.line.type === "curve") {
                this._drawBzLine(count, i);
            }
            else {
                this._drawLine(count, i);
            }
        }

        // draw markers
        for (i = 0; i < count; i++) {
            this._drawMarker(count, i, false);
            this._drawMarker(count, i, true);
        }
    },
    _drawLine: function (count, serial) {
        var config = this.chartConfig;
        var theme = this.chartTheme;
        var color, width;
        var c, item;
        var i, x, y;

        if (serial >= this.items.length) {
            return;
        }

        // prepare context
        c = this.context;
        color = this.items[serial].color;
        width = theme.line.lineWidth;
        c.save().applyTheme(theme.line).lineWidth(width).strokeStyle(color).beginPath();

        // draw whole line
        for (i = serial; i < this.items.length; i += count) {
            item = this.items[i];

            x = item.left + item.width / 2;
            y = item.top <= 0 ? 0.5 : item.top;

            if (i === 0) {
                c.moveTo(x, y);
            }
            else {
                c.lineTo(x, y);
            }
        }
        c.stroke();

        // draw area
        if (config.stack !== "none") {
            c.applyTheme(theme.area).fillStyle(color);
            for (i = this.items.length - (count - serial); i >= 0; i -= count) {
                item = this.items[i];
                if (!item) {
                    continue;
                }

                x = item.left + item.width / 2;
                y = item.top + item.height;
                c.lineTo(x, y);
            }
            c.closePath().fill();
        }

        c.restore();
    },
    _drawBzLine: function (count, serial) {
        var config = this.chartConfig;
        var theme = this.chartTheme;
        var color, width;
        var c, item1, item2;
        var i, x1, y1, x2, y2;
        var cp1x, cp1y, cp2x, cp2y;

        if (serial >= this.items.length) {
            return;
        }

        // prepare context
        c = this.context;
        color = this.items[serial].color;
        width = theme.line.lineWidth;
        c.save().applyTheme(theme.line).lineWidth(width).strokeStyle(color).beginPath();

        // draw whole line
        for (i = serial; i < this.items.length; i += count) {
            item1 = this.items[i];
            item2 = this.items[i + count];
            if (!item1 || !item2) {
                continue;
            }

            x1 = item1.left + item1.width / 2;
            y1 = item1.top <= 0 ? 0.5 : item1.top + 0.5;
            x2 = item2.left + item2.width / 2;
            y2 = item2.top <= 0 ? 0.5 : item2.top + 0.5;

            // calc control point
            cp1x = cp2x = (x1 + x2) / 2;
            cp1y = y1;
            cp2y = y2;

            if (i === serial) {
                c.moveTo(x1, y1);
            }
            c.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
        }
        c.stroke();

        // draw area
        if (config.stack !== "none") {
            c.applyTheme(theme.area).fillStyle(color);
            for (i = this.items.length - (count - serial); i >= 0; i -= count) {
                item1 = this.items[i];
                item2 = this.items[i - count];
                if (!item1 || !item2) {
                    continue;
                }

                x1 = item1.left + item1.width / 2;
                y1 = item1.top + item1.height + 0.5;
                x2 = item2.left + item2.width / 2;
                y2 = item2.top + item2.height + 0.5;

                // calc control point
                cp1x = cp2x = (x1 + x2) / 2;
                cp1y = y1;
                cp2y = y2;

                if (i === this.items.length - (count - serial)) {
                    c.lineTo(x1, y1);
                }
                c.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
            }
            c.closePath().fill();
        }

        c.restore();
    },
    _drawMarker: function (count, serial, mask) {
        var config = this.chartConfig;
        var theme = this.chartTheme;
        var color, width;
        var c, item;
        var i, x, y;

        if (serial >= this.items.length) {
            return;
        }

        // prepare context
        if (!mask) {
            c = this.context;
        }
        else {
            c = this.contextMask;
        }
        c.save();

        // draw whole line
        for (i = serial; i < this.items.length; i += count) {
            item = this.items[i];

            x = item.left + item.width / 2 - 3;
            y = (item.top <= 0 ? 0.5 : item.top + 0.5) - 3;

            if (!mask) {
                color = item.color;
            }
            else {
                color = item.maskColor;
            }

            c.fillStyle(color).fillRect(x, y, 6, 6);
        }
        c.restore();
    }
});

// register chart
zChart.regChart("line", zChart.LineChart);
