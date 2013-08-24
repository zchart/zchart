/**
 * Chart Legend
 * @type {*}
 */
zChart.Legend = Class.extend({
    /**
     * Initialize class instance
     * @param chartEl
     * @param opts
     * @param theme
     * @param onHover
     * @param onClick
     */
    init: function (chartEl, opts, theme, onHover, onClick) {
        this.chartEl = chartEl;
        this.config = opts;
        this.theme = theme;
        this.onHover = onHover;
        this.onClick = onClick;

        this.eventMap = {};
        this.legendEl = null;

        this.title = this.config.title.format || "";
        this.items = [];
        this.value = {};
        this.category = "";
        this.unit = "";

        if (this.config.enabled !== true) {
            return;
        }

        this._createUI();
        this._bindEvents();
    },
    /**
     * Destroy
     */
    destroy: function () {
        if (!this.legendEl) {
            return;
        }
        this.listEl.undelegate();
        this.legendEl.remove();
        this.legendEl = null;
    },
    /**
     * Re-layout
     */
    layout: function () {
        if (!this.legendEl) {
            return;
        }
    },
    /**
     * Get legend div width
     * @returns {*}
     */
    getWidth: function () {
        return this.legendEl ? this.legendEl.outerWidth(true) : 0;
    },
    /**
     * Get legend div height
     * @returns {*}
     */
    getHeight: function () {
        return this.legendEl ? this.legendEl.outerHeight(true) : 0;
    },
    /**
     * Set position
     * @param left
     * @param top
     */
    setPosition: function (left, top) {
        if (this.legendEl) {
            this.legendEl.css({left: left + "px", top: top + "px"});
        }
    },
    /**
     * Set legend content
     * @param data
     */
    setData: function (data) {
        if (!data || !this.legendEl) {
            return;
        }

        if (data instanceof Array) {
            this.items = data;
        }
        else {
            this.items = data.items;
            this.category = data.category || this.category;
            this.unit = data.unit || this.unit;
        }
        this._createItems();
    },
    /**
     * Set items values
     * @param value
     */
    setValue: function (value) {

    },
    /**
     * Set title
     * @param title
     */
    setTitle: function (title) {
        this.title = title;
        if (this.titleEl) {
            this.titleEl.text(title);
        }
    },
    /**
     * Create legend
     * @private
     */
    _createUI: function () {
        var config = this.config;
        var theme = this.theme;

        // container
        this.legendEl = $("<div>").addClass("zchart-legend").appendTo(this.chartEl);
        this.legendEl.applyTheme(theme);
        this.legendEl.css({
            position: "absolute",
            "box-sizing": "border-box"
        });

        this.legendEl.width(config.width).height(config.height);

        // list
        this.listEl = $("<ul>").appendTo(this.legendEl);
        this.listEl.css({
            "margin": 0,
            "padding": 0
        });
    },
    /**
     * Create legend items
     * @private
     */
    _createItems: function () {
        var item, li, marker, label, value;
        var i;
        var config = this.config;
        var theme = this.theme;
        var items = this.items;

        // clear
        this.listEl.empty();

        // title
        if (config.title.format) {
            this.titleEl = $("<li>").addClass("zchart-legend-title").appendTo(this.listEl);
            this.titleEl.text(this._formatTitle()).height(config.title.height);
            this.titleEl.applyTheme(theme.title);
        }

        // items
        for (i = 0; i < items.length; i++) {
            item = items[i];

            li = $("<li>").addClass("zchart-legend-item").appendTo(this.listEl);
            li.data("index", i).data("visible", true);
            li.css({
                "border-bottom": "1px solid transparent",
                cursor: (config.hover || config.toggle) ? "pointer" : "default"
            });

            // marker
            marker = $("<div>").addClass("zchart-legend-marker").appendTo(li);
            marker.width(15).height(15);
            marker.css({
                display: "block",
                position: "relative",
                "border-radius": "3px",
                "background-color": item.color,
                "margin-top": "2px"
            });

            // label
            label = $("<label>").addClass("zchart-legend-label").appendTo(li);
            label.text(item.text).attr("title", item.text);
            label.css({
                position: "absolute",
                left: "20px",
                top: "0",
                overflow: "hidden",
                "text-overflow": "ellipsis",
                "white-space": "nowrap",
                cursor: (config.hover || config.toggle) ? "pointer" : "default"
            });

            // value
            if (config.value.type !== "none") {
                value = $("<label>").addClass("zchart-legend-value").appendTo(li);
                value.text(this._formatValue(item.value, config.value.fraction)).width(config.value.width);
                value.css({
                    position: "absolute",
                    top: "0",
                    right: "0",
                    overflow: "hidden",
                    cursor: (config.hover || config.toggle) ? "pointer" : "default"
                });
            }
        }

        // li style
        this.listEl.children("li").css({
            display: "block",
            position: "relative",
            width: "100%",
            height: "20px",
            "line-height": "20px",
            overflow: "hidden"
        });
    },
    /**
     * Format title according title template and current data
     * @private
     */
    _formatTitle: function () {
        return zChart.formatText(this.title, {category: this.category, unit: this.unit});
    },
    /**
     * Format value to string
     * @param value
     * @param unit
     * @private
     */
    _formatValue: function (value, unit) {
        var v = zChart.formatNumber(value, this.config.value.fraction);
        return zChart.formatText(this.config.value.format, {unit: unit, value: v});
    },
    /**
     * bind events
     * @private
     */
    _bindEvents: function () {
        var config = this.config;
        var _this = this;

        if (config.hover) {
            this.listEl.delegate("li", "mouseenter", function (event) {
                _this._onHover(event, true);
            });

            this.listEl.delegate("li", "mouseleave", function (event) {
                _this._onHover(event, false);
            });
        }

        if (config.toggle) {
            this.listEl.delegate("li", "click", function (event) {
                _this._onClick(event);
            });
        }
    },
    /**
     * Handle item hover event
     * @param event
     * @param flag
     * @private
     */
    _onHover: function (event, flag) {
        var item = $(event.currentTarget);
        var index = item.data("index");
        var label = item.children(".zchart-legend-label");

        if (flag) {
            label.css("text-decoration", "underline");
        }
        else {
            label.css("text-decoration", "none");
        }

        if ($.isFunction(this.onHover)) {
            this.onHover(event, index, flag);
        }
    },
    /**
     * Handle item click event
     * @param event
     * @private
     */
    _onClick: function (event) {
        var item = $(event.currentTarget);
        var index = item.data("index");
        var flag = item.data("visible");

        if (flag) {
            item.css("opacity", "0.5");
        }
        else {
            item.css("opacity", "1");
        }
        item.data("visible", !flag);

        if ($.isFunction(this.onClick)) {
            this.onClick(event, index, !flag);
        }
    }
});
