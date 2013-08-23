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
        this.gridCount = null;
        this.startIndex = 0;
        this.endIndex = 0;
        this.zoom = 1;
        this.min = null;
        this.max = null;
        this.labels = [];

        this.bufferCanvas = document.createElement("canvas");
        this.buffer = zChart.ctx(this.bufferCanvas.getContext("2d"));
    },
    /**
     * Destroy object
     */
    destroy: function () {
        this.buffer = null;
        $(this.bufferCanvas).remove();
        this.bufferCanvas = null;
    },
    /**
     * Layout content
     */
    layout: function () {

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
        this.width = width;
        this.layout();
    },
    /**
     * Set current height
     * @param height
     * @returns {Number}
     */
    setHeight: function (height) {
        this.height = height;
        this.layout();
    },
    /**
     * Set axis position
     * @param x
     * @param y
     * @param width
     * @param height
     */
    setPosition: function (x, y) {
        this.x = x;
        this.y = y;
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
        this.gridCount = grid;
        this.layout();
    },
    /**
     * Redraw axis
     */
    redraw: function () {
        this.layout();
        this._draw();
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
     */
    _draw: function () {
        // subclass implement
    }
});
