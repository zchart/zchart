zChart.Axis = Class.extend({
    init: function (context, opts, theme) {
        this.context = context;
        this.config = opts;
        this.theme = theme;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.gridCount = 0;
        this.startIndex = 0;
        this.endIndex = 0;
        this.zoom = 1;

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
    }
});
