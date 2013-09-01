/**
 * CSS style-name map
 */
zChart.cssMap = {
    display: {},
    position: {},
    width: {},
    height: {},
    left: {
        suffix: "px"
    },
    top: {
        suffix: "px"
    },
    fontFamily: {},
    fontSize: {
        suffix: "px"
    },
    fontWeight: {},
    fontStyle: {},
    color: {},
    background: {},
    borderColor: {},
    borderWidth: {
        suffix: "px"
    },
    borderStyle: {},
    borderRadius: {
        suffix: "px"
    },
    align: {
        name: "text-align"
    },
    padding: {
        suffix: "px"
    },
    margin: {
        suffix: "px"
    },
    opacity: {},
    boxShadow: {
        name: "box-shadow"
    },
    overflow: {},
    textOverflow: {}
};

/**
 * Canvas style map
 */
zChart.cstyleMap = {
    font: "font",
    textAlign: "textAlign",
    color: "fillStyle",
    lineWidth: "lineWidth",
    lineColor: "strokeStyle",
    bgColor: "fillStyle",
    shadowColor: "shadowColor",
    shadowOffsetX: "shadowOffsetX",
    shadowOffsetY: "shadowOffsetY",
    shadowBlur: "shadowBlur",
    opacity: "globalAlpha"
};

/**
 * Default theme
 */
zChart.defaultTheme = {
    /**
     * Chart container style, div
     */
    chart: {
        display: "block",
        position: "relative",
        fontSize: 12,
        fontFamily: "Tahoma,Arial,sans-serif",
        margin: [5],
        colors: ["#CC0000", "#FF7400", "#008C00", "#006E2E", "#4096EE",
            "#FF0084", "#B02B2C", "#D15600", "#C79810", "#73880A",
            "#6BBA70", "#3F4C6B", "#356AA0", "#D01F3C", "#FFFF88",
            "#CDEB8B", "#C3D9FF", "#36393D"]
    },
    /**
     * Title style, div
     */
    title: {
        display: "block",
        position: "absolute",
        left: "0",
        top: "0",
        width: "100%",
        fontFamily: "Tahoma,Arial,sans-serif",
        overflow: "hidden",
        /**
         * Main title style
         */
        mainTitle: {
            align: "center",
            color: "#000000",
            fontSize: 14,
            fontWeight: "bold",
            fontStyle: "normal",
            overflow: "hidden",
            textOverflow: "ellipsis"
        },
        /**
         * sub title style
         */
        subTitle: {
            align: "center",
            color: "#333333",
            fontSize: 12,
            fontWeight: "normal",
            fontStyle: "italic",
            overflow: "hidden",
            textOverflow: "ellipsis"
        }
    },
    /**
     * Legend style, div
     */
    legend: {
        itemAlign: "vertical",          // vertical/horizon
        verticalAlign: "middle",        // top/middle/bottom
        color: "#000000",
        bgColor: "transparent",
        fontFamily: "Tahoma,Arial,sans-serif",
        fontSize: 12,
        borderWidth: 0,
        borderColor: "#ffffff",
        borderStyle: "solid",
        borderRadius: 5,
        padding: [5],
        overflow: "hidden",
        /**
         * Title style
         */
        title: {
            color: "#666666",
            fontSize: 12,
            fontWeight: "normal",
            fontStyle: "normal",
            align: "right"              // left/right/center
        }
    },
    /**
     * Tooltip style, div
     */
    tooltip: {
        color: "#000000",
        background: "#F1F1F1",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 5,
        padding: [3, 5, 3, 5],
        fontFamily: "Tahoma,Arial,sans-serif",
        fontSize: 12,
        fontWeight: "normal",
        opacity: 0.85,
        boxShadow: "rgba(0, 0, 0, 0.3) 1px 1px 2px 1px"
    },
    /**
     * Category axis style, canvas
     */
    xAxis: {
        title: {
            color: "#3b3b3b",
            font: "12px Arial"
        },
        label: {
            color: "#3b3b3b",
            font: "12px Tahoma,Arial,sans-serif"
        },
        line: {
            lineWidth: 1,
            lineColor: "#666666",
            lineStyle: "solid"          // solid/dashed
        },
        grid: {
            lineWidth: 1,
            lineColor: "#A1A1A1",
            lineStyle: "dashed",          // solid/dashed
            opacity: 0.5
        }
    },
    /**
     * Value axis style, canvas
     */
    yAxis: {
        left: {
            title: {
                color: "#3b3b3b",
                font: "12px Arial"
            },
            label: {
                color: "#3b3b3b",
                font: "12px Tahoma,Arial,sans-serif"
            },
            line: {
                lineWidth: 1,
                lineColor: "#666666",
                lineStyle: "solid"          // solid/dashed
            },
            grid: {
                lineWidth: 1,
                lineColor: "#A1A1A1",
                lineStyle: "dashed",          // solid/dashed
                opacity: 0.5
            }
        },
        right: {

        }
    },
    /**
     * Pie chart style, canvas
     */
    pie: {
        lineWidth: 1,
        lineColor: "#FFFFFF",
        label: {
            color: "#E1E2E3",
            shadowColor: "#000000",
            fontFamily: "Tahoma,Arial,sans-serif",
            fontSize: 12,
            lineColor: "#000000",
            lineWidth: 1
        }
    },
    /**
     * Serial chart style, canvas
     */
    serial: {
        border: {
            lineWidth: 1,
            lineColor: "#A1A1A1",
            lineStyle: "solid"          // solid/dashed
        },
        background: {
            color: "transparent"
        },
        line: {
            lineWidth: 2
        },
        area: {
            opacity: 0.75
        }
    }
};

