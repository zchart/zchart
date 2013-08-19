/**
 * Pie chart
 * @type {*}
 */
zChart.PieChart = zChart.Chart.extend({
    init: function (opts, theme) {
        this._super(opts, theme);

        // vars
        this.items = [];

        // initialize
        this._layout();
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
     * Layout chart
     * @private
     */
    _layout: function () {
        var config = this.config.pie;
        this._super();

        this.radius = Math.min(this.canvasEl.width(), this.canvasEl.height()) / 2;
        this.radius = this.radius - config.depth - config.expandOffset - config.margin;
        if (config.label.radius > -8) {
            this.radius -= config.label.radius + 8
        }
        this.cx = this.canvasEl.width() / 2;
        this.cy = this.canvasEl.height() / 2;
    },
    /**
     * Layout items
     * @param test
     * @returns {*}
     * @private
     */
    _layoutItems: function (test) {
        var item, data, fill, legend = [];
        var i, sum, ratio;
        var start, end, dir, adir, quarter, pi2 = Math.PI * 2;
        var config = this.config.pie;
        var groupValue = 0, count;

        if (!this.data || this.data.length === 0) {
            return 0;
        }
        this.items = [];

        // get sum
        sum = 0;
        for (i = 0; i < this.data.length; i++) {
            sum += this.data[i].value;
        }

        // sort data
        if (!test) {
            zChart.sortObjects(this.data, "value", false);

            // check min ratio
            i = 0;
            count = 0;
            if (config.minRatio > 0) {
                for (i = 0; i < this.data.length; i++) {
                    count++;
                    if (this.data[i].value * 100 / sum < config.minRatio) {
                        break;
                    }
                }
            }
            // check max count
            if (config.maxCount > 0) {
                if ((count > 0 && config.maxCount < count) ||
                    (count == 0 && config.maxCount < this.data.length)) {
                    count = config.maxCount;
                }
            }

            // group small values
            if (count > 1 && count < this.data.length) {
                for (i = count - 1; i < this.data.length; i++) {
                    groupValue += this.data[i].value;
                }

                this.data[count - 1].value = groupValue;
                this.data[count - 1].text = config.groupLabel;
                this.data[count - 1].grouped = true;

                this.data.splice(count);
                console.log(this.data.length, this.data);
            }
        }

        // calc items
        start = config.startAngle * pi2 / 360;
        for (i = 0; i < this.data.length; i++) {
            data = this.data[i];
            ratio = sum === 0 ? 0 : data.value / sum;
            end = start + pi2 * ratio;
            fill = this.theme.chart.colors[i];

            // calc dir, used to decide draw sequence
            dir = ((start + end) / 2) % pi2;
            adir = Math.abs(dir);

            if (adir < Math.PI / 2) {
                quarter = 4;
            }
            else if (adir < Math.PI) {
                quarter = 3;
                adir = Math.PI - adir;
            }
            else if (adir < Math.PI * 1.5) {
                quarter = 2;
                adir = Math.PI - adir;
            }
            else {
                quarter = 1;
                adir = (pi2 - adir) * -1;
            }
            adir = dir >= 0 ? adir : adir * -1;

            item = {
                index: i,
                name: data.name,
                text: data.text,
                value: data.value,
                unit: config.unit,
                data: data.data,
                label: this._formatLabel(data.text, data.value, ratio * 100),
                ratio: ratio,
                cx: 0,
                cy: 0,
                radius: this.radius,
                start: start,
                end: end,
                dir: adir,
                quarter: quarter,
                fill: fill,
                sideFill1: zChart.adjustLuminance(fill, -0.2),
                sideFill2: zChart.adjustLuminance(fill, -0.3),
                brightness: 1,
                maskColor: zChart.getMaskColor(i),
                grouped: false
            };
            this.items.push(item);
            start = end;

            legend.push({
                text: item.text,
                value: item.value,
                color: item.fill
            });
        }

        if (!test) {
            // update legend
            this.legend.setData({unit: config.unit, items: legend});

            // sort items to top-down
            zChart.sortObjects(this.items, "dir", true);
        }

        return this.items.length;
    },
    /**
     * Calc point position
     * @param item
     * @private
     */
    _getPoints: function (item) {
        var config = this.config.pie;
        var dir = (item.start + item.end) / 2;
        var r2 = config.innerRadius * item.radius;

        var cos1 = Math.cos(item.start);
        var sin1 = Math.sin(item.start);
        var cos2 = Math.cos(item.end);
        var sin2 = Math.sin(item.end);
        var cos3 = Math.cos(dir);
        var sin3 = Math.sin(dir);

        return {
            x1: item.cx + item.radius * cos1,
            y1: item.cy + item.radius * sin1,
            x2: item.cx + item.radius * cos2,
            y2: item.cy + item.radius * sin2,
            x3: item.cx + item.radius * cos3,
            y3: item.cy + item.radius * sin3,
            x4: item.cx + (item.radius + config.label.radius) * cos3,
            y4: item.cy + (item.radius + config.label.radius) * sin3,
            x5: item.cx + r2 * cos1,
            y5: item.cy + r2 * sin1,
            x6: item.cx + r2 * cos2,
            y6: item.cy + r2 * sin2
        }
    },
    /**
     * Format text
     * @param text
     * @param value
     * @param ratio
     * @private
     */
    _formatLabel: function (text, value, ratio) {
        var config = this.config.pie;

        var label = config.label.format;
        value = zChart.formatNumber(value, config.label.fraction);
        ratio = zChart.formatNumber(ratio, config.label.fraction);

        label = label.replace(/<value>/g, value);
        label = label.replace(/<ratio>/g, ratio);
        label = label.replace(/<text>/g, text);

        return label;
    },
    /**
     * Draw chart onto canvas
     * @private
     */
    _draw: function () {
        var config = this.config.pie;
        var i, item;
        var tilt = config.tilt > 0 && config.tilt <= 1 ? (1 - config.tilt) : 1;
        var pos = [];

        // clear canvas
        this._clearCanvas(this.canvas);
        this._clearCanvas(this.canvasMask);

        this.context.save();
        this.contextMask.save();
        this.context.translate(this.cx, this.cy);
        this.contextMask.translate(this.cx, this.cy);
        this.context.scale(1, tilt);
        this.contextMask.scale(1, tilt);

        // draw items
        for (i = 0; i < this.items.length; i++) {
            item = this.items[i];
            if (item.start === item.end) {
                continue;
            }

            pos[i] = this._getPoints(item);

            this._drawSector(this.context, item, false, pos[i]);
            this._drawSector(this.contextMask, item, true, pos[i]);
        }

        // draw labels
        for (i = 0; i < this.items.length; i++) {
            item = this.items[i];
            if (item.start === item.end) {
                continue;
            }

            this._drawLabel(this.context, item, pos[i]);
        }

        this.context.restore();
        this.contextMask.restore();
    },
    /**
     * Draw label for a slice
     * @param c
     * @param item
     * @param pos
     * @private
     */
    _drawLabel: function (c, item, pos) {
        var config = this.config.pie;
        var theme = this.theme.pie;
        var angle = (item.start + item.end) / 2;
        var offset = config.label.radius;
        var align;

        c.save().translate(item.cx, item.cy);

        // draw join line
        if (offset >= 0) {
            c.rotate(angle).translate(item.radius, 0)
                .beginPath().moveTo(0, 0).lineTo(offset, 0)
                .translate(offset, 0);

            if (item.quarter === 1 || item.quarter === 4) {
                align = "left";
                c.rotate(0 - angle).lineTo(15, 0);
                offset = 17;
            }
            else {
                align = "right";
                c.rotate(0 - angle).lineTo(-15, 0);
                offset = -17;
            }

            c.strokeStyle(theme.label.lineColor)
                .lineWidth(theme.label.lineWidth)
                .lineJoin("round")
                .stroke()
                .translate(offset, 0);
        }
        else {
            align = "center";
            c.rotate(angle).translate(item.radius + offset, 0).rotate(0 - angle);
        }

        // draw text
        c.fillStyle(theme.label.color)
            .font(theme.label.fontSize + "px " + theme.label.fontFamily)
            .textAlign(align)
            .textBaseline("middle")
            .shadowBlur(1)
            .shadowColor(theme.label.shadowColor)
            .shadowOffsetX(1)
            .shadowOffsetY(1)
            .scale(1, 1 / (1 - config.tilt))
            .fillText(item.label, 0, 0)
            .restore();
    },
    /**
     * Draw a slice
     * @param c
     * @param item
     * @param mask
     * @param pos
     * @private
     */
    _drawSector: function (c, item, mask, pos) {
        var config = this.config.pie;
        var theme = this.theme.pie;
        var depth = config.depth;
        var PI = Math.PI;
        var cx = item.cx,
            cy = item.cy,
            r1 = item.radius,
            r2 = item.radius * config.innerRadius,
            start = item.start,
            end = item.end,
            fill = mask ? item.maskColor : item.fill;
        var side = 0;
        var sideFill;

        // prepare side color
        if (mask) {
            sideFill = [item.maskColor, item.maskColor, item.maskColor, item.maskColor];
        }
        else {
            sideFill = [item.sideFill1, item.sideFill2, item.sideFill1, item.sideFill2];
        }

        c.lineWidth(theme.lineWidth > 0 ? theme.lineWidth - 0.5 : 0)
            .strokeStyle(theme.lineWidth > 0 ? theme.lineColor : "transparent");

        // draw left/right side
        function _drawLRSide (angle) {
            c.save().translate(cx, cy)
                .beginPath()
                .save().rotate(angle).moveTo(r2, 0).lineTo(r1, 0).restore()
                .save().translate(0, depth).rotate(angle).lineTo(r1, 0).lineTo(r2, 0).restore()
                .closePath()
                .fillStyle(sideFill[side]).fill().stroke()
                .restore();
        }

        // draw radius side
        function _drawIOSide (r) {
            c.save().translate(cx, cy)
                .beginPath()
                .save().rotate(start).moveTo(r, 0).arc(0, 0, r, 0, end - start, false).restore()
                .save().translate(0, depth).rotate(end).lineTo(r, 0).arc(0, 0, r, 0, start - end, true).restore()
                .closePath()
                .fillStyle(sideFill[side]).fill().stroke()
                .restore();
        }

        // draw 3d effect
        if (depth > 0) {
            // left side
            if (start > PI * 0.5 && start < PI * 1.5) {
                _drawLRSide(start);
                side++;
            }

            // right side
            if (end < PI * 0.5 || end > PI * 1.5) {
                _drawLRSide(end);
                side++;
            }

            // inner side
            if (r2 > 0) {
                _drawIOSide(r2);
                side++;
            }

            // outer side
            _drawIOSide(r1);
        }

        // top surface
        if (item.brightness !== 1 && !mask) {
            fill = zChart.adjustLuminance(fill, item.brightness - 1);
        }

        c.save().translate(cx, cy)
            .beginPath()
            .save().rotate(start).moveTo(r1, 0).arc(0, 0, r1, 0, end - start, false).restore()
            .save().rotate(end).lineTo(r2, 0).arc(0, 0, r2, 0, start - end, true).restore()
            .closePath()
            .fillStyle(fill).fill().stroke()
            .restore();
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
        if ((!item && this.__hover_item_id__) || (item && item.index !== this.__hover_item_id__)) {
            this.__hover_item_id__ = item ? item.index : null;
            this._brightenItem(item);

            if (item) {
                this.tip.setData({
                    serial: item.text,
                    category: "",
                    value: item.value,
                    unit: item.unit,
                    ratio: item.ratio,
                    color: item.fill
                });
            }
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
            this.data[index]._value = this.data[index].value;
            this.data[index].value = 0;
        }
        else {
            this.data[index].value = this.data[index]._value;
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

        for (i = 0; i < this.items.length; i++) {
            if (hex === this.items[i].maskColor) {
                return this.items[i];
            }
        }

        return null;
    }
});

// register
zChart.regChart("pie", zChart.PieChart);
