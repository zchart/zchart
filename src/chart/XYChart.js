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

        this.activeSerial = null;

        this._super(opts, theme);
    },
    /**
     * Destroy chart instance
     */
    destroy: function () {
        if (this.xAxis) {
            this.xAxis.destroy();
            this.xAxis = null;
        }
        if (this.yAxisLeft) {
            this.yAxisLeft.destroy();
            this.yAxisLeft = null;
        }
        if (this.yAxisRight) {
            this.yAxisRight.destroy();
            this.yAxisRight = null;
        }
        this._super();
    },
    /**
     * Set new data
     * @param data
     */
    setData: function (data) {
        this._super(data);
        this._setLegendData();
        this._layout();
        this._draw();
    },
    /**
     * Set legend data
     * @private
     */
    _setLegendData: function () {
        var i;
        var config = this.chartConfig;
        var data = [];

        if (!this.legend) {
            return;
        }

        for (i = 0; i < config.serials.length; i++) {
            data.push({
                text: config.serials[i].text,
                value: "",
                color: this._getColor(i),
                visible: config.serials[i].visible
            });
        }

        this.legend.setData(data);
    },
    /**
     * Get max value
     * @param side
     * @param stack
     * @returns {Object}
     * @private
     */
    _getValueRange: function (side, stack) {
        var data = this.data;
        var serials = this.chartConfig.serials;
        var min = Number.MAX_VALUE;
        var max = Number.MIN_VALUE;
        var i, j, value, n;
        var bottom = null, top = null, grid = null;
        var axis;

        if (!data || data.length === 0) {
            return {min: 0, max: 0};
        }

        if (stack === "percent") {
            return {top: 100, bottom: 0, grid: 5};
        }

        // get axis config
        if (side === "left") {
            axis = this.config.yAxis.left;
        }
        else {
            axis = this.config.yAxis.right;
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
        if (axis.min !== null && axis.max !== null) {
            bottom = axis.min;
            top = axis.max;
        }
        else {
            for (i = 0; i < data.length; i++) {
                n = 0;
                value = 0;
                for (j = 0; j < serials.length; j++) {
                    // skip invisible, or other side serials
                    if (serials[j].visible === false) {
                        continue;
                    }
                    if (side === "left" && serials[j].side && serials[j].side !== side) {
                        continue;
                    }
                    if (side === "right" && serials[j].side !== side) {
                        continue;
                    }

                    if (stack === "normal") {
                        value += data[i][serials[j].field];
                    }
                    else {
                        value = data[i][serials[j].field];
                        check(value);
                    }
                    n++;
                }

                // if no visible serials, return default
                if (n === 0) {
                    return {top: 1, bottom: 0, grid: 2};
                }

                if (stack === "normal") {
                    check(value);
                }
            }

            // maybe only specified one
            if (axis.min !== null) {
                bottom = axis.min;
            }
            if (axis.max !== null) {
                top = axis.max;
            }
        }

        // calc bottom
        if (bottom === null) {
            value = Math.abs(min);
            n = Math.ceil(value).toString();
            bottom = parseInt(n[0], 10) * 1.1 * Math.pow(10, n.length - 1) * (min >= 0 ? 1 : -1);

            if (bottom > 0) {
                bottom = 0;
            }
        }

        if (top === null) {
            value = Math.abs(max);
            n = Math.floor(value).toString();
            top = (parseInt(n[0], 10) + 1) * Math.pow(10, n.length - 1) * (min >= 0 ? 1 : -1);
        }

        // calc grid
        if (typeof axis.grid.count === "number") {
            grid = axis.grid.count;
            if (grid <= 0) {
                grid = 1;
            }
        }
        else {
            for (i = 12; i >= 4; i--) {
                if ((top - bottom) % i === 0) {
                    grid = i;
                    break;
                }
            }

            if (grid === null) {
                grid = 5;
            }
        }

        return {top: top, bottom: bottom, grid: grid};
    },
    /**
     * Layout chart
     * @private
     */
    _layout: function () {
        this._super();

        var config = this.chartConfig;
        var width = this.canvasWidth;
        var height = this.canvasHeight;
        var w = 0, h = 0;
        var i;

        // re-calc range info
        if (this.data && this.data.length > 0) {
            // set axis info
            this.rangeLeft = this._getValueRange("left", config.stack);
            this.yAxisLeft.setRange(this.rangeLeft.bottom, this.rangeLeft.top, this.rangeLeft.grid);

            if (this.yAxisRight) {
                this.rangeRight = this._getValueRange("right", config.stack);
                this.yAxisRight.setRange(this.rangeRight.bottom, this.rangeRight.top, this.rangeRight.grid);
            }

            // set category axis info
            var info = [];
            var field = config.category.field;
            for (i = 0; i < this.data.length; i++) {
                info.push(this.data[i][field]);
            }
            this.xAxis.setData(info);
        }

        // layout axises
        if (!config.rotate) {
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
        var chartConfig = this.chartConfig;
        this._super();

        // create axises
        this.yAxisLeft = new zChart.ValueAxis(
            this.context,
            this.config.yAxis.left,
            this.theme.yAxis.left,
            chartConfig.rotate
        );

        // right value axis. rotate chart only support one value axis
        if (!chartConfig.rotate && config.yAxis.right && config.yAxis.right.enabled === true) {
            this.yAxisRight = new zChart.ValueAxis(
                this.context,
                this.config.yAxis.right,
                this.theme.yAxis.right,
                chartConfig.rotate
            );
        }

        // category axis
        this.xAxis = new zChart.CategoryAxis(
            this.context,
            this.config.xAxis,
            this.theme.xAxis,
            chartConfig.rotate
        );
    },
    /**
     * Draw background
     * @private
     */
    _drawPlotBackground: function () {
        var axis;
        var width, height;
        var x1, y1, x2, y2;
        var grid, i;
        var c = this.context;
        var config = this.chartConfig;
        var theme, type;
        var inter = 0;

        width = this.plotWidth;
        height = this.plotHeight;

        // fill background color
        c.save().applyTheme(this.chartTheme.background)
            .fillRect(0, 0, width, height)
            .restore();

        // draw plot border
        type = this.chartTheme.border.lineStyle;
        c.save().applyTheme(this.chartTheme.border).beginPath();
        c.line(0.5, 0.5, 0.5 + width, 0.5, type)
            .line(0.5 + width, 0.5, 0.5 + width, 0.5 + height, type)
            .line(0.5 + width, 0.5 + height, 0.5, 0.5 + height, type)
            .line(0.5, 0.5 + height, 0.5, 0.5, type)
            .stroke().restore();

        // value grids
        axis = this.yAxisLeft;
        grid = axis.getGrid();
        inter = (config.rotate ? width : height) / grid;
        type = this.theme.yAxis.left.grid.lineStyle;

        c.save().applyTheme(this.theme.yAxis.left.grid);
        for (i = 1; i < grid; i++) {
            if (!config.rotate) {
                x1 = 0;
                x2 = this.plotWidth;
                y1 = y2 = Math.round(inter * i) + 0.5;
            }
            else {
                y1 = 0;
                y2 = this.plotHeight;
                x1 = x2 = Math.round(inter * i) + 0.5;
            }

            c.beginPath().line(x1, y1, x2, y2, type).stroke().closePath();
        }
        c.restore();

        // category grids
        axis = this.xAxis;
        grid = axis.getGrid();
        inter = (!config.rotate ? width : height) / grid;
        type = this.theme.xAxis.grid.lineStyle;

        c.save().applyTheme(this.theme.xAxis.grid);
        for (i = 1; i < grid; i++) {
            if (config.rotate) {
                x1 = 0;
                x2 = this.plotWidth;
                y1 = y2 = Math.round(inter * i) + 0.5;
            }
            else {
                y1 = 0;
                y2 = this.plotHeight;
                x1 = x2 = Math.round(inter * i) + 0.5;
            }

            c.beginPath().line(x1, y1, x2, y2, type).stroke().closePath();
        }
        c.restore();
    },
    /**
     * Callback for mouse move event
     * @param x
     * @param y
     * @returns {*}
     * @private
     */
    _onHover: function (x, y) {
        var pos;

        var item = this._getItemByPosition(x, y);
        if ((!item && this.__hover_item_id__ !== null) || (item && item.index !== this.__hover_item_id__)) {
            this.__hover_item_id__ = item ? item.index : null;

            if (item) {
                this.tip.setData({
                    serial: item.text,
                    category: item.category,
                    value: item.value,
                    unit: item.unit,
                    ratio: item.ratio,
                    color: item.color
                });
                this.xAxis.selectIndex(item.categoryIndex);
                this.activeSerial = item.serialIndex;
            }
            else {
                this.xAxis.selectIndex(null);
                this.activeSerial = null;
            }

            this._brightenItem(item);
        }

        if (item) {
            this.tip.show();
            pos = this.canvasEl.offset();
            this.tip.setPosition(pos.left + x, pos.top + y);

            return this.data[item.index];
        }
        else {
            this.tip.hide();
            return null;
        }
    },
    /**
     * Callback for click event
     * @param x
     * @param y
     * @returns {*}
     * @private
     */
    _onClick: function (x, y) {
        var expanded;
        var item = this._getItemByPosition(x, y);
        if (item) {
            expanded = this._expandItem(item);
            return $.extend(this.data[item.index], {expanded: expanded});
        }
        else {
            return null;
        }
    },
    /**
     * Handle legend item hover event
     * @param event
     * @param index
     * @param flag
     * @private
     */
    _onLegendHover: function (event, index, flag) {
    },
    /**
     * Handle legend item click event
     * @param event
     * @param index
     * @param flag
     * @private
     */
    _onLegendClick: function (event, index, flag) {
        this._toggleItem(index, flag);
    },
    /**
     * Make a item brighter
     * @param item
     * @private
     */
    _brightenItem: function (item) {
        if (item && item.brightness === 1) {
            item.brightness = 1.1;
        }

        // resume other items
        for (var i = 0; i < this.items.length; i++) {
            if (!item || this.items[i].index !== item.index) {
                this.items[i].brightness = 1;
            }
        }

        // redraw
        this._draw();
    },
    /**
     * Toggle item
     * @param index
     * @param flag
     * @private
     */
    _toggleItem: function (index, flag) {
        var config = this.chartConfig;

        if (index < 0 || index >= config.serials.length) {
            return;
        }

        config.serials[index].visible = flag;
        this.layout();
    },
    /**
     * Split and expand a item
     * @param item
     * @private
     */
    _expandItem: function (item) {
        var config = this.config.pie;
        var cx, cy;
        var radian;
        var offset = config.expandOffset;
        var expanded = true;

        radian = (item.start + item.end) / 2;

        // expand
        if (item.cx === 0 && item.cy === 0 && item.end - item.start < Math.PI * 2) {
            cx = offset * Math.cos(radian);
            cy = offset * Math.sin(radian);
            this._animate(item, {cx: cx, cy: cy}, 100, null);
        }
        else {
            this._animate(item, {cx: 0, cy: 0}, 100, null);
            expanded = false;
        }

        // collapse others
        if (config.expandOne && (cx !== 0 || this.cy !== 0)) {
            for (var i = 0; i < this.items.length; i++) {
                item = this.items[i];
                if (item.cx !== 0 || item.cy !== 0) {
                    this._animate(item, {cx: 0, cy: 0}, 100, null);
                }
            }
        }

        return expanded;
    },
    /**
     * Get item by position
     * @param x
     * @param y
     * @returns {*}
     * @private
     */
    _getItemByPosition: function (x, y) {
        var imageData, pixel;
        var i, hex;
        var r, g, b;

        imageData = this.contextMask.getImageData(x, y, 1, 1);
        pixel = imageData.data;

        r = pixel[0].toString(16);
        if (r.length < 2) {
            r = "0" + r;
        }

        g = pixel[1].toString(16);
        if (g.length < 2) {
            g = "0" + g;
        }

        b = pixel[2].toString(16);
        if (b.length < 2) {
            b = "0" + b;
        }
        hex = "#" + r + g + b;

        i = zChart.getMaskIndex(hex);
        if (i >= 0 && i < this.items.length) {
            return this.items[i];
        }

        return null;
    }
});
