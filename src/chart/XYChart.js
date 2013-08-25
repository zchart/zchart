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
        var i;

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

        this._layout();
        this._draw();
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
        var i, j, value;

        if (!data || data.length === 0) {
            return {min: 0, max: 0};
        }

        if (stack === "percent") {
            return {min: 0, max: 100, top: 100, bottom: 0, step: 20, grid: 5};
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
                if (stack === "normal") {
                    value += data[i][serials[j].field];
                }
                else {
                    value = data[i][serials[j].field];
                    check(value);
                }
            }

            if (stack === "normal") {
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

        var config = this.chartConfig;
        var width = this.canvasWidth;
        var height = this.canvasHeight;
        var w = 0, h = 0;

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
            }
            else {
                this.xAxis.selectIndex(null);
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
        var i, item = null;

        if (!flag) {
            this._brightenItem(item);
            return;
        }

        for (i = 0; i < this.items.length; i++) {
            if (this.items[i].index === index) {
                item = this.items[i];
            }
        }

        this._brightenItem(item);
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
        var config = this.config.pie;
        var cx, cy;
        var start, end, dir, radian;
        var offset = config.expandOffset;
        var item;
        var oldItems, oldItem;

        // save old value
        oldItems = this.items;
        if (!flag) {
            this.data[index]._value = this.data[index][config.valueField];
            this.data[index][config.valueField] = 0;
        }
        else {
            this.data[index][config.valueField] = this.data[index]._value;
        }

        // re-calc
        this.items = [];
        this._layoutItems(true);

        // resume value
        zChart.sortObjects(this.items, "index", true);
        zChart.sortObjects(oldItems, "index", true);

        // animate
        for (var i = 0; i < this.items.length; i++) {
            item = this.items[i];
            oldItem = oldItems[i];

            radian = (item.start + item.end) / 2;
            start = item.start;
            end = item.end;
            dir = (start + end) / 2;

            if (oldItem.cx !== 0 || oldItem.cy !== 0) {
                cx = item.cx + offset * Math.cos(radian);
                cy = item.cy + offset * Math.sin(radian);
            }
            else {
                cx = 0;
                cy = 0;
            }

            // set item value to old, to be the beginning of animation
            item.start = oldItem.start;
            item.end = oldItem.end;
            item.cx = oldItem.cx;
            item.cy = oldItem.cy;

            this._animate(this.items[i],
                {start: start, end: end, cx: cx, cy: cy},
                100,
                null);
        }

        // reset to top-down order
        zChart.sortObjects(this.items, "dir", true);
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
