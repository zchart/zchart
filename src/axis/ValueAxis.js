/**
 * Value Axis
 */
zChart.ValueAxis = zChart.Axis.extend({
    init: function (context, opts, theme, rotate) {
        this._super(context, opts, theme, rotate);

        this.min = null;
        this.max = null;
    },
    /**
     * Set value range
     * @param min
     * @param max
     * @param grid
     */
    setRange: function (min, max, grid) {
        this.min = min;
        this.max = max;
        this.gridCount = this.config.gridCount === "auto" ? grid : this.config.gridCount;
        this.layout();
    },
    /**
     * Layout labels and title
     */
    layout: function () {
        var config = this.config;
        var theme = this.theme;
        var gridCount = this.gridCount;
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
            titleHeight = config.title.offset;
            if (config.title.width === "auto") {
                titleHeight += parseInt(theme.title.font, 10) + 4 || 20;
            }
            else {
                titleHeight += config.title.width;
            }
        }
        else {
            titleHeight = 0;
        }

        // label check
        this.context.save().applyTheme(theme.label);
        width = 0;
        height = parseInt(theme.label.font, 10) + 4 || 20;
        for (i = 0; i <= gridCount; i++) {
            value = this.min + step * i;
            if (this.max <= 1 && this.max > 0) {
                value = zChart.formatNumber(value, 1);
            }
            else {
                value = zChart.formatNumber(value, 0);
            }

            label = zChart.formatText(config.label.format, {value: value, unit: unit});
            metric = this.context.measureText(label);
            if (metric.width > width) {
                width = Math.ceil(metric.width);
            }

            this.labels.push(label);
            this.labels.width = width;
            this.labels.height = height;
            this.labels.totalWidth += metric.width;
            this.labels.totalHeight += height; //metric.height;
        }
        this.context.restore();

        if (!this.rotate) {
            if (config.width !== "auto" && typeof config.width === "number") {
                this.width = config.width;
            }
            else {
                this.width = width + titleHeight + config.label.offset;
            }
            this.interval = Math.ceil(this.labels.totalHeight / this.height);
        }
        else {
            if (config.height !== "auto" && typeof config.height === "number") {
                this.height = config.height;
            }
            else {
                this.height = height + titleHeight + config.label.offset;
            }
            this.interval = Math.ceil(this.labels.totalWidth / this.width);
        }

        this._super();
    },
    /**
     * Draw axis
     * @private
     */
    _draw: function () {
        this._super(this.rotate ? "horizon" : "vertical", this.config.side);
    }
});
