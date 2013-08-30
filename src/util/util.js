/**
 * Log output functions
 */
$.extend({
    log: function () {
        if (window.console && window.console.log) {
            console.log.apply(window.console, arguments);
        }
    },
    debug: function () {
        if (window.console && window.console.debug) {
            console.debug.apply(window.console, arguments);
        }
    },
    warn: function () {
        if (window.console && window.console.warn) {
            console.warn.apply(window.console, arguments);
        }
    },
    error: function () {
        if (window.console && window.console.error) {
            console.error.apply(window.console, arguments);
        }
    },
    trace: function () {
        if (window.console && window.console.debug) {
            console.debug.apply(window.console, arguments);
        }
    }
});

/**
 * create mask color by index
 * @param index
 * @returns {string}
 */
zChart.getMaskColor = function (index) {
    var hex;
    hex = (index + 1).toString(16);
    hex = "000000".substr(0, 6 - hex.length) + hex;
    return "#" + hex;
};

/**
 * Get index by mask color
 * @param color
 */
zChart.getMaskIndex = function (color) {
    var hex;
    hex = String(color).replace(/[^0-9a-f]/gi, '');
    return parseInt(hex, 16) - 1;
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
    if (n.length > 1 && fraction > 0) {
        ret += "." + n[1].substr(0, fraction);
    }

    return ret;
};

/**
 * Format text
 * @param fmt
 * @param value
 */
zChart.formatText = function (fmt, value) {
    var text = fmt;
    var re;

    for (var name in value) {
        re = new RegExp("<" + name + ">", "g");
        text = text.replace(re, value[name]);
    }

    return text;
};

/**
 * Format date to string
 * @param fmt
 * @param date
 */
zChart.formatDate = function (fmt, date) {
    if (!fmt || !date) {
        return fmt;
    }

    var tm = fmt;
    tm = tm.replace("yyyy", date.getFullYear());
    tm = tm.replace("MM", date.getMonth() + 1);
    tm = tm.replace("dd", date.getDate());
    tm = tm.replace("hh", date.getHours());
    tm = tm.replace("mm", date.getMinutes());
    tm = tm.replace("ss", date.getSeconds());

    return tm;
};

/**
 * Make context2d to support link call
 * @param canvas
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

    // extend style setting
    fn.prototype.applyTheme = function (theme) {
        var _this = this;

        if (typeof theme !== "object") {
            return this;
        }

        for (var key in theme) {
            if (!theme.hasOwnProperty(key) || typeof zChart.cstyleMap[key] === "undefined") {
                continue;
            }
            _this[zChart.cstyleMap[key]](theme[key]);
        }

        return this;
    };

    // extend dash-line drawing
    fn.prototype.dashLine = function(x, y, x2, y2, dashArray) {
        if (!dashArray) {
            dashArray = [10, 5];
        }

        var dashCount = dashArray.length;
        this.context.moveTo(x, y);

        var dx = (x2 - x),
            dy = (y2 - y);
        var slope = dx === 0 ? dy : dy / dx;
        var distRemaining = dy === 0 ? Math.abs(dx) : dx === 0 ? Math.abs(dy) : Math.sqrt(dx * dx + dy * dy);
        var dashIndex = 0,
            draw = true;
        var dashLength;
        var xStep;

        while (distRemaining >= 0.1) {
            dashLength = dashArray[dashIndex++ % dashCount];
            if (dashLength > distRemaining) {
                dashLength = distRemaining;
            }
            if (dashLength === 0) {
                // Hack for Safari
                dashLength = 0.001;
            }

            if (dx === 0) {
                y += dashLength;
            }
            else if (dy === 0) {
                x += dashLength;
            }
            else {
                xStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
                if (dx < 0) {
                    xStep = -xStep;
                }

                x += xStep;
                y += slope * xStep;
            }

            this.context[draw ? 'lineTo' : 'moveTo'](x, y);

            distRemaining -= dashLength;
            draw = !draw;
        }
        return this;
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
                value = value.join(suffix + " ") + suffix;
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

/**
 * Get date object
 * @param tm
 */
zChart.getDate = function (tm) {
    var dt;

    if (tm instanceof Date) {
        return tm;
    }

    if (typeof tm === "string") {
        dt = Date.parse(tm);
        return dt instanceof Date ? dt : null;
    }

    return null;
};
