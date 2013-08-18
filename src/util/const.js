/**
 * Option css style-name map
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
        margin: [0],
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
        position: "relative",
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
        borderWidth: 2,
        borderRadius: 5,
        padding: [3, 5, 3, 5],
        fontFamily: "Tahoma,Arial,sans-serif",
        fontSize: 12,
        fontWeight: "normal",
        opacity: 0.85
    },
    xAxis: {},
    yAxis: {},
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
        container: null,
        width: "100%",
        height: "100%"
    },
    /**
     * Title
     */
    title: {
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
     * Legend
     */
    legend: {
        position: "align",              // align/none
        align: "right",                 // bottom/right/left/top
        left: null,
        top: null,
        width: 150,
        height: null,
        title: {
            format: "<unit>",
            height: null
        },
        value: {
            type: "last",               // last/first/average/max/min/active/none
            fraction: 2,
            format: "<value>",
            width: null
        },
        hover: true,
        toggle: true
    },
    tooltip: {
        format: "<serial>: <span style='font-size:1.2em;font-weight:bold;'><value></span> <unit>",
        fraction: 2
    },
    xAxis: {},
    yAxis: {},
    pie: {
        startAngle: -90,
        maxCount: 10,
        minRatio: 10,
        groupLabel: "Others",
        expandOne: true,
        expandOffset: 10,
        tilt: 0,
        depth: 0,
        margin: 5,
        unit: "",
        innerRadius: 0,
        label: {
            format: "<ratio>%",
            fraction: 2,
            radius: -30
        }
    }
};
