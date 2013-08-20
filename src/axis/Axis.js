zChart.Axis = Class.extend({
    init: function (opts, theme) {
        this.config = opts;
        this.theme = theme;

        this.axisEl = null;
    },
    getWidth: function () {
        return this.axisEl ? this.axisEl.width() : 0;
    },
    getHeight: function () {
        return this.axisEl ? this.axisEl.height() : 0;
    }
});
