/**
 * Chart Item Tooltip
 * @type {*}
 */
zChart.Tip = Class.extend({
    init: function (chartEl, opts, theme) {
        this.chartEl = chartEl;
        this.config = opts;
        this.theme = theme;

        this.tipEl = null;
    },
    /**
     * Set tip content
     * @param data
     */
    setData: function (data) {
        if (this.config.enabled !== true) {
            return;
        }

        if (!this.tipEl) {
            this._createUI();
        }
        this.data = data;

        var tip = this._formatTip();
        this.tipEl.html(tip);
        this.tipEl.css("border-color", data.color);

        this.width = this.tipEl.outerWidth(true);
        this.height = this.tipEl.outerHeight(true);
    },
    /**
     * Place tip at specified position
     * @param x
     * @param y
     */
    setPosition: function (x, y) {
        var offset = 10;
        var left, top, width, height;

        if (this.config.enabled !== true) {
            return;
        }

        if (!this.tipEl) {
            this._createUI();
        }

        width = this.width;
        height = this.height;

        // try left side
        if (x > width + offset) {
            left = x - width - offset;
            top = y - height / 2;
        }
        // else place at right side
        else {
            left = x + offset;
            top = y - height / 2;
        }

        // move tip
        this.tipEl.css({
            left: left + "px",
            top: top + "px"
        });
    },
    /**
     * Show tip
     */
    show: function () {
        if (this.tipEl) {
            this.tipEl.show();
        }
    },
    /**
     * Hide tip
     */
    hide: function () {
        this.destroy();
    },
    /**
     * Destroy instance
     */
    destroy: function () {
        if (this.tipEl) {
            this.tipEl.unbind().remove();
            this.tipEl = null;
        }
    },
    /**
     * Format tip content
     * @returns {XML}
     * @private
     */
    _formatTip: function () {
        var tip;
        var config = this.config;

        this.data.value = zChart.formatNumber(this.data.value, config.fraction);
        this.data.ratio = zChart.formatNumber(this.data.ratio, config.fraction);
        tip = zChart.formatText(config.format, this.data);

        return tip;
    },
    /**
     * Create dom
     * @private
     */
    _createUI: function () {
        var theme = this.theme;

        this.tipEl = $("<div>").appendTo(document.body);
        this.tipEl.applyTheme(theme);
        this.tipEl.css({
            position: "absolute",
            "box-shadow": "rgba(0, 0, 0, 0.3) 1px 1px 2px 1px"
        });

        this._bindEvents();
    },
    /**
     * Internal event process
     * @private
     */
    _bindEvents: function () {
        var _this = this;

        // hide tip when hover
        this.tipEl.unbind().bind("mousemove", function () {
            _this.tipEl.hide();
        });
    }
});
