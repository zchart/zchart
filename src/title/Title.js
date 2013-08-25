/**
 * Chart title
 * @type {*}
 */
zChart.Title = Class.extend({
    /**
     * Initialize class instance
     * @param chartEl
     * @param opts
     * @param theme
     */
    init: function (chartEl, opts, theme) {
        this.chartEl = chartEl;
        this.config = opts;
        this.theme = theme;

        this.titleEl = null;
        this.mainTitleEl = null;
        this.subTitleEl = null;

        if (this.config.enabled !== true) {
            return;
        }

        // create UI
        this._createUI();
    },
    /**
     * Destroy instance
     */
    destroy: function () {
        if (this.titleEl) {
            this.titleEl.remove();
            this.titleEl = null;
        }
    },
    /**
     * Set new title
     * @param title
     */
    setTitle: function (title) {
        if (!this.titleEl || !title) {
            return;
        }

        if (title.mainTitle) {
            if (title.mainTitle.text) {
                this.mainTitleEl.text(title.mainTitle.text);
            }
            else if (title.mainTitle.html) {
                this.mainTitleEl.html(title.mainTitle.html);
            }
        }
        else if (title.subTitle) {
            if (title.subTitle.text) {
                this.subTitleEl.text(title.subTitle.text);
            }
            else if (title.subTitle.html) {
                this.subTitleEl.html(title.subTitle.html);
            }
        }
    },
    /**
     * Re-layout
     */
    layout: function () {
    },
    /**
     * Get title div width
     * @returns {Number}
     */
    getWidth: function () {
        return this.titleEl ? this.titleEl.width() : 0;
    },
    /**
     * Get title div height
     * @returns {Number}
     */
    getHeight: function () {
        return this.titleEl ? this.titleEl.height() : 0;
    },
    /**
     * Create title content
     * @private
     */
    _createUI: function () {
        var config, theme, title;

        // title container
        this.titleEl = $("<div>").addClass("zchart-title").appendTo(this.chartEl);
        this.titleEl.applyTheme(this.theme);

        // create title
        for (var type in this.config) {
            if (type !== "mainTitle" && type !== "subTitle") {
                continue;
            }

            config = this.config[type];
            theme = this.theme[type];

            title = $("<div>").addClass("zchart-" + type).appendTo(this.titleEl);
            title.applyTheme(theme);
            title.height(config.height);

            if (config.text !== "") {
                title.text(config.text);
//                title.css({"line-height": type === "mainTitle" ? config.height + "px" : ""});
            }
            else if (config.html !== "") {
                title.html(config.html);
            }

            this[type + "El"] = title;
        }
    }
});
