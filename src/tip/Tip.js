zChart.Tip = Class.extend({
    init: function (chartEl, opts, theme) {
        this.chartEl = chartEl;
        this.config = opts;
        this.theme = theme;

        this._createUI();
        this._bindEvents();
    },
    /**
     * Set tip content
     * @param data
     */
    setData: function (data) {
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

        width = this.width;
        height = this.height;

        // try left side
        if (x > width + offset) {
            left = x - width - offset;
            top = y - height / 2;
        }
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
        this.tipEl.show();
    },
    /**
     * Hide tip
     */
    hide: function () {
        this.tipEl.hide();
    },
    /**
     * Destroy instance
     */
    destroy: function () {
        this.tipEl.unbind().remove();
        this.tipEl = null;
    },
    /**
     * Format tip content
     * @returns {XML}
     * @private
     */
    _formatTip: function () {
        var value, tip;
        var config = this.config;

        value = zChart.formatNumber(this.data.value, config.fraction);

        tip = config.format;
        tip = tip.replace(/<value>/g, value);
        tip = tip.replace(/<category>/g, this.data.category);
        tip = tip.replace(/<serial>/g, this.data.serial);
        tip = tip.replace(/<unit>/g, this.data.unit);
        tip = tip.replace(/<ratio>/g, this.data.ratio);

        return tip;
    },
    /**
     * Create dom
     * @private
     */
    _createUI: function () {
        var theme = this.theme;

        this.tipEl = $("<div>").appendTo(document.body);
        this.tipEl.css({
            display: "none",
            position: "absolute",
            color: theme.color,
            padding: theme.padding.join("px ") + "px",
            "background-color": theme.bgColor,
            "border": theme.borderWidth + "px solid transparent",
            "border-radius": theme.borderRadius + "px",
            "font-family": theme.fontFamily,
            "font-size": theme.fontSize + "px",
            "font-weight": theme.fontWeight,
            "box-shadow": "rgba(0, 0, 0, 0.3) 1px 1px 2px 1px",
            "opacity": theme.opacity
        });
    },
    /**
     * Internal event process
     * @private
     */
    _bindEvents: function () {
        var _this = this;

        // hide tip when hover
        this.tipEl.unbind().bind("mousemove", function () {
            _this.hide();
        });
    }
});
