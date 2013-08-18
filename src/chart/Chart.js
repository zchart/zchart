/**
 * Chart base class
 * @type {*}
 */
zChart.Chart = Class.extend({
    /**
     * Initialize instance
     * @param {Object} opts chart settings
     * @param {Object} theme
     */
    init: function (opts, theme) {
        this.theme = {};
        this.config = {};

        this.config = $.extend(true, zChart.defaultConfig, opts);
        this.theme = $.extend(true, zChart.defaultTheme, theme);

        this.containerEl = null;
        this.chartEl = null;
        this.title = null;
        this.legend = null;
        this.tip = null;

        this.eventMap = {};
        this.__item_id__ = 0;

        // prepare animation function
        this.animationQueue = [];

        // init chart
        this._createUI();
        this._bindEvents();

        // start animation loop
        this._loop(0);
    },
    /**
     * Render to document
     * @param {String/Object} id dom element id, or dom object
     */
    render: function (id) {
        if (typeof id === "undefined") {
            id = this.config.chart.container;
        }
        else {
            this.config.chart.container = id;
        }

        // get reference to container
        this.containerEl = null;
        if (typeof id === "string") {
            this.containerEl = $("#" + id);
        }
        else {
            this.containerEl = $(id);
        }

        // append chart to container
        this.chartEl.appendTo(this.containerEl);

        // validate
        this.layout();
    },
    /**
     * Destroy instance
     */
    destroy: function () {
        this.animationQueue = [];

        this.context = null;
        this.contextMask = null;
        this.contextBuffer = null;

        this.title.destroy();
        this.title = null;
        this.tip.destroy();
        this.tip = null;
        this.legend.destroy();
        this.legend = null;

        this.canvasEl.unbind().remove();
        this.canvasEl = null;
        this.chartEl.unbind().remove();
        this.chartEl = null;
    },
    /**
     * Set chart data
     * @param {Array} data array of object
     */
    setData: function (data) {
        this.data = data;
    },
    /**
     * Set new title
     * @param title
     */
    setTitle: function (title) {
        this.title.setTitle(title);
    },
    /**
     * Set new theme
     * @param theme
     */
    setTheme: function (theme) {
        this.theme = $.extend(true, this.theme, theme);
        this.redraw();
    },
    /**
     * Get current theme
     * @returns {*}
     */
    getTheme: function () {
        return $.extend(true, {}, this.theme);
    },
    /**
     * Set new options
     * @param opts
     */
    setOptions: function (opts) {
        this.config = $.extend(true, this.config, opts);
        this.redraw();
    },
    /**
     * Get current option
     * @returns {*}
     */
    getOptions: function () {
        return $.extend(true, {}, this.config);
    },
    /**
     * Update chart data at specified index
     * @param {Number} index
     * @param {Object} data
     */
    updateData: function (index, data) {

    },
    /**
     * Add a data item into chart data at specified index
     * @param {Number} index
     * @param {Object} data
     */
    addData: function (index, data) {

    },
    /**
     * refresh chart to changed size
     */
    layout: function () {
        this._layout();
        this._draw();
    },
    /**
     * Redraw whole chart
     */
    redraw: function () {
        // destroy and rebuild
        this.destroy();
        this._createUI();
        this._bindEvents();

        // draw
        this._layout();
        this.setData(this.data);
    },
    /**
     * Add a new event handler
     * @param {String} name event name
     * @param {Function} handler event handler
     */
    addListener: function (name, handler) {
        if (typeof this.eventMap[name] !== "undefined") {
            this.eventMap[name].push(handler);
        }
        else {
            this.eventMap[name] = [handler];
        }
    },
    /**
     * Remove a event handler
     * @param {String} name event name
     * @param {Function} handler event handler
     */
    removeListener: function (name, handler) {
        var handlers = this.eventMap[name];
        if (typeof handlers === "undefined") {
            return;
        }

        // remove all listeners
        if (typeof handler === "undefined") {
            this.eventMap[name] = null;
            delete this.eventMap[name];
            return;
        }
        // remove specified listener
        else {
            for (var i = handlers.length - 1; i >= 0; i--) {
                if (handlers[i] === handler) {
                    handlers.splice(i, 1);
                }
            }
        }
    },
    /**
     * create a new item id
     * @returns {number}
     * @private
     */
    _newId: function () {
        if (this.__item_id__ >= Number.MAX_VALUE) {
            this.__item_id__ = 0;
        }
        return this.__item_id__++;
    },
    /**
     * layout chart
     * @private
     */
    _layout: function () {
        var left, top;
        var width, height;
        var titleHeight;
        var legendWidth, legendHeight;

        // get components size
        width = this.chartEl.width();
        height = this.chartEl.height();

        // re-layout title and legend
        this.title.layout();
        this.legend.layout();

        titleHeight = this.title.getHeight();
        legendWidth = this.legend.getWidth();
        legendHeight = this.legend.getHeight();

        // calc canvas position
        height = height - titleHeight;
        left = 0;
        top = titleHeight;

        var position = this.config.legend.position;
        var align = this.config.legend.align;
        if (position === "align") {
            if (align === "left") {
                width -= legendWidth;
                left = legendWidth;
                this.legend.setPosition(0, titleHeight);
            }
            else if (align === "top") {
                height -= legendHeight;
                top += legendHeight;
                this.legend.setPosition(0, titleHeight);
            }
            else if (align === "bottom") {
                height -= legendHeight;
                this.legend.setPosition(0, titleHeight + height);
            }
            else /* right */{
                width -= legendWidth;
                this.legend.setPosition(width, titleHeight);
            }
        }

        // change canvas size
        this.canvasEl.width(width).height(height);
        this.canvas.attr({width: width, height: height});
        this.canvasBuffer.attr({width: width, height: height});
        this.canvasMask.attr({width: width, height: height});

        // re-layout position
        this.canvasEl.css({
            position: "absolute",
            left: left + "px",
            top: top + "px"
        });
    },
    /**
     * create chart UI
     * @private
     */
    _createUI: function () {
        this.chartEl = $("<div>").addClass("zchart");
        this.chartEl.width(this.config.chart.width).height(this.config.chart.height);
        this.chartEl.applyTheme(this.theme.chart);
        if (this.containerEl) {
            this.chartEl.appendTo(this.containerEl);
        }

        // title
        this._createTitle();

        // legend
        this._createLegend();

        // tooltip
        this._createTip();

        // main canvas
        this.canvasEl = $("<div>").addClass("plot").appendTo(this.chartEl);
        this.canvas = $("<canvas>").appendTo(this.canvasEl);
        this.context = zChart.ctx(this.canvas.get(0).getContext("2d"));

        // paint buffer
        this.canvasBuffer = $("<canvas>");
        this.contextBuffer = zChart.ctx(this.canvasBuffer.get(0).getContext("2d"));

        // mask canvas for item detect
        this.canvasMask = $("<canvas>");
        this.contextMask = zChart.ctx(this.canvasMask.get(0).getContext("2d"));
    },
    /**
     * Create title div
     * @private
     */
    _createTitle: function () {
        if (this.title) {
            return;
        }

        // title
        this.title = new zChart.Title(this.chartEl, this.config.title, this.theme.title);
    },
    /**
     * Create legend
     * @private
     */
    _createLegend: function () {
        if (this.legend) {
            return;
        }
        var _this = this;

        // legend
        this.legend = new zChart.Legend(this.chartEl, this.config.legend, this.theme.legend,
            function (event, index, flag) {
                _this._onLegendHover(event, index, flag);
            },
            function (event, index, flag) {
                _this._onLegendClick(event, index, flag);
            }
        );
    },
    /**
     * Create tooltip
     * @private
     */
    _createTip: function () {
        if (this.tip) {
            return;
        }

        // tooltip
        this.tip = new zChart.Tip(this.chartEl, this.config.tooltip, this.theme.tooltip);
    },
    /**
     * Handle legend item hover event
     * @param event
     * @param index
     * @param flag
     * @private
     */
    _onLegendHover: function (event, index, flag) {
    },
    /**
     * Handle legend item click event
     * @param event
     * @param index
     * @param flag
     * @private
     */
    _onLegendClick: function (event, index, flag) {
    },
    /**
     * bind events
     * @private
     */
    _bindEvents: function () {
        var x, y;
        var offset;
        var _this = this;
        var data;

        // mouse move event
        this.canvasEl.bind("mousemove", function (event) {
            if (_this._onHover) {
                offset = _this.canvasEl.offset();
                x = event.pageX - offset.left;
                y = event.pageY - offset.top;
                data = _this._onHover(x, y);
                if (data) {
                    _this._triggerEvent("hover", event, data);

                    if (_this.eventMap["click"]) {
                        _this.canvasEl.css("cursor", "pointer");
                    }
                }
                else {
                    _this.canvasEl.css("cursor", "default");
                }
            }
        });

        // click event
        this.canvasEl.bind("click", function (event) {
            if (_this._onClick) {
                offset = _this.canvasEl.offset();
                x = event.pageX - offset.left;
                y = event.pageY - offset.top;
                data = _this._onClick(x, y);
                if (data) {
                    _this._triggerEvent("click", event, data);
                }
            }
        });
    },
    /**
     * trigger event
     * @param name
     * @param event
     * @param data
     * @private
     */
    _triggerEvent: function (name, event, data) {
        var handlers = this.eventMap[name];
        if (handlers && handlers.length) {
            for (var i = 0; i < handlers.length; i++) {
                if (typeof handlers[i] === "function") {
                    handlers[i](event, data);
                }
            }
        }
    },
    /**
     * Clear canvas content
     * @param canvas
     * @private
     */
    _clearCanvas: function (canvas) {
        if (!canvas) {
            return;
        }
        canvas.attr("width", canvas.attr("width"));
    },
    /**
     * Draw on canvas
     * @private
     */
    _draw: function () {
    },
    /**
     * animate a object
     * @param object
     * @param target
     * @param duration
     * @param fx
     */
    _animate: function (object, target, duration, fx) {
        var animation;
        var source = {};

        // record current value
        for (var key in target) {
            source[key] = object[key];
        }

        // push into animation queue
        animation = {
            obj: object,
            source: source,
            target: target,
            duration: duration,
            fx: fx,
            startTime: Date.now(),
            finished: false
        };
        this.animationQueue.push(animation);
    },
    /**
     * animation loop
     * @param timestamp
     * @private
     */
    _loop: function (timestamp) {
        var _this = this;
        var i, item, len;
        var ts;

        len = this.animationQueue.length;
        if (len > 0) {
            ts = Date.now();

            // process all animation items
            for (i = 0; i < this.animationQueue.length; i++) {
                item = this.animationQueue[i];
                this._update(item, ts);
            }

            // redraw
            this._draw();

            // clear finished animation
            for (i = this.animationQueue.length - 1; i >= 0; i--) {
                item = this.animationQueue[i];
                if (item.finished) {
                    this.animationQueue.splice(i, 1);
                }
            }
        }

        // start next round draw
        var requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
        if (!requestAnimationFrame) {
            requestAnimationFrame = function (fn) {
                window.setTimeout(fn, 16);
            }
        }
        requestAnimationFrame(function(ts) {
            _this._loop(ts);
        });
    },
    /**
     * update animation item attr values
     * @param item
     * @param ts
     * @private
     */
    _update: function (item, ts) {
        var ratio = (ts - item.startTime) / item.duration;

        // update
        for (var key in item.target) {
            if (item.fx === "linear") {
                // TBD
            }
            else {
                item.obj[key] = this._fxLinear(item.source[key], item.target[key], ratio);
            }
        }

        if (ratio >= 1) {
            item.finished = true;
        }
    },
    /**
     * calculate process by linear
     * @param start
     * @param end
     * @param ratio
     */
    _fxLinear: function (start, end, ratio) {
        if (ratio > 1) {
            ratio = 1;
        }

        if (typeof start === "number") {
            return start + (end - start) * ratio;
        }
        else {
            return end;
        }
    }
});
