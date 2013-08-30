/**
 * Column Chart
 * @type {*}
 */
zChart.ColumnChart = zChart.XYChart.extend({
    init: function (opts, theme) {
        this._super(opts, theme);

        this.chartConfig = this.config.serial;
        this.chartTheme = this.theme.serial;

        this.items = [];
    },
    /**
     * Layout items
     * @returns {*}
     * @private
     */
    _layoutItems: function () {
        var config = this.chartConfig;
        var plotWidth = config.rotate ? this.plotHeight : this.plotWidth;
        var plotHeight = config.rotate ? this.plotWidth : this.plotHeight;
        var offset, left, top, width, height;
        var groupWidth, groupInter, columnWidth, columnWidthInt, columnInter;
        var serialCount = config.serials.length;
        var visibleSerialCount;
        var item, data, field, stack, range;
        var i, j, serialIndex, sum, ratio;
        var category, serial;

        if (!this.data || this.data.length === 0) {
            return 0;
        }

        this.items = [];
        stack = config.stack;

        // calc visible serial count
        visibleSerialCount = 0;
        for (i = 0; i < config.serials.length; i++) {
            if (config.serials[i].visible !== false) {
                visibleSerialCount++;
            }
        }

        if (visibleSerialCount === 0) {
            return;
        }

        // calc group & column size
        groupWidth = plotWidth / this.data.length;
        groupInter = groupWidth * (1 - config.columnWidth);
        columnWidth = groupWidth - groupInter;
        columnInter = config.columnInter;

        // if not stacked, group width is divided by serials
        if (stack !== "percent" && stack !== "normal") {
            columnWidth = (columnWidth - columnInter * (visibleSerialCount - 1)) / visibleSerialCount;
        }

        // get integer width
        columnWidthInt = Math.floor(columnWidth);

        // groups
        for (i = 0; i < this.data.length; i++) {
            data = this.data[i];
            category = data[config.category.field];
            offset = Math.floor(groupWidth * i + groupInter / 2);

            // calc group sum for percent stack
            if (config.stack === "percent") {
                sum = 0;
                for (j = 0; j < serialCount; j++) {
                    field = config.serials[j].field;
                    sum += data[field];
                }
            }

            width = height = ratio = 0;
            top = plotHeight;

            // items
            serialIndex = 0;
            for (j = 0; j < serialCount; j++) {
                if (config.serials[j].visible === false) {
                    continue;
                }

                field = config.serials[j].field;
                serial = config.serials[j].text;

                // get corresponding range
                if (config.serials[j].side !== "right") {
                    range = this.rangeLeft;
                }
                else {
                    range = this.rangeRight;
                }

                if (stack === "percent") {
                    ratio = data[field] / sum;
                    width = columnWidthInt;
                    height = Math.round(plotHeight * ratio);
                    left = offset;
                    top -= height;
                }
                else if (stack === "normal") {
                    ratio = data[field] / range.top;
                    width = columnWidthInt;
                    height = Math.round(plotHeight * ratio);
                    left = offset;
                    top -= height;
                }
                else {
                    ratio = data[field] / range.top;
                    width = columnWidthInt;
                    height = Math.round(plotHeight * ratio);
                    left = Math.floor(offset + (columnWidth + columnInter) * serialIndex);
                    top = plotHeight - height;
                }

                item = {
                    index: i * serialCount + j,
                    serialIndex: j,
                    category: category,
                    categoryIndex: i,
                    text: serial,
                    value: data[field],
                    unit: config.serials[j].unit,
                    ratio: ratio * 100,
                    left: left - 0.5,
                    top: top - 0.5,
                    width: width,
                    height: height,
                    color: this._getColor(j),
                    maskColor: zChart.getMaskColor(i  * serialCount + j),
                    brightness: 1
                };

                this.items.push(item);
                serialIndex++;
            }
        }
    },
    /**
     * Draw chart onto canvas
     * @private
     */
    _draw: function () {
        var config = this.chartConfig;
        var i, item;

        // clear canvas
        this._clearCanvas(this.canvas);
        this._clearCanvas(this.canvasMask);

        // translate to plot working area
        this.context.save();
        this.contextMask.save();
        this.context.translate(this.canvasX, this.canvasY);
        this.contextMask.translate(this.canvasX, this.canvasY);

        // translate to plot area
        this.context.save();
        this.contextMask.save();
        this.context.translate(this.plotX, this.plotY);
        this.contextMask.translate(this.plotX, this.plotY);

        // draw plot background
        this._drawPlotBackground();

        // draw items
        if (config.rotate) {
            this.context.translate(this.plotWidth, 0).rotate(Math.PI / 2);
            this.contextMask.translate(this.plotWidth, 0).rotate(Math.PI / 2);
        }
        this._drawItems();

        this.context.restore();
        this.contextMask.restore();

        // draw axises
        this.yAxisLeft.draw();
        if (this.yAxisRight) {
            this.yAxisRight.draw();
        }
        this.xAxis.draw();

        this.context.restore();
        this.contextMask.restore();
    },
    /**
     * Draw background
     * @private
     */
    _drawPlotBackground: function () {
        this.context.save()
            .fillStyle("#d1d2d3").fillRect(0, this.plotY, this.plotWidth, this.plotHeight)
            .restore();
    },
    /**
     * Draw items
     * @private
     */
    _drawItems: function () {
        var i, item;

        for (i = 0; i < this.items.length; i++) {
            item = this.items[i];

            this._drawRect(this.context, item, false);
            this._drawRect(this.contextMask, item, true);
        }
    },
    /**
     * Draw a rect
     * @param c
     * @param item
     * @param mask
     * @private
     */
    _drawRect: function (c, item, mask) {
        var color, stroke;

        if (mask) {
            color = item.maskColor;
            stroke = item.maskColor;
        }
        else {
            color = item.color;
            stroke = item.color;
            if (item.brightness !== 1) {
                color = zChart.adjustLuminance(color, item.brightness - 1);
            }
        }

        c.save()
            .fillStyle(color).strokeStyle(stroke)
            .fillRect(item.left, item.top, item.width, item.height)
            .strokeRect(item.left, item.top, item.width, item.height)
            .restore();
    }
});

// register chart
zChart.regChart("column", zChart.ColumnChart);
