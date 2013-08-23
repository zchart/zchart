/**
 * Value Axis
 */
zChart.ValueAxis = zChart.Axis.extend({
    init: function (context, opts, theme, rotate) {
        this._super(context, opts, theme, rotate);
    },
    /**
     * Layout labels and title
     */
    layout: function () {
        var config = this.config;
        var theme = this.theme;
        var gridCount = config.gridCount === "auto" ? this.gridCount : config.gridCount;
        var i, width, height, label, value, unit;
        var step, metric, titleHeight;

        if (this.min === null || this.max === null) {
            return;
        }

        this.labels = [];
        this.labels.totalWidth = 0;
        this.labels.totalHeight = 0;

        unit = config.unit;
        step = (this.max - this.min) / gridCount;

        // get title size
        if (typeof config.title.text === "string" && config.title.text !== "") {
            titleHeight = config.title.width + config.title.offset;
        }
        else {
            titleHeight = 0;
        }

        // label check
        this.buffer.save().applyTheme(theme.label);
        width = 0;
        height = 0;
        for (i = 0; i <= gridCount; i++) {
            value = this.min + step * i;
            if (this.max <= 1 && this.max > 0) {
                value = zChart.formatNumber(value, 1);
            }
            else {
                value = zChart.formatNumber(value, 0);
            }

            label = zChart.formatText(config.label.format, {value: value, unit: unit});
            metric = this.buffer.measureText(label);
            if (metric.width > width) {
                width = Math.ceil(metric.width);
            }

            this.labels.push(label);
            this.labels.width = width;
            this.labels.height = 20;
            this.labels.totalWidth += metric.width;
            this.labels.totalHeight += 20; //metric.height;
        }
        this.buffer.restore();

        if (!this.rotate) {
            if (config.width !== "auto" && typeof config.width === "number") {
                this.width = config.width;
            }
            else {
                this.width = width + titleHeight + config.label.offset;
            }
        }
        else {
            if (config.height !== "auto" && typeof config.height === "number") {
                this.height = config.height;
            }
            else {
                this.height = height + titleHeight + config.label.offset;
            }
        }

        this._super();
    },
    /**
     * Draw axis
     * @private
     */
    _draw: function () {
        var c = this.context;
        var x1, y1, x2, y2, x3, y3;
        var inter, step, grid;
        var config = this.config;
        var theme = this.theme;
        var base, align;

        if (!this.width || !this.height) {
            return;
        }

        // main line
        if (!this.rotate) {
            x1 = x2 = this.x + this.width - 0.5;
            y1 = this.y;
            y2 = y1 + this.height;
        }
        else {
            x1 = this.x;
            x2 = this.x + this.width;
            y1 = y2 = this.y;
        }

        c.save().applyTheme(theme.line)
            .moveTo(x1, y1).lineTo(x2, y2)
            .stroke()
            .restore();

        // short line and labels
        grid = this.labels.length - 1;
        if (!this.rotate) {
            inter = Math.ceil(this.labels.totalHeight / this.height);
            step = this.height / grid;
        }
        else {
            inter = Math.ceil(this.labels.totalWidth / this.width);
            step = this.width / grid;
        }

        for (var i = 0; i < this.labels.length; i++) {
            if (i % inter !== 0) {
                continue;
            }

            // calc position
            if (!this.rotate) {
                x1 = this.x + this.width - 0.5;
                x2 = x1 + 5;
                x3 = x1 - config.label.offset;
                y1 = y2 = y3 = this.y + this.height - Math.round(i * step) - (i < grid ? 0.5 : 0);
                base = i === 0 ? "bottom" : i === grid ? "top" : "middle";
                align = "right";
            }
            else {
                x1 = x2 = x3 = this.x + Math.round(i * step) - (i < grid ? 0.5 : 0);
                y1 = this.y;
                y2 = y1 - 5;
                y3 = y1 + config.label.offset;
                base = "top";
                align = i === grid ? "right" : "center";
            }

            // line
            if (i > 0) {
                c.save().applyTheme(theme.line)
                    .moveTo(x1, y1).lineTo(x2, y2)
                    .stroke()
                    .restore();
            }

            // text
            if (i === this.labels.length - 1) {
                if (base === "bottom") {
                    base = "top";
                }
                else {
                    align = "right";
                }
            }
            c.save().applyTheme(theme.label)
                .textBaseline(base).textAlign(align)
                .fillText(this.labels[i], x3, y3)
                .restore();
        }

        // title
        if (typeof config.title.text === "string" && config.title.text !== "") {
            c.save().applyTheme(theme.title);

            if (!this.rotate) {
                x1 = this.x + this.width - config.label.offset - this.labels.width - config.title.offset;
                y1 = this.y + this.height / 2;
                c.translate(x1, y1).rotate(0 - Math.PI / 2)
                    .textBaseline("bottom").textAlign("center").fillText(config.title.text, 0, 0);
            }
            else {
                x1 = this.x + this.width / 2;
                y1 = this.y + config.label.offset + this.labels.height + config.title.offset;
                c.translate(x1, y1)
                    .textBaseline("top").textAlign("center").fillText(config.title.text, 0, 0);
            }

            c.restore();
        }
    }
});
