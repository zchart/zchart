/**
 * Column Chart
 * @type {*}
 */
zChart.ColumnChart = zChart.XYChart.extend({
    init: function (opts, theme) {
        this._super(opts, theme);

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
        var plotWidth = this.canvasEl.width();
        var plotHeight = this.canvasEl.height();
        var left, top, width, height;
        var groupWidth, groupInter;

        if (!this.data || this.data.length === 0) {
            return 0;
        }

        data = this.data;
        this.items = [];
        range = this._getValueRange(config.serials, false);
console.log(range);
        groupWidth = Math.floor(plotWidth / data.length);
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
                color: this._getColor(0)
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

        this.context.save();
        this.contextMask.save();

        // draw items
        for (i = 0; i < this.items.length; i++) {
            item = this.items[i];

            //this._drawSector(this.context, item, false);
            //this._drawSector(this.contextMask, item, true);
//console.debug(item);
            this.context.fillStyle(item.color).fillRect(item.left, item.top, item.width, item.height);
        }

//        // draw labels
//        for (i = 0; i < this.items.length; i++) {
//            item = this.items[i];
//            if (item.start === item.end) {
//                continue;
//            }
//
//            this._drawLabel(this.context, item);
//        }

        this.context.restore();
        this.contextMask.restore();
    }
});

// register chart
zChart.regChart("column", zChart.ColumnChart);
