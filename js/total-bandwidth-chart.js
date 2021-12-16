am5.ready(function() {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("totalBandwidthChart");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    const myTheme = am5themes_Animated.new(root);
    myTheme.rule("Grid").setAll({
        stroke: am5.color(0xFFFFFF)
    })
    root.setThemes([
        myTheme
    ]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
    }));

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineX.set("visible", false);
    // cursor.lineY.set("visible", false);

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
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
    }));

    var yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.labels.template.setAll({
        fontSize: "14px",
        fill: am5.color(0x717591)
    });
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: yRenderer
    }));

    var myTooltip = am5.Tooltip.new(root, {
        autoTextColor: false,
        labelText: "{valueY} {label}",
    });

    myTooltip.label.setAll({
        fill: am5.color(0xFFFFFF),
        fontSize: "14px",
    });
    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "Total Bandwidth",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        sequencedInterpolation: true,
        seriesTooltipTarget: "bullet",
        tooltip: myTooltip,
    }));
    series.columns.template.setAll({
        cornerRadiusTL: 5,
        cornerRadiusTR: 5
    });
    series.columns.template.adapters.add("fill", (fill, target) => {
        return '#2C3ACF';
    });

    // Set data from API
    jQuery('#reportFilter2').val(3);
    loadData((res) => {
        setData(res)
    })

    jQuery('#reportFilter2').on('change', () => {
        loadData((res) => {
            setData(res);
        })
    })

    function loadData(callbackFn) {
        let fromDate = moment();
        let toDate = moment();
        switch (jQuery('#reportFilter2').val()) {
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
        jQuery('#txtDateRange2').text(`${fromDate.format("MMM DD")} - ${toDate.format("MMM DD")}`);
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

    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    function niceBytes(x) {
        let l = 0,
            n = parseInt(x, 10) || 0;
        while (n >= 1024 && ++l) {
            n = n / 1024;
        }
        return ({
            value: n.toFixed(n < 10 && l > 0 ? 1 : 0),
            unit: units[l]
        });
    }

    function setData(resX) {
        // Binding value
        const niceB = niceBytes(resX.bandwidth.total);
        jQuery('#txtTotalBandwidth').text(numberWithCommas(niceB.value));
        jQuery('#txtTotalBandwidthUnit').text(niceB.unit);
        // Generate chart
        var data = resX.bandwidth.data.map((e, i) => {
            return {
                date: new Date(e.date).getTime(),
                value: Number(niceBytes(e.value).value),
                label: niceBytes(e.value).unit
            }
        });
        xAxis.data.setAll(data);
        series.data.setAll(data);
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        chart.appear(1000, 100);
    }
}); // end am5.ready()