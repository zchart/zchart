zChart.Axis = Class.extend({
    init: function (context, opts, theme, rotate) {
        this.context = context;
        this.config = opts;
        this.theme = theme;
        this.rotate = rotate;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.gridCount = this.config.grid.count === "auto" ? 5 : this.config.grid.count;
        this.labels = [];
        this.interval = 1;
    },
    /**
     * Destroy object
     */
    destroy: function () {
        this.labels = null;
    },
    /**
     * Layout content
     */
    layout: function () {
    },
    /**
     * Get actual grid count
     * @returns {*}
     */
    getGrid: function () {
        return this.gridCount;
    },
    /**
     * Get interval
     * @returns {number}
     */
    getInterval: function () {
        return this.interval > this.config.grid.interval ? this.interval : this.config.grid.interval;
    },
    /**
     * Get current width
     * @returns {Number}
     */
    getWidth: function () {
        return this.width > 0 ? this.width : 0;
    },
    /**
     * Get current height
     * @returns {Number}
     */
    getHeight: function () {
        return this.height > 0 ? this.height : 0;
    },
    /**
     * Set current width
     * @param width
     * @returns {Number}
     */
    setWidth: function (width) {
        if (this.width !== width) {
            this.width = width;
            this.layout();
        }
    },
    /**
     * Set current height
     * @param height
     * @returns {Number}
     */
    setHeight: function (height) {
        if (this.height !== height) {
            this.height = height;
            this.layout();
        }
    },
    /**
     * Set axis position
     * @param x
     * @param y
     */
    setPosition: function (x, y) {
        this.x = x;
        this.y = y;
    },
    /**
     * Draw content
     * @private
     */
    draw: function () {
        this._draw();
    },
    /**
     * Draw content
     * @private
     * @param dir
     * @param side
     * @param category
     */
    _draw: function (dir, side, category) {
        var c = this.context;
        var x1, y1, x2, y2, x3, y3;
        var inter, step, grid;
        var config = this.config;
        var theme = this.theme;
        var base, align;

        if (!this.width || !this.height) {
            return;
        }

        if (typeof side === "undefined") {
            side = "left";
        }

        // main line
        if (dir === "vertical") {
            if (side === "left") {
                x1 = x2 = this.x + this.width + 0.5;
            }
            else {
                x1 = x2 = this.x + 0.5;
            }
            y1 = this.y;
            y2 = y1 + this.height + 0.5;
        }
        else {
            x1 = this.x;
            x2 = this.x + this.width;
            y1 = y2 = this.y + 0.5;
        }

        c.save().applyTheme(theme.line).beginPath()
            .line(x1, y1, x2, y2, theme.line.lineStyle)
            .stroke().restore();

        // short line and labels
        grid = this.labels.length - 1;
        inter = this.getInterval();
        if (dir === "vertical") {
            step = this.height / grid;
        }
        else {
            step = this.width / grid;
        }

        for (var i = 0; i < this.labels.length; i++) {
            // calc position
            if (dir === "vertical") {
                if (side === "left") {
                    x1 = this.x + this.width + 0.5;
                    x2 = x1 + config.indLen;
                    x3 = x1 - config.label.offset;
                    align = "right";
                }
                else {
                    x1 = this.x + 0.5;
                    x2 = x1 - config.indLen;
                    x3 = x1 + config.label.offset;
                    align = "left";
                }

                if (category) {
                    y1 = y2 = this.y + Math.round(i * step) + 0.5;
                    y3 = y1 + step / 2;
                }
                else {
                    y1 = y2 = y3 = this.y + this.height - Math.round(i * step) + 0.5;
                }

                base = "middle";
            }
            else {
                x1 = x2 = x3 = this.x + Math.round(i * step) + 0.5;
                y1 = this.y;
                y2 = y1 - config.indLen;
                y3 = y1 + config.label.offset;
                base = "top";
                align = "center";

                if (category) {
                    x3 = x1 + step / 2;
                }
            }

            // line
            if (i % inter === 0) {
                c.save().applyTheme(theme.line)
                    .beginPath().line(x1, y1, x2, y2)
                    .stroke()
                    .restore();
            }

            // text
            if (typeof this.labels[i] !== "undefined" && i % inter === 0) {
                c.save().applyTheme(theme.label)
                    .textBaseline(base).textAlign(align);

                if (this.selectedIndex === i) {
                    c.font("bold " + theme.label.font);
                }

                c.fillText(this.labels[i], x3, y3).restore();
            }
        }

        // title
        if (typeof config.title.text === "string" && config.title.text !== "") {
            c.save().applyTheme(theme.title);

            if (dir === "vertical") {
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
