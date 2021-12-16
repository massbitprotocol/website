am5.ready(function() {

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("totalRequestsChart");


    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
        am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
    }));

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "none"
    }));
    cursor.lineY.set("visible", false);


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xRenderer = am5xy.AxisRendererX.new(root, {});
    xRenderer.labels.template.setAll({
        fontSize: "14px",
        fill: am5.color(0x717591),
        paddingTop: 15,
        minGridDistance: 30
    });
    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0.5,
        baseInterval: {
            timeUnit: "day",
            count: 1
        },
        startLocation: 0.4,
        endLocation: 0.6,
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
    }));

    var yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.labels.template.setAll({
        fontSize: "14px",
        fill: am5.color(0x717591)
    });
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        numberFormat: '#a',
        renderer: yRenderer
    }));

    var myTooltip = am5.Tooltip.new(root, {
        autoTextColor: false,
        labelText: "{valueY} requests",
    });

    myTooltip.label.setAll({
        fill: am5.color(0x000000),
        fontSize: "14px",
    });
    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: myTooltip,
        fill: am5.color(0xE9EBFA),
        stroke: am5.color(0x2C3ACF)
    }));

    series.fills.template.setAll({
        visible: true,
        fillOpacity: 0.7,
    });
    series.strokes.template.setAll({
        strokeWidth: 3,
    });



    // Set data from API
    jQuery('#reportFilter1').val(3);
    loadData((res) => {
        setData(res)
    })

    jQuery('#reportFilter1').on('change', () => {
        loadData((res) => {
            setData(res);
        })
    })

    function loadData(callbackFn) {
        let fromDate = moment();
        let toDate = moment();
        switch (jQuery('#reportFilter1').val()) {
            case "2":
                {
                    fromDate = moment().subtract(1, 'days');
                    toDate = moment().subtract(1, 'days');
                    break
                }
            case "3":
                {
                    fromDate = moment().subtract(6, 'days');
                    toDate = moment();
                    break
                }
            case "4":
                {
                    fromDate = moment().subtract(29, 'days');
                    toDate = moment();
                    break
                }
            case "5":
                {
                    fromDate = moment().startOf('month');
                    toDate = moment().endOf('month');
                    break
                }
            case "6":
                {
                    fromDate = moment().subtract(1, 'month').startOf('month');
                    toDate = moment().subtract(1, 'month').endOf('month');
                    break
                }
        }
        jQuery('#txtDateRange').text(`${fromDate.format("MMM DD")} - ${toDate.format("MMM DD")}`);
        jQuery.ajax({
            url: "https://dapi.massbit.io/api/v1?action=stat.dapi&fromDate=" + fromDate.format('YYYY-MM-DD') + "&toDate=" + toDate.format('YYYY-MM-DD'),
            type: 'GET',
            dataType: 'json',
            success: function(res) {
                if (res && res.result) {
                    callbackFn(res.data);
                }
            }
        });
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function setData(resX) {
        // Binding value
        jQuery('#txtTotalRequests').text(numberWithCommas(resX.requests.total));

        // Generate chart
        var data = resX.requests.data.map((e, i) => {
            return {
                date: new Date(e.date).getTime(),
                value: e.value
            }
        });
        series.data.setAll(data);

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        chart.appear(1000, 100);
    }

}); // end am5.ready()