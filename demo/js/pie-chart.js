/**
 * Create pie chart demo
 */
$(function() {
    var chart1, chart2;
    var data1 = [];
    var data2 = {};
    var brands = ["iPhone 5", "Galaxy 4", "HTC one", "Galaxy III", "iPhone 4s", "All Brands"];
    var areas = ["Europa", "Asia", "America", "Africa", "Latin America"];
    var sum, value, brand;

    // create random data
    for (var i = 0; i < brands.length; i++) {
        brand = brands[i];
        sum = 0;
        data2[brand] = [];

        for (var j = 0; j < areas.length; j++) {
            value = Math.round(Math.random() * 300 + 100);
            data2[brand].push({
                text: areas[j],
                value: value
            });
            sum += value;
        }

        if (i < brands.length - 1) {
            data1.push({
                text: brand,
                value: sum
            });
        }
    }

    // left pie
    var option1 = {
        chart: {
            type: "pie",
            container: "chart-1",
            width: 400,
            height: 300
        },
        title: {
            enabled: true,
            mainTitle: {
                text: "2012 Smart-phone Market Share Top-5",
                height: 20
            },
            subTitle: {
                text: "-- simulate & random data",
                height: 20
            }
        },
        legend: {
            enabled: true,
            place: "left",
            width: 120
        },
        tooltip: {
            enabled: true
        },
        pie: {
            unit: "M"
        }
    };

    chart1 = zChart.create(option1, null);

    chart1.render();
    chart1.setData(data1);
    chart1.addListener("click", function (event, data) {
        var brand = data.text;
        if (data.expanded === false) {
            brand = "All Brands"
        }

        var text = brand + " -- Area Market Share";
        chart2.setTitle({mainTitle: {text: text}});
        chart2.setData(data2[brand]);
    });

    // right pie
    var option2 = {
        chart: {
            type: "pie",
            width: 400,
            height: 300
        },
        title: {
            enabled: true,
            mainTitle: {
                text: "All Brands -- Area Market Share",
                height: 40
            }
        },
        legend: {
            enabled: true,
            place: "right",
            width: 120
        },
        tooltip: {
            enabled: true
        },
        pie: {
            unit: "M"
        }
    };

    chart2 = zChart.create(option2, null);
    chart2.render("chart-2");
    chart2.setData(data2["iPhone 5"]);

    // set customizable chart
    chart = chart1;
});
