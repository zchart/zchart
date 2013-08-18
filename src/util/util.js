/**
 * create mask color by index
 * @param index
 * @returns {string}
 */
zChart.getMaskColor = function (index) {
    var r, g, b, hex;

    index += 1;

    hex = "#";
    r = (index % 255).toString(16);
    if (r.length < 2) {
        r = "0" + r;
    }

    g = ((index >> 8) % 255).toString(16);
    if (g.length < 2) {
        g = "0" + g;
    }

    b = ((index >> 16) % 255).toString(16);
    if (b.length < 2) {
        b = "0" + b;
    }

    return hex + r + g + b;
};

/**
 * Adjust hex color brightness
 * @param hex
 * @param lum
 * @returns {string}
 * @link http://www.sitepoint.com/javascript-generate-lighter-darker-color/
 */
zChart.adjustLuminance = function (hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
};

/**
 * Sort object array
 * @param obj
 * @param attr
 * @param asc
 */
zChart.sortObjects = function (obj, attr, asc) {
    if (typeof asc === "undefined") {
        asc = true;
    }

    return obj.sort(function (obj1, obj2) {
        if (obj1[attr] > obj2[attr]) {
            if (asc) {
                return 1;
            }
            else {
                return -1;
            }
        }
        else if (obj1[attr] < obj2[attr]) {
            if (asc) {
                return -1;
            }
            else {
                return 1;
            }
        }
        else {
            return 0;
        }
    });
};
/**
 * Format number to string
 * @param value
 * @param fraction
 * @private
 */
zChart.formatNumber = function (value, fraction) {
    var n, a, aa, ret, i;

    if (typeof value === "undefined" || value === null) {
        return "";
    }
    if (!fraction) {
        fraction = 0;
    }

    n = value.toString().split(".");
    a = n[0].split("").reverse();
    aa = [];

    for (i = 0; i < a.length; i++) {
        aa.push(a[i]);
        if (i % 3 === 2 && i < a.length - 1 && a[i + 1] !== "-") {
            aa.push(",");
        }
    }

    ret = aa.reverse().join("");
    if (n.length > 1) {
        ret += "." + n[1].substr(0, fraction);
    }

    return ret;
};

/**
 * Make context2d to support link call
 * @param context
 */
zChart.ctx = function (canvas) {
    var fn = function (oldCtx) {
        this.context = oldCtx;
    };

    var context = canvas;
    if (typeof context.save === "undefined") {
        context = context.getContext("2d");
    }

    for (var f in context) {
        if (typeof context[f] === "function") {
            fn.prototype[f] = function (f) {
                return function () {
                    var ret = this.context[f].apply(this.context, arguments);
                    return ret ? ret : this;
                };
            }(f);
        }
        else {
            fn.prototype[f] = function (f) {
                return function () {
                    this.context[f] = Array.prototype.join.call(arguments);
                    return this;
                }
            }(f)
        }
    }

    fn.prototype.applyTheme = function (theme) {

    };

    return new fn(context);
};

/**
 * Apply predefined style to dom
 */
$.fn.extend({
    applyTheme: function (theme) {
        if (typeof theme !== "object") {
            return this;
        }

        var cssMap, name, value, suffix;
        var style = {};

        for (var key in theme) {
            cssMap = zChart.cssMap[key];
            if (typeof cssMap === "undefined") {
                continue;
            }

            name = cssMap.name || key;
            name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
            suffix = cssMap.suffix || "";
            value = theme[key];

            if ($.isArray(value)) {
                value = value.join(" " + suffix);
            }
            else {
                value += suffix;
            }

            style[name] = value;
        }

        if (style !== {}) {
            this.css(style);
        }
        return this;
    }
});
