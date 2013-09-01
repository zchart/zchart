/**
 * Category Axis
 */
zChart.CategoryAxis = zChart.Axis.extend({
    init: function (context, opts, theme, rotate) {
        this._super(context, opts, theme, rotate);

        this.data = null;
        this.zoom = 1;
        this.startIndex = 0;
        this.endIndex = 0;
        this.selectedIndex = null;
    },
    /**
     * Set category data
     * @param data
     */
    setData: function (data) {
        this.data = data;
        this.layout();
    },
    /**
     * Set selected index
     * @param index
     */
    selectIndex: function (index) {
        this.selectedIndex = index;
    },
    /**
     * Layout labels and title
     */
    layout: function () {
        var config = this.config;
        var theme = this.theme;
        var i, width, height, label;
        var metric, titleHeight;

        if (this.data === null) {
            return;
        }

        this.labels = [];
        this.labels.totalWidth = 0;
        this.labels.totalHeight = 0;

        // get title size
        if (typeof config.title.text === "string" && config.title.text !== "") {
            titleHeight = config.title.offset;
            if (config.title.height === "auto") {
                titleHeight += parseInt(theme.title.font, 10) + 4 || 20;
            }
            else {
                titleHeight += config.title.height;
            }
        }
        else {
            titleHeight = 0;
        }

        // label check
        this.context.save().applyTheme(theme.label);
        width = 0;
        height = parseInt(theme.label.font, 10) + 4 || 20;
        for (i = 0; i <= this.data.length; i++) {
            label = this.data[i] || "";
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

        if (this.rotate) {
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

        this.gridCount = this.labels.length - 1;
        this._super();
    },
    /**
     * Draw axis
     * @private
     */
    _draw: function () {
        this._super(this.rotate ? "vertical" : "horizon", "left", true);
    }
});
