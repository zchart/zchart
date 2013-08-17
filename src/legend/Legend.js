zChart.Legend = Class.extend({
    /**
     * Initialize class instance
     * @param chartEl
     * @param opts
     * @param theme
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

        this._createUI();
        this._bindEvents();
    },
    /**
     * Destroy
     */
    destroy: function () {
        this.listEl.undelegate();
        this.legendEl.remove();
        this.legendEl = null;
    },
    /**
     * Re-layout
     */
    layout: function () {
        if (this.config.position === "none") {
            this.legendEl.width(0).height(0);
        }
        else {
            //
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
        this.legendEl.css({left: left + "px", top: top + "px"});
    },
    /**
     * Set legend content
     * @param data
     */
    setData: function (data) {
        if (!data || !this.legendEl) {
            return;
        }

        if (data.constructor === Array) {
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
    },
    /**
     * Create legend
     * @private
     */
    _createUI: function () {
        var config = this.config;
        var theme = this.theme;

        // container
        this.legendEl = $("<div>").addClass("legend").appendTo(this.chartEl);
        this.legendEl.css({
            display: "block",
            position: "absolute",
            overflow: "hidden",
            padding: theme.padding.join("px ") + "px",
            "color": theme.color,
            "font-family": theme.fontFamily,
            "font-size": theme.fontSize + "px",
            "font-weight": theme.fontWeight,
            "font-style": theme.fontStyle,
            "background-color": theme.bgColor,
            "border": theme.borderWidth + "px solid transparent",
            "border-radius": theme.borderRadius + "px",
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
            this.titleEl = $("<li>").addClass("title").appendTo(this.listEl);
            this.titleEl.text(this._formatTitle()).height(config.title.height);
            this.titleEl.css({
                "color": theme.title.color,
                "font-size": theme.title.fontSize + "px",
                "font-weight": theme.title.fontWeight,
                "font-style": theme.title.fontStyle,
                "text-align": theme.title.align
            });
        }

        // items
        for (i = 0; i < items.length; i++) {
            item = items[i];

            li = $("<li>").addClass("item").appendTo(this.listEl);
            li.data("index", i).data("visible", true);
            li.css({
                "border-bottom": "1px solid transparent",
                cursor: (config.hover || config.toggle) ? "pointer" : "default"
            });

            // marker
            marker = $("<div>").addClass("marker").appendTo(li);
            marker.width(15).height(15);
            marker.css({
                display: "block",
                position: "relative",
                "border-radius": "3px",
                "background-color": item.color,
                "margin-top": "2px"
            });

            // label
            label = $("<label>").addClass("label").appendTo(li);
            label.text(item.text);
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
            if (config.value.format) {
                value = $("<label>").addClass("value").appendTo(li);
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
        var title = this.title;
        title = title.replace(/<category>/g, this.category);
        title = title.replace(/<unit>/g, this.unit);
        return title;
    },
    /**
     * Format value to string
     * @param value
     * @param unit
     * @private
     */
    _formatValue: function (value, unit) {
        var v = zChart.formatNumber(value, this.config.value.fraction);
        var s = this.config.value.format;
        s = s.replace(/<unit>/g, unit);
        s = s.replace(/<value>/g, v);
        return s;
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
        var label = item.children(".label");

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
     * @param index
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