/**
 * Default config
 */
zChart.defaultConfig = {
    /**
     * Chart container
     */
    chart: {
        type: "",
        container: null,
        width: "100%",
        height: "100%"
    },
    /**
     * Title config
     */
    title: {
        enabled: false,
        mainTitle: {
            text: "",
            html: "",
            height: null
        },
        subTitle: {
            text: "",
            html: "",
            height: null
        }
    },
    /**
     * Legend config
     */
    legend: {
        enabled: false,
        place: "right",                 // left/right/top/bottom/float
        left: null,
        top: null,
        width: 150,
        height: null,
        title: {
            format: "<unit>",
            height: null
        },
        value: {
            type: "last",               // last/none
            fraction: 2,
            format: "<value>",
            width: null
        },
        hover: true,
        toggle: true
    },
    /**
     * Tooltip config
     */
    tooltip: {
        enabled: false,
        format: "<serial>: <span style='font-size:1.2em;font-weight:bold;'><value></span> <unit>",
        fraction: 2
    },
    /**
     * Category axis config
     */
    xAxis: {
        width: "auto",
        height: "auto",
        indLen: 4,                      // indicator short line length
        title: {
            text: "",
            height: "auto",
            offset: 3
        },
        label: {
            format: "yyyy-MM-dd",       // valid when parseDate is true
            offset: 3                   // offset to the line
        },
        grid: {
            count: "auto",
            interval: 1
        }
    },
    /**
     * Value axises config
     */
    yAxis: {
        left: {
            enabled: true,
            side: "left",
            width: "auto",              // width
            height: "auto",
            unit: "",
            min: null,
            max: null,
            indLen: 4,                  // indicator short line length
            title: {
                text: "",
                width: "auto",
                offset: 3               // offset from labels
            },
            label: {
                format: "<value><unit>",
                offset: 3               // offset from axis line
            },
            grid: {
                count: "auto",
                interval: 1
            }
        },
        right: {
            enabled: false,
            side: "right"
        }
    },
    /**
     * Pie chart config
     */
    pie: {
        startAngle: -90,
        maxCount: 10,
        minRatio: 10,
        groupLabel: "Others",
        expandOne: true,
        expandOffset: 10,
        tilt: 0,
        depth: 0,
        unit: "",
        innerRadius: 0,
        textField: "text",
        valueField: "value",
        label: {
            format: "<ratio>%",
            fraction: 2,
            radius: -30
        }
    },
    /**
     * Serial chart config
     */
    serial: {
        rotate: false,
        stack: "none",                  // none/normal/percent
        combineTip: false,
        column: {
            width: 0.65,
            inter: 2
        },
        line: {
            type: "sharp"               // sharp/curve
        },
        category: {
            field: "",
            text: ""
        },
        serials: [{
            field: "",
            text: "",
            unit: "",
            side: "left",
            visible: true,
            marker: "rect"              // rect/round/diamond
        }]
    }
};
