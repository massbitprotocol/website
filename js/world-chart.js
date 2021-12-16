am5.ready(function() {
    // Create root and chart
    var root = am5.Root.new("worldChart");

    // Set themes
    root.setThemes([
        am5themes_Animated.new(root)
    ]);


    // ====================================
    // Create map
    // ====================================

    var chart = root.container.children.push(am5map.MapChart.new(root, {
        // panX: "none",
        // panY: "none",
        // wheelY: "none",
        pinchZoom: true,
        fill: "0xf3f3f3"
    }));
    var continentSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_continentsLow,
        exclude: ["antarctica"],
        fill: am5.color(0xE9EEF5)
    }));

    // Create polygon series
    var polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_usaLow,
            fill: am5.color(0xE9EEF5)
        })
    );

    // =================================
    // Set up point series
    // =================================

    var currentSeries;
    var regionalSeries = {};
    // Load store data
    function loadData() {
        am5.net.load("https://dapi.massbit.io/api/v1?action=stat.network").then(function(res) {
            var resJson = am5.JSONParser.parse(res.response);
            if (resJson.result) {
                setupStores(resJson.data.gateways, 'Gateway');
                setupStores(resJson.data.nodes, 'Node');
            }
        });
    }
    loadData();
    // setInterval(() => {
    //     loadData();
    // }, 5000)

    // Parses data and creats map point series for domestic and state-level
    function setupStores(data, poinType) {
        // Init country-level series
        regionalSeries[poinType] = {
            markerData: [],
            series: createSeries("total", poinType)
        };

        // Set current series
        currentSeries = regionalSeries[poinType].series;

        // Process data
        am5.array.each(data, function(store, idx) {
            regionalSeries[poinType].markerData.push({
                country_name: store.country_name,
                total: store.value,
                label: poinType == 'Gateway' ? store.value > 1 ? 'Gateways' : 'Gateway' : store.value > 1 ? 'Nodes' : 'Node',
                geometry: {
                    type: "Point",
                    coordinates: [store.longitude, store.latitude]
                }
            });
        });
        regionalSeries[poinType].series.data.setAll(regionalSeries[poinType].markerData);
    }

    // Finds polygon in series by its id
    function getPolygon(id) {
        var found;
        polygonSeries.mapPolygons.each(function(polygon) {
            if (polygon.dataItem.get("id") == id) {
                found = polygon;
            }
        })
        return found;
    }

    // Creates series with heat rules
    function createSeries(heatfield, poinType) {
        // Create point series
        var pointSeries = chart.series.push(
            am5map.MapPointSeries.new(root, {
                valueField: heatfield,
                calculateAggregates: true
            })
        );

        // Add store bullet
        var circleTemplate = am5.Template.new(root);
        pointSeries.bullets.push(function() {
            var container = am5.Container.new(root, {});

            var tooltip = am5.Tooltip.new(root, {
                getFillFromSprite: false,
                getStrokeFromSprite: false,
                getLabelFillFromSprite: false,
                fill: am5.color(0xFFFFFF),
                autoTextColor: false,
            });
            tooltip.get("background").setAll({
                fill: am5.color(0x27319B),
                strokeWidth: 0,
                stroke: am5.color(0x27319B),
            });
            var circle = container.children.push(am5.Circle.new(root, {
                radius: 12,
                fill: poinType == 'Gateway' ? am5.color(0x00B159) : am5.color(0xFBAF1D),
                fillOpacity: 1,
                cursorOverStyle: "pointer",
                strokeWidth: 0.5,
                stroke: am5.color(0xffffff),
                tooltip: tooltip,
                tooltipText: "Country: {country_name}\n{label}: {total}",
            }, circleTemplate));

            var label = container.children.push(am5.Label.new(root, {
                text: "{total}",
                fill: am5.color(0xffffff),
                fontSize: '12px',
                populateText: true,
                centerX: am5.p50,
                centerY: am5.p50,
                textAlign: "left"
            }));

            return am5.Bullet.new(root, {
                sprite: container
            });
        });

        // Add heat rule for circles
        pointSeries.set("heatRules", [{
            target: circleTemplate,
            dataField: "value",
            min: 10,
            max: 24,
            key: "radius",
        }])
        return pointSeries;
    }
}); // end am5.ready()