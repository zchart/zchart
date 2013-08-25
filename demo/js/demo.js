/**
 * Customizable chart
 */
var chart;

$(function() {
    /**
     * Process custom settings
     */
    function processSettings (event) {
        var input = $(event.currentTarget);
        var dataType = input.attr("datatype");
        var name = input.attr("name");
        var factor = parseFloat(input.attr("factor")) || 1;

        var value = input.val();
        if (dataType === "number") {
            value = parseInt(value, 10) * factor;
        }
        else if (dataType === "boolean") {
            value = event.currentTarget.checked;
        }

        var option = chart.getOptions();
        var theme = chart.getTheme();
        var options = {option: option, theme: theme};

        var path = input.attr("target").split(".");
        var obj = options;

        for (var i = 0; i < path.length; i++) {
            obj = obj[path[i]];
        }
        obj[name] = value;

        if (path[0] === "option") {
            chart.setOptions(options[path[0]]);
        }
        else {
            chart.setTheme(options[path[0]]);
        }
    }

    $(".custom").delegate("input", "change", function (event) {
        processSettings(event);
    });
    $(".custom").delegate("select", "change", function (event) {
        console.log("select changed");
        processSettings(event);
    });
});
