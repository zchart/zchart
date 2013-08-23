/**
 * Category Axis
 */
zChart.CategoryAxis = zChart.Axis.extend({
    init: function (context, opts, theme, rotate) {
        this._super(context, opts, theme, rotate);
    },
    /**
     * Layout labels and title
     */
    layout: function () {
        return;
        var config = this.config;
        var theme = this.theme;
        var gridCount = config.gridCount === "auto" ? this.gridCount : config.gridCount;
        var i, width, height, label, value, unit;
        var step, metric, titleHeight;

        this.labels = [];
        unit = config.unit;
        step = (this.max - this.min) / gridCount;

        // get title size
        if (typeof config.title.text === "string" && config.title.text !== "") {
            this.buffer.save().applyTheme(theme.title);
            metric = this.buffer.measureText(config.title.text);
            titleHeight = metric.height + config.title.offset;
            this.buffer.restore();
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
                value = value.toString();
            }

            label = zChart.formatText(config.label.format, {value: value, unit: unit});
            metric = this.buffer.measureText(label);
            if (metric.width > width) {
                width = metric.width;
            }
            if (metric.height > height) {
                height = metric.height;
            }

            this.labels.push(label);
            this.labels.width = width;
            this.labels.height = height;
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
    },
    /**
     * Draw axis
     * @private
     */
    _draw: function () {
    }
});
