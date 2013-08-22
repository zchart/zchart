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
        this.gridCount = 0;
        this.startIndex = 0;
        this.endIndex = 0;
        this.zoom = 1;
        this.min = 0;
        this.max = 1;
        this.inter = 1;
        this.labels = [];

        this.bufferCanvas = $("<canvas>");
        this.buffer = zChart.ctx(this.bufferCanvas.get(0).getContext("2d"));
    },
    /**
     * Destroy object
     */
    destroy: function () {
        this.buffer = null;
        this.bufferCanvas.remove();
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
        return this.width;
    },
    /**
     * Get current height
     * @returns {Number}
     */
    getHeight: function () {
        return this.height;
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
    setRange: function (min, max, grid) {
        this.min = min;
        this.max = max;
        this.gridCount = grid;

        this.layout();
        this._draw();
    },
    redraw: function () {
        this.layout();
        this._draw();
    },
    _draw: function () {

    }
});
