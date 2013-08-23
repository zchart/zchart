/**
 * Column Chart
 * @type {*}
 */
zChart.ColumnChart = zChart.XYChart.extend({
    init: function (opts, theme) {
        this.rotate = false;
        this._super(opts, theme);

        this.chartConfig = this.config.column;
        this.chartTheme = this.theme.column;

        this.items = [];
    },
    /**
     * Layout items
     * @returns {*}
     * @private
     */
    _layoutItems: function () {
        var item, data, fill, legend = [];
        var i, sum, ratio;
        var start, end, dir, adir, quarter, pi2 = Math.PI * 2;
        var config = this.config.column;
        var groupValue = 0, count;
        var range;
        var plotWidth = this.plotWidth;
        var plotHeight = this.plotHeight;
        var left, top, width, height;
        var groupWidth, groupInter;

        if (!this.data || this.data.length === 0) {
            return 0;
        }

        data = this.data;
        this.items = [];
        range = this._getValueRange("left", false);

        groupWidth = plotWidth / data.length;
        groupInter = groupWidth * (1 - config.columnWidth);

        for (i = 0; i < data.length; i++) {
            left = Math.floor(groupWidth * i + groupInter / 2);
            top = Math.floor(plotHeight * (1 - data[i].value1 / range.top));
            width = groupWidth * config.columnWidth;
            height = plotHeight - top;

            item = {
                text: data[i].text,
                value: data[i].value1,
                left: left,
                top: top,
                width: width,
                height: height,
                color: this._getColor(0),
                maskColor: zChart.getMaskColor(0)
            };

            this.items.push(item);
        }

    },
    /**
     * Draw chart onto canvas
     * @private
     */
    _draw: function () {
        var config = this.config.pie;
        var i, item;
        var tilt = config.tilt > 0 && config.tilt <= 1 ? (1 - config.tilt) : 1;

        // clear canvas
        this._clearCanvas(this.canvas);
        this._clearCanvas(this.canvasMask);

        // prepare canvas
        this.context.save();
        this.contextMask.save();
        this.context.translate(this.plotX, this.plotY);
        this.contextMask.translate(this.plotX, this.plotY);

        // draw plot background
        this.context.save().fillStyle("#d1d2d3").fillRect(0, this.plotY, this.plotWidth, this.plotHeight).restore();

        // draw items
        for (i = 0; i < this.items.length; i++) {
            item = this.items[i];

            this._drawRect(this.context, item, false);
            this._drawRect(this.contextMask, item, true);
        }

        this.context.restore();
        this.contextMask.restore();

        this.yAxisLeft._draw();
    },
    _drawRect: function (c, item, mask) {
        var color = mask ? item.maskColor : item.color;

        c.fillStyle(item.color).fillRect(item.left, item.top, item.width, item.height);
    }
});

// register chart
zChart.regChart("column", zChart.ColumnChart);
